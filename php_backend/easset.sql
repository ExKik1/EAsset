-- ============================================================
-- EAsset Database Schema
-- Import via phpMyAdmin: Database > Import > pilih file ini
-- Atau jalankan: mysql -u root -p < easset.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS `easset_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `easset_db`;

-- ─── 1. FAKULTAS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `fakultas` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nama`       VARCHAR(150) NOT NULL,
  `kode`       VARCHAR(20)  NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 2. PROGRAM STUDI ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `program_studi` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `fakultas_id` INT UNSIGNED NOT NULL,
  `nama`        VARCHAR(150) NOT NULL,
  `kode`        VARCHAR(20)  NOT NULL UNIQUE,
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`fakultas_id`) REFERENCES `fakultas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 3. USERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nim_nip`          VARCHAR(30)  DEFAULT NULL,
  `name`             VARCHAR(150) NOT NULL,
  `email`            VARCHAR(200) NOT NULL UNIQUE,
  `password`         VARCHAR(255) NOT NULL,
  `role`             ENUM('admin','kerumahtanggaan','umum') NOT NULL DEFAULT 'umum',
  `alamat`           TEXT         DEFAULT NULL,
  `profile`          VARCHAR(255) DEFAULT NULL,
  `fakultas_id`      INT UNSIGNED DEFAULT NULL,
  `program_studi_id` INT UNSIGNED DEFAULT NULL,
  `created_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`fakultas_id`)      REFERENCES `fakultas`(`id`)      ON DELETE SET NULL,
  FOREIGN KEY (`program_studi_id`) REFERENCES `program_studi`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 4. KATEGORI ASET ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `kategori_aset` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nama_kategori`  VARCHAR(100) NOT NULL,
  `kode_kategori`  VARCHAR(20)  NOT NULL UNIQUE,
  `deskripsi`      TEXT         DEFAULT NULL,
  `created_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 5. ASET ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `aset` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `kode_qr`          VARCHAR(50)  NOT NULL UNIQUE,
  `kode_barang`      VARCHAR(50)  NOT NULL UNIQUE,
  `nama_barang`      VARCHAR(200) NOT NULL,
  `kategori_aset_id` INT UNSIGNED NOT NULL,
  `foto_barang`      VARCHAR(255) DEFAULT NULL,
  `stok`             INT          NOT NULL DEFAULT 0,
  `status`           ENUM('tersedia','dipinjam','rusak') NOT NULL DEFAULT 'tersedia',
  `deskripsi`        TEXT         DEFAULT NULL,
  `created_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`kategori_aset_id`) REFERENCES `kategori_aset`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 6. PEMINJAMAN ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `peminjaman` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`          INT UNSIGNED NOT NULL,
  `aset_id`          INT UNSIGNED NOT NULL,
  `qty`              INT          NOT NULL DEFAULT 1,
  `kode_peminjaman`  VARCHAR(60)  NOT NULL UNIQUE,
  `jaminan`          VARCHAR(200) NOT NULL,
  `waktu_pinjam`     DATETIME     NOT NULL,
  `deskripsi_pinjam` TEXT         DEFAULT NULL,
  `waktu_kembali`    DATETIME     DEFAULT NULL,
  `kondisi_kembali`  ENUM('bagus','rusak') DEFAULT NULL,
  `foto_baru`        VARCHAR(255) DEFAULT NULL,
  `deskripsi_rusak`  TEXT         DEFAULT NULL,
  `diproses_oleh`    INT UNSIGNED DEFAULT NULL,
  `created_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`)       REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`aset_id`)       REFERENCES `aset`(`id`)  ON DELETE RESTRICT,
  FOREIGN KEY (`diproses_oleh`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 7. LOG AUDIT ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `log_audit` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`    INT UNSIGNED DEFAULT NULL,
  `aksi`       VARCHAR(100) NOT NULL,
  `deskripsi`  TEXT         NOT NULL,
  `alamat_ip`  VARCHAR(45)  DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Fakultas
INSERT INTO `fakultas` (`nama`, `kode`) VALUES
('Fakultas Teknik',                        'FT'),
('Fakultas Ilmu Komputer',                 'FILKOM'),
('Fakultas Ekonomi dan Bisnis',            'FEB'),
('Fakultas Hukum',                         'FH');

-- Program Studi
INSERT INTO `program_studi` (`fakultas_id`, `nama`, `kode`) VALUES
(1, 'Teknik Informatika',          'TI'),
(1, 'Teknik Elektro',              'TE'),
(2, 'Sistem Informasi',            'SI'),
(2, 'Ilmu Komputer',               'IK'),
(3, 'Manajemen',                   'MNJ'),
(4, 'Ilmu Hukum',                  'IH');

-- Users — password bcrypt: Admin@12345 / Rumah@12345 / User@12345
INSERT INTO `users` (`nim_nip`, `name`, `email`, `password`, `role`, `alamat`) VALUES
('198001012005011001', 'Admin Sistem',   'admin@easset.ac.id',           '$2y$12$JbOvI38sxPEprXbosV0alOfpVp7Rf3/PuVZ9vFy99CVR5.buvs55C', 'admin',           'Gedung Rektorat Lt. 2'),
('199203152015041002', 'Budi Santoso',   'kerumahtanggaan@easset.ac.id', '$2y$12$qrbwgaKB3Gt1n5yLA7ZZcObsJDQKhGrsSKVWWsYmGjXcIGBd1v4vy', 'kerumahtanggaan', 'Unit Sarana & Prasarana'),
('2021010001',         'Anisa Putri',    'mahasiswa@easset.ac.id',       '$2y$12$PUjnJ3NTa2QCc6FCIIMDROR12/XL2lHDTlh.8i1IxCJhYlzzQ74Jy', 'umum',            'Jl. Mawar No. 5');

