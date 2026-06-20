<?php
$payload = requireAuth();
requireRole($payload, ['admin']);
$id   = (int)($_GET['id'] ?? 0);
$body = getBody();
$nama = trim($body['nama'] ?? '');
$fid  = (int)($body['fakultas_id'] ?? 0);
if (!$id || !$nama) error('ID dan nama wajib ada.', 422);
$db = getDB();
$params = [$nama];
$sql = "UPDATE program_studi SET nama=?";
if ($fid) { $sql .= ", fakultas_id=?"; $params[] = $fid; }
$sql .= ", updated_at=NOW() WHERE id=?"; $params[] = $id;
$db->prepare($sql)->execute($params);
$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")->execute([$payload['sub'], 'UPDATE_PRODI', "Prodi ID $id diperbarui: $nama", $_SERVER['REMOTE_ADDR'] ?? '']);
success(null, 'Prodi berhasil diperbarui.');
