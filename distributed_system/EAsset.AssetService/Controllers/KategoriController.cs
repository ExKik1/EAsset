using EAsset.AssetService.Data;
using EAsset.AssetService.DTOs;
using EAsset.AssetService.Models;
using EAsset.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EAsset.AssetService.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize]
public class KategoriController(AssetDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var list = await db.KategoriAset
            .OrderBy(k => k.NamaKategori)
            .Select(k => new KategoriResponse(k.Id, k.NamaKategori, k.KodeKategori, k.Deskripsi))
            .ToListAsync();
        return Ok(ApiResponse<IEnumerable<KategoriResponse>>.Ok(list));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Show(int id)
    {
        var k = await db.KategoriAset.FindAsync(id);
        if (k is null) return NotFound(ApiResponse<object>.Fail("Kategori tidak ditemukan."));
        return Ok(ApiResponse<KategoriResponse>.Ok(new(k.Id, k.NamaKategori, k.KodeKategori, k.Deskripsi)));
    }

    [HttpPost]
    [Authorize(Roles = "admin,kerumahtanggaan")]
    public async Task<IActionResult> Store([FromBody] CreateKategoriRequest req)
    {
        if (await db.KategoriAset.AnyAsync(k => k.KodeKategori == req.KodeKategori))
            return Conflict(ApiResponse<object>.Fail("Kode kategori sudah digunakan."));

        var kat = new KategoriAset
        {
            NamaKategori = req.NamaKategori,
            KodeKategori = req.KodeKategori,
            Deskripsi    = req.Deskripsi,
            CreatedAt    = DateTime.UtcNow,
            UpdatedAt    = DateTime.UtcNow,
        };
        db.KategoriAset.Add(kat);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Show), new { id = kat.Id },
            ApiResponse<KategoriResponse>.Ok(new(kat.Id, kat.NamaKategori, kat.KodeKategori, kat.Deskripsi), "Kategori berhasil ditambahkan."));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Destroy(int id)
    {
        var k = await db.KategoriAset.FindAsync(id);
        if (k is null) return NotFound(ApiResponse<object>.Fail("Kategori tidak ditemukan."));
        db.KategoriAset.Remove(k);
        await db.SaveChangesAsync();
        return Ok(ApiResponse<object>.Ok(null!, "Kategori berhasil dihapus."));
    }
}
