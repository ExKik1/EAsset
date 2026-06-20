<?php
$payload = requireAuth();
$body        = getBody();
$oldPassword = trim($body['old_password'] ?? '');
$newPassword = trim($body['new_password'] ?? '');
$confirm     = trim($body['confirm_password'] ?? '');

if (!$oldPassword || !$newPassword || !$confirm) error('Semua field password wajib diisi.', 422);
if (strlen($newPassword) < 8) error('Password baru minimal 8 karakter.', 422);
if ($newPassword !== $confirm) error('Konfirmasi password tidak cocok.', 422);

$db   = getDB();
$stmt = $db->prepare("SELECT password FROM users WHERE id = ? LIMIT 1");
$stmt->execute([$payload['sub']]);
$user = $stmt->fetch();

if (!$user || !password_verify($oldPassword, $user['password'])) {
    error('Password lama tidak benar.', 401);
}

$hash = password_hash($newPassword, PASSWORD_BCRYPT);
$db->prepare("UPDATE users SET password=?, updated_at=NOW() WHERE id=?")
   ->execute([$hash, $payload['sub']]);

$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$payload['sub'], 'CHANGE_PASSWORD', "User {$payload['name']} mengganti password.", $_SERVER['REMOTE_ADDR'] ?? '']);

success(null, 'Password berhasil diubah.');
