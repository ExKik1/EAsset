<?php
$payload = requireAuth();
requireRole($payload, ['admin']);
$id = (int)($_GET['id'] ?? 0);
if (!$id) error('ID tidak valid.', 422);
if ($id === (int)$payload['sub']) error('Tidak bisa menghapus akun sendiri.', 400);

$db = getDB();
$stmt = $db->prepare("SELECT name FROM users WHERE id=? LIMIT 1");
$stmt->execute([$id]);
$user = $stmt->fetch();
if (!$user) error('User tidak ditemukan.', 404);

$db->prepare("DELETE FROM users WHERE id=?")->execute([$id]);
$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$payload['sub'], 'DELETE_USER', "Admin menghapus user: {$user['name']}", $_SERVER['REMOTE_ADDR'] ?? '']);
success(null, 'User berhasil dihapus.');
