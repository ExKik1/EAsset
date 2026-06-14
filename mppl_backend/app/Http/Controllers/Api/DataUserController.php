<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DataUserController extends Controller
{
    public function index()
    {
        $users = User::with(['fakultas', 'programStudi'])->get();
        return response()->json([
            'status' => 'success',
            'data' => $users
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nim_nip' => 'nullable|string|unique:users,nim_nip',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,kerumahtanggaan,umum',
            'fakultas_id' => 'nullable|exists:fakultas,id',
            'program_studi_id' => 'nullable|exists:program_studi,id',
            'alamat' => 'nullable|string',
            'profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ], [
            'nim_nip.unique' => 'NIM atau NIP sudah terdaftar di sistem.',
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan oleh akun lain.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal harus 8 karakter.',
            'role.required' => 'Role/Hak akses wajib ditentukan.',
            'role.in' => 'Pilihan role tidak valid.',
            'profile.image' => 'File yang diunggah harus berupa gambar.',
            'profile.max' => 'Ukuran gambar maksimal adalah 2MB.'
        ]);

        $profilePath = 'profiles/default-profile.png';
        if ($request->hasFile('profile')) {
            $profilePath = $request->file('profile')->store('profiles', 'public');
        }

        $user = User::create([
            'nim_nip' => $request->nim_nip,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'fakultas_id' => $request->fakultas_id,
            'program_studi_id' => $request->program_studi_id,
            'alamat' => $request->alamat,
            'profile' => $profilePath,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data pengguna baru berhasil ditambahkan.',
            'data' => $user->load(['fakultas', 'programStudi'])
        ], 201);
    }

    public function show($id)
    {
        $user = User::with(['fakultas', 'programStudi'])->find($id);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Data pengguna tidak ditemukan.'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $user], 200);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Data pengguna tidak ditemukan.'], 404);
        }
        $request->validate([
            'nim_nip' => 'nullable|string|unique:users,nim_nip,' . $id,
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|in:admin,kerumahtanggaan,umum',
            'fakultas_id' => 'nullable|exists:fakultas,id',
            'program_studi_id' => 'nullable|exists:program_studi,id',
            'alamat' => 'nullable|string',
            'profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->nim_nip = $request->nim_nip;
        $user->fakultas_id = $request->fakultas_id;
        $user->program_studi_id = $request->program_studi_id;
        $user->alamat = $request->alamat;

        if ($request->hasFile('profile')) {
            if ($user->profile && $user->profile !== 'profiles/default-profile.png' && Storage::disk('public')->exists($user->profile)) {
                Storage::disk('public')->delete($user->profile);
            }
            $user->profile = $request->file('profile')->store('profiles', 'public');
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();
        return response()->json([
            'status' => 'success',
            'message' => 'Data pengguna berhasil diperbarui.',
            'data' => $user->load(['fakultas', 'programStudi'])
        ], 200);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Data pengguna tidak ditemukan.'], 404);
        }

        if ($user->profile && $user->profile !== 'profiles/default-profile.png' && Storage::disk('public')->exists($user->profile)) {
            Storage::disk('public')->delete($user->profile);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['status' => 'success', 'message' => 'Data pengguna berhasil dihapus.'], 200);
    }
}