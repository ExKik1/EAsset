<?php
$payload = requireAuth();
requireRole($payload, ['admin']);
$kodeQr = trim($_GET['kode_qr'] ?? '');
if (!$kodeQr) error('Kode QR tidak boleh kosong.', 422);

$db   = getDB();
$stmt = $db->prepare("SELECT id, nama_barang FROM aset WHERE kode_qr=? LIMIT 1");
$stmt->execute([$kodeQr]);
$aset = $stmt->fetch();
if (!$aset) error('Aset tidak ditemukan.', 404);

// Cek apakah masih ada peminjaman aktif
$cekPinjam = $db->prepare("SELECT id FROM peminjaman WHERE aset_id=? AND waktu_kembali IS NULL LIMIT 1");
$cekPinjam->execute([$aset['id']]);
if ($cekPinjam->fetch()) error('Aset tidak bisa dihapus karena masih dalam status dipinjam.', 409);

$db->prepare("DELETE FROM aset WHERE kode_qr=?")->execute([$kodeQr]);

$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$payload['sub'], 'DELETE_ASET', "Aset dihapus: {$aset['nama_barang']} ($kodeQr)", $_SERVER['REMOTE_ADDR'] ?? '']);

success(null, 'Aset berhasil dihapus.');
