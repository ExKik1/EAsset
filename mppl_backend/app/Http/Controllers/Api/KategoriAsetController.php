<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KategoriAset;
use Illuminate\Http\Request;

class KategoriAsetController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => KategoriAset::all()->sortByDesc('id')->values()
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required|string',
            'kode_kategori' => 'required|string|unique:kategori_aset,kode_kategori',
            'deskripsi' => 'nullable|string'
        ], [
            'nama_kategori.required' => 'Nama kategori wajib diisi.',
            'kode_kategori.required' => 'Kode kategori wajib diisi.',
            'kode_kategori.unique' => 'Kode kategori tersebut sudah ada.'
        ]);

        $kategori = KategoriAset::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori aset berhasil ditambahkan.',
            'data' => $kategori
        ], 201);
    }

    public function show($id)
    {
        $kategori = KategoriAset::find($id);
        if (!$kategori) {
            return response()->json(['status' => 'error', 'message' => 'Kategori tidak ditemukan.'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $kategori], 200);
    }

    public function update(Request $request, $id)
    {
        $kategori = KategoriAset::find($id);
        if (!$kategori) {
            return response()->json(['status' => 'error', 'message' => 'Kategori tidak ditemukan.'], 404);
        }

        $request->validate([
            'nama_kategori' => 'required|string',
            'kode_kategori' => 'required|string|unique:kategori_aset,kode_kategori,' . $id,
            'deskripsi' => 'nullable|string'
        ], [
            'nama_kategori.required' => 'Nama kategori wajib diisi.',
            'kode_kategori.required' => 'Kode kategori wajib diisi.',
            'kode_kategori.unique' => 'Kode kategori sudah digunakan.'
        ]);

        $kategori->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori aset berhasil diperbarui.',
            'data' => $kategori
        ], 200);
    }

    public function destroy($id)
    {
        $kategori = KategoriAset::find($id);
        if (!$kategori) {
            return response()->json(['status' => 'error', 'message' => 'Kategori tidak ditemukan.'], 404);
        }
        $kategori->delete();
        return response()->json(['status' => 'success', 'message' => 'Kategori aset berhasil dihapus.'], 200);
    }
}
