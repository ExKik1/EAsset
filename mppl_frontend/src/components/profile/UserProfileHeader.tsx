import { Link } from "react-router-dom";
import { ArrowLeft, User, RefreshCw } from "lucide-react";

interface UserProfileHeaderProps {
  isFetchLoading: boolean;
  onRefresh: () => void;
}

export default function UserProfileHeader({
  isFetchLoading,
  onRefresh,
}: UserProfileHeaderProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 border border-info-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-[#0b2f9f]" />
            <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#0b2f9f] to-[#00809d] bg-clip-text text-transparent tracking-tight">
              User Profile Configuration
            </h3>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">
            Kelola data kredensial personal, keamanan sandi enkripsi, dan
            kontrol privasi akun Anda.
          </p>
        </div>

        <div className="shrink-0 flex items-center">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetchLoading}
            className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-brand-gradient transition shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-white ${
                isFetchLoading ? "animate-spin text-[#0b2f9f]" : ""
              }`}
            />
            {isFetchLoading ? "Sinkronisasi..." : "Muat Ulang Profil"}
          </button>
        </div>
      </div>
    </>
  );
}
