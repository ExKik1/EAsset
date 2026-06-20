<?php
$body = getBody();
$email    = trim($body['email'] ?? '');
$password = trim($body['password'] ?? '');

if (!$email || !$password) error('Email dan password wajib diisi.', 422);

$db   = getDB();
$stmt = $db->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    error('Email atau password salah.', 401);
}

$payload = [
    'sub'   => $user['id'],
    'name'  => $user['name'],
    'email' => $user['email'],
    'role'  => $user['role'],
];
$token = jwtEncode($payload);

// Log audit
$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$user['id'], 'LOGIN', "User {$user['name']} berhasil login.", $_SERVER['REMOTE_ADDR'] ?? '']);

$userData = [
    'id'               => (int)$user['id'],
    'nim_nip'          => $user['nim_nip'],
    'name'             => $user['name'],
    'email'            => $user['email'],
    'role'             => $user['role'],
    'alamat'           => $user['alamat'],
    'profile'          => $user['profile'],
    'fakultas_id'      => $user['fakultas_id'] ? (int)$user['fakultas_id'] : null,
    'program_studi_id' => $user['program_studi_id'] ? (int)$user['program_studi_id'] : null,
];

success(['token' => $token, 'token_type' => 'Bearer', 'expires_in' => JWT_EXPIRY, 'user' => $userData], 'Login berhasil.');
