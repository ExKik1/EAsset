<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AkademikController;
use App\Http\Controllers\Api\KategoriAsetController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DataUserController;
use App\Http\Controllers\Api\AsetController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PeminjamanController;
use App\Http\Controllers\Api\LogAuditController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/faculties', [AkademikController::class, 'getAllFaculties']);
    Route::get('/faculties/{faculty_id}/prodi', [AkademikController::class, 'getProdiByFaculty']);

    Route::get('/profile', [ProfileController::class, 'getAllProfiles']);
    Route::put('/profile/update', [ProfileController::class, 'updateProfile']);
    Route::delete('/profile/delete', [ProfileController::class, 'destroyProfile']);

    Route::get('/assets-main', [AsetController::class, 'indexUsers']);
    Route::get('/assets-main/detail/{kode_barang}', [AsetController::class, 'showUsers']);

    Route::get('/assets-main/{kode_qr}', [PeminjamanController::class, 'validateQrCode']);
    Route::post('/borrowing-main/checkout', [PeminjamanController::class, 'checkout']);
    Route::get('/borrowing-main/history', [PeminjamanController::class, 'getHistory']);


    Route::middleware('role:admin')->group(function () {
        Route::post('/faculties', [AkademikController::class, 'storeFaculty']);
        Route::get('/faculties/{id}', [AkademikController::class, 'showFaculty']);
        Route::put('/faculties/{id}', [AkademikController::class, 'updateFaculty']);
        Route::delete('/faculties/{id}', [AkademikController::class, 'destroyFaculty']);

        Route::get('/prodi', [AkademikController::class, 'getAllProdi']);
        Route::post('/prodi', [AkademikController::class, 'storeProdi']);
        Route::get('/prodi/{id}', [AkademikController::class, 'showProdi']);
        Route::put('/prodi/{id}', [AkademikController::class, 'updateProdi']);
        Route::delete('/prodi/{id}', [AkademikController::class, 'destroyProdi']);

        Route::get('/data-users', [DataUserController::class, 'index']);
        Route::post('/data-users', [DataUserController::class, 'store']);
        Route::get('/data-users/{id}', [DataUserController::class, 'show']);
        Route::put('/data-users/{id}', [DataUserController::class, 'update']);
        Route::delete('/data-users/{id}', [DataUserController::class, 'destroy']);
    });

    Route::middleware('role:admin,kerumahtanggaan')->group(function () {
        Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);

        Route::post('/borrowing/checkin', [PeminjamanController::class, 'checkin']);
        Route::get('/borrowing/history', [PeminjamanController::class, 'getHistory']);

        Route::get('/categories', [KategoriAsetController::class, 'index']);
        Route::post('/categories', [KategoriAsetController::class, 'store']);
        Route::get('/categories/{id}', [KategoriAsetController::class, 'show']);
        Route::put('/categories/{id}', [KategoriAsetController::class, 'update']);
        Route::delete('/categories/{id}', [KategoriAsetController::class, 'destroy']);

        Route::get('/assets', [AsetController::class, 'index']);
        Route::post('/assets', [AsetController::class, 'store']);
        Route::get('/assets/{kode_qr}', [AsetController::class, 'show']);
        Route::put('/assets/{kode_qr}', [AsetController::class, 'update']);
        Route::delete('/assets/{kode_qr}', [AsetController::class, 'destroy']);
        Route::get('/audit-logs', [LogAuditController::class, 'getAuditLogs']);
    });
});
