<?php
$payload = requireAuth();
requireRole($payload, ['admin']);
$id   = (int)($_GET['id'] ?? 0);
$body = getBody();
$name  = trim($body['name']   ?? '');
$role  = trim($body['role']   ?? 'umum');
$nimNip= trim($body['nim_nip'] ?? '');
$alamat= trim($body['alamat'] ?? '');
if (!$id || !$name) error('ID dan nama wajib ada.', 422);
if (!in_array($role, ['admin','kerumahtanggaan','umum'])) $role = 'umum';

$db = getDB();
$db->prepare("UPDATE users SET name=?, nim_nip=?, role=?, alamat=?, updated_at=NOW() WHERE id=?")
   ->execute([$name, $nimNip ?: null, $role, $alamat ?: null, $id]);

if (!empty($body['password'])) {
    $hash = password_hash($body['password'], PASSWORD_BCRYPT);
    $db->prepare("UPDATE users SET password=? WHERE id=?")->execute([$hash, $id]);
}

$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$payload['sub'], 'UPDATE_USER', "Admin memperbarui user ID $id: $name", $_SERVER['REMOTE_ADDR'] ?? '']);
success(null, 'User berhasil diperbarui.');
