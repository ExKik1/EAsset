import { FileText, User, Monitor, Calendar, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface LogAuditItem {
  id: number;
  user_id: number | null;
  aksi: string;
  deskripsi: string;
  alamat_ip: string | null;
  created_at: string;
  user?: {
    name: string;
    email: string;
  } | null;
}

interface LogAuditTableProps {
  currentData: LogAuditItem[];
  isFetchLoading: boolean;
  indexOfFirstItem: number;
}

export default function LogAuditTable({
  currentData,
  isFetchLoading,
  indexOfFirstItem,
}: LogAuditTableProps) {
  // Generator Warna Lencana Aksi Komparatif
  const getActionBadge = (aksi: string) => {
    const actionUpper = aksi.toUpperCase();
    if (actionUpper.includes("CREATE") || actionUpper.includes("TAMBAH")) {
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    } else if (actionUpper.includes("UPDATE") || actionUpper.includes("UBAH")) {
      return "bg-blue-100 text-blue-800 border-blue-200";
    } else if (actionUpper.includes("DELETE") || actionUpper.includes("HAPUS")) {
      return "bg-rose-100 text-rose-800 border-rose-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  // Format Tanggal ISO Ke readable format lokal
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse table-auto">
        <thead className="relative bg-brand-gradient text-white overflow-hidden">
          <tr className="absolute inset-0 pointer-events-none overflow-hidden block w-full h-full">
            <td colSpan={5} className="absolute inset-0 p-0 block w-full h-full">
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                  opacity: [0, 0.15, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </td>
          </tr>

          <tr className="border-b border-white/10 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider">
            <th className="py-3.5 px-4 w-12 text-center text-white">No</th>
            <th className="py-3.5 px-4 w-32 text-white">Aksi</th>
            <th className="py-3.5 px-4 w-48 text-white">Pelaksana (User)</th>
            <th className="py-3.5 px-4 min-w-[300px] text-white">Deskripsi Kronologi</th>
            <th className="py-3.5 px-4 w-44 text-white">Metrik Keamanan</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-slate-700 text-xs sm:text-sm">
          {isFetchLoading ? (
            <tr>
              <td colSpan={5} className="py-8 px-4 text-center text-slate-400 font-medium">
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0b2f9f]" />
                  Sinkronisasi catatan aktivitas log server...
                </div>
              </td>
            </tr>
          ) : currentData.length > 0 ? (
            currentData.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Kolom Nomor Indeks */}
                <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-400 font-bold">
                  {indexOfFirstItem + index + 1}
                </td>

                {/* Kolom Lencana Tipe Aksi */}
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded border text-[11px] font-mono tracking-wide font-bold uppercase ${getActionBadge(item.aksi)}`}>
                    {item.aksi}
                  </span>
                </td>

                {/* Kolom Identitas User */}
                <td className="py-3.5 px-4 font-medium text-slate-800">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800 leading-none mb-0.5">
                        {item.user ? item.user.name : <span className="text-slate-400 italic font-normal">System / Visitor</span>}
                      </p>
                      {item.user && <p className="text-[10px] text-slate-400 font-mono leading-none">{item.user.email}</p>}
                    </div>
                  </div>
                </td>

                {/* Kolom Narasi Deskripsi */}
                <td className="py-3.5 px-4 text-slate-600 font-medium leading-relaxed">
                  <div className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span className="whitespace-pre-line">{item.deskripsi}</span>
                  </div>
                </td>

                {/* Kolom Informasi IP & Timestamp */}
                <td className="py-3.5 px-4 text-slate-500">
                  <div className="space-y-1 text-[11px] font-medium font-mono">
                    <div className="flex items-center gap-1.5" title="Alamat IP">
                      <Monitor className="w-3 h-3 text-slate-400" />
                      <span>{item.alamat_ip || "0.0.0.0 (Unknown)"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400" title="Waktu Kejadian">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{formatDateTime(item.created_at)}</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-12 px-4 text-center text-slate-400 font-medium">
                Catatan historis log audit kosong atau tidak ditemukan kriteria pencarian yang cocok.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}