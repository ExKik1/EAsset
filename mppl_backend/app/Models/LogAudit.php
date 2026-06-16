<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogAudit extends Model
{
    use HasFactory;

    protected $table = 'log_audit';
    protected $fillable = [
        'user_id',
        'aksi',
        'deskripsi',
        'alamat_ip',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
