import { Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthMiddleware from "./middleware/AuthMiddleware";
import GuestMiddleware from "./middleware/GuestMiddleware";
import RoleMiddleware from "./middleware/RoleMiddleware";

import Login        from "./pages/auth/Login";
import Register     from "./pages/auth/Register";
import LandingPage  from "./pages/main/Landing";
import NotFound     from "./pages/errors/NotFound";
import Forbidden    from "./pages/errors/Forbidden";
import DashboardLayout from "./layouts/DashboardLayout";

// ── Halaman Umum (semua role) ──────────────────────────────────────────────
import Dashboard    from "./pages/dashboard/Dashboard";
import MainContent  from "./pages/main/MainContent";   // QR Scanner
import QrScanPage   from "./pages/main/QrScanPage";
import UserProfile  from "./pages/main/UserProfile";

// ── Sirkulasi (Peminjaman) ──────────────────────────────────────────────────
import CheckoutPage from "./pages/borrowing/CheckoutPage";
import CheckinPage  from "./pages/borrowing/CheckinPage";
import HistoryPage  from "./pages/borrowing/HistoryPage";

// ── Katalog Aset (admin & kerumahtanggaan) ─────────────────────────────────
import KategoriAsetPage   from "./pages/features_role/categories_assets/KategoriAsetPage";
import KategoriAsetCreate from "./pages/features_role/categories_assets/KategoriAsetCreate";
import KategoriAsetEdit   from "./pages/features_role/categories_assets/KategoriAsetEdit";
import AsetPage    from "./pages/features_role/aset/AsetPage";
import AsetCreate  from "./pages/features_role/aset/AsetCreate";
import AsetEdit    from "./pages/features_role/aset/AsetEdit";
import AsetDetail  from "./pages/features_role/aset/AsetDetail";
import LogAuditPage from "./pages/features_role/log_audit/LogAuditPage";

// ── Admin Only ─────────────────────────────────────────────────────────────
import FakultasPage   from "./pages/admin/faculties/FakultasPage";
import FakultasCreate from "./pages/admin/faculties/FakultasCreate";
import FakultasEdit   from "./pages/admin/faculties/FakultasEdit";
import ProdiPage      from "./pages/admin/prodi/ProdiPage";
import ProdiCreate    from "./pages/admin/prodi/ProdiCreate";
import ProdiEdit      from "./pages/admin/prodi/ProdiEdit";
import UserPage       from "./pages/admin/users/UserPage";
import UserCreate     from "./pages/admin/users/UserCreate";
import UserEdit       from "./pages/admin/users/UserEdit";

// ─── Helper: wrap page dengan DashboardLayout ────────────────────────────────
const W = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout>{children}</DashboardLayout>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Guest routes ──────────────────────────────────────────── */}
        <Route element={<GuestMiddleware><Outlet /></GuestMiddleware>}>
          <Route path="/"              element={<LandingPage />} />
          <Route path="/auth/login"    element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Route>

        {/* ── Authenticated routes ───────────────────────────────────── */}
        <Route element={<AuthMiddleware><Outlet /></AuthMiddleware>}>

          {/* Dashboard — semua role (konten berbeda per role) */}
          <Route path="/dashboard" element={<W><Dashboard /></W>} />
          <Route path="/main"      element={<W><Dashboard /></W>} />

          {/* QR Scanner — semua role */}
          <Route path="/scan-qr" element={<W><MainContent /></W>} />
          <Route path="/main/scan" element={<W><QrScanPage /></W>} />

          {/* Profil — semua role */}
          <Route path="/profile" element={<UserProfile />} />

          {/* Sirkulasi: Checkout — semua role (umum untuk ajukan pinjam) */}
          <Route path="/borrowing/checkout" element={<W><CheckoutPage /></W>} />

          {/* Sirkulasi: Riwayat — semua role (umum: hanya milik sendiri) */}
          <Route path="/borrowing/history" element={<W><HistoryPage /></W>} />

          {/* Sirkulasi: Checkin — admin & kerumahtanggaan */}
          <Route element={<RoleMiddleware allowedRoles={["admin","kerumahtanggaan"]} />}>
            <Route path="/borrowing/checkin" element={<W><CheckinPage /></W>} />
          </Route>

          {/* Katalog Aset — admin & kerumahtanggaan */}
          <Route element={<RoleMiddleware allowedRoles={["admin","kerumahtanggaan"]} />}>
            <Route path="/categories-assets"          element={<W><KategoriAsetPage /></W>} />
            <Route path="/categories-assets/create"   element={<W><KategoriAsetCreate /></W>} />
            <Route path="/categories-assets/edit/:id" element={<W><KategoriAsetEdit /></W>} />

            <Route path="/assets"               element={<W><AsetPage /></W>} />
            <Route path="/assets/create"        element={<W><AsetCreate /></W>} />
            <Route path="/assets/edit/:kode_qr" element={<W><AsetEdit /></W>} />
            <Route path="/assets/show/:kode_qr" element={<W><AsetDetail /></W>} />

            <Route path="/audit-logs" element={<W><LogAuditPage /></W>} />
          </Route>

          {/* Admin Only */}
          <Route element={<RoleMiddleware allowedRoles={["admin"]} />}>
            <Route path="/faculties"          element={<W><FakultasPage /></W>} />
            <Route path="/faculties/create"   element={<W><FakultasCreate /></W>} />
            <Route path="/faculties/edit/:id" element={<W><FakultasEdit /></W>} />

            <Route path="/prodi"          element={<W><ProdiPage /></W>} />
            <Route path="/prodi/create"   element={<W><ProdiCreate /></W>} />
            <Route path="/prodi/edit/:id" element={<W><ProdiEdit /></W>} />

            <Route path="/data-users"          element={<W><UserPage /></W>} />
            <Route path="/data-users/create"   element={<W><UserCreate /></W>} />
            <Route path="/data-users/edit/:id" element={<W><UserEdit /></W>} />
          </Route>
        </Route>

        <Route path="/403" element={<Forbidden />} />
        <Route path="*"    element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
