<?php
$payload = requireAuth();
requireRole($payload, ['admin']);
$id = (int)($_GET['id'] ?? 0);
if (!$id) error('ID tidak valid.', 422);
$db = getDB();
$chk = $db->prepare("SELECT id FROM aset WHERE kategori_aset_id=? LIMIT 1");
$chk->execute([$id]);
if ($chk->fetch()) error('Kategori tidak bisa dihapus karena masih memiliki aset terkait.', 409);
$db->prepare("DELETE FROM kategori_aset WHERE id=?")->execute([$id]);
$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$payload['sub'], 'DELETE_KATEGORI', "Kategori ID $id dihapus.", $_SERVER['REMOTE_ADDR'] ?? '']);
success(null, 'Kategori berhasil dihapus.');
