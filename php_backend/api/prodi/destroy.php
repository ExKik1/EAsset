<?php
$payload = requireAuth();
requireRole($payload, ['admin']);
$id = (int)($_GET['id'] ?? 0);
if (!$id) error('ID tidak valid.', 422);
$db = getDB();
$db->prepare("DELETE FROM program_studi WHERE id=?")->execute([$id]);
$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")->execute([$payload['sub'], 'DELETE_PRODI', "Prodi ID $id dihapus.", $_SERVER['REMOTE_ADDR'] ?? '']);
success(null, 'Prodi berhasil dihapus.');
