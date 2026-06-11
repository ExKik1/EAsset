<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    protected $table = 'peminjaman';
    protected $fillable = [
        'user_id',
        'aset_id',
        'qty',
        'waktu_pinjam',
        'deskripsi_pinjam',
        'jaminan',
        'waktu_kembali',
        'kondisi_kembali',
        'foto_baru',
        'deskripsi_rusak',
        'diproses_oleh'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function aset()
    {
        return $this->belongsTo(Aset::class);
    }
    public function petugas()
    {
        return $this->belongsTo(User::class, 'dipproses_oleh');
    }
}