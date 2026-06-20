<?php
$payload = requireAuth();

// UserProfile.tsx kirim sebagai multipart/form-data dengan _method=PUT
$isMultipart = str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'multipart');
if ($isMultipart) {
    $name       = trim($_POST['name']              ?? '');
    $nimNip     = trim($_POST['nim_nip']           ?? '');
    $alamat     = trim($_POST['alamat']            ?? '');
    $prodiId    = isset($_POST['program_studi_id']) && $_POST['program_studi_id'] !== '' ? (int)$_POST['program_studi_id'] : null;
    $fakultasId = isset($_POST['fakultas_id'])      && $_POST['fakultas_id'] !== ''      ? (int)$_POST['fakultas_id']      : null;
    $password   = trim($_POST['password']          ?? '');
    $passConfirm= trim($_POST['password_confirmation'] ?? '');
} else {
    $body       = getBody();
    $name       = trim($body['name']              ?? '');
    $nimNip     = trim($body['nim_nip']           ?? '');
    $alamat     = trim($body['alamat']            ?? '');
    $prodiId    = isset($body['program_studi_id']) && $body['program_studi_id'] !== '' ? (int)$body['program_studi_id'] : null;
    $fakultasId = isset($body['fakultas_id'])      && $body['fakultas_id'] !== ''      ? (int)$body['fakultas_id']      : null;
    $password   = trim($body['password']          ?? '');
    $passConfirm= trim($body['password_confirmation'] ?? '');
}

if (!$name) error('Nama tidak boleh kosong.', 422);

$db = getDB();

// Handle foto profil upload
$profilePath = null;
if ($isMultipart && !empty($_FILES['profile']['tmp_name'])) {
    $uploadDir = __DIR__ . '/../../../uploads/profiles/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
    $ext      = pathinfo($_FILES['profile']['name'], PATHINFO_EXTENSION);
    $filename = 'profile_' . $payload['sub'] . '_' . time() . '.' . $ext;
    move_uploaded_file($_FILES['profile']['tmp_name'], $uploadDir . $filename);
    $profilePath = 'uploads/profiles/' . $filename;
    $db->prepare("UPDATE users SET profile=? WHERE id=?")->execute([$profilePath, $payload['sub']]);
}

$db->prepare("UPDATE users SET name=?, nim_nip=?, alamat=?, fakultas_id=?, program_studi_id=?, updated_at=NOW() WHERE id=?")
   ->execute([$name, $nimNip ?: null, $alamat ?: null, $fakultasId, $prodiId, $payload['sub']]);

// Update password jika diisi
if ($password && $password === $passConfirm && strlen($password) >= 8) {
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $db->prepare("UPDATE users SET password=? WHERE id=?")->execute([$hash, $payload['sub']]);
}

$db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
   ->execute([$payload['sub'], 'UPDATE_PROFILE', "User {$payload['name']} memperbarui profil.", $_SERVER['REMOTE_ADDR'] ?? '']);

// Return updated user
$stmt = $db->prepare("SELECT id, nim_nip, name, email, role, alamat, profile, fakultas_id, program_studi_id FROM users WHERE id=? LIMIT 1");
$stmt->execute([$payload['sub']]);
$user = $stmt->fetch();
$user['id'] = (int)$user['id'];

success($user, 'Profil berhasil diperbarui.');
