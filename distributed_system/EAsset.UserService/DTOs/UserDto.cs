using System.ComponentModel.DataAnnotations;

namespace EAsset.UserService.DTOs;

public record UserResponse(int Id, string? NimNip, string Name, string Email, string Role, string? Alamat, string CreatedAt);

public class RegisterRequest
{
    [Required, MaxLength(150)] public string Name     { get; set; } = string.Empty;
    [Required, EmailAddress]   public string Email    { get; set; } = string.Empty;
    [Required, MinLength(8)]   public string Password { get; set; } = string.Empty;
    public string? NimNip  { get; set; }
    public string? Alamat  { get; set; }
    public string  Role    { get; set; } = "Umum";
}

public class LoginRequest
{
    [Required, EmailAddress] public string Email    { get; set; } = string.Empty;
    [Required]               public string Password { get; set; } = string.Empty;
}

public record LoginResponse(string Token, string TokenType, int ExpiresIn, UserResponse User);
