<?php
$payload = requireAuth();
$kodeQr  = trim($_GET['kode_qr'] ?? '');
if (!$kodeQr) error('Kode QR tidak boleh kosong.', 422);

$db   = getDB();
$stmt = $db->prepare("SELECT a.*, k.nama_kategori, k.kode_kategori FROM aset a JOIN kategori_aset k ON k.id = a.kategori_aset_id WHERE a.kode_qr = ? LIMIT 1");
$stmt->execute([$kodeQr]);
$aset = $stmt->fetch();
if (!$aset) error('Aset tidak ditemukan.', 404);
$aset['id'] = (int)$aset['id'];
success($aset);
