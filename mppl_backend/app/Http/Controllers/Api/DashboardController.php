<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        // 1. Data Ringkasan Utama (Stats Card)
        $statsData = [
            'totalUsers' => DB::table('users')->count(),
            'totalAsset' => DB::table('aset')->count(),
            'totalKategoriAsset' => DB::table('kategori_aset')->count(),
            'totalFakultas' => 0,
            'totalProdi' => 0,
        ];

        if ($role === 'admin') {
            $statsData['totalFakultas'] = DB::table('fakultas')->count();
            $statsData['totalProdi'] = DB::table('program_studi')->count();
        }

        // 2. Data Grafik Batang (Sirkulasi Bulanan)
        $monthsData = DB::table('peminjaman')
            ->select(
                DB::raw("DATE_FORMAT(created_at, '%b') as bulan"),
                DB::raw("COUNT(*) as jumlah"),
                DB::raw("YEAR(created_at) as tahun"),
                DB::raw("MONTH(created_at) as bulan_num")
            )
            ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('tahun', 'bulan_num', 'bulan')
            ->orderBy('tahun', 'asc')
            ->orderBy('bulan_num', 'asc')
            ->get();

        $chartData = [];
        for ($i = 11; $i >= 0; $i--) {
            $carbonMonth = now()->subMonths($i);
            $monthLabel = $carbonMonth->format('M');
            $match = $monthsData->firstWhere('bulan', $monthLabel);
            $chartData[] = [
                'bulan' => $monthLabel,
                'jumlah' => $match ? (int)$match->jumlah : 0
            ];
        }

        // 3. Data Chart Circle Pie (Kondisi Pengembalian Peminjaman: Bagus vs Rusak)
        $kondisiData = DB::table('peminjaman')
            ->select('kondisi_kembali', DB::raw('count(*) as total'))
            ->whereIn('kondisi_kembali', ['bagus', 'rusak'])
            ->groupBy('kondisi_kembali')
            ->get();

        $pieChartData = [
            ['name' => 'Bagus', 'value' => (int)($kondisiData->firstWhere('kondisi_kembali', 'bagus')->total ?? 0)],
            ['name' => 'Rusak', 'value' => (int)($kondisiData->firstWhere('kondisi_kembali', 'rusak')->total ?? 0)],
        ];

        // 4. Data Chart Doughnut (Status Kondisi Aset Aktual: Tersedia, Dipinjam, Rusak)
        $statusAsetData = DB::table('aset')
            ->select('status', DB::raw('count(*) as total'))
            ->whereIn('status', ['tersedia', 'dipinjam', 'rusak'])
            ->groupBy('status')
            ->get();

        $doughnutChartData = [
            ['name' => 'Tersedia', 'value' => (int)($statusAsetData->firstWhere('status', 'tersedia')->total ?? 0)],
            ['name' => 'Dipinjam', 'value' => (int)($statusAsetData->firstWhere('status', 'dipinjam')->total ?? 0)],
            ['name' => 'Rusak', 'value' => (int)($statusAsetData->firstWhere('status', 'rusak')->total ?? 0)],
        ];

        return response()->json([
            'success' => true,
            'role' => $role,
            'stats' => $statsData,
            'chart' => $chartData,
            'pieChart' => $pieChartData,
            'doughnutChart' => $doughnutChartData
        ], 200);
    }
}
