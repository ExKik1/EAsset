import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  LogOut,
  LayoutDashboard,
  QrCode,
  FolderTree,
  Users2,
  Settings,
  ChevronDown,
  Layers,
  History,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarMainProps {
  isCollapse: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  userName: string;
  userRole: "admin" | "kerumahtanggaan" | "umum";
}

export default function SidebarMain({
  isCollapse,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  userName,
  userRole,
}: SidebarMainProps) {
  const location = useLocation();
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({
    sirkulasi: false,
    masterAset: false,
    akademik: false,
  });

  const toggleSubMenu = (menuKey: string) => {
    if (isCollapse && window.innerWidth >= 1024) return;
    setOpenSubMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const renderNavigationContent = () => (
    <nav className="space-y-1.5 px-1">
      {/* 1. DASHBOARD */}
      <Link
        to="/dashboard"
        onClick={onCloseMobile}
        className={`flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-all ${
          location.pathname === "/dashboard"
            ? "bg-emerald-50 text-[#059669]"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        } ${isCollapse ? "lg:justify-center lg:px-0" : ""}`}
        title="Dashboard Utama"
      >
        <LayoutDashboard className="w-5 h-5 shrink-0" />
        <span className={isCollapse ? "lg:hidden" : "block"}>Dashboard</span>
      </Link>

      {/* 2. MENU SIRKULASI (Admin & Kerumahtanggaan) */}
      {(userRole === "admin" || userRole === "kerumahtanggaan") && (
        <div>
          <button
            onClick={() => toggleSubMenu("sirkulasi")}
            className={`w-full flex items-center justify-between gap-3 py-2.5 px-3.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer ${
              isCollapse ? "lg:justify-center lg:px-0" : ""
            }`}
            title="Sirkulasi Peminjaman"
          >
            <div className="flex items-center gap-3 min-w-0">
              <QrCode className="w-5 h-5 shrink-0 text-emerald-600" />
              <span className={isCollapse ? "lg:hidden" : "block truncate"}>
                Sirkulasi Aset
              </span>
            </div>
            {!isCollapse && (
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openSubMenus["sirkulasi"] ? "rotate-180 text-[#059669]" : ""
                }`}
              />
            )}
          </button>

          <AnimatePresence initial={false}>
            {openSubMenus["sirkulasi"] &&
              (!isCollapse || window.innerWidth < 1024) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pl-9 mt-1 space-y-1 border-l border-slate-100 ml-6"
                >
                  <Link
                    to="/borrowing/checkin"
                    onClick={onCloseMobile}
                    className="block py-2 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900"
                  >
                    Proses Checkin QR
                  </Link>
                  <Link
                    to="/borrowing/history"
                    onClick={onCloseMobile}
                    className="block py-2 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900"
                  >
                    Riwayat Sirkulasi
                  </Link>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      )}

      {/* 3. KATALOG DATA ASET (Admin & Kerumahtanggaan) */}
      {(userRole === "admin" || userRole === "kerumahtanggaan") && (
        <div>
          <button
            onClick={() => toggleSubMenu("masterAset")}
            className={`w-full flex items-center justify-between gap-3 py-2.5 px-3.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer ${
              isCollapse ? "lg:justify-center lg:px-0" : ""
            }`}
            title="Katalog & Inventaris"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Layers className="w-5 h-5 shrink-0" />
              <span className={isCollapse ? "lg:hidden" : "block truncate"}>
                Katalog Aset
              </span>
            </div>
            {!isCollapse && (
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openSubMenus["masterAset"] ? "rotate-180 text-[#059669]" : ""
                }`}
              />
            )}
          </button>

          <AnimatePresence initial={false}>
            {openSubMenus["masterAset"] &&
              (!isCollapse || window.innerWidth < 1024) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pl-9 mt-1 space-y-1 border-l border-slate-100 ml-6"
                >
                  <Link
                    to="/categories"
                    onClick={onCloseMobile}
                    className="block py-2 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900"
                  >
                    Kategori Aset
                  </Link>
                  <Link
                    to="/assets"
                    onClick={onCloseMobile}
                    className="block py-2 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900"
                  >
                    Daftar Barang
                  </Link>
                  <Link
                    to="/audit-logs"
                    onClick={onCloseMobile}
                    className="block py-2 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900"
                  >
                    Log Audit Sistem
                  </Link>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      )}

      {/* 4. MANAJEMEN PENGGUNA (Admin Only) */}
      {userRole === "admin" && (
        <Link
          to="/admin/users"
          onClick={onCloseMobile}
          className={`flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-all ${
            location.pathname === "/admin/users"
              ? "bg-emerald-50 text-[#059669]"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          } ${isCollapse ? "lg:justify-center lg:px-0" : ""}`}
          title="Kelola Data Pengguna"
        >
          <Users2 className="w-5 h-5 shrink-0" />
          <span className={isCollapse ? "lg:hidden" : "block"}>
            Data Pengguna
          </span>
        </Link>
      )}

      {/* 5. DATA AKADEMIK KAMPUS (Admin Only) */}
      {userRole === "admin" && (
        <div>
          <button
            onClick={() => toggleSubMenu("akademik")}
            className={`w-full flex items-center justify-between gap-3 py-2.5 px-3.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer ${
              isCollapse ? "lg:justify-center lg:px-0" : ""
            }`}
            title="Struktur Institusi Kampus"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FolderTree className="w-5 h-5 shrink-0" />
              <span className={isCollapse ? "lg:hidden" : "block truncate"}>
                Data Kampus
              </span>
            </div>
            {!isCollapse && (
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  openSubMenus["akademik"] ? "rotate-180 text-[#059669]" : ""
                }`}
              />
            )}
          </button>

          <AnimatePresence initial={false}>
            {openSubMenus["akademik"] &&
              (!isCollapse || window.innerWidth < 1024) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pl-9 mt-1 space-y-1 border-l border-slate-100 ml-6"
                >
                  <Link
                    to="/faculties"
                    onClick={onCloseMobile}
                    className="block py-2 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900"
                  >
                    Fakultas
                  </Link>
                  <Link
                    to="/prodi"
                    onClick={onCloseMobile}
                    className="block py-2 px-3 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900"
                  >
                    Program Studi
                  </Link>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      )}

      {/* 6. SETTING PROFILE GENERAL */}
      <Link
        to="/profile"
        onClick={onCloseMobile}
        className={`flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-all ${
          location.pathname === "/profile"
            ? "bg-emerald-50 text-[#059669]"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        } ${isCollapse ? "lg:justify-center lg:px-0" : ""}`}
        title="Pengaturan Profil"
      >
        <Settings className="w-5 h-5 shrink-0" />
        <span className={isCollapse ? "lg:hidden" : "block"}>Profil</span>
      </Link>
    </nav>
  );

  return (
    <>
      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpenMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-900 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white z-50 p-5 flex flex-col justify-between shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="space-y-5 flex-1">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-[#059669]" />
                    <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      E-Asset Navigasi
                    </h2>
                  </div>
                  <button
                    onClick={onCloseMobile}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {renderNavigationContent()}
              </div>
              <div className="pt-4 border-t">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 text-rose-600 bg-rose-50 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-transform"
                >
                  <LogOut className="w-4 h-4" /> Keluar Sistem
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR PANEL */}
      <aside
        className={`hidden lg:flex fixed top-16 bottom-0 left-0 bg-white border-r border-slate-200 p-4 flex-col justify-between shrink-0 overflow-y-auto z-20 transition-all duration-300 ${
          isCollapse ? "w-20" : "w-64"
        }`}
      >
        <div className="space-y-6 flex-1 py-1">{renderNavigationContent()}</div>

        <div className="space-y-4">
          {!isCollapse && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-xs space-y-1">
              <div className="flex items-center space-x-2">
                <History className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-bold text-slate-700">
                  Sirkulasi Log
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Pencatatan sirkulasi inventarisasi kampus berbasis pemindaian
                token QR Code.
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={onLogout}
              className={`w-full py-2.5 rounded-xl border border-rose-100 text-rose-600 bg-rose-50/40 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isCollapse
                  ? "px-0 justify-center border-none bg-transparent hover:bg-rose-50"
                  : "px-4"
              }`}
              title="Keluar dari Aplikasi E-Asset"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className={isCollapse ? "hidden" : "block"}>Keluar</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
