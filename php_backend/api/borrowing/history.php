<?php
$payload = requireAuth();
$db    = getDB();
$role  = $payload['role'];
$uid   = $payload['sub'];

$sql    = "SELECT p.id, p.kode_peminjaman, p.qty, p.jaminan, p.waktu_pinjam, p.waktu_kembali, p.kondisi_kembali, p.deskripsi_pinjam, p.deskripsi_rusak, p.foto_baru, u.name AS nama_peminjam, u.nim_nip, a.nama_barang, a.kode_qr, a.kode_barang, k.nama_kategori, stf.name AS diproses_oleh_nama FROM peminjaman p JOIN users u ON u.id = p.user_id JOIN aset a ON a.id = p.aset_id JOIN kategori_aset k ON k.id = a.kategori_aset_id LEFT JOIN users stf ON stf.id = p.diproses_oleh WHERE 1=1";
$params = [];

// User umum hanya lihat miliknya sendiri
if ($role === 'umum') { $sql .= " AND p.user_id = ?"; $params[] = $uid; }

// Filter status
$status = trim($_GET['status'] ?? '');
if ($status === 'aktif')      { $sql .= " AND p.waktu_kembali IS NULL"; }
elseif ($status === 'kembali') { $sql .= " AND p.waktu_kembali IS NOT NULL"; }

$sql .= " ORDER BY p.created_at DESC";
$stmt = $db->prepare($sql);
$stmt->execute($params);
$history = $stmt->fetchAll();

foreach ($history as &$h) $h['id'] = (int)$h['id'];
success($history);
