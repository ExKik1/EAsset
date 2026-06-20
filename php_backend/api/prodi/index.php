<?php
$payload = requireAuth();
$db = getDB();
$stmt = $db->query("SELECT ps.*, f.nama AS fakultas_nama FROM program_studi ps JOIN fakultas f ON f.id=ps.fakultas_id ORDER BY ps.nama ASC");
$data = $stmt->fetchAll();
foreach ($data as &$d) $d['id'] = (int)$d['id'];
success($data);
