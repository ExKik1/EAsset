<?php
$payload = requireAuth();
requireRole($payload, ['admin', 'kerumahtanggaan']);
$body = getBody();

$kodeQr      = trim($body['kode_qr']          ?? '');
$kodeBarang  = trim($body['kode_barang']       ?? '');
$namaBarang  = trim($body['nama_barang']       ?? '');
$kategoriId  = (int)($body['kategori_aset_id'] ?? 0);
$stok        = (int)($body['stok']             ?? 0);
$status      = trim($body['status']            ?? 'tersedia');
$deskripsi   = trim($body['deskripsi']         ?? '');
$foto        = trim($body['foto_barang']       ?? '');

if (!$kodeQr || !$kodeBarang || !$namaBarang || !$kategoriId) error('Field kode_qr, kode_barang, nama_barang, kategori_aset_id wajib diisi.', 422);
if (!in_array($status, ['tersedia','dipinjam','rusak'])) $status = 'tersedia';

$db = getDB();
$chk = $db->prepare("SELECT id FROM aset WHERE kode_qr=? OR kode_barang=? LIMIT 1");
$chk->execute([$kodeQr, $kodeBarang]);
if ($chk->fetch()) error('Kode QR atau Kode Barang sudah terdaftar.', 409);

$db->prepare("INSERT INTO aset (kode_qr, kode_barang, nama_barang, kategori_aset_id, stok, status, deskripsi, foto_barang) VALUES (?,?,?,?,?,?,?,?)")
   ->execute([$kodeQr, $kodeBarang, $namaBarang, $kategoriId, $stok, $status, $deskripsi ?: null, $foto ?: null]);
$newId = (int)$db->lastInsertId();

$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$payload['sub'], 'CREATE_ASET', "Aset baru ditambahkan: $namaBarang ($kodeQr)", $_SERVER['REMOTE_ADDR'] ?? '']);

success(['id' => $newId, 'kode_qr' => $kodeQr, 'nama_barang' => $namaBarang], 'Aset berhasil ditambahkan.', 201);
