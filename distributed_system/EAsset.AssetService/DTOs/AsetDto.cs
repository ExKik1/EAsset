using System.ComponentModel.DataAnnotations;

namespace EAsset.AssetService.DTOs;

// ─── Response DTOs ─────────────────────────────────────────────────────────

public record AsetResponse(
    int     Id,
    string  KodeQr,
    string  KodeBarang,
    string  NamaBarang,
    string  Kategori,
    string  KodeKategori,
    string? FotoBarang,
    int     Stok,
    string  Status,
    string? Deskripsi,
    string  CreatedAt,
    string  UpdatedAt
);

public record KategoriResponse(
    int     Id,
    string  NamaKategori,
    string  KodeKategori,
    string? Deskripsi
);

// ─── Request DTOs ─────────────────────────────────────────────────────────

public class CreateAsetRequest
{
    [Required] public string KodeQr         { get; set; } = string.Empty;
    [Required] public string KodeBarang     { get; set; } = string.Empty;
    [Required] public string NamaBarang     { get; set; } = string.Empty;
    [Required] public int    KategoriAsetId { get; set; }
    public string? FotoBarang               { get; set; }
    [Range(0, int.MaxValue)] public int Stok { get; set; }
    public string? Deskripsi                { get; set; }
}

public class UpdateAsetRequest
{
    [Required] public string NamaBarang     { get; set; } = string.Empty;
    [Required] public int    KategoriAsetId { get; set; }
    public string? FotoBarang               { get; set; }
    [Range(0, int.MaxValue)] public int Stok { get; set; }
    [Required] public string Status         { get; set; } = "Tersedia";
    public string? Deskripsi                { get; set; }
}

public class CreateKategoriRequest
{
    [Required, MaxLength(100)] public string NamaKategori { get; set; } = string.Empty;
    [Required, MaxLength(20)]  public string KodeKategori { get; set; } = string.Empty;
    public string? Deskripsi { get; set; }
}
