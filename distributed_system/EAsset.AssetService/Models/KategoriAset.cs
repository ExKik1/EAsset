using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAsset.AssetService.Models;

[Table("KategoriAset")]
public class KategoriAset
{
    [Key]
    public int    Id            { get; set; }

    [Required, MaxLength(100)]
    public string NamaKategori  { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string KodeKategori  { get; set; } = string.Empty;

    public string? Deskripsi    { get; set; }

    public DateTime CreatedAt   { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt   { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Aset> Aset { get; set; } = [];
}
