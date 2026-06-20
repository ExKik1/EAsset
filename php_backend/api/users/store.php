<?php
$payload = requireAuth();
requireRole($payload, ['admin']);
$body  = getBody();
$name  = trim($body['name']     ?? '');
$email = trim($body['email']    ?? '');
$pass  = trim($body['password'] ?? '');
$role  = trim($body['role']     ?? 'umum');
$nimNip= trim($body['nim_nip']  ?? '');
$alamat= trim($body['alamat']   ?? '');

if (!$name || !$email || !$pass) error('Nama, email, password wajib diisi.', 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) error('Format email tidak valid.', 422);
if (!in_array($role, ['admin','kerumahtanggaan','umum'])) $role = 'umum';

$db = getDB();
$chk = $db->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
$chk->execute([$email]);
if ($chk->fetch()) error('Email sudah terdaftar.', 409);

$hash = password_hash($pass, PASSWORD_BCRYPT);
$db->prepare("INSERT INTO users (nim_nip, name, email, password, role, alamat) VALUES (?,?,?,?,?,?)")
   ->execute([$nimNip ?: null, $name, $email, $hash, $role, $alamat ?: null]);
$newId = (int)$db->lastInsertId();

$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$payload['sub'], 'CREATE_USER', "Admin menambahkan user baru: $name ($email)", $_SERVER['REMOTE_ADDR'] ?? '']);

success(['id' => $newId, 'name' => $name, 'email' => $email, 'role' => $role], 'User berhasil ditambahkan.', 201);
