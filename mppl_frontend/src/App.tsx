import { Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthMiddleware from "./middleware/AuthMiddleware";
import GuestMiddleware from "./middleware/GuestMiddleware";
import RoleMiddleware from "./middleware/RoleMiddleware"; // Impor middleware role baru

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MainContent from "./pages/main/MainContent";
import HistoryLog from "./pages/main/HistoryLog";
import NotFound from "./pages/errors/NotFound";
import Forbidden from "./pages/errors/Forbidden"; 
import LandingPage from "./pages/main/Landing";
import UserProfile from "./pages/main/UserProfile";
import DashboardLayout from "./layouts/DashboardLayout";

import KategoriAsetPage from "./pages/features_role/categories_assets/KategoriAsetPage";
import KategoriAsetCreate from "./pages/features_role/categories_assets/KategoriAsetCreate";
import KategoriAsetEdit from "./pages/features_role/categories_assets/KategoriAsetEdit";
import AsetPage from "./pages/features_role/aset/AsetPage";
import AsetCreate from "./pages/features_role/aset/AsetCreate";
import AsetEdit from "./pages/features_role/aset/AsetEdit";
import AsetDetail from "./pages/features_role/aset/AsetDetail";
import LogAuditPage from "./pages/features_role/log_audit/LogAuditPage";

import FakultasPage from "./pages/admin/faculties/FakultasPage";
import FakultasCreate from "./pages/admin/faculties/FakultasCreate";
import FakultasEdit from "./pages/admin/faculties/FakultasEdit";
import ProdiPage from "./pages/admin/prodi/ProdiPage";
import ProdiCreate from "./pages/admin/prodi/ProdiCreate";
import ProdiEdit from "./pages/admin/prodi/ProdiEdit";
import UserPage from "./pages/admin/users/UserPage";
import UserCreate from "./pages/admin/users/UserCreate";
import UserEdit from "./pages/admin/users/UserEdit";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          element={
            <GuestMiddleware>
              <Outlet />
            </GuestMiddleware>
          }
        >
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Route>

        <Route
          element={
            <AuthMiddleware>
              <Outlet />
            </AuthMiddleware>
          }
        >
          <Route
            path="/main"
            element={
              <DashboardLayout>
                <MainContent />
              </DashboardLayout>
            }
          />
          <Route path="/history" element={<HistoryLog />} />
          <Route path="/profile" element={<UserProfile />} />

          <Route element={<RoleMiddleware allowedRoles={["admin", "kerumahtanggan"]} />}>
            <Route path="/categories-assets" element={<KategoriAsetPage />} />
            <Route path="/categories-assets/create" element={<KategoriAsetCreate />} />
            <Route path="/categories-assets/edit/:id" element={<KategoriAsetEdit />} />

            <Route path="/assets" element={<AsetPage />} />
            <Route path="/assets/create" element={<AsetCreate />} />
            <Route path="/assets/edit/:kode_qr" element={<AsetEdit />} />
            <Route path="/assets/show/:kode_qr" element={<AsetDetail />} />
          </Route>

          <Route element={<RoleMiddleware allowedRoles={["admin"]} />}>
            <Route path="/audit-logs" element={<LogAuditPage />} />

            <Route path="/faculties" element={<FakultasPage />} />
            <Route path="/faculties/create" element={<FakultasCreate />} />
            <Route path="/faculties/edit/:id" element={<FakultasEdit />} />

            <Route path="/prodi" element={<ProdiPage />} />
            <Route path="/prodi/create" element={<ProdiCreate />} />
            <Route path="/prodi/edit/:id" element={<ProdiEdit />} />

            <Route path="/data-users" element={<UserPage />} />
            <Route path="/data-users/create" element={<UserCreate />} />
            <Route path="/data-users/edit/:id" element={<UserEdit />} />
          </Route>
        </Route>

        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;