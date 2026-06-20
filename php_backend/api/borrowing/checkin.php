<?php
$payload = requireAuth();
requireRole($payload, ['admin', 'kerumahtanggaan']);
$body          = getBody();
$peminjamanId  = (int)($body['peminjaman_id']    ?? 0);
$kondisi       = trim($body['kondisi_kembali']   ?? '');
$fotoBaru      = trim($body['foto_baru']         ?? '');
$deskripsiRusak= trim($body['deskripsi_rusak']   ?? '');

if (!$peminjamanId || !$kondisi) error('peminjaman_id dan kondisi_kembali wajib diisi.', 422);
if (!in_array($kondisi, ['bagus','rusak'])) error('Kondisi harus: bagus atau rusak.', 422);
if ($kondisi === 'rusak' && !$fotoBaru) error('Foto kondisi rusak wajib dilampirkan.', 422);

$db = getDB();
$db->beginTransaction();
try {
    $stmt = $db->prepare("SELECT p.*, a.nama_barang FROM peminjaman p JOIN aset a ON a.id = p.aset_id WHERE p.id=? AND p.waktu_kembali IS NULL LIMIT 1 FOR UPDATE");
    $stmt->execute([$peminjamanId]);
    $pinjam = $stmt->fetch();

    if (!$pinjam) { $db->rollBack(); error('Peminjaman tidak ditemukan atau sudah dikembalikan.', 404); }

    $asetStmt = $db->prepare("SELECT * FROM aset WHERE id=? LIMIT 1 FOR UPDATE");
    $asetStmt->execute([$pinjam['aset_id']]);
    $aset = $asetStmt->fetch();

    $stokBaru  = (int)$aset['stok'] + (int)$pinjam['qty'];
    $statusBaru = ($kondisi === 'rusak') ? 'rusak' : 'tersedia';

    $db->prepare("UPDATE aset SET stok=?, status=?, updated_at=NOW() WHERE id=?")->execute([$stokBaru, $statusBaru, $aset['id']]);

    $db->prepare("UPDATE peminjaman SET waktu_kembali=NOW(), kondisi_kembali=?, foto_baru=?, deskripsi_rusak=?, diproses_oleh=?, updated_at=NOW() WHERE id=?")
       ->execute([$kondisi, $kondisi === 'rusak' ? $fotoBaru : null, $kondisi === 'rusak' ? $deskripsiRusak : null, $payload['sub'], $peminjamanId]);

    $db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
       ->execute([$payload['sub'], 'CHECKIN_ASET', "Checkin: {$pinjam['nama_barang']} — kondisi: $kondisi (TRX: {$pinjam['kode_peminjaman']})", $_SERVER['REMOTE_ADDR'] ?? '']);

    $db->commit();
    success(null, 'Checkin pengembalian berhasil diproses.');
} catch (Throwable $e) {
    $db->rollBack();
    error('Terjadi kesalahan sistem: ' . $e->getMessage(), 500);
}
