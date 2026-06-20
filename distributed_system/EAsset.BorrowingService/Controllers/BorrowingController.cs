using EAsset.BorrowingService.Data;
using EAsset.BorrowingService.DTOs;
using EAsset.BorrowingService.Models;
using EAsset.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;

namespace EAsset.BorrowingService.Controllers;

/// <summary>
/// Peminjaman (checkout) &amp; Pengembalian (checkin).
/// Port: 5003
/// Integrasi: memanggil AssetService (5001) untuk validasi QR dan update stok.
/// </summary>
[ApiController]
[Route("api/borrowing")]
[Authorize]
public class BorrowingController(
    BorrowingDbContext db,
    IHttpClientFactory httpFactory,
    IConfiguration config) : ControllerBase
{
    // ── GET /api/borrowing ────────────────────────────────────────────────
    [HttpGet]
    [Authorize(Roles = "Admin,Kerumahtanggaan")]
    public async Task<IActionResult> Index()
    {
        var list = await db.Peminjaman
            .OrderByDescending(p => p.WaktuPinjam)
            .Select(p => MapResponse(p))
            .ToListAsync();
        return Ok(ApiResponse<IEnumerable<PeminjamanResponse>>.Ok(list));
    }

    // ── GET /api/borrowing/history — riwayat milik user sendiri ──────────
    [HttpGet("history")]
    public async Task<IActionResult> History()
    {
        var userId = GetUserId();
        var isStaff = User.IsInRole("Admin") || User.IsInRole("Kerumahtanggaan");

        var query = isStaff
            ? db.Peminjaman.AsQueryable()
            : db.Peminjaman.Where(p => p.UserId == userId);

        var list = await query
            .OrderByDescending(p => p.WaktuPinjam)
            .Select(p => MapResponse(p))
            .ToListAsync();

        return Ok(ApiResponse<IEnumerable<PeminjamanResponse>>.Ok(list));
    }

    // ── POST /api/borrowing/checkout ──────────────────────────────────────
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // 1. Validasi aset ke AssetService (integrasi data antar service)
        var assetInfo = await CallAssetService(req.KodeQrAset, Request.Headers.Authorization.ToString());
        if (assetInfo is null)
            return NotFound(ApiResponse<object>.Fail($"Kode QR '{req.KodeQrAset}' tidak ditemukan di AssetService."));

        if (assetInfo.GetProperty("status").GetString() != "Tersedia")
            return Conflict(ApiResponse<object>.Fail("Aset sedang dipinjam atau tidak tersedia."));

        var stok = assetInfo.GetProperty("stok").GetInt32();
        if (stok < req.Qty)
            return Conflict(ApiResponse<object>.Fail($"Stok tidak cukup. Tersedia: {stok} unit."));

        // 2. Buat record peminjaman
        var kode = $"PJM-{DateTime.UtcNow:yyyyMMddHHmmss}-{GetUserId()}";
        var peminjaman = new Peminjaman
        {
            UserId          = GetUserId(),
            NamaPeminjam    = User.FindFirstValue(ClaimTypes.Name) ?? "Unknown",
            KodeQrAset      = req.KodeQrAset,
            NamaBarang      = assetInfo.GetProperty("namaBarang").GetString() ?? "-",
            Qty             = req.Qty,
            KodePeminjaman  = kode,
            Jaminan         = req.Jaminan,
            DeskripsiPinjam = req.DeskripsiPinjam,
            WaktuPinjam     = DateTime.UtcNow,
            CreatedAt       = DateTime.UtcNow,
            UpdatedAt       = DateTime.UtcNow,
        };

        db.Peminjaman.Add(peminjaman);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(History), null,
            ApiResponse<PeminjamanResponse>.Ok(MapResponse(peminjaman), "Checkout peminjaman berhasil."));
    }

    // ── POST /api/borrowing/checkin ───────────────────────────────────────
    [HttpPost("checkin")]
    [Authorize(Roles = "Admin,Kerumahtanggaan")]
    public async Task<IActionResult> Checkin([FromBody] CheckinRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var peminjaman = await db.Peminjaman
            .FirstOrDefaultAsync(p => p.KodePeminjaman == req.KodePeminjaman && p.WaktuKembali == null);

        if (peminjaman is null)
            return NotFound(ApiResponse<object>.Fail("Kode peminjaman tidak ditemukan atau sudah dikembalikan."));

        if (!Enum.TryParse<KondisiKembali>(req.KondisiKembali, true, out var kondisi))
            return BadRequest(ApiResponse<object>.Fail("Kondisi tidak valid. Pilihan: Bagus, Rusak."));

        peminjaman.WaktuKembali    = DateTime.UtcNow;
        peminjaman.KondisiKembali  = kondisi;
        peminjaman.DeskripsiRusak  = req.DeskripsiRusak;
        peminjaman.FotoBaru        = req.FotoBaru;
        peminjaman.DiproseOlehId   = GetUserId();
        peminjaman.UpdatedAt       = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return Ok(ApiResponse<PeminjamanResponse>.Ok(MapResponse(peminjaman), "Checkin pengembalian berhasil."));
    }

    // ── Health check ──────────────────────────────────────────────────────
    [HttpGet("/health")]
    [AllowAnonymous]
    public IActionResult Health() => Ok(new { service = "BorrowingService", status = "healthy", port = 5003, time = DateTime.UtcNow });

    // ─── HTTP call ke AssetService (integrasi antar-node) ─────────────────
    private async Task<JsonElement?> CallAssetService(string kodeQr, string bearerToken)
    {
        try
        {
            var client = httpFactory.CreateClient("AssetService");
            client.DefaultRequestHeaders.Authorization =
                AuthenticationHeaderValue.Parse(bearerToken);

            var res = await client.GetAsync($"/api/assets/scan/{Uri.EscapeDataString(kodeQr)}");
            if (!res.IsSuccessStatusCode) return null;

            var json  = await res.Content.ReadAsStringAsync();
            var root  = JsonDocument.Parse(json).RootElement;
            return root.GetProperty("data");
        }
        catch
        {
            return null;
        }
    }

    private int GetUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
               ?? User.FindFirstValue(JwtClaimTypes.Sub);
        return int.TryParse(sub, out var id) ? id : 0;
    }

    private static PeminjamanResponse MapResponse(Peminjaman p) => new(
        p.Id,
        p.KodePeminjaman,
        p.UserId,
        p.NamaPeminjam,
        p.KodeQrAset,
        p.NamaBarang,
        p.Qty,
        p.Jaminan,
        p.WaktuPinjam.ToString("dd/MM/yyyy HH:mm"),
        p.DeskripsiPinjam,
        p.WaktuKembali?.ToString("dd/MM/yyyy HH:mm"),
        p.KondisiKembali?.ToString(),
        p.DeskripsiRusak,
        p.WaktuKembali.HasValue ? "Dikembalikan" : "Sedang Dipinjam"
    );

    // ── JWT claim name constant ───────────────────────────────────────────
    private static class JwtClaimTypes { public const string Sub = "sub"; }
}
