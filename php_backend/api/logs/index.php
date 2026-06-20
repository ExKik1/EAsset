<?php
$payload = requireAuth();
requireRole($payload, ['admin', 'kerumahtanggaan']);
$db   = getDB();
$stmt = $db->query("SELECT l.id, l.aksi, l.deskripsi, l.alamat_ip, l.created_at, u.name AS nama_user, u.role FROM log_audit l LEFT JOIN users u ON u.id=l.user_id ORDER BY l.created_at DESC LIMIT 200");
$logs = $stmt->fetchAll();
foreach ($logs as &$l) $l['id'] = (int)$l['id'];
success($logs);
