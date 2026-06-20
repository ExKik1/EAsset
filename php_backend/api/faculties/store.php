<?php
$payload = requireAuth();
requireRole($payload, ['admin']);
$body = getBody();
$nama = trim($body['nama'] ?? '');
$kode = strtoupper(trim($body['kode'] ?? ''));
if (!$nama || !$kode) error('Nama dan kode wajib diisi.', 422);
$db = getDB();
$chk = $db->prepare("SELECT id FROM fakultas WHERE kode=? LIMIT 1");
$chk->execute([$kode]);
if ($chk->fetch()) error('Kode fakultas sudah ada.', 409);
$db->prepare("INSERT INTO fakultas (nama, kode) VALUES (?,?)")->execute([$nama, $kode]);
$newId = (int)$db->lastInsertId();
$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")->execute([$payload['sub'], 'CREATE_FAKULTAS', "Fakultas baru: $nama", $_SERVER['REMOTE_ADDR'] ?? '']);
success(['id' => $newId, 'nama' => $nama, 'kode' => $kode], 'Fakultas berhasil ditambahkan.', 201);
