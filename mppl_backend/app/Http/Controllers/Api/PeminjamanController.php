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
    public function checkout(Request $request)
    {
        $request->validate([
            'kode_qr' => 'required|string',
            'qty' => 'required|integer|min:1',
            'deskripsi_pinjam' => 'nullable|string',
            'jaminan' => 'required|string'
        ], [
            'kode_qr.required' => 'Scan QR Code barang terlebih dahulu.',
            'qty.required' => 'Jumlah (qty) barang yang akan dipinjam wajib diisi.',
            'qty.min' => 'Jumlah peminjaman minimal 1 barang.',
            'jaminan.required' => 'Foto jaminan identitas (KTM/KTP) wajib diunggah.'
        ]);

        return DB::transaction(function () use ($request) {
            $aset = Aset::where('kode_qr', $request->kode_qr)->lockForUpdate()->first();

            if (!$aset) {
                return response()->json(['status' => 'error', 'message' => 'Barang/Aset tidak terdaftar di sistem.'], 404);
            }

            if ($aset->status === 'rusak') {
                return response()->json(['status' => 'error', 'message' => 'Maaf, barang ini sedang berstatus rusak dan tidak bisa dipinjam.'], 400);
            }

            if ($aset->stok < $request->qty) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Stok tidak mencukupi. Sisa stok tersedia saat ini: {$aset->stok} item."
                ], 400);
            }

            $stokBaru = $aset->stok - $request->qty;
            $statusBaru = ($stokBaru == 0) ? 'dipinjam' : 'tersedia';

            $aset->update([
                'stok' => $stokBaru,
                'status' => $statusBaru
            ]);

            $peminjaman = Peminjaman::create([
                'user_id' => $request->user()->id,
                'aset_id' => $aset->id,
                'qty' => $request->qty,
                'waktu_pinjam' => now(),
                'deskripsi_pinjam' => $request->deskripsi_pinjam,
                'jaminan' => $request->jaminan
            ]);

            LogAudit::create([
                'user_id' => $request->user()->id,
                'aksi' => 'CHECKOUT_ASET',
                'deskripsi' => "Meminjam {$request->qty} item dari {$aset->nama_barang} (QR: {$request->kode_qr})",
                'alamat_ip' => $request->ip()
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Proses peminjaman (Check-out) berhasil dicatat.',
                'data' => $peminjaman
            ], 201);
        });
    }

    public function checkin(Request $request)
    {
        $request->validate([
            'peminjaman_id' => 'required|exists:peminjaman,id',
            'kondisi_kembali' => 'required|in:bagus,rusak',
            'foto_baru' => 'required_if:kondisi_kembali,rusak|string|nullable',
            'deskripsi_rusak' => 'required_if:kondisi_kembali,rusak|string|nullable'
        ], [
            'peminjaman_id.required' => 'ID transaksi peminjaman wajib dilampirkan.',
            'peminjaman_id.exists' => 'Data peminjaman tidak valid.',
            'kondisi_kembali.required' => 'Status kondisi barang saat kembali wajib diisi.',
            'kondisi_kembali.in' => 'Pilihan kondisi harus bagus atau rusak.',
            'foto_baru.required_if' => 'Bukti foto barang rusak wajib dilampirkan jika kondisi rusak.',
            'deskripsi_rusak.required_if' => 'Deskripsi/kronologi kerusakan wajib diisi jika kondisi rusak.'
        ]);

        return DB::transaction(function () use ($request) {
            $peminjaman = Peminjaman::where('id', $request->peminjaman_id)
                ->whereNull('waktu_kembali')
                ->first();

            if (!$peminjaman) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Catatan transaksi aktif tidak ditemukan atau barang sudah dikembalikan sebelumnya.'
                ], 404);
            }

            $aset = Aset::where('id', $peminjaman->aset_id)->lockForUpdate()->first();
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
                'diproses_oleh' => $request->user()->id
            ]);

            LogAudit::create([
                'user_id' => $request->user()->id,
                'aksi' => 'CHECKIN_ASET',
                'deskripsi' => "Verifikasi pengembalian aset ID: {$aset->id}. Kondisi: {$request->kondisi_kembali}.",
                'alamat_ip' => $request->ip()
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Proses pengembalian (Check-in) sukses diproses dan stok barang telah dipulihkan.'
            ], 200);
        });
    }

    public function getHistory()
    {
        $history = Peminjaman::with(['user:id,name,nim_nip', 'aset:id,nama_barang,kode_qr'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $history], 200);
    }
}