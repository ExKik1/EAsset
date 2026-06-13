<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramStudi extends Model
{
    protected $table = 'program_studi';
    protected $fillable = ['fakultas_id', 'kode_prodi', 'nama_prodi', 'deskripsi'];

    public function fakultas()
    {
        return $this->belongsTo(Fakultas::class, 'fakultas_id');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'program_studi_id');
    }
}
