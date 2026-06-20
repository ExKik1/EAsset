<?php
$payload = requireAuth();
$body = getBody();
$kodeQr        = trim($body['kode_qr']          ?? '');
$kodeBarang    = trim($body['kode_barang']       ?? '');
$kodePeminjaman= trim($body['kode_peminjaman']   ?? '');
$qty           = (int)($body['qty']              ?? 1);
$jaminan       = trim($body['jaminan']           ?? '');
$deskripsi     = trim($body['deskripsi_pinjam']  ?? '');

if (!$kodeQr || !$kodeBarang || !$kodePeminjaman || $qty < 1 || !$jaminan) {
    error('Semua field wajib diisi: kode_qr, kode_barang, kode_peminjaman, qty, jaminan.', 422);
}

$db = getDB();

// Cek duplikat kode peminjaman
$dupChk = $db->prepare("SELECT id FROM peminjaman WHERE kode_peminjaman=? LIMIT 1");
$dupChk->execute([$kodePeminjaman]);
if ($dupChk->fetch()) error('Kode peminjaman sudah digunakan.', 409);

// Ambil aset dengan lock (transaksi untuk keamanan stok)
$db->beginTransaction();
try {
    $stmt = $db->prepare("SELECT * FROM aset WHERE kode_qr=? AND kode_barang=? LIMIT 1 FOR UPDATE");
    $stmt->execute([$kodeQr, $kodeBarang]);
    $aset = $stmt->fetch();

    if (!$aset) { $db->rollBack(); error('Kombinasi QR dan kode barang tidak cocok.', 404); }
    if ($aset['status'] === 'rusak') { $db->rollBack(); error('Aset berstatus rusak, tidak bisa dipinjam.', 400); }
    if ((int)$aset['stok'] < $qty) { $db->rollBack(); error("Stok tidak cukup. Tersedia: {$aset['stok']} unit.", 400); }

    $stokBaru  = (int)$aset['stok'] - $qty;
    $statusBaru = ($stokBaru === 0) ? 'dipinjam' : 'tersedia';

    $db->prepare("UPDATE aset SET stok=?, status=?, updated_at=NOW() WHERE id=?")->execute([$stokBaru, $statusBaru, $aset['id']]);

    $db->prepare("INSERT INTO peminjaman (user_id, aset_id, qty, kode_peminjaman, jaminan, waktu_pinjam, deskripsi_pinjam) VALUES (?,?,?,?,?,NOW(),?)")
       ->execute([$payload['sub'], $aset['id'], $qty, $kodePeminjaman, $jaminan, $deskripsi ?: null]);
    $pId = (int)$db->lastInsertId();

    $db->prepare("INSERT INTO log_audit (user_id, aksi, deskripsi, alamat_ip) VALUES (?,?,?,?)")
       ->execute([$payload['sub'], 'CHECKOUT_ASET', "Checkout {$qty}x {$aset['nama_barang']} (TRX: $kodePeminjaman)", $_SERVER['REMOTE_ADDR'] ?? '']);

    $db->commit();
    success(['id' => $pId, 'kode_peminjaman' => $kodePeminjaman, 'nama_barang' => $aset['nama_barang'], 'qty' => $qty], 'Peminjaman berhasil diproses.', 201);
} catch (Throwable $e) {
    $db->rollBack();
    error('Terjadi kesalahan sistem: ' . $e->getMessage(), 500);
}
