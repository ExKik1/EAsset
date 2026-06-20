<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\KategoriAset;
use App\Models\Aset;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * Berisi: Users (admin, kerumahtanggaan, umum), KategoriAset, dan 20 Aset dengan QR Label.
     */
    public function run(): void
    {
        // ─────────────────────────────────────────────────────────
        // 1. USERS
        // ─────────────────────────────────────────────────────────
        User::create([
            'nim_nip'    => '198001012005011001',
            'name'       => 'Admin Sistem',
            'email'      => 'admin@easset.ac.id',
            'password'   => Hash::make('Admin@12345'),
            'role'       => 'admin',
            'alamat'     => 'Gedung Rektorat Lt. 2, Kampus Utama',
        ]);

        User::create([
            'nim_nip'    => '199203152015041002',
            'name'       => 'Budi Santoso',
            'email'      => 'kerumahtanggaan@easset.ac.id',
            'password'   => Hash::make('Rumah@12345'),
            'role'       => 'kerumahtanggaan',
            'alamat'     => 'Unit Sarana & Prasarana, Kampus Utama',
        ]);

        User::create([
            'nim_nip'    => '2021010001',
            'name'       => 'Anisa Putri',
            'email'      => 'mahasiswa@easset.ac.id',
            'password'   => Hash::make('User@12345'),
            'role'       => 'umum',
            'alamat'     => 'Jl. Mawar No. 5, Kota Kampus',
        ]);

        // ─────────────────────────────────────────────────────────
        // 2. KATEGORI ASET (6 kategori)
        // ─────────────────────────────────────────────────────────
        $elektronik = KategoriAset::create([
            'nama_kategori' => 'Elektronik & IT',
            'kode_kategori' => 'KAT-ELEK',
            'deskripsi'     => 'Perangkat elektronik, komputer, jaringan, dan alat IT pendukung kegiatan akademik.',
        ]);

        $furnitur = KategoriAset::create([
            'nama_kategori' => 'Furnitur & Perlengkapan Ruang',
            'kode_kategori' => 'KAT-FURN',
            'deskripsi'     => 'Meja, kursi, lemari, rak, dan perabotan ruangan kampus.',
        ]);

        $alat_lab = KategoriAset::create([
            'nama_kategori' => 'Alat Laboratorium',
            'kode_kategori' => 'KAT-LAB',
            'deskripsi'     => 'Instrumen dan perlengkapan laboratorium ilmiah dan praktikum.',
        ]);

        $kendaraan = KategoriAset::create([
            'nama_kategori' => 'Kendaraan Operasional',
            'kode_kategori' => 'KAT-KEND',
            'deskripsi'     => 'Kendaraan dinas dan operasional kampus.',
        ]);

        $olahraga = KategoriAset::create([
            'nama_kategori' => 'Peralatan Olahraga',
            'kode_kategori' => 'KAT-OLAH',
            'deskripsi'     => 'Perlengkapan dan peralatan sarana olahraga kampus.',
        ]);

        $audio_visual = KategoriAset::create([
            'nama_kategori' => 'Audio Visual & Presentasi',
            'kode_kategori' => 'KAT-AV',
            'deskripsi'     => 'Proyektor, sound system, kamera, dan peralatan presentasi.',
        ]);

        // ─────────────────────────────────────────────────────────
        // 3. DAFTAR ASET — 20 Barang dengan QR Label
        //    Format kode_qr : QR-[KATEGORI]-[NOMOR URUT]
        //    Format kode_barang : [SINGKATAN]-[TAHUN]-[NOMOR URUT]
        // ─────────────────────────────────────────────────────────
        $asetData = [
            // ── ELEKTRONIK & IT ──────────────────────────────────
            [
                'kode_qr'          => 'QR-ELEK-0001',
                'nama_barang'      => 'Laptop Dell Inspiron 15 3000',
                'kode_barang'      => 'LPT-2024-001',
                'kategori_aset_id' => $elektronik->id,
                'stok'             => 10,
                'status'           => 'tersedia',
                'deskripsi'        => 'Laptop Intel Core i5 Gen 12, RAM 8GB, SSD 512GB. Digunakan untuk kegiatan praktikum dan perkantoran.',
            ],
            [
                'kode_qr'          => 'QR-ELEK-0002',
                'nama_barang'      => 'PC Desktop HP ProDesk 400 G9',
                'kode_barang'      => 'PCD-2024-001',
                'kategori_aset_id' => $elektronik->id,
                'stok'             => 20,
                'status'           => 'tersedia',
                'deskripsi'        => 'PC Desktop Intel Core i7, RAM 16GB, SSD 256GB + HDD 1TB. Inventaris Lab Komputer.',
            ],
            [
                'kode_qr'          => 'QR-ELEK-0003',
                'nama_barang'      => 'Router Mikrotik RB750Gr3',
                'kode_barang'      => 'RTR-2024-001',
                'kategori_aset_id' => $elektronik->id,
                'stok'             => 5,
                'status'           => 'tersedia',
                'deskripsi'        => 'Router jaringan kampus untuk distribusi internet ke gedung perkuliahan.',
            ],
            [
                'kode_qr'          => 'QR-ELEK-0004',
                'nama_barang'      => 'Printer Canon PIXMA G2010',
                'kode_barang'      => 'PRN-2024-001',
                'kategori_aset_id' => $elektronik->id,
                'stok'             => 8,
                'status'           => 'tersedia',
                'deskripsi'        => 'Printer inkjet warna untuk keperluan administrasi dan cetak dokumen akademik.',
            ],
            [
                'kode_qr'          => 'QR-ELEK-0005',
                'nama_barang'      => 'UPS APC Back-UPS 1000VA',
                'kode_barang'      => 'UPS-2024-001',
                'kategori_aset_id' => $elektronik->id,
                'stok'             => 6,
                'status'           => 'tersedia',
                'deskripsi'        => 'UPS 1000VA pelindung daya untuk server dan perangkat jaringan.',
            ],
            // ── FURNITUR & PERLENGKAPAN RUANG ────────────────────
            [
                'kode_qr'          => 'QR-FURN-0001',
                'nama_barang'      => 'Meja Tulis Kayu Jati 120x60cm',
                'kode_barang'      => 'MJT-2023-001',
                'kategori_aset_id' => $furnitur->id,
                'stok'             => 40,
                'status'           => 'tersedia',
                'deskripsi'        => 'Meja kerja kayu solid untuk ruang dosen dan administrasi kampus.',
            ],
            [
                'kode_qr'          => 'QR-FURN-0002',
                'nama_barang'      => 'Kursi Putar Ergonomis HighBack',
                'kode_barang'      => 'KRS-2023-001',
                'kategori_aset_id' => $furnitur->id,
                'stok'             => 50,
                'status'           => 'tersedia',
                'deskripsi'        => 'Kursi kantor putar dengan sandaran tinggi dan adjustable height.',
            ],
            [
                'kode_qr'          => 'QR-FURN-0003',
                'nama_barang'      => 'Lemari Arsip Metal 4 Laci',
                'kode_barang'      => 'LMR-2023-001',
                'kategori_aset_id' => $furnitur->id,
                'stok'             => 15,
                'status'           => 'tersedia',
                'deskripsi'        => 'Lemari filing cabinet baja untuk penyimpanan dokumen dan arsip penting.',
            ],
            [
                'kode_qr'          => 'QR-FURN-0004',
                'nama_barang'      => 'Papan Tulis Whiteboard 120x240cm',
                'kode_barang'      => 'WBD-2023-001',
                'kategori_aset_id' => $furnitur->id,
                'stok'             => 25,
                'status'           => 'tersedia',
                'deskripsi'        => 'Papan tulis white board magnetik untuk ruang kelas dan ruang rapat.',
            ],
            [
                'kode_qr'          => 'QR-FURN-0005',
                'nama_barang'      => 'Rak Buku Besi 5 Tingkat',
                'kode_barang'      => 'RKB-2023-001',
                'kategori_aset_id' => $furnitur->id,
                'stok'             => 12,
                'status'           => 'tersedia',
                'deskripsi'        => 'Rak buku besi powder coat untuk perpustakaan dan ruang referensi.',
            ],
            // ── ALAT LABORATORIUM ─────────────────────────────────
            [
                'kode_qr'          => 'QR-LAB-0001',
                'nama_barang'      => 'Mikroskop Binokuler Olympus CX23',
                'kode_barang'      => 'MKR-2024-001',
                'kategori_aset_id' => $alat_lab->id,
                'stok'             => 15,
                'status'           => 'tersedia',
                'deskripsi'        => 'Mikroskop binokuler perbesaran hingga 1000x untuk lab biologi dan kimia.',
            ],
            [
                'kode_qr'          => 'QR-LAB-0002',
                'nama_barang'      => 'Multimeter Digital Fluke 117',
                'kode_barang'      => 'MTM-2024-001',
                'kategori_aset_id' => $alat_lab->id,
                'stok'             => 20,
                'status'           => 'tersedia',
                'deskripsi'        => 'Multimeter digital True-RMS untuk pengukuran tegangan, arus, dan resistansi.',
            ],
            [
                'kode_qr'          => 'QR-LAB-0003',
                'nama_barang'      => 'Oscilloscope Digital Rigol DS1054Z',
                'kode_barang'      => 'OSC-2024-001',
                'kategori_aset_id' => $alat_lab->id,
                'stok'             => 8,
                'status'           => 'tersedia',
                'deskripsi'        => 'Osiloskop digital 4 kanal, 50MHz, sampling rate 1GSa/s untuk lab elektronika.',
            ],
            // ── KENDARAAN OPERASIONAL ────────────────────────────
            [
                'kode_qr'          => 'QR-KEND-0001',
                'nama_barang'      => 'Minibus Toyota Hiace 2.5 Diesel',
                'kode_barang'      => 'MBU-2022-001',
                'kategori_aset_id' => $kendaraan->id,
                'stok'             => 2,
                'status'           => 'tersedia',
                'deskripsi'        => 'Minibus 15 kursi untuk transportasi kegiatan kampus dan kunjungan studi.',
            ],
            [
                'kode_qr'          => 'QR-KEND-0002',
                'nama_barang'      => 'Sepeda Motor Honda Vario 160',
                'kode_barang'      => 'MTR-2023-001',
                'kategori_aset_id' => $kendaraan->id,
                'stok'             => 3,
                'status'           => 'tersedia',
                'deskripsi'        => 'Motor operasional dinas untuk kurir dan pengiriman dokumen antar gedung.',
            ],
            // ── PERALATAN OLAHRAGA ────────────────────────────────
            [
                'kode_qr'          => 'QR-OLAH-0001',
                'nama_barang'      => 'Bola Basket Spalding Gold',
                'kode_barang'      => 'BLB-2024-001',
                'kategori_aset_id' => $olahraga->id,
                'stok'             => 10,
                'status'           => 'tersedia',
                'deskripsi'        => 'Bola basket ukuran 7 untuk kegiatan UKM dan turnamen basket kampus.',
            ],
            [
                'kode_qr'          => 'QR-OLAH-0002',
                'nama_barang'      => 'Net Voli Resmi FIVB Standard',
                'kode_barang'      => 'NTV-2024-001',
                'kategori_aset_id' => $olahraga->id,
                'stok'             => 4,
                'status'           => 'tersedia',
                'deskripsi'        => 'Net bola voli standar internasional untuk lapangan indoor kampus.',
            ],
            // ── AUDIO VISUAL & PRESENTASI ─────────────────────────
            [
                'kode_qr'          => 'QR-AV-0001',
                'nama_barang'      => 'Proyektor Epson EB-X51 3800 Lumens',
                'kode_barang'      => 'PRY-2024-001',
                'kategori_aset_id' => $audio_visual->id,
                'stok'             => 12,
                'status'           => 'tersedia',
                'deskripsi'        => 'Proyektor XGA 3800 lumen untuk ruang kuliah, seminar, dan presentasi akademik.',
            ],
            [
                'kode_qr'          => 'QR-AV-0002',
                'nama_barang'      => 'Kamera DSLR Canon EOS 2000D Kit',
                'kode_barang'      => 'KMR-2024-001',
                'kategori_aset_id' => $audio_visual->id,
                'stok'             => 5,
                'status'           => 'tersedia',
                'deskripsi'        => 'Kamera DSLR 24.1MP untuk dokumentasi kegiatan kampus dan UKM fotografi.',
            ],
            [
                'kode_qr'          => 'QR-AV-0003',
                'nama_barang'      => 'Sound System Aktif Yamaha DBR15',
                'kode_barang'      => 'SND-2024-001',
                'kategori_aset_id' => $audio_visual->id,
                'stok'             => 4,
                'status'           => 'tersedia',
                'deskripsi'        => 'Speaker aktif 1000W 15 inci untuk acara seminar, wisuda, dan kegiatan besar kampus.',
            ],
        ];

        foreach ($asetData as $aset) {
            Aset::create($aset);
        }
    }
}
