<?php
$payload = requireAuth();
requireRole($payload, ['admin']);
$id = (int)($_GET['id'] ?? 0);
if (!$id) error('ID tidak valid.', 422);
$db = getDB();
$stmt = $db->prepare("SELECT u.id, u.nim_nip, u.name, u.email, u.role, u.alamat, u.profile, u.created_at, f.nama AS fakultas_nama, ps.nama AS prodi_nama FROM users u LEFT JOIN fakultas f ON f.id=u.fakultas_id LEFT JOIN program_studi ps ON ps.id=u.program_studi_id WHERE u.id=? LIMIT 1");
$stmt->execute([$id]);
$user = $stmt->fetch();
if (!$user) error('User tidak ditemukan.', 404);
$user['id'] = (int)$user['id'];
success($user);
