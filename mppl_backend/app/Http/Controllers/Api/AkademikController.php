<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fakultas;
use App\Models\ProgramStudi;
use Illuminate\Http\Request;

class AkademikController extends Controller
{
    public function getAllFaculties()
    {
        $fakultas = Fakultas::all()->sortByDesc('id')->values();
        return response()->json([
            'status' => 'success',
            'data' => $fakultas
        ], 200);
    }

    public function storeFaculty(Request $request)
    {
        $request->validate([
            'kode_fakultas' => 'required|string|unique:fakultas,kode_fakultas',
            'nama_fakultas' => 'required|string|max:255',
            'deskripsi' => 'nullable|string'
        ], [
            'kode_fakultas.required' => 'Kode fakultas wajib diisi.',
            'kode_fakultas.unique' => 'Kode fakultas sudah terdaftar di sistem.',
            'nama_fakultas.required' => 'Nama fakultas wajib diisi.',
            'nama_fakultas.max' => 'Nama fakultas maksimal 255 karakter.'
        ]);

        $fakultas = Fakultas::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Fakultas baru berhasil ditambahkan.',
            'data' => $fakultas
        ], 201);
    }

    public function showFaculty($id)
    {
        $fakultas = Fakultas::find($id);
        if (!$fakultas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Fakultas tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $fakultas
        ], 200);
    }

    public function updateFaculty(Request $request, $id)
    {
        $fakultas = Fakultas::find($id);
        if (!$fakultas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Fakultas tidak ditemukan.'
            ], 404);
        }

        $request->validate([
            'kode_fakultas' => 'required|string|unique:fakultas,kode_fakultas,' . $id,
            'nama_fakultas' => 'required|string|max:255',
            'deskripsi' => 'nullable|string'
        ], [
            'kode_fakultas.required' => 'Kode fakultas wajib diisi.',
            'kode_fakultas.unique' => 'Kode fakultas sudah digunakan oleh fakultas lain.',
            'nama_fakultas.required' => 'Nama fakultas wajib diisi.'
        ]);

        $fakultas->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Data fakultas berhasil diperbarui.',
            'data' => $fakultas
        ], 200);
    }

    public function destroyFaculty($id)
    {
        $fakultas = Fakultas::find($id);
        if (!$fakultas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Fakultas tidak ditemukan.'
            ], 404);
        }

        $fakultas->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Fakultas berhasil dihapus dari sistem.'
        ], 200);
    }

    public function getAllProdi()
    {
        $prodi = ProgramStudi::with('fakultas')->orderBy('id', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $prodi
        ], 200);
    }

    public function getProdiByFaculty($faculty_id)
    {
        $prodi = ProgramStudi::where('fakultas_id', $faculty_id)->get();

        if ($prodi->isEmpty()) {
            return response()->json([
                'status' => 'empty',
                'message' => 'Tidak ada program studi yang terhubung dengan fakultas ini.',
                'data' => []
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'data' => $prodi
        ], 200);
    }

    public function storeProdi(Request $request)
    {
        $request->validate([
            'fakultas_id' => 'required|exists:fakultas,id',
            'kode_prodi' => 'required|string|unique:program_studi,kode_prodi',
            'nama_prodi' => 'required|string|max:255',
            'deskripsi' => 'nullable|string'
        ], [
            'fakultas_id.required' => 'Fakultas induk wajib dipilih.',
            'fakultas_id.exists' => 'Fakultas yang dipilih tidak valid atau belum terdaftar.',
            'kode_prodi.required' => 'Kode program studi wajib diisi.',
            'kode_prodi.unique' => 'Kode program studi sudah terdaftar di sistem.',
            'nama_prodi.required' => 'Nama program studi wajib diisi.'
        ]);

        $prodi = ProgramStudi::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Program studi baru berhasil ditambahkan.',
            'data' => $prodi
        ], 201);
    }

    public function showProdi($id)
    {
        $prodi = ProgramStudi::with('fakultas')->find($id);
        if (!$prodi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Program studi tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $prodi
        ], 200);
    }

    public function updateProdi(Request $request, $id)
    {
        $prodi = ProgramStudi::find($id);
        if (!$prodi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Program studi tidak ditemukan.'
            ], 404);
        }

        $request->validate([
            'fakultas_id' => 'required|exists:fakultas,id',
            'kode_prodi' => 'required|string|unique:program_studi,kode_prodi,' . $id,
            'nama_prodi' => 'required|string|max:255',
            'deskripsi' => 'nullable|string'
        ], [
            'fakultas_id.required' => 'Fakultas wajib dipilih.',
            'fakultas_id.exists' => 'Fakultas tidak valid.',
            'kode_prodi.required' => 'Kode prodi wajib diisi.',
            'kode_prodi.unique' => 'Kode prodi sudah digunakan oleh program studi lain.',
            'nama_prodi.required' => 'Nama prodi wajib diisi.'
        ]);

        $prodi->update($request->all());
        return response()->json([
            'status' => 'success',
            'message' => 'Data program studi berhasil diperbarui.',
            'data' => $prodi
        ], 200);
    }

    public function destroyProdi($id)
    {
        $prodi = ProgramStudi::find($id);
        if (!$prodi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Program studi tidak ditemukan.'
            ], 404);
        }

        $prodi->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Program studi berhasil dihapus dari sistem.'
        ], 200);
    }
}