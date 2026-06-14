import { Link } from "react-router-dom";
import { Users, RefreshCw, Plus } from "lucide-react";

interface UserHeaderProps {
  isFetchLoading: boolean;
  onRefresh: () => void;
}

export default function UserHeader({
  isFetchLoading,
  onRefresh,
}: UserHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 border border-info-border shadow-sm">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-[#0b2f9f]" />
          <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#0b2f9f] to-[#00809d] bg-clip-text text-transparent tracking-tight">
            Master Data Pengguna Sistem
          </h3>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm">
          Kelola hak akses otentikasi, data identitas personel, kredensial, dan
          berkas foto profil pengguna.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={isFetchLoading}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-sm cursor-pointer disabled:opacity-50 rounded-md"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetchLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
        <Link
          to="/data-users/create"
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-brand-gradient transition shadow-sm cursor-pointer rounded-md"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Pengguna
        </Link>
      </div>
    </div>
  );
}
