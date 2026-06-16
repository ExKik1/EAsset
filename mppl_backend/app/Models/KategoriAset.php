<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KategoriAset extends Model
{
    protected $table = 'kategori_aset';
    protected $fillable = ['nama_kategori', 'kode_kategori', 'deskripsi'];

    public function aset()
    {
        return $this->hasMany(Aset::class, 'kategori_aset_id');
    }
}
