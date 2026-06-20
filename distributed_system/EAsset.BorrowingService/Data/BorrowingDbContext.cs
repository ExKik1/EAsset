using EAsset.BorrowingService.Models;
using Microsoft.EntityFrameworkCore;

namespace EAsset.BorrowingService.Data;

public class BorrowingDbContext(DbContextOptions<BorrowingDbContext> options) : DbContext(options)
{
    public DbSet<Peminjaman> Peminjaman { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Peminjaman>()
            .HasIndex(p => p.KodePeminjaman).IsUnique();

        modelBuilder.Entity<Peminjaman>()
            .Property(p => p.KondisiKembali)
            .HasConversion<string>()
            .HasMaxLength(10)
            .IsRequired(false);
    }
}
