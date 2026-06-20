using EAsset.UserService.Models;
using Microsoft.EntityFrameworkCore;

namespace EAsset.UserService.Data;

public class UserDbContext(DbContextOptions<UserDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email).IsUnique();

        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<string>()
            .HasMaxLength(20);

        // Seed: admin default
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id           = 1,
                NimNip       = "198001012005011001",
                Name         = "Admin Sistem",
                Email        = "admin@easset.ac.id",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@12345"),
                Role         = UserRole.Admin,
                Alamat       = "Gedung Rektorat Lt. 2",
                CreatedAt    = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt    = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc),
            },
            new User
            {
                Id           = 2,
                NimNip       = "199203152015041002",
                Name         = "Budi Santoso",
                Email        = "kerumahtanggaan@easset.ac.id",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Rumah@12345"),
                Role         = UserRole.Kerumahtanggaan,
                Alamat       = "Unit Sarana & Prasarana",
                CreatedAt    = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt    = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc),
            },
            new User
            {
                Id           = 3,
                NimNip       = "2021010001",
                Name         = "Anisa Putri",
                Email        = "mahasiswa@easset.ac.id",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@12345"),
                Role         = UserRole.Umum,
                Alamat       = "Jl. Mawar No. 5",
                CreatedAt    = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt    = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc),
            }
        );
    }
}
