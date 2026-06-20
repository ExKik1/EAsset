using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EAsset.UserService.Models;

public enum UserRole { Admin, Kerumahtanggaan, Umum }

[Table("Users")]
public class User
{
    [Key]
    public int       Id              { get; set; }

    [MaxLength(30)]
    public string?   NimNip          { get; set; }

    [Required, MaxLength(150)]
    public string    Name            { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string    Email           { get; set; } = string.Empty;

    [Required]
    public string    PasswordHash    { get; set; } = string.Empty;

    public UserRole  Role            { get; set; } = UserRole.Umum;

    public string?   Alamat          { get; set; }

    public string?   ProfilePhoto    { get; set; }

    public DateTime  CreatedAt       { get; set; } = DateTime.UtcNow;
    public DateTime  UpdatedAt       { get; set; } = DateTime.UtcNow;
}
