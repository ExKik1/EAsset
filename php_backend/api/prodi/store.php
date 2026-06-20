<?php
$payload = requireAuth();
requireRole($payload, ['admin']);
$body = getBody();
$nama = trim($body['nama'] ?? '');
$kode = strtoupper(trim($body['kode'] ?? ''));
$fid  = (int)($body['fakultas_id'] ?? 0);
if (!$nama || !$kode || !$fid) error('Nama, kode, dan fakultas_id wajib diisi.', 422);
$db = getDB();
$db->prepare("INSERT INTO program_studi (fakultas_id, nama, kode) VALUES (?,?,?)")->execute([$fid, $nama, $kode]);
$newId = (int)$db->lastInsertId();
$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")->execute([$payload['sub'], 'CREATE_PRODI', "Prodi baru: $nama", $_SERVER['REMOTE_ADDR'] ?? '']);
success(['id' => $newId, 'nama' => $nama, 'kode' => $kode], 'Prodi berhasil ditambahkan.', 201);
