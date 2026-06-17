<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aset;
use App\Models\Peminjaman;
use App\Models\LogAudit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PeminjamanController extends Controller
{
    /**
     * ENDPOINT BARU: Validasi QR Code sebelum Form Terbuka (Digunakan Frontend)
     * URL: GET /api/assets-main/{kode_qr}
     */
    public function validateQrCode(Request $request, $kode_qr)
    {
        $aset = Aset::where('kode_qr', $kode_qr)->first();

        if (!$aset) {
            return response()->json([
                'status' => 'error',
                'message' => 'QR Code tidak terdaftar dalam sistem inventaris E-Asset.'
            ], 404);
        }

        // Validasi Kondisi Kelayakan Aset Fisik
        if ($aset->status === 'rusak') {
            return response()->json([
                'status' => 'error',
                'message' => "Aset '{$aset->nama_barang}' saat ini berstatus rusak/dalam perbaikan."
            ], 400);
        }

        // Validasi Ketersediaan Volume Stok
        if ($aset->stok <= 0 || $aset->status === 'dipinjam') {
            return response()->json([
                'status' => 'error',
                'message' => "Stok aset '{$aset->nama_barang}' sedang kosong atau sedang dipinjam penuh."
            ], 400);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Aset terverifikasi.',
            'data' => $aset
        ], 200);
    }

    /**
     * PROSES CHECKOUT PEMINJAMAN ASET
     * URL: POST /api/borrowing-main/checkout
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'kode_qr' => 'required|string',
            'kode_barang' => 'required|string',
            'kode_peminjaman' => 'required|string|unique:peminjaman,kode_peminjaman',
            'qty' => 'required|integer|min:1',
            'deskripsi_pinjam' => 'nullable|string',
            'jaminan' => 'required|string'
        ], [
            'kode_qr.required' => 'Scan QR Code barang terlebih dahulu.',
            'kode_barang.required' => 'Kode registrasi barang wajib disertakan.',
            'kode_peminjaman.required' => 'Token transaksi wajib di-generate oleh sistem.',
            'kode_peminjaman.unique' => 'Token transaksi duplikat, silakan ulangi proses ajuan.',
            'qty.required' => 'Jumlah barang wajib ditentukan.',
            'qty.min' => 'Minimal peminjaman adalah 1 unit barang.',
            'jaminan.required' => 'Atribut jaminan identitas fisik wajib diisi.'
        ]);

        return DB::transaction(function () use ($request) {
            // Mengunci baris data (Pessimistic Locking) untuk menghindari Race Condition stok minus
            $aset = Aset::where('kode_qr', $request->kode_qr)
                ->where('kode_barang', $request->kode_barang)
                ->lockForUpdate()
                ->first();

            if (!$aset) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Data kombinasi QR Code dan Kode Registrasi Barang tidak cocok.'
                ], 404);
            }

            if ($aset->status === 'rusak') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Gagal! Barang ini berstatus rusak dan dilarang untuk sirkulasi.'
                ], 400);
            }

            if ($aset->stok < $request->qty) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Stok tidak mencukupi. Sisa stok aktual saat ini: {$aset->stok} unit."
                ], 400);
            }

            // Hitung kalkulasi pemulihan nilai stok baru
            $stokBaru = $aset->stok - $request->qty;
            $statusBaru = ($stokBaru == 0) ? 'dipinjam' : 'tersedia';

            $aset->update([
                'stok' => $stokBaru,
                'status' => $statusBaru
            ]);

            // Catat rekam data transaksi utama peminjaman
            $peminjaman = Peminjaman::create([
                'user_id' => $request->user()->id, // Otomatis mengikat ID aktor yang sedang login (Sanctum)
                'aset_id' => $aset->id,
                'qty' => $request->qty,
                'waktu_pinjam' => now(),
                'deskripsi_pinjam' => $request->deskripsi_pinjam,
                'jaminan' => $request->jaminan,
                'kode_peminjaman' => $request->kode_peminjaman
            ]);

            // Logging Audit Trail Keamanan Sistem
            LogAudit::create([
                'user_id' => $request->user()->id,
                'aksi' => 'CHECKOUT_ASET',
                'deskripsi' => "User {$request->user()->name} meminjam {$request->qty} item dari aset {$aset->nama_barang} (Token TRX: {$request->kode_peminjaman})",
                'alamat_ip' => $request->ip()
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Proses pengajuan peminjaman (Check-out) berhasil diverifikasi sistem.',
                'data' => $peminjaman
            ], 201);
        });
    }

    /**
     * PROSES CHECKIN PENGEMBALIAN ASET
     * URL: POST /api/borrowing-main/checkin
     */
    public function checkin(Request $request)
    {
        $request->validate([
            'peminjaman_id' => 'required|exists:peminjaman,id',
            'kondisi_kembali' => 'required|in:bagus,rusak',
            'foto_baru' => 'required_if:kondisi_kembali,rusak|string|nullable',
            'deskripsi_rusak' => 'required_if:kondisi_kembali,rusak|string|nullable'
        ], [
            'peminjaman_id.required' => 'ID data induk transaksi peminjaman wajib dilampirkan.',
            'peminjaman_id.exists' => 'Referensi log transaksi tidak terdaftar.',
            'kondisi_kembali.required' => 'Status fisik akhir barang wajib diisi.',
            'foto_baru.required_if' => 'Bukti konkrit dokumentasi foto kerusakan wajib dilampirkan.',
            'deskripsi_rusak.required_if' => 'Deskripsi kronologi kerusakan wajib ditulis.'
        ]);

        return DB::transaction(function () use ($request) {
            $peminjaman = Peminjaman::where('id', $request->peminjaman_id)
                ->whereNull('waktu_kembali')
                ->first();

            if (!$peminjaman) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Transaksi tidak aktif atau barang sudah dicheck-in sebelumnya.'
                ], 404);
            }

            $aset = Aset::where('id', $peminjaman->aset_id)->lockForUpdate()->first();

            // Mengembalikan volume jumlah kuantitas stok barang ke semula
            $stokSemula = $aset->stok + $peminjaman->qty;
            $statusBaru = ($request->kondisi_kembali === 'rusak') ? 'rusak' : 'tersedia';

            $aset->update([
                'stok' => $stokSemula,
                'status' => $statusBaru
            ]);

            $peminjaman->update([
                'waktu_kembali' => now(),
                'kondisi_kembali' => $request->kondisi_kembali,
                'foto_baru' => $request->kondisi_kembali === 'rusak' ? $request->foto_baru : null,
                'deskripsi_rusak' => $request->kondisi_kembali === 'rusak' ? $request->deskripsi_rusak : null,
                'diproses_oleh' => $request->user()->id // Staf yang memproses checkout
            ]);

            LogAudit::create([
                'user_id' => $request->user()->id,
                'aksi' => 'CHECKIN_ASET',
                'deskripsi' => "Verifikasi pengembalian aset oleh staf. Kondisi akhir: {$request->kondisi_kembali} pada token TRX: {$peminjaman->kode_peminjaman}.",
                'alamat_ip' => $request->ip()
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Proses pengembalian (Check-in) sukses diproses dan stok barang telah dipulihkan.'
            ], 200);
        });
    }

    /**
     * GET HISTORY LOG PEMINJAMAN (SMART SCOPE BERDASARKAN ROLE PENGGUNA)
     * URL: GET /api/borrowing-main/history
     */
    public function getHistory(Request $request)
    {
        $user = $request->user();

        // Inisialisasi Eager Loading Query
        $query = Peminjaman::with(['user:id,name,nim_nip', 'aset:id,nama_barang,kode_qr'])
            ->orderBy('created_at', 'desc');

        // PROTEKSI DATA PRIVASI: Jika role-nya adalah umum, BATASI data hanya miliknya sendiri
        if ($user->role === 'umum') {
            $query->where('user_id', $user->id);
        }

        // Jika admin atau kerumahtanggaan, barulah lolos mengambil semua data log transaksi kampus
        $history = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $history
        ], 200);
    }
}
