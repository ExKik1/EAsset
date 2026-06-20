using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAsset.BorrowingService.Models;

public enum KondisiKembali { Bagus, Rusak }

[Table("Peminjaman")]
public class Peminjaman
{
    [Key]
    public int      Id               { get; set; }

    /// <summary>ID user peminjam (dari UserService)</summary>
    public int      UserId           { get; set; }

    /// <summary>Kode QR aset yang dipinjam (dari AssetService)</summary>
    [Required, MaxLength(50)]
    public string   KodeQrAset       { get; set; } = string.Empty;

    /// <summary>Nama barang (disimpan lokal untuk integritas data)</summary>
    [MaxLength(200)]
    public string   NamaBarang       { get; set; } = string.Empty;

    /// <summary>Nama peminjam (disimpan lokal)</summary>
    [MaxLength(150)]
    public string   NamaPeminjam     { get; set; } = string.Empty;

    public int      Qty              { get; set; } = 1;

    [Required, MaxLength(50)]
    public string   KodePeminjaman   { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string   Jaminan          { get; set; } = string.Empty;

    public DateTime WaktuPinjam      { get; set; } = DateTime.UtcNow;

    public string?  DeskripsiPinjam  { get; set; }

    public DateTime? WaktuKembali    { get; set; }

    public KondisiKembali? KondisiKembali { get; set; }

    public string?  FotoBaru         { get; set; }

    public string?  DeskripsiRusak   { get; set; }

    /// <summary>ID staff yang memproses checkin (dari UserService)</summary>
    public int?     DiproseOlehId    { get; set; }

    public DateTime CreatedAt        { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt        { get; set; } = DateTime.UtcNow;
}
