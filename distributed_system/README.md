# EAsset — Distributed System (ASP.NET Core)

Implementasi sistem terdistribusi untuk platform manajemen aset kampus **E-Asset**,  
dibangun menggunakan **C# / ASP.NET Core 8**, **SQL Server**, dan **Entity Framework Core**.

---

## 🏗️ Arsitektur Microservices

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT / BROWSER                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP
┌──────────────────────────▼──────────────────────────────────────┐
│              EAsset.Gateway  (Port 5000)                        │
│         ASP.NET Core Reverse Proxy / API Gateway                │
│   Routes requests → downstream services by path prefix         │
└───────┬──────────────────┬─────────────────────┬───────────────┘
        │                  │                     │
   /api/assets         /api/users           /api/borrowing
        │                  │                     │
┌───────▼──────┐  ┌────────▼──────┐  ┌──────────▼──────┐
│ AssetService │  │  UserService  │  │ BorrowingService │
│  Port 5001   │  │   Port 5002   │  │    Port 5003     │
│              │  │               │  │                  │
│ SQL Server   │  │  SQL Server   │  │   SQL Server     │
│ DB: Assets   │  │  DB: Users    │  │  DB: Borrowing   │
└──────────────┘  └───────────────┘  └──────────────────┘
```

---

## 📦 Services

| Service | Port | Database | Tanggung Jawab |
|---------|------|----------|----------------|
| **EAsset.Gateway** | `5000` | — | API Gateway, routing, CORS |
| **EAsset.AssetService** | `5001` | `EAsset_Assets` | CRUD Aset, Kategori, QR Scan |
| **EAsset.UserService** | `5002` | `EAsset_Users` | Auth, User, Role, Fakultas, Prodi |
| **EAsset.BorrowingService** | `5003` | `EAsset_Borrowing` | Peminjaman, Checkin, Riwayat |

---

## ⚙️ Komponen Teknis

- **Bahasa**: C# 12
- **Framework**: ASP.NET Core 8 Web API
- **ORM**: Entity Framework Core 8
- **Database**: SQL Server (LocalDB untuk dev, SQL Server untuk prod)
- **Auth**: JWT Bearer Token (divalidasi di Gateway)
- **Service Communication**: HTTP Client (REST antar service)
- **Port Config**: Setiap service berjalan pada port terpisah

---

## 🚀 Cara Menjalankan

### Prasyarat
- .NET 8 SDK
- SQL Server / SQL Server LocalDB
- Visual Studio 2022 atau VS Code + C# Extension

### Langkah Menjalankan

```bash
# 1. Clone / masuk ke direktori
cd distributed_system

# 2. Restore semua dependency
dotnet restore EAsset.sln

# 3. Update koneksi database di appsettings.json masing-masing service

# 4. Jalankan migrasi database
dotnet ef database update --project EAsset.AssetService
dotnet ef database update --project EAsset.UserService
dotnet ef database update --project EAsset.BorrowingService

# 5. Jalankan semua service (terminal terpisah)
dotnet run --project EAsset.Gateway          # http://localhost:5000
dotnet run --project EAsset.AssetService     # http://localhost:5001
dotnet run --project EAsset.UserService      # http://localhost:5002
dotnet run --project EAsset.BorrowingService # http://localhost:5003
```

---

## 📡 API Endpoints (via Gateway Port 5000)

| Method | Path | Service | Keterangan |
|--------|------|---------|-----------|
| GET | `/api/assets` | AssetService | Daftar semua aset |
| GET | `/api/assets/{kodeQr}` | AssetService | Detail aset by QR |
| GET | `/api/assets/scan/{kodeQr}` | AssetService | Scan QR → info aset |
| POST | `/api/assets` | AssetService | Tambah aset baru |
| PUT | `/api/assets/{kodeQr}` | AssetService | Update aset |
| DELETE | `/api/assets/{kodeQr}` | AssetService | Hapus aset |
| GET | `/api/categories` | AssetService | Daftar kategori |
| POST | `/api/categories` | AssetService | Tambah kategori |
| POST | `/api/users/register` | UserService | Registrasi user |
| POST | `/api/users/login` | UserService | Login → JWT token |
| GET | `/api/users` | UserService | Daftar user (admin) |
| GET | `/api/borrowing` | BorrowingService | Daftar peminjaman |
| POST | `/api/borrowing/checkout` | BorrowingService | Checkout peminjaman |
| POST | `/api/borrowing/checkin` | BorrowingService | Checkin pengembalian |

---

## 📋 Kriteria Penilaian UAS

✅ **Bahasa C#** — Semua service ditulis dalam C#  
✅ **ASP.NET Core** — Web API framework  
✅ **SQL Server** — Database utama (3 DB terpisah per service)  
✅ **Entity Framework** — ORM untuk data access  
✅ **Multi-Service** — 4 service (Gateway + 3 layanan bisnis)  
✅ **Port Berbeda** — Gateway:5000, Asset:5001, User:5002, Borrowing:5003  
✅ **Integrasi Data** — BorrowingService memanggil AssetService & UserService via HTTP  
✅ **Kestabilan Node** — Health check endpoint di setiap service  
