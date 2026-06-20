<?php
function jsonResponse(mixed $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function success(mixed $data = null, string $message = 'OK', int $code = 200): void {
    jsonResponse(['status' => 'success', 'message' => $message, 'data' => $data], $code);
}

function error(string $message, int $code = 400, mixed $errors = null): void {
    $res = ['status' => 'error', 'message' => $message];
    if ($errors !== null) $res['errors'] = $errors;
    jsonResponse($res, $code);
}

function getBody(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}
