<?php
$payload = requireAuth();
requireRole($payload, ['admin']);
$id = (int)($_GET['id'] ?? 0);
$body = getBody();
$nama = trim($body['nama'] ?? '');
if (!$id || !$nama) error('ID dan nama wajib ada.', 422);
$db = getDB();
$db->prepare("UPDATE fakultas SET nama=?, updated_at=NOW() WHERE id=?")->execute([$nama, $id]);
$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")->execute([$payload['sub'], 'UPDATE_FAKULTAS', "Fakultas ID $id diperbarui: $nama", $_SERVER['REMOTE_ADDR'] ?? '']);
success(null, 'Fakultas berhasil diperbarui.');
