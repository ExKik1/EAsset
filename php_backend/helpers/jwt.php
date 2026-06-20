<?php
// Simple JWT implementation — tidak memerlukan library eksternal
define('JWT_SECRET', 'EAsset_JWT_SecretKey_2026_phpMyAdmin_MPPL');
define('JWT_EXPIRY', 86400); // 24 jam

function jwtEncode(array $payload): string {
    $header  = base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRY;
    $payloadEnc = base64UrlEncode(json_encode($payload));
    $signature  = base64UrlEncode(hash_hmac('sha256', "$header.$payloadEnc", JWT_SECRET, true));
    return "$header.$payloadEnc.$signature";
}

function jwtDecode(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    [$header, $payload, $signature] = $parts;
    $expectedSig = base64UrlEncode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));

    if (!hash_equals($expectedSig, $signature)) return null;

    $decoded = json_decode(base64UrlDecode($payload), true);
    if (!$decoded) return null;
    if (isset($decoded['exp']) && $decoded['exp'] < time()) return null; // expired

    return $decoded;
}

function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 4 - strlen($data) % 4));
}
