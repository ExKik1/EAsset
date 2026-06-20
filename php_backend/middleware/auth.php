<?php
require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/response.php';

function requireAuth(): array {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
        error('Token tidak ditemukan. Silakan login terlebih dahulu.', 401);
    }
    $token = substr($authHeader, 7);
    $payload = jwtDecode($token);
    if (!$payload) {
        error('Token tidak valid atau sudah kadaluarsa. Silakan login ulang.', 401);
    }
    return $payload;
}

function requireRole(array $payload, array $allowedRoles): void {
    if (!in_array($payload['role'], $allowedRoles, true)) {
        error('Akses ditolak. Anda tidak memiliki hak akses untuk fitur ini.', 403);
    }
}
