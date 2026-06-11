<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aset extends Model
{
    protected $table = 'aset';
    protected $fillable = ['kode_qr', 'nama_barang', 'kategori_aset_id', 'foto_barang', 'stok', 'status', 'deskripsi'];

    public function kategoriAset()
    {
        return $this->belongsTo(KategoriAset::class, 'kategori_aset_id');
    }
}