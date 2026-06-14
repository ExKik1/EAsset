<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('peminjaman', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('aset_id')->constrained('aset')->onDelete('cascade');
            $table->integer('qty');
            $table->dateTime('waktu_pinjam');
            $table->text('deskripsi_pinjam')->nullable();
            $table->string('jaminan');
            $table->string('kode_peminjaman')->unique();
            $table->dateTime('waktu_kembali')->nullable();
            $table->enum('kondisi_kembali', ['bagus', 'rusak'])->nullable();
            $table->string('foto_baru')->nullable();
            $table->text('deskripsi_rusak')->nullable();
            $table->foreignId('diproses_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjamen');
    }
};
