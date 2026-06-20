<?php
$payload = requireAuth();
requireRole($payload, ['admin']);
$id = (int)($_GET['id'] ?? 0);
if (!$id) error('ID tidak valid.', 422);
$db = getDB();
$chk = $db->prepare("SELECT id FROM program_studi WHERE fakultas_id=? LIMIT 1");
$chk->execute([$id]);
if ($chk->fetch()) error('Fakultas masih memiliki program studi terkait.', 409);
$db->prepare("DELETE FROM fakultas WHERE id=?")->execute([$id]);
$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")->execute([$payload['sub'], 'DELETE_FAKULTAS', "Fakultas ID $id dihapus.", $_SERVER['REMOTE_ADDR'] ?? '']);
success(null, 'Fakultas berhasil dihapus.');
