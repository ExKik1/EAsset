using EAsset.Shared;
using EAsset.UserService.Data;
using EAsset.UserService.DTOs;
using EAsset.UserService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EAsset.UserService.Controllers;

/// <summary>
/// Autentikasi — Register &amp; Login.
/// Port: 5002 | Prefix: /api/users
/// </summary>
[ApiController]
[Route("api/users")]
public class AuthController(UserDbContext db, IConfiguration config) : ControllerBase
{
    // ── POST /api/users/register ───────────────────────────────────────────
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (await db.Users.AnyAsync(u => u.Email == req.Email))
            return Conflict(ApiResponse<object>.Fail("Email sudah terdaftar."));

        if (!Enum.TryParse<UserRole>(req.Role, true, out var role))
            role = UserRole.Umum;

        var user = new User
        {
            NimNip       = req.NimNip,
            Name         = req.Name,
            Email        = req.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role         = role,
            Alamat       = req.Alamat,
            CreatedAt    = DateTime.UtcNow,
            UpdatedAt    = DateTime.UtcNow,
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(Profile), new { id = user.Id },
            ApiResponse<UserResponse>.Ok(MapUser(user), "Registrasi berhasil."));
    }

    // ── POST /api/users/login ─────────────────────────────────────────────
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);

        if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(ApiResponse<object>.Fail("Email atau password salah."));

        var token = GenerateJwt(user);

        return Ok(ApiResponse<LoginResponse>.Ok(
            new LoginResponse(token, "Bearer", 86400, MapUser(user)),
            "Login berhasil."));
    }

    // ── GET /api/users ─────────────────────────────────────────────────────
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Index()
    {
        var users = await db.Users
            .OrderBy(u => u.Name)
            .Select(u => MapUser(u))
            .ToListAsync();
        return Ok(ApiResponse<IEnumerable<UserResponse>>.Ok(users));
    }

    // ── GET /api/users/{id} ────────────────────────────────────────────────
    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Profile(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound(ApiResponse<object>.Fail("User tidak ditemukan."));
        return Ok(ApiResponse<UserResponse>.Ok(MapUser(user)));
    }

    // ── Health check ───────────────────────────────────────────────────────
    [HttpGet("/health")]
    [AllowAnonymous]
    public IActionResult Health() => Ok(new { service = "UserService", status = "healthy", port = 5002, time = DateTime.UtcNow });

    // ─── Helpers ──────────────────────────────────────────────────────────
    private string GenerateJwt(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("role", user.Role.ToString()),
        };

        var token = new JwtSecurityToken(
            issuer:             config["Jwt:Issuer"],
            audience:           config["Jwt:Audience"],
            claims:             claims,
            expires:            DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static UserResponse MapUser(User u) => new(
        u.Id, u.NimNip, u.Name, u.Email,
        u.Role.ToString(),
        u.Alamat,
        u.CreatedAt.ToString("dd/MM/yyyy HH:mm")
    );
}
