<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aset;
use App\Models\LogAudit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AsetController extends Controller
{
    public function index()
    {
        $aset = Aset::with('kategoriAset')->get();
        return response()->json([
            'status' => 'success',
            'data' => $aset
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_qr' => 'required|string|unique:aset,kode_qr',
            'nama_barang' => 'required|string',
            'kode_barang' => 'required|string|unique:aset,kode_barang',
            'kategori_aset_id' => 'required|exists:kategori_aset,id',
            'foto_barang' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'stok' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string'
        ], [
            'kode_qr.required' => 'Kode QR wajib diisi.',
            'kode_qr.unique' => 'Kode QR sudah terdaftar pada sistem.',
            'nama_barang.required' => 'Nama barang wajib diisi.',
            'kode_barang.required' => 'Kode Barang wajib diisi.',
            'kode_barang.unique' => 'Kode Barang sudah terdaftar pada sistem.',
            'kategori_aset_id.required' => 'Kategori aset wajib dipilih.',
            'kategori_aset_id.exists' => 'Kategori aset tidak valid.',
            'foto_barang.image' => 'File yang diunggah harus berupa gambar.',
            'foto_barang.max' => 'Ukuran gambar maksimal adalah 2MB.',
            'stok.required' => 'Jumlah stok awal wajib ditentukan.',
            'stok.integer' => 'Stok harus berupa angka.',
            'stok.min' => 'Stok tidak boleh kurang dari 0.'
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto_barang')) {
            $fotoPath = $request->file('foto_barang')->store('assets', 'public');
        }

        $aset = Aset::create([
            'kode_qr' => $request->kode_qr,
            'nama_barang' => $request->nama_barang,
            'kode_barang' => $request->kode_barang,
            'kategori_aset_id' => $request->kategori_aset_id,
            'foto_barang' => $fotoPath,
            'stok' => $request->stok,
            'status' => 'tersedia',
            'deskripsi' => $request->deskripsi,
        ]);

        LogAudit::create([
            'user_id' => $request->user() ? $request->user()->id : null,
            'aksi' => 'CREATE_ASET',
            'deskripsi' => "Menambahkan aset baru: {$aset->nama_barang} dengan stok {$aset->stok}.",
            'alamat_ip' => $request->ip()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data barang/aset baru berhasil disimpan.',
            'data' => $aset->load('kategoriAset')
        ], 201);
    }

    public function show($kode_qr)
    {
        $aset = Aset::with('kategoriAset')->where('kode_qr', $kode_qr)->first();

        if (!$aset) {
            return response()->json([
                'status' => 'error',
                'message' => 'Aset dengan Kode QR tersebut tidak ditemukan di sistem E-Asset.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $aset
        ], 200);
    }

    public function update(Request $request, $kode_qr)
    {
        $aset = Aset::where('kode_qr', $kode_qr)->first();
        if (!$aset) {
            return response()->json(['status' => 'error', 'message' => 'Aset tidak ditemukan.'], 404);
        }

        $request->validate([
            'kode_qr' => 'required|string|unique:aset,kode_qr,' . $aset->id,
            'nama_barang' => 'required|string',
            'kode_barang' => 'required|string|unique:aset,kode_barang,' . $aset->id,
            'kategori_aset_id' => 'required|exists:kategori_aset,id',
            'foto_barang' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'stok' => 'required|integer|min:0',
            'status' => 'required|in:tersedia,dipinjam,rusak',
            'deskripsi' => 'nullable|string'
        ], [
            'nama_barang.required' => 'Nama barang wajib diisi.',
            'kode_barang.required' => 'Kode Barang wajib diisi.',
            'kode_barang.unique' => 'Kode Barang sudah terdaftar pada sistem.',
            'kategori_aset_id.exists' => 'Kategori tidak valid.',
            'stok.min' => 'Stok tidak boleh kurang dari 0.',
            'status.in' => 'Status barang tidak valid.',
            'foto_barang.image' => 'File yang diunggah harus berupa gambar.',
            'foto_barang.max' => 'Ukuran gambar maksimal adalah 2MB.'
        ]);

        $aset->kode_qr = $request->kode_qr;
        $aset->nama_barang = $request->nama_barang;
        $aset->kode_barang = $request->kode_barang;
        $aset->kategori_aset_id = $request->kategori_aset_id;
        $aset->stok = $request->stok;
        $aset->status = $request->status;
        $aset->deskripsi = $request->deskripsi;

        if ($request->hasFile('foto_barang')) {
            if ($aset->foto_barang && Storage::disk('public')->exists($aset->foto_barang)) {
                Storage::disk('public')->delete($aset->foto_barang);
            }
            $aset->foto_barang = $request->file('foto_barang')->store('assets', 'public');
        }

        $aset->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Data aset berhasil diperbarui.',
            'data' => $aset->load('kategoriAset')
        ], 200);
    }

    public function destroy(Request $request, $kode_qr)
    {
        $aset = Aset::where('kode_qr', $kode_qr)->first();
        if (!$aset) {
            return response()->json(['status' => 'error', 'message' => 'Aset tidak ditemukan.'], 404);
        }

        if ($aset->foto_barang && Storage::disk('public')->exists($aset->foto_barang)) {
            Storage::disk('public')->delete($aset->foto_barang);
        }

        $aset->delete();

        LogAudit::create([
            'user_id' => $request->user() ? $request->user()->id : null,
            'aksi' => 'DELETE_ASET',
            'deskripsi' => "Menghapus aset dengan Kode QR: {$kode_qr}",
            'alamat_ip' => $request->ip()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Aset berhasil dihapus dari sistem.'
        ], 200);
    }
}
