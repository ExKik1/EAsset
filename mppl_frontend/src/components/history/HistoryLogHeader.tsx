import { Link } from "react-router-dom";
import { ArrowLeft, History, RefreshCw } from "lucide-react";

interface HistoryLogHeaderProps {
  isFetchLoading: boolean;
  onRefresh: () => void;
}

export default function HistoryLogHeader({
  isFetchLoading,
  onRefresh,
}: HistoryLogHeaderProps) {
  return (
    <>
      <div className="flex justify-start">
        <Link
          to="/main"
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-slate-600 bg-white hover:text-[#0b2f9f] border border-info-border hover:border-[#0b2f9f]/30 shadow-sm transition-all duration-200 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Kembali ke Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 border border-info-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-[#0b2f9f]" />
            <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#0b2f9f] to-[#00809d] bg-clip-text text-transparent tracking-tight">
              Cryptographic Audit Logs
            </h3>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">
            Riwayat lengkap aktivitas enkripsi dan dekripsi berkas Anda pada
            sistem.
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isFetchLoading}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-brand-gradient transition shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetchLoading ? "animate-spin" : ""}`}
          />
          Refresh Data
        </button>
      </div>
    </>
  );
}
