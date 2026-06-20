<?php
$body  = getBody();
$name  = trim($body['name']     ?? '');
$email = trim($body['email']    ?? '');
$pass  = trim($body['password'] ?? '');
$role  = trim($body['role']     ?? 'umum');
$nimNip = trim($body['nim_nip'] ?? '');
$alamat = trim($body['alamat']  ?? '');

if (!$name || !$email || !$pass) error('Nama, email, dan password wajib diisi.', 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) error('Format email tidak valid.', 422);
if (strlen($pass) < 8) error('Password minimal 8 karakter.', 422);
if (!in_array($role, ['admin','kerumahtanggaan','umum'])) $role = 'umum';

$db   = getDB();
$stmt = $db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
if ($stmt->fetch()) error('Email sudah terdaftar.', 409);

$hash = password_hash($pass, PASSWORD_BCRYPT);
$ins  = $db->prepare("INSERT INTO users (nim_nip, name, email, password, role, alamat) VALUES (?,?,?,?,?,?)");
$ins->execute([$nimNip ?: null, $name, $email, $hash, $role, $alamat ?: null]);
$userId = (int)$db->lastInsertId();

$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$userId, 'REGISTER', "User baru $name mendaftar dengan role $role.", $_SERVER['REMOTE_ADDR'] ?? '']);

success(['id' => $userId, 'name' => $name, 'email' => $email, 'role' => $role], 'Registrasi berhasil.', 201);
