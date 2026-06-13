<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fakultas extends Model
{
    protected $table = 'fakultas';
    protected $fillable = ['kode_fakultas', 'nama_fakultas', 'deskripsi'];

    public function programStudi()
    {
        return $this->hasMany(ProgramStudi::class, 'fakultas_id');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'fakultas_id');
    }
}
