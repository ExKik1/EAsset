<?php
$payload = requireAuth();
$db   = getDB();
$stmt = $db->query("SELECT k.*, COUNT(a.id) AS jumlah_aset FROM kategori_aset k LEFT JOIN aset a ON a.kategori_aset_id = k.id GROUP BY k.id ORDER BY k.nama_kategori ASC");
$cats = $stmt->fetchAll();
foreach ($cats as &$c) { $c['id'] = (int)$c['id']; $c['jumlah_aset'] = (int)$c['jumlah_aset']; }
success($cats);
