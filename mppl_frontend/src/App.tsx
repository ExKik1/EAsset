import { Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthMiddleware from "./middleware/AuthMiddleware";
import GuestMiddleware from "./middleware/GuestMiddleware";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MainContent from "./pages/main/MainContent";
import HistoryLog from "./pages/main/HistoryLog";
import NotFound from "./pages/errors/NotFound";
import LandingPage from "./pages/main/Landing";
import UserProfile from "./pages/main/UserProfile";
import DashboardLayout from "./layouts/DashboardLayout";
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

          <Route path="/faculties" element={<FakultasPage />} />
          <Route path="/faculties/create" element={<FakultasCreate />} />
          <Route path="/faculties/edit/:id" element={<FakultasEdit />} />

          <Route path="/prodi" element={<ProdiPage />} />
          <Route path="/prodi/create" element={<ProdiCreate />} />
          <Route path="/prodi/edit/:id" element={<ProdiEdit />} />

          <Route path="/data-users" element={<UserPage />} />
          <Route path="/data-users/create" element={<UserCreate />} />
          <Route path="/data-users/edit/:id" element={<UserEdit />} />

          <Route path="/history" element={<HistoryLog />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
