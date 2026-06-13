import {
  FileText,
  Lock,
  Unlock,
  HardDrive,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

interface LogData {
  id: number;
  file_name: string;
  file_size: string;
  action_type: "encrypt" | "decrypt";
  status: "success" | "failed";
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface HistoryLogTableProps {
  currentLogs: LogData[];
  isFetchLoading: boolean;
  indexOfFirstItem: number;
}

export default function HistoryLogTable({
  currentLogs,
  isFetchLoading,
  indexOfFirstItem,
}: HistoryLogTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-info-border text-slate-400 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider">
            <th className="py-3 px-3 bg-brand-gradient bg-clip-text text-transparent sm:px-4 w-12 text-center">
              No
            </th>
            <th className="py-3 px-3 bg-brand-gradient bg-clip-text text-transparent sm:px-4 min-w-[180px]">
              Nama File
            </th>
            <th className="py-3 px-3 bg-brand-gradient bg-clip-text text-transparent sm:px-4 w-28 sm:w-32">
              Tipe Aksi
            </th>
            <th className="py-3 px-3 bg-brand-gradient bg-clip-text text-transparent sm:px-4 w-24 sm:w-28">
              Ukuran
            </th>
            <th className="py-3 px-3 bg-brand-gradient bg-clip-text text-transparent sm:px-4 w-24 sm:w-28">
              Status
            </th>
            <th className="py-3 px-3 bg-brand-gradient bg-clip-text text-transparent sm:px-4 w-36 sm:w-40">
              Tanggal & Waktu
            </th>
            <th className="py-3 px-3 bg-brand-gradient bg-clip-text text-transparent sm:px-4 w-28 sm:w-36">
              IP Address
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700 text-xs sm:text-sm">
          {isFetchLoading ? (
            [...Array(1)].map((_, i) => (
              <tr key={i} className="animate-pulse bg-white">
                <td
                  colSpan={7}
                  className="py-5 px-4 text-center text-slate-400 text-xs"
                >
                  Sedang memuat baris data dari server...
                </td>
              </tr>
            ))
          ) : currentLogs.length > 0 ? (
            currentLogs.map((log, index) => (
              <tr
                key={log.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="py-3.5 px-3 sm:px-4 text-center font-mono text-xs text-slate-400 font-bold">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="py-3.5 px-3 sm:px-4 font-medium max-w-xs sm:max-w-md">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span
                      className="truncate block text-[12px] lg:text-[14px] font-semibold text-slate-800"
                      title={log.file_name}
                    >
                      {log.file_name}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-3 sm:px-4">
                  {log.action_type === "encrypt" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 border border-blue-100 text-[#0b2f9f]">
                      <Lock className="w-2.5 h-2.5" /> Encrypt
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 border border-cyan-100 text-[#00809d]">
                      <Unlock className="w-2.5 h-2.5" /> Decrypt
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-3 sm:px-4 font-mono text-xs text-slate-500 font-semibold">
                  <div className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-slate-400/70" />
                    {log.file_size}
                  </div>
                </td>
                <td className="py-3.5 px-3 sm:px-4">
                  {log.status === "success" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700">
                      <CheckCircle className="w-2.5 h-2.5" /> Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-700">
                      <XCircle className="w-2.5 h-2.5" /> Failed
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-slate-500 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400/70 shrink-0" />
                    <span>
                      {new Date(log.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {new Date(log.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        WIB
                      </span>
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-3 sm:px-4 font-mono text-xs text-slate-400 font-medium">
                  {log.ip_address || "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-white">
              <td
                colSpan={7}
                className="py-12 px-4 text-center text-slate-400 font-medium"
              >
                <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-2">
                  <FileText className="w-8 h-8 text-slate-400/70" />
                  <p className="text-sm bg-brand-gradient bg-clip-text text-transparent font-bold">
                    Data Log Tidak Ditemukan
                  </p>
                  <p className="text-xs text-slate-400">
                    Tidak ada riwayat aktivitas yang cocok dengan kriteria
                    pencarian Anda.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
