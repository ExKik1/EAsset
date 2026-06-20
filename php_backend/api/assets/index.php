<?php
$payload = requireAuth();
requireRole($payload, ['admin', 'kerumahtanggaan']);
$db = getDB();

$search   = trim($_GET['search']   ?? '');
$kategori = trim($_GET['kategori'] ?? '');
$status   = trim($_GET['status']   ?? '');

$sql    = "SELECT a.*, k.nama_kategori, k.kode_kategori FROM aset a JOIN kategori_aset k ON k.id = a.kategori_aset_id WHERE 1=1";
$params = [];

if ($search) {
    $sql .= " AND (a.nama_barang LIKE ? OR a.kode_qr LIKE ? OR a.kode_barang LIKE ?)";
    $params[] = "%$search%"; $params[] = "%$search%"; $params[] = "%$search%";
}
if ($kategori) { $sql .= " AND a.kategori_aset_id = ?"; $params[] = $kategori; }
if ($status)   { $sql .= " AND a.status = ?";           $params[] = $status;   }

$sql .= " ORDER BY a.nama_barang ASC";
$stmt = $db->prepare($sql);
$stmt->execute($params);
$raw = $stmt->fetchAll();

// Nested kategori_aset object agar kompatibel dengan frontend AsetTable
$asets = array_map(function($a) {
    $a['id'] = (int)$a['id'];
    $a['kategori_aset'] = ['nama_kategori' => $a['nama_kategori'], 'kode_kategori' => $a['kode_kategori']];
    return $a;
}, $raw);

success($asets);
