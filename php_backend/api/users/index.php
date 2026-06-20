<?php
$payload = requireAuth();
requireRole($payload, ['admin']);
$db   = getDB();
$stmt = $db->query("SELECT u.id, u.nim_nip, u.name, u.email, u.role, u.alamat, u.profile, u.created_at, f.nama AS fakultas_nama, ps.nama AS prodi_nama FROM users u LEFT JOIN fakultas f ON f.id=u.fakultas_id LEFT JOIN program_studi ps ON ps.id=u.program_studi_id ORDER BY u.name ASC");
$users = $stmt->fetchAll();
foreach ($users as &$u) $u['id'] = (int)$u['id'];
success($users);
