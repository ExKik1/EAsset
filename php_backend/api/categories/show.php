<?php
$payload = requireAuth();
$id = (int)($_GET['id'] ?? 0);
if (!$id) error('ID tidak valid.', 422);
$db   = getDB();
$stmt = $db->prepare("SELECT * FROM kategori_aset WHERE id=? LIMIT 1");
$stmt->execute([$id]);
$cat = $stmt->fetch();
if (!$cat) error('Kategori tidak ditemukan.', 404);
$cat['id'] = (int)$cat['id'];
success($cat);
