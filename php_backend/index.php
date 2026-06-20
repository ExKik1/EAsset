<?php
// ─────────────────────────────────────────────────────────────────────────────
// EAsset PHP Native Backend — Router Utama
// Jalankan dengan: php -S localhost:8080 index.php
// ─────────────────────────────────────────────────────────────────────────────
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/helpers/response.php';
require_once __DIR__ . '/helpers/jwt.php';
require_once __DIR__ . '/middleware/auth.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Hapus base path jika ada (misal /api/)
$uri = '/' . trim($uri, '/');

// ─── Router ───────────────────────────────────────────────────────────────────
// AUTH
if ($uri === '/api/auth/login'    && $method === 'POST') { require __DIR__ . '/api/auth/login.php';    exit; }
if ($uri === '/api/auth/register' && $method === 'POST') { require __DIR__ . '/api/auth/register.php'; exit; }
if ($uri === '/api/auth/logout'   && $method === 'POST') { require __DIR__ . '/api/auth/logout.php';   exit; }

// PROFILE
if ($uri === '/api/profile' && $method === 'GET')    { require __DIR__ . '/api/profile/get.php';    exit; }
if ($uri === '/api/profile' && $method === 'PUT')    { require __DIR__ . '/api/profile/update.php'; exit; }
// Support POST dengan _method=PUT (multipart/form-data dari UserProfile.tsx)
if ($uri === '/api/profile/update' && ($method === 'POST' || $method === 'PUT')) { require __DIR__ . '/api/profile/update.php'; exit; }
if ($uri === '/api/profile/change-password' && $method === 'PUT') { require __DIR__ . '/api/profile/password.php'; exit; }

// DASHBOARD
if ($uri === '/api/dashboard/stats' && $method === 'GET') { require __DIR__ . '/api/dashboard/stats.php'; exit; }

// SCAN QR
if (preg_match('#^/api/scan-qr/(.+)$#', $uri, $m) && $method === 'GET') {
    $_GET['kode_qr'] = $m[1];
    require __DIR__ . '/api/assets/scan.php'; exit;
}

// ASSETS
if ($uri === '/api/assets' && $method === 'GET')    { require __DIR__ . '/api/assets/index.php';  exit; }
if ($uri === '/api/assets' && $method === 'POST')   { require __DIR__ . '/api/assets/store.php';  exit; }
if (preg_match('#^/api/assets/([^/]+)$#', $uri, $m)) {
    $_GET['kode_qr'] = urldecode($m[1]);
    if ($method === 'GET')    { require __DIR__ . '/api/assets/show.php';    exit; }
    if ($method === 'PUT')    { require __DIR__ . '/api/assets/update.php';  exit; }
    if ($method === 'DELETE') { require __DIR__ . '/api/assets/destroy.php'; exit; }
}
// ASSETS PUBLIC (untuk user umum)
if ($uri === '/api/assets-main' && $method === 'GET') { require __DIR__ . '/api/assets/public.php'; exit; }

// CATEGORIES
if ($uri === '/api/categories' && $method === 'GET')  { require __DIR__ . '/api/categories/index.php';  exit; }
if ($uri === '/api/categories' && $method === 'POST') { require __DIR__ . '/api/categories/store.php';  exit; }
if (preg_match('#^/api/categories/(\d+)$#', $uri, $m)) {
    $_GET['id'] = $m[1];
    if ($method === 'GET')    { require __DIR__ . '/api/categories/show.php';    exit; }
    if ($method === 'PUT')    { require __DIR__ . '/api/categories/update.php';  exit; }
    if ($method === 'DELETE') { require __DIR__ . '/api/categories/destroy.php'; exit; }
}

// BORROWING
if ($uri === '/api/borrowing/checkout' && $method === 'POST') { require __DIR__ . '/api/borrowing/checkout.php'; exit; }
if ($uri === '/api/borrowing/checkin'  && $method === 'POST') { require __DIR__ . '/api/borrowing/checkin.php';  exit; }
if ($uri === '/api/borrowing/history'  && $method === 'GET')  { require __DIR__ . '/api/borrowing/history.php';  exit; }

// DATA USERS (admin only)
if ($uri === '/api/data-users' && $method === 'GET')  { require __DIR__ . '/api/users/index.php';  exit; }
if ($uri === '/api/data-users' && $method === 'POST') { require __DIR__ . '/api/users/store.php';  exit; }
if (preg_match('#^/api/data-users/(\d+)$#', $uri, $m)) {
    $_GET['id'] = $m[1];
    if ($method === 'GET')    { require __DIR__ . '/api/users/show.php';    exit; }
    if ($method === 'PUT')    { require __DIR__ . '/api/users/update.php';  exit; }
    if ($method === 'DELETE') { require __DIR__ . '/api/users/destroy.php'; exit; }
}

// AUDIT LOGS
if ($uri === '/api/audit-logs' && $method === 'GET') { require __DIR__ . '/api/logs/index.php'; exit; }

// FAKULTAS
if ($uri === '/api/faculties' && $method === 'GET')  { require __DIR__ . '/api/faculties/index.php'; exit; }
if ($uri === '/api/faculties' && $method === 'POST') { require __DIR__ . '/api/faculties/store.php'; exit; }
if (preg_match('#^/api/faculties/(\d+)/prodi$#', $uri, $m)) {
    $_GET['id'] = $m[1];
    if ($method === 'GET') { require __DIR__ . '/api/faculties/prodi_by_faculty.php'; exit; }
}
if (preg_match('#^/api/faculties/(\d+)$#', $uri, $m)) {
    $_GET['id'] = $m[1];
    if ($method === 'PUT')    { require __DIR__ . '/api/faculties/update.php';  exit; }
    if ($method === 'DELETE') { require __DIR__ . '/api/faculties/destroy.php'; exit; }
}

// PRODI
if ($uri === '/api/prodi' && $method === 'GET')  { require __DIR__ . '/api/prodi/index.php'; exit; }
if ($uri === '/api/prodi' && $method === 'POST') { require __DIR__ . '/api/prodi/store.php'; exit; }
if (preg_match('#^/api/prodi/(\d+)$#', $uri, $m)) {
    $_GET['id'] = $m[1];
    if ($method === 'PUT')    { require __DIR__ . '/api/prodi/update.php';  exit; }
    if ($method === 'DELETE') { require __DIR__ . '/api/prodi/destroy.php'; exit; }
}

// 404
error('Endpoint tidak ditemukan: ' . $uri, 404);
