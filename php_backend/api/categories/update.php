<?php
$payload = requireAuth();
requireRole($payload, ['admin', 'kerumahtanggaan']);
$id   = (int)($_GET['id'] ?? 0);
$body = getBody();
$nama = trim($body['nama_kategori'] ?? '');
$desk = trim($body['deskripsi']     ?? '');
if (!$id || !$nama) error('ID dan nama kategori wajib ada.', 422);

$db = getDB();
$db->prepare("SELECT id FROM kategori_aset WHERE id=? LIMIT 1")->execute([$id]);
// no check needed — just update
$db->prepare("UPDATE kategori_aset SET nama_kategori=?, deskripsi=?, updated_at=NOW() WHERE id=?")
   ->execute([$nama, $desk ?: null, $id]);

$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$payload['sub'], 'UPDATE_KATEGORI', "Kategori ID $id diperbarui: $nama", $_SERVER['REMOTE_ADDR'] ?? '']);

success(null, 'Kategori berhasil diperbarui.');
