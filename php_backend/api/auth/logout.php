<?php
$payload = requireAuth();
$db = getDB();
$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$payload['sub'], 'LOGOUT', "User {$payload['name']} logout.", $_SERVER['REMOTE_ADDR'] ?? '']);
success(null, 'Logout berhasil.');
