using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAsset.AssetService.Models;

public enum StatusAset { Tersedia, Dipinjam, Rusak }

[Table("Aset")]
public class Aset
{
    [Key]
    public int         Id             { get; set; }

    /// <summary>Kode QR unik yang ditempelkan sebagai label pada barang fisik.</summary>
    [Required, MaxLength(50)]
    public string      KodeQr         { get; set; } = string.Empty;

    /// <summary>Kode inventaris internal barang.</summary>
    [Required, MaxLength(50)]
    public string      KodeBarang     { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string      NamaBarang     { get; set; } = string.Empty;

    [ForeignKey(nameof(KategoriAset))]
    public int         KategoriAsetId { get; set; }

    public string?     FotoBarang     { get; set; }

    public int         Stok           { get; set; } = 0;

    public StatusAset  Status         { get; set; } = StatusAset.Tersedia;

    public string?     Deskripsi      { get; set; }

    public DateTime    CreatedAt      { get; set; } = DateTime.UtcNow;
    public DateTime    UpdatedAt      { get; set; } = DateTime.UtcNow;

    // Navigation
    public KategoriAset? KategoriAset { get; set; }
}
