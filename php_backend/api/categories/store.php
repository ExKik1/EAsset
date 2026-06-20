<?php
$payload = requireAuth();
requireRole($payload, ['admin', 'kerumahtanggaan']);
$body = getBody();
$nama  = trim($body['nama_kategori']  ?? '');
$kode  = trim($body['kode_kategori']  ?? '');
$desk  = trim($body['deskripsi']      ?? '');
if (!$nama || !$kode) error('Nama dan kode kategori wajib diisi.', 422);

$db  = getDB();
$chk = $db->prepare("SELECT id FROM kategori_aset WHERE kode_kategori=? LIMIT 1");
$chk->execute([$kode]);
if ($chk->fetch()) error('Kode kategori sudah terdaftar.', 409);

$db->prepare("INSERT INTO kategori_aset (nama_kategori, kode_kategori, deskripsi) VALUES (?,?,?)")
   ->execute([$nama, strtoupper($kode), $desk ?: null]);
$newId = (int)$db->lastInsertId();

$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$payload['sub'], 'CREATE_KATEGORI', "Kategori baru: $nama ($kode)", $_SERVER['REMOTE_ADDR'] ?? '']);

success(['id' => $newId, 'nama_kategori' => $nama, 'kode_kategori' => $kode], 'Kategori berhasil ditambahkan.', 201);
