<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function getAllProfiles()
    {
        $users = User::with(['fakultas', 'programStudi'])->get();
        return response()->json([
            'status' => 'success',
            'data' => $users
        ], 200);
    }

    public function getProfileById($id)
    {
        $user = User::with(['fakultas', 'programStudi'])->find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data pengguna tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $user
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'nim_nip' => 'nullable|string|unique:users,nim_nip,' . $user->id,
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'fakultas_id' => 'nullable|exists:fakultas,id',
            'program_studi_id' => 'nullable|exists:program_studi,id',
            'alamat' => 'nullable|string',
            'profile' => 'nullable|string'
        ], [
            'nim_nip.unique' => 'NIM atau NIP sudah terdaftar pada pengguna lain.',
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan oleh pengguna lain.',
            'password.min' => 'Password baru minimal harus 8 karakter.',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok.',
            'fakultas_id.exists' => 'Fakultas yang dipilih tidak valid.',
            'program_studi_id.exists' => 'Program studi yang dipilih tidak valid.'
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('nim_nip')) {
            $user->nim_nip = $request->nim_nip;
        }
        if ($request->filled('fakultas_id')) {
            $user->fakultas_id = $request->fakultas_id;
        }
        if ($request->filled('program_studi_id')) {
            $user->program_studi_id = $request->program_studi_id;
        }
        if ($request->filled('alamat')) {
            $user->alamat = $request->alamat;
        }
        if ($request->filled('profile')) {
            $user->profile = $request->profile;
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profil Anda berhasil diperbarui.',
            'data' => $user->load(['fakultas', 'programStudi'])
        ], 200);
    }

    public function destroyProfile(Request $request, $id = null)
    {
        if ($id && $request->user()->role === 'admin') {
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pengguna tidak ditemukan.'
                ], 404);
            }
            $user->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Akun pengguna berhasil dihapus oleh Admin.'
            ], 200);
        }

        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Akun Anda berhasil dihapus dari sistem.'
        ], 200);
    }
}