-- Kategori Aset
INSERT INTO `kategori_aset` (`nama_kategori`, `kode_kategori`, `deskripsi`) VALUES
('Elektronik & IT',               'KAT-ELEK', 'Laptop, PC, printer, router, dan perangkat IT pendukung akademik.'),
('Furnitur & Perlengkapan Ruang', 'KAT-FURN', 'Meja, kursi, lemari, rak, dan perabotan ruangan kampus.'),
('Alat Laboratorium',             'KAT-LAB',  'Instrumen dan perlengkapan laboratorium ilmiah dan praktikum.'),
('Kendaraan Operasional',         'KAT-KEND', 'Kendaraan dinas dan operasional kampus.'),
('Peralatan Olahraga',            'KAT-OLAH', 'Perlengkapan dan peralatan sarana olahraga kampus.'),
('Audio Visual & Presentasi',     'KAT-AV',   'Proyektor, sound system, kamera, dan peralatan presentasi.');

-- Aset (20 barang)
INSERT INTO `aset` (`kode_qr`, `kode_barang`, `nama_barang`, `kategori_aset_id`, `stok`, `status`, `deskripsi`) VALUES
('QR-ELEK-0001','LPT-2024-001','Laptop Dell Inspiron 15 3000',      1, 10,'tersedia','Intel Core i5 Gen 12, RAM 8GB, SSD 512GB.'),
('QR-ELEK-0002','PCD-2024-001','PC Desktop HP ProDesk 400 G9',       1, 20,'tersedia','Intel Core i7, RAM 16GB, SSD 256GB + HDD 1TB.'),
('QR-ELEK-0003','RTR-2024-001','Router Mikrotik RB750Gr3',            1,  5,'tersedia','Router jaringan kampus untuk distribusi internet.'),
('QR-ELEK-0004','PRN-2024-001','Printer Canon PIXMA G2010',           1,  8,'tersedia','Printer inkjet warna untuk administrasi.'),
('QR-ELEK-0005','UPS-2024-001','UPS APC Back-UPS 1000VA',             1,  6,'tersedia','UPS 1000VA pelindung daya untuk server.'),
('QR-FURN-0001','MJT-2023-001','Meja Tulis Kayu Jati 120x60cm',      2, 40,'tersedia','Meja kerja kayu solid untuk dosen dan administrasi.'),
('QR-FURN-0002','KRS-2023-001','Kursi Putar Ergonomis HighBack',      2, 50,'tersedia','Kursi putar adjustable height untuk kantor.'),
('QR-FURN-0003','LMR-2023-001','Lemari Arsip Metal 4 Laci',           2, 15,'tersedia','Filing cabinet baja untuk arsip dokumen.'),
('QR-FURN-0004','WBD-2023-001','Papan Tulis Whiteboard 120x240cm',   2, 25,'tersedia','Whiteboard magnetik untuk ruang kelas.'),
('QR-FURN-0005','RKB-2023-001','Rak Buku Besi 5 Tingkat',             2, 12,'tersedia','Rak buku besi powder coat untuk perpustakaan.'),
('QR-LAB-0001', 'MKR-2024-001','Mikroskop Binokuler Olympus CX23',   3, 15,'tersedia','Perbesaran hingga 1000x untuk lab biologi.'),
('QR-LAB-0002', 'MTM-2024-001','Multimeter Digital Fluke 117',        3, 20,'tersedia','True-RMS untuk pengukuran tegangan & arus.'),
('QR-LAB-0003', 'OSC-2024-001','Oscilloscope Digital Rigol DS1054Z', 3,  8,'tersedia','4 kanal, 50MHz untuk lab elektronika.'),
('QR-KEND-0001','MBU-2022-001','Minibus Toyota Hiace 2.5 Diesel',    4,  2,'tersedia','15 kursi untuk transportasi kegiatan kampus.'),
('QR-KEND-0002','MTR-2023-001','Sepeda Motor Honda Vario 160',        4,  3,'tersedia','Motor dinas untuk kurir antar gedung.'),
('QR-OLAH-0001','BLB-2024-001','Bola Basket Spalding Gold',           5, 10,'tersedia','Ukuran 7 untuk UKM dan turnamen basket.'),
('QR-OLAH-0002','NTV-2024-001','Net Voli Resmi FIVB Standard',        5,  4,'tersedia','Net voli standar internasional.'),
('QR-AV-0001',  'PRY-2024-001','Proyektor Epson EB-X51 3800 Lumen',  6, 12,'tersedia','XGA 3800 lumen untuk ruang kuliah & seminar.'),
('QR-AV-0002',  'KMR-2024-001','Kamera DSLR Canon EOS 2000D Kit',    6,  5,'tersedia','24.1MP untuk dokumentasi kegiatan kampus.'),
('QR-AV-0003',  'SND-2024-001','Sound System Aktif Yamaha DBR15',    6,  4,'tersedia','1000W 15 inci untuk seminar dan wisuda.');
