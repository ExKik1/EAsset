#!/bin/bash
# ─────────────────────────────────────────────────────────────
# run-all.sh — Jalankan semua EAsset microservices secara paralel
# Prasyarat: .NET 8 SDK + SQL Server (LocalDB)
# ─────────────────────────────────────────────────────────────

set -e
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 EAsset Distributed System — Starting All Services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "📦 Restoring NuGet packages..."
dotnet restore "$BASE_DIR/EAsset.sln"

echo ""
echo "▶ Starting AssetService    → http://localhost:5001"
dotnet run --project "$BASE_DIR/EAsset.AssetService" &
PID_ASSET=$!

echo "▶ Starting UserService     → http://localhost:5002"
dotnet run --project "$BASE_DIR/EAsset.UserService" &
PID_USER=$!

echo "▶ Starting BorrowingService → http://localhost:5003"
dotnet run --project "$BASE_DIR/EAsset.BorrowingService" &
PID_BORROWING=$!

sleep 3

echo "▶ Starting Gateway         → http://localhost:5000"
dotnet run --project "$BASE_DIR/EAsset.Gateway" &
PID_GATEWAY=$!

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ All services running!"
echo "  Gateway   : http://localhost:5000"
echo "  Assets    : http://localhost:5001/swagger"
echo "  Users     : http://localhost:5002/swagger"
echo "  Borrowing : http://localhost:5003/swagger"
echo "  Health    : http://localhost:5000/health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Tekan Ctrl+C untuk menghentikan semua service."
echo ""

# Tunggu semua proses
wait $PID_ASSET $PID_USER $PID_BORROWING $PID_GATEWAY
