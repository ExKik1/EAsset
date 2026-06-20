<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aset;
use App\Models\LogAudit;
use Illuminate\Http\Request;

/**
 * ScanQrController
 * Menangani pemindaian QR Code untuk mendapatkan informasi aset secara real-time.
 * Digunakan oleh fitur kamera QR scanner di frontend.
 */
class ScanQrController extends Controller
{
    /**
     * Scan QR Code — mencari aset berdasarkan kode_qr yang didapat dari kamera.
     * GET /api/scan-qr/{kode_qr}
     *
     * Accessible by: semua user yang sudah login (admin, kerumahtanggaan, umum)
     */
    public function scan(Request $request, string $kode_qr)
    {
        // Bersihkan kode dari spasi atau karakter tidak perlu
        $kode_qr = trim($kode_qr);

        $aset = Aset::with('kategoriAset')
            ->where('kode_qr', $kode_qr)
            ->first();

        if (!$aset) {
            return response()->json([
                'status'  => 'not_found',
                'message' => "Tidak ada barang dengan kode QR \"{$kode_qr}\" yang terdaftar dalam sistem E-Asset.",
                'kode_qr' => $kode_qr,
            ], 404);
        }

        // Catat log pemindaian QR
        LogAudit::create([
            'user_id'   => $request->user()?->id,
            'aksi'      => 'SCAN_QR',
            'deskripsi' => "Pemindaian QR Code untuk aset: {$aset->nama_barang} (Kode: {$kode_qr})",
            'alamat_ip' => $request->ip(),
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Aset ditemukan.',
            'data'    => [
                'id'             => $aset->id,
                'kode_qr'        => $aset->kode_qr,
                'kode_barang'    => $aset->kode_barang,
                'nama_barang'    => $aset->nama_barang,
                'kategori'       => $aset->kategoriAset?->nama_kategori ?? '-',
                'kode_kategori'  => $aset->kategoriAset?->kode_kategori ?? '-',
                'foto_barang'    => $aset->foto_barang
                    ? asset('storage/' . $aset->foto_barang)
                    : null,
                'stok'           => $aset->stok,
                'status'         => $aset->status,
                'status_label'   => match ($aset->status) {
                    'tersedia' => 'Tersedia',
                    'dipinjam' => 'Sedang Dipinjam',
                    'rusak'    => 'Rusak / Tidak Layak',
                    default    => $aset->status,
                },
                'deskripsi'      => $aset->deskripsi,
                'created_at'     => $aset->created_at?->format('d/m/Y H:i'),
                'updated_at'     => $aset->updated_at?->format('d/m/Y H:i'),
            ],
        ], 200);
    }

    /**
     * Validasi batch QR — memeriksa apakah kode_qr valid tanpa mencatat log.
     * POST /api/scan-qr/validate
     *
     * Body: { "kode_qr": "QR-ELEK-0001" }
     */
    public function validate(Request $request)
    {
        $request->validate([
            'kode_qr' => 'required|string|max:100',
        ]);

        $aset = Aset::where('kode_qr', trim($request->kode_qr))->exists();

        return response()->json([
            'status' => $aset ? 'valid' : 'invalid',
            'exists' => $aset,
        ], 200);
    }
}
