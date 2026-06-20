using EAsset.AssetService.Models;
using Microsoft.EntityFrameworkCore;

namespace EAsset.AssetService.Data;

public class AssetDbContext(DbContextOptions<AssetDbContext> options) : DbContext(options)
{
    public DbSet<Aset>        Aset        { get; set; }
    public DbSet<KategoriAset> KategoriAset { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Index unik
        modelBuilder.Entity<Aset>()
            .HasIndex(a => a.KodeQr).IsUnique();

        modelBuilder.Entity<Aset>()
            .HasIndex(a => a.KodeBarang).IsUnique();

        modelBuilder.Entity<KategoriAset>()
            .HasIndex(k => k.KodeKategori).IsUnique();

        // Enum disimpan sebagai string agar mudah dibaca di DB
        modelBuilder.Entity<Aset>()
            .Property(a => a.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        // ─── Seed Data: 6 Kategori ─────────────────────────────
        modelBuilder.Entity<KategoriAset>().HasData(
            new KategoriAset { Id = 1, NamaKategori = "Elektronik & IT",                KodeKategori = "KAT-ELEK", Deskripsi = "Laptop, PC, printer, router, dan perangkat IT." },
            new KategoriAset { Id = 2, NamaKategori = "Furnitur & Perlengkapan Ruang",  KodeKategori = "KAT-FURN", Deskripsi = "Meja, kursi, lemari, dan perabotan ruangan." },
            new KategoriAset { Id = 3, NamaKategori = "Alat Laboratorium",              KodeKategori = "KAT-LAB",  Deskripsi = "Instrumen laboratorium ilmiah dan praktikum." },
            new KategoriAset { Id = 4, NamaKategori = "Kendaraan Operasional",          KodeKategori = "KAT-KEND", Deskripsi = "Kendaraan dinas kampus." },
            new KategoriAset { Id = 5, NamaKategori = "Peralatan Olahraga",             KodeKategori = "KAT-OLAH", Deskripsi = "Perlengkapan olahraga kampus." },
            new KategoriAset { Id = 6, NamaKategori = "Audio Visual & Presentasi",      KodeKategori = "KAT-AV",   Deskripsi = "Proyektor, sound system, kamera." }
        );

        // ─── Seed Data: 20 Aset ────────────────────────────────
        var now = new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc);
        modelBuilder.Entity<Aset>().HasData(
            // ELEKTRONIK
            new Aset { Id=1,  KodeQr="QR-ELEK-0001", KodeBarang="LPT-2024-001", NamaBarang="Laptop Dell Inspiron 15 3000",      KategoriAsetId=1, Stok=10, Status=StatusAset.Tersedia, Deskripsi="Intel Core i5 Gen 12, RAM 8GB, SSD 512GB.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=2,  KodeQr="QR-ELEK-0002", KodeBarang="PCD-2024-001", NamaBarang="PC Desktop HP ProDesk 400 G9",      KategoriAsetId=1, Stok=20, Status=StatusAset.Tersedia, Deskripsi="Intel Core i7, RAM 16GB, SSD 256GB + HDD 1TB.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=3,  KodeQr="QR-ELEK-0003", KodeBarang="RTR-2024-001", NamaBarang="Router Mikrotik RB750Gr3",           KategoriAsetId=1, Stok=5,  Status=StatusAset.Tersedia, Deskripsi="Router jaringan kampus untuk distribusi internet.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=4,  KodeQr="QR-ELEK-0004", KodeBarang="PRN-2024-001", NamaBarang="Printer Canon PIXMA G2010",          KategoriAsetId=1, Stok=8,  Status=StatusAset.Tersedia, Deskripsi="Printer inkjet warna untuk keperluan administrasi.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=5,  KodeQr="QR-ELEK-0005", KodeBarang="UPS-2024-001", NamaBarang="UPS APC Back-UPS 1000VA",           KategoriAsetId=1, Stok=6,  Status=StatusAset.Tersedia, Deskripsi="UPS 1000VA pelindung daya untuk server.", CreatedAt=now, UpdatedAt=now },
            // FURNITUR
            new Aset { Id=6,  KodeQr="QR-FURN-0001", KodeBarang="MJT-2023-001", NamaBarang="Meja Tulis Kayu Jati 120x60cm",    KategoriAsetId=2, Stok=40, Status=StatusAset.Tersedia, Deskripsi="Meja kerja kayu solid untuk dosen dan administrasi.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=7,  KodeQr="QR-FURN-0002", KodeBarang="KRS-2023-001", NamaBarang="Kursi Putar Ergonomis HighBack",    KategoriAsetId=2, Stok=50, Status=StatusAset.Tersedia, Deskripsi="Kursi putar adjustable height untuk kantor.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=8,  KodeQr="QR-FURN-0003", KodeBarang="LMR-2023-001", NamaBarang="Lemari Arsip Metal 4 Laci",        KategoriAsetId=2, Stok=15, Status=StatusAset.Tersedia, Deskripsi="Filing cabinet baja untuk arsip dokumen.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=9,  KodeQr="QR-FURN-0004", KodeBarang="WBD-2023-001", NamaBarang="Papan Tulis Whiteboard 120x240cm", KategoriAsetId=2, Stok=25, Status=StatusAset.Tersedia, Deskripsi="Whiteboard magnetik untuk ruang kelas.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=10, KodeQr="QR-FURN-0005", KodeBarang="RKB-2023-001", NamaBarang="Rak Buku Besi 5 Tingkat",          KategoriAsetId=2, Stok=12, Status=StatusAset.Tersedia, Deskripsi="Rak buku besi powder coat untuk perpustakaan.", CreatedAt=now, UpdatedAt=now },
            // LAB
            new Aset { Id=11, KodeQr="QR-LAB-0001",  KodeBarang="MKR-2024-001", NamaBarang="Mikroskop Binokuler Olympus CX23",  KategoriAsetId=3, Stok=15, Status=StatusAset.Tersedia, Deskripsi="Perbesaran hingga 1000x untuk lab biologi.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=12, KodeQr="QR-LAB-0002",  KodeBarang="MTM-2024-001", NamaBarang="Multimeter Digital Fluke 117",      KategoriAsetId=3, Stok=20, Status=StatusAset.Tersedia, Deskripsi="True-RMS untuk pengukuran tegangan & arus.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=13, KodeQr="QR-LAB-0003",  KodeBarang="OSC-2024-001", NamaBarang="Oscilloscope Digital Rigol DS1054Z",KategoriAsetId=3, Stok=8,  Status=StatusAset.Tersedia, Deskripsi="4 kanal, 50MHz untuk lab elektronika.", CreatedAt=now, UpdatedAt=now },
            // KENDARAAN
            new Aset { Id=14, KodeQr="QR-KEND-0001", KodeBarang="MBU-2022-001", NamaBarang="Minibus Toyota Hiace 2.5 Diesel",  KategoriAsetId=4, Stok=2,  Status=StatusAset.Tersedia, Deskripsi="15 kursi untuk transportasi kegiatan kampus.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=15, KodeQr="QR-KEND-0002", KodeBarang="MTR-2023-001", NamaBarang="Sepeda Motor Honda Vario 160",      KategoriAsetId=4, Stok=3,  Status=StatusAset.Tersedia, Deskripsi="Motor dinas untuk kurir antar gedung.", CreatedAt=now, UpdatedAt=now },
            // OLAHRAGA
            new Aset { Id=16, KodeQr="QR-OLAH-0001", KodeBarang="BLB-2024-001", NamaBarang="Bola Basket Spalding Gold",        KategoriAsetId=5, Stok=10, Status=StatusAset.Tersedia, Deskripsi="Ukuran 7 untuk UKM dan turnamen basket.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=17, KodeQr="QR-OLAH-0002", KodeBarang="NTV-2024-001", NamaBarang="Net Voli Resmi FIVB Standard",     KategoriAsetId=5, Stok=4,  Status=StatusAset.Tersedia, Deskripsi="Net voli standar internasional.", CreatedAt=now, UpdatedAt=now },
            // AUDIO VISUAL
            new Aset { Id=18, KodeQr="QR-AV-0001",   KodeBarang="PRY-2024-001", NamaBarang="Proyektor Epson EB-X51 3800 Lumen",KategoriAsetId=6, Stok=12, Status=StatusAset.Tersedia, Deskripsi="XGA 3800 lumen untuk ruang kuliah & seminar.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=19, KodeQr="QR-AV-0002",   KodeBarang="KMR-2024-001", NamaBarang="Kamera DSLR Canon EOS 2000D Kit",  KategoriAsetId=6, Stok=5,  Status=StatusAset.Tersedia, Deskripsi="24.1MP untuk dokumentasi kegiatan kampus.", CreatedAt=now, UpdatedAt=now },
            new Aset { Id=20, KodeQr="QR-AV-0003",   KodeBarang="SND-2024-001", NamaBarang="Sound System Aktif Yamaha DBR15",  KategoriAsetId=6, Stok=4,  Status=StatusAset.Tersedia, Deskripsi="1000W 15 inci untuk seminar dan wisuda.", CreatedAt=now, UpdatedAt=now }
        );
    }
}
