using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── JWT Validation (Gateway memvalidasi token sebelum meneruskan request) ─────
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = builder.Configuration["Jwt:Issuer"],
            ValidAudience            = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        };
    });

builder.Services.AddAuthorization();

// ── YARP Reverse Proxy ────────────────────────────────────────────────────────
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// ── CORS — izinkan frontend React (port 5173 / 3000) ─────────────────────────
builder.Services.AddCors(o => o.AddPolicy("FrontendPolicy", p =>
    p.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:80")
     .AllowAnyMethod()
     .AllowAnyHeader()
     .AllowCredentials()));

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();

// ── Health endpoint Gateway ───────────────────────────────────────────────────
app.MapGet("/health", () => Results.Ok(new
{
    service  = "EAsset.Gateway",
    status   = "healthy",
    port     = 5000,
    services = new[]
    {
        new { name = "AssetService",    port = 5001, path = "/api/assets" },
        new { name = "UserService",     port = 5002, path = "/api/users"  },
        new { name = "BorrowingService",port = 5003, path = "/api/borrowing" },
    },
    time = DateTime.UtcNow,
})).AllowAnonymous();

// ── Proxy semua request ke downstream services ────────────────────────────────
app.MapReverseProxy();

app.Run("http://0.0.0.0:5000");
