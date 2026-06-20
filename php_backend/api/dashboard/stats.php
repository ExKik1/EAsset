<?php
$payload = requireAuth();
requireRole($payload, ['admin', 'kerumahtanggaan']);
$db = getDB();

$totalAset       = $db->query("SELECT COUNT(*) FROM aset")->fetchColumn();
$totalTersedia   = $db->query("SELECT COUNT(*) FROM aset WHERE status='tersedia'")->fetchColumn();
$totalDipinjam   = $db->query("SELECT COUNT(*) FROM aset WHERE status='dipinjam'")->fetchColumn();
$totalRusak      = $db->query("SELECT COUNT(*) FROM aset WHERE status='rusak'")->fetchColumn();
$totalKategori   = $db->query("SELECT COUNT(*) FROM kategori_aset")->fetchColumn();
$totalUsers      = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
$totalPeminjaman = $db->query("SELECT COUNT(*) FROM peminjaman")->fetchColumn();
$aktifPeminjaman = $db->query("SELECT COUNT(*) FROM peminjaman WHERE waktu_kembali IS NULL")->fetchColumn();

// Peminjaman per kategori (untuk chart)
$chartStmt = $db->query("
    SELECT k.nama_kategori AS label, COUNT(p.id) AS total
    FROM kategori_aset k
    LEFT JOIN aset a ON a.kategori_aset_id = k.id
    LEFT JOIN peminjaman p ON p.aset_id = a.id
    GROUP BY k.id, k.nama_kategori
    ORDER BY total DESC
");
$chartData = $chartStmt->fetchAll();

// Stok per kategori
$stokStmt = $db->query("
    SELECT k.nama_kategori AS label, SUM(a.stok) AS total
    FROM kategori_aset k
    LEFT JOIN aset a ON a.kategori_aset_id = k.id
    GROUP BY k.id, k.nama_kategori
");
$stokData = $stokStmt->fetchAll();

// Peminjaman 7 hari terakhir
$trendStmt = $db->query("
    SELECT DATE(waktu_pinjam) AS tgl, COUNT(*) AS total
    FROM peminjaman
    WHERE waktu_pinjam >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY DATE(waktu_pinjam)
    ORDER BY tgl ASC
");
$trendData = $trendStmt->fetchAll();

// Peminjaman terbaru 5 data
$recentStmt = $db->query("
    SELECT p.id, p.kode_peminjaman, p.qty, p.waktu_pinjam, p.waktu_kembali,
           u.name AS nama_peminjam, a.nama_barang, a.kode_qr
    FROM peminjaman p
    JOIN users u ON u.id = p.user_id
    JOIN aset a  ON a.id = p.aset_id
    ORDER BY p.created_at DESC
    LIMIT 5
");
$recentData = $recentStmt->fetchAll();

success([
    'total_aset'        => (int)$totalAset,
    'total_tersedia'    => (int)$totalTersedia,
    'total_dipinjam'    => (int)$totalDipinjam,
    'total_rusak'       => (int)$totalRusak,
    'total_kategori'    => (int)$totalKategori,
    'total_users'       => (int)$totalUsers,
    'total_peminjaman'  => (int)$totalPeminjaman,
    'aktif_peminjaman'  => (int)$aktifPeminjaman,
    'chart_peminjaman'  => $chartData,
    'chart_stok'        => $stokData,
    'trend_7hari'       => $trendData,
    'peminjaman_terbaru'=> $recentData,
]);
