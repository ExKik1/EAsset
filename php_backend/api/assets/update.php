<?php
$payload = requireAuth();
requireRole($payload, ['admin', 'kerumahtanggaan']);
$kodeQr = trim($_GET['kode_qr'] ?? '');
$body   = getBody();

$namaBarang = trim($body['nama_barang']       ?? '');
$kategoriId = (int)($body['kategori_aset_id'] ?? 0);
$stok       = (int)($body['stok']             ?? 0);
$status     = trim($body['status']            ?? 'tersedia');
$deskripsi  = trim($body['deskripsi']         ?? '');
$foto       = trim($body['foto_barang']       ?? '');

if (!$kodeQr || !$namaBarang || !$kategoriId) error('Field kode_qr, nama_barang, kategori_aset_id wajib diisi.', 422);
if (!in_array($status, ['tersedia','dipinjam','rusak'])) $status = 'tersedia';

$db   = getDB();
$chk  = $db->prepare("SELECT id FROM aset WHERE kode_qr=? LIMIT 1");
$chk->execute([$kodeQr]);
if (!$chk->fetch()) error('Aset tidak ditemukan.', 404);

$db->prepare("UPDATE aset SET nama_barang=?, kategori_aset_id=?, stok=?, status=?, deskripsi=?, foto_barang=?, updated_at=NOW() WHERE kode_qr=?")
   ->execute([$namaBarang, $kategoriId, $stok, $status, $deskripsi ?: null, $foto ?: null, $kodeQr]);

$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$payload['sub'], 'UPDATE_ASET', "Aset diperbarui: $namaBarang ($kodeQr)", $_SERVER['REMOTE_ADDR'] ?? '']);

success(null, 'Aset berhasil diperbarui.');
