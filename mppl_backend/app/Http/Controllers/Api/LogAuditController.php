<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LogAudit;
// use Illuminate\Http\Request;

class LogAuditController extends Controller
{
    public function getAuditLogs()
    {
        $logs = LogAudit::with('user:id,name,email,role')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $logs
        ], 200);
    }
}