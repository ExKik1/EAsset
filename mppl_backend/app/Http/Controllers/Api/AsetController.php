<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Aset;
use App\Models\LogAudit;
use Illuminate\Http\Request;

class AsetController extends Controller
{
    public function index()
    {
        $aset = Aset::with('kategoriAset')->get();
        return response()->json(['status' => 'success', 'data' => $aset], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_qr' => 'required|string|unique:aset,kode_qr',
            'nama_barang' => 'required|string',
            'kode_barang' => 'required|string|unique:aset,kode_barang',
            'kategori_aset_id' => 'required|exists:kategori_aset,id',
            'foto_barang' => 'nullable|string',
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
            'stok.required' => 'Jumlah stok awal wajib ditentukan.',
            'stok.integer' => 'Stok harus berupa angka.',
            'stok.min' => 'Stok tidak boleh kurang dari 0.'
        ]);

        $aset = Aset::create($request->all());

        LogAudit::create([
            'user_id' => $request->user()->id,
            'aksi' => 'CREATE_ASET',
            'deskripsi' => "Menambahkan aset baru: {$aset->nama_barang} dengan stok {$aset->stok}.",
            'alamat_ip' => $request->ip()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data barang/aset baru berhasil disimpan.',
            'data' => $aset
        ], 201);
    }

    public function showByQr($kode_qr)
    {
        $aset = Aset::where('kode_qr', $kode_qr)->with('kategoriAset')->first();

        if (!$aset) {
            return response()->json([
                'status' => 'error',
                'message' => 'Aset dengan Kode QR tersebut tidak ditemukan di sistem E-Asset.'
            ], 404);
        }

        return response()->json(['status' => 'success', 'data' => $aset], 200);
    }

    public function update(Request $request, $id)
    {
        $aset = Aset::find($id);
        if (!$aset) {
            return response()->json(['status' => 'error', 'message' => 'Aset tidak ditemukan.'], 404);
        }

        $request->validate([
            'nama_barang' => 'required|string',
            'kode_barang' => 'required|string|unique:aset,kode_barang,' . $id,
            'kategori_aset_id' => 'required|exists:kategori_aset,id',
            'stok' => 'required|integer|min:0',
            'status' => 'required|in:tersedia,dipinjam,rusak',
            'deskripsi' => 'nullable|string'
        ], [
            'nama_barang.required' => 'Nama barang wajib diisi.',
            'kode_barang.required' => 'Kode Barang wajib diisi.',
            'kode_barang.unique' => 'Kode Barang sudah terdaftar pada sistem.',
            'kategori_aset_id.exists' => 'Kategori tidak valid.',
            'stok.min' => 'Stok tidak boleh kurang dari 0.',
            'status.in' => 'Status barang tidak valid.'
        ]);

        $aset->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Data aset berhasil diperbarui.',
            'data' => $aset
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $aset = Aset::find($id);
        if (!$aset) {
            return response()->json(['status' => 'error', 'message' => 'Aset tidak ditemukan.'], 404);
        }

        $aset->delete();

        LogAudit::create([
            'user_id' => $request->user()->id,
            'aksi' => 'DELETE_ASET',
            'deskripsi' => "Menghapus aset ID: {$id}",
            'alamat_ip' => $request->ip()
        ]);

        return response()->json(['status' => 'success', 'message' => 'Aset berhasil dihapus dari sistem.'], 200);
    }
}
