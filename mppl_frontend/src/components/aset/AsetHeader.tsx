import { Link } from "react-router-dom";
import { Plus, RefreshCw, Box } from "lucide-react";

interface AsetHeaderProps {
  isFetchLoading: boolean;
  onRefresh: () => void;
}

export default function AsetHeader({
  isFetchLoading,
  onRefresh,
}: AsetHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 border border-info-border shadow-sm">
      <div>
        <div className="flex items-center gap-2 mb-1">
          {/* Ikon diselaraskan dengan warna utama biru navigasi */}
          <Box className="w-5 h-5 text-[#0b2f9f]" />
          <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#0b2f9f] to-[#00809d] bg-clip-text text-transparent tracking-tight">
            Manajemen Master Aset & Logistik
          </h3>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm">
          Kelola inventarisasi barang, pemantauan stok, status unit, serta
          integrasi pelacakan QR Code.
        </p>
      </div>

      {/* Kontainer Tombol Aksi yang Sinkron dengan Desain Kategori */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={isFetchLoading}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-sm rounded-md cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetchLoading ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>

        <Link
          to="/assets/create"
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-brand-gradient transition shadow-sm rounded-md cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Aset Baru</span>
        </Link>
      </div>
    </div>
  );
}