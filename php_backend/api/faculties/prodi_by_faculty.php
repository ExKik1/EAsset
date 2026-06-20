<?php
$payload = requireAuth();
$id = (int)($_GET['id'] ?? 0);
if (!$id) error('ID fakultas tidak valid.', 422);
$db   = getDB();
$stmt = $db->prepare("SELECT id, fakultas_id, nama AS nama_prodi, kode AS kode_prodi FROM program_studi WHERE fakultas_id=? ORDER BY nama ASC");
$stmt->execute([$id]);
$data = $stmt->fetchAll();
foreach ($data as &$d) $d['id'] = (int)$d['id'];
success($data);
