using System.ComponentModel.DataAnnotations;

namespace EAsset.BorrowingService.DTOs;

public record PeminjamanResponse(
    int      Id,
    string   KodePeminjaman,
    int      UserId,
    string   NamaPeminjam,
    string   KodeQrAset,
    string   NamaBarang,
    int      Qty,
    string   Jaminan,
    string   WaktuPinjam,
    string?  DeskripsiPinjam,
    string?  WaktuKembali,
    string?  KondisiKembali,
    string?  DeskripsiRusak,
    string   Status
);

public class CheckoutRequest
{
    [Required] public string KodeQrAset      { get; set; } = string.Empty;
    [Required] public string Jaminan         { get; set; } = string.Empty;
    [Range(1, 100)] public int Qty           { get; set; } = 1;
    public string? DeskripsiPinjam           { get; set; }
}

public class CheckinRequest
{
    [Required] public string KodePeminjaman  { get; set; } = string.Empty;
    [Required] public string KondisiKembali  { get; set; } = "Bagus";
    public string? DeskripsiRusak            { get; set; }
    public string? FotoBaru                  { get; set; }
}
