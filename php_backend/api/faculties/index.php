<?php
$payload = requireAuth();
$db = getDB();
$stmt = $db->query("SELECT f.*, COUNT(ps.id) AS jumlah_prodi FROM fakultas f LEFT JOIN program_studi ps ON ps.fakultas_id=f.id GROUP BY f.id ORDER BY f.nama ASC");
$data = $stmt->fetchAll();
foreach ($data as &$d) { $d['id'] = (int)$d['id']; $d['jumlah_prodi'] = (int)$d['jumlah_prodi']; }
success($data);
