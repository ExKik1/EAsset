using EAsset.AssetService.Data;
using EAsset.AssetService.DTOs;
using EAsset.AssetService.Models;
using EAsset.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EAsset.AssetService.Controllers;

/// <summary>
/// CRUD Aset + Scan QR.
/// Port: 5001
/// </summary>
[ApiController]
[Route("api/assets")]
[Authorize]
public class AsetController(AssetDbContext db) : ControllerBase
{
    // ── GET /api/assets ────────────────────────────────────────────────────
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var aset = await db.Aset
            .Include(a => a.KategoriAset)
            .OrderBy(a => a.NamaBarang)
            .Select(a => MapToResponse(a))
            .ToListAsync();

        return Ok(ApiResponse<IEnumerable<AsetResponse>>.Ok(aset, $"{aset.Count} aset ditemukan."));
    }

    // ── GET /api/assets/{kodeQr} ───────────────────────────────────────────
    [HttpGet("{kodeQr}")]
    public async Task<IActionResult> Show(string kodeQr)
    {
        var aset = await db.Aset
            .Include(a => a.KategoriAset)
            .FirstOrDefaultAsync(a => a.KodeQr == kodeQr);

        if (aset is null)
            return NotFound(ApiResponse<object>.Fail($"Aset dengan kode QR '{kodeQr}' tidak ditemukan."));

        return Ok(ApiResponse<AsetResponse>.Ok(MapToResponse(aset)));
    }

    // ── GET /api/assets/scan/{kodeQr} — khusus pemindaian kamera QR ──────
    [HttpGet("scan/{kodeQr}")]
    [AllowAnonymous] // Gateway akan memvalidasi JWT terlebih dulu
    public async Task<IActionResult> ScanQr(string kodeQr)
    {
        var aset = await db.Aset
            .Include(a => a.KategoriAset)
            .FirstOrDefaultAsync(a => a.KodeQr == kodeQr.Trim());

        if (aset is null)
            return NotFound(ApiResponse<object>.Fail($"Kode QR '{kodeQr}' tidak terdaftar dalam sistem E-Asset."));

        return Ok(ApiResponse<AsetResponse>.Ok(MapToResponse(aset), "Aset berhasil ditemukan via QR Scan."));
    }

    // ── POST /api/assets ───────────────────────────────────────────────────
    [HttpPost]
    [Authorize(Roles = "admin,kerumahtanggaan")]
    public async Task<IActionResult> Store([FromBody] CreateAsetRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (await db.Aset.AnyAsync(a => a.KodeQr == req.KodeQr))
            return Conflict(ApiResponse<object>.Fail("Kode QR sudah terdaftar."));

        if (await db.Aset.AnyAsync(a => a.KodeBarang == req.KodeBarang))
            return Conflict(ApiResponse<object>.Fail("Kode barang sudah terdaftar."));

        if (!await db.KategoriAset.AnyAsync(k => k.Id == req.KategoriAsetId))
            return BadRequest(ApiResponse<object>.Fail("Kategori tidak valid."));

        var aset = new Aset
        {
            KodeQr         = req.KodeQr,
            KodeBarang     = req.KodeBarang,
            NamaBarang     = req.NamaBarang,
            KategoriAsetId = req.KategoriAsetId,
            FotoBarang     = req.FotoBarang,
            Stok           = req.Stok,
            Deskripsi      = req.Deskripsi,
            Status         = StatusAset.Tersedia,
            CreatedAt      = DateTime.UtcNow,
            UpdatedAt      = DateTime.UtcNow,
        };

        db.Aset.Add(aset);
        await db.SaveChangesAsync();
        await db.Entry(aset).Reference(a => a.KategoriAset).LoadAsync();

        return CreatedAtAction(nameof(Show), new { kodeQr = aset.KodeQr },
            ApiResponse<AsetResponse>.Ok(MapToResponse(aset), "Aset berhasil ditambahkan."));
    }

    // ── PUT /api/assets/{kodeQr} ───────────────────────────────────────────
    [HttpPut("{kodeQr}")]
    [Authorize(Roles = "admin,kerumahtanggaan")]
    public async Task<IActionResult> Update(string kodeQr, [FromBody] UpdateAsetRequest req)
    {
        var aset = await db.Aset.Include(a => a.KategoriAset)
            .FirstOrDefaultAsync(a => a.KodeQr == kodeQr);

        if (aset is null)
            return NotFound(ApiResponse<object>.Fail("Aset tidak ditemukan."));

        if (!Enum.TryParse<StatusAset>(req.Status, true, out var status))
            return BadRequest(ApiResponse<object>.Fail("Status tidak valid. Pilihan: Tersedia, Dipinjam, Rusak."));

        aset.NamaBarang     = req.NamaBarang;
        aset.KategoriAsetId = req.KategoriAsetId;
        aset.FotoBarang     = req.FotoBarang ?? aset.FotoBarang;
        aset.Stok           = req.Stok;
        aset.Status         = status;
        aset.Deskripsi      = req.Deskripsi;
        aset.UpdatedAt      = DateTime.UtcNow;

        await db.SaveChangesAsync();
        await db.Entry(aset).Reference(a => a.KategoriAset).LoadAsync();

        return Ok(ApiResponse<AsetResponse>.Ok(MapToResponse(aset), "Aset berhasil diperbarui."));
    }

    // ── DELETE /api/assets/{kodeQr} ────────────────────────────────────────
    [HttpDelete("{kodeQr}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Destroy(string kodeQr)
    {
        var aset = await db.Aset.FirstOrDefaultAsync(a => a.KodeQr == kodeQr);
        if (aset is null)
            return NotFound(ApiResponse<object>.Fail("Aset tidak ditemukan."));

        db.Aset.Remove(aset);
        await db.SaveChangesAsync();

        return Ok(ApiResponse<object>.Fail("Aset berhasil dihapus.") with { Status = "success" });
    }

    // ── Health Check ───────────────────────────────────────────────────────
    [HttpGet("/health")]
    [AllowAnonymous]
    public IActionResult Health() => Ok(new { service = "AssetService", status = "healthy", port = 5001, time = DateTime.UtcNow });

    // ─── Mapper ────────────────────────────────────────────────────────────
    private static AsetResponse MapToResponse(Aset a) => new(
        a.Id,
        a.KodeQr,
        a.KodeBarang,
        a.NamaBarang,
        a.KategoriAset?.NamaKategori ?? "-",
        a.KategoriAset?.KodeKategori ?? "-",
        a.FotoBarang,
        a.Stok,
        a.Status.ToString(),
        a.Deskripsi,
        a.CreatedAt.ToString("dd/MM/yyyy HH:mm"),
        a.UpdatedAt.ToString("dd/MM/yyyy HH:mm")
    );
}
