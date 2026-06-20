<?php
// Public assets endpoint — untuk user umum melihat katalog
$payload = requireAuth();
$db = getDB();

$search   = trim($_GET['search']   ?? '');
$kategori = trim($_GET['kategori'] ?? '');

$sql    = "SELECT a.id, a.kode_qr, a.kode_barang, a.nama_barang, a.foto_barang, a.stok, a.status, a.deskripsi, k.nama_kategori, k.kode_kategori FROM aset a JOIN kategori_aset k ON k.id = a.kategori_aset_id WHERE a.status != 'rusak'";
$params = [];

if ($search) {
    $sql .= " AND (a.nama_barang LIKE ? OR a.kode_qr LIKE ?)";
    $params[] = "%$search%"; $params[] = "%$search%";
}
if ($kategori) { $sql .= " AND a.kategori_aset_id = ?"; $params[] = $kategori; }

$sql .= " ORDER BY a.nama_barang ASC";
$stmt = $db->prepare($sql);
$stmt->execute($params);
$asets = $stmt->fetchAll();
foreach ($asets as &$a) $a['id'] = (int)$a['id'];
success($asets);
