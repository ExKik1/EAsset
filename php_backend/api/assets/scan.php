<?php
$payload = requireAuth();
$kodeQr  = trim($_GET['kode_qr'] ?? '');
if (!$kodeQr) error('Kode QR tidak boleh kosong.', 422);

$db   = getDB();
$stmt = $db->prepare("
    SELECT a.*, k.nama_kategori, k.kode_kategori
    FROM aset a
    JOIN kategori_aset k ON k.id = a.kategori_aset_id
    WHERE a.kode_qr = ?
    LIMIT 1
");
$stmt->execute([$kodeQr]);
$aset = $stmt->fetch();

if (!$aset) error("Kode QR \"$kodeQr\" tidak terdaftar dalam sistem E-Asset.", 404);

$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$payload['sub'], 'SCAN_QR', "QR Scan: {$aset['nama_barang']} ($kodeQr)", $_SERVER['REMOTE_ADDR'] ?? '']);

$statusLabel = match($aset['status']) {
    'tersedia' => 'Tersedia',
    'dipinjam' => 'Sedang Dipinjam',
    'rusak'    => 'Rusak / Tidak Layak',
    default    => $aset['status'],
};

success([
    'id'           => (int)$aset['id'],
    'kode_qr'      => $aset['kode_qr'],
    'kode_barang'  => $aset['kode_barang'],
    'nama_barang'  => $aset['nama_barang'],
    'kategori'     => $aset['nama_kategori'],
    'kode_kategori'=> $aset['kode_kategori'],
    'foto_barang'  => $aset['foto_barang'],
    'stok'         => (int)$aset['stok'],
    'status'       => $aset['status'],
    'status_label' => $statusLabel,
    'deskripsi'    => $aset['deskripsi'],
    'created_at'   => $aset['created_at'],
    'updated_at'   => $aset['updated_at'],
], 'Aset ditemukan.');
