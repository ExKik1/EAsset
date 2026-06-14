import { Link } from "react-router-dom";
import { Edit2, Trash2, School, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface Fakultas {
  id: number;
  kode_fakultas: string;
  nama_fakultas: string;
  deskripsi: string | null;
  created_at: string;
}

interface FakultasTableProps {
  currentData: Fakultas[];
  isFetchLoading: boolean;
  indexOfFirstItem: number;
  onOpenDeleteModal: (item: Fakultas) => void;
}

export default function FakultasTable({
  currentData,
  isFetchLoading,
  indexOfFirstItem,
  onOpenDeleteModal,
}: FakultasTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse table-auto">
        <thead className="relative bg-brand-gradient text-white overflow-hidden">
          <tr className="absolute inset-0 pointer-events-none overflow-hidden block w-full h-full">
            <td
              colSpan={5}
              className="absolute inset-0 p-0 block w-full h-full"
            >
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
            <th className="py-3.5 px-4 w-40 text-white">Kode Fakultas</th>
            <th className="py-3.5 px-4 min-w-[200px] text-white">
              Nama Fakultas
            </th>
            <th className="py-3.5 px-4 min-w-[250px] text-white">Deskripsi</th>
            <th className="py-3.5 px-4 w-28 text-center text-white">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-slate-700 text-xs sm:text-sm">
          {isFetchLoading ? (
            <tr>
              <td
                colSpan={5}
                className="py-8 px-4 text-center text-slate-400 font-medium"
              >
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0b2f9f]" />
                  Mendapatkan data dari server...
                </div>
              </td>
            </tr>
          ) : currentData.length > 0 ? (
            currentData.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-400 font-bold">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="py-3.5 px-4 font-semibold text-primary">
                  <span className="bg-teal-200/40 px-2 py-0.5 rounded border border-slate-200 font-mono text-xs tracking-wider">
                    {item.kode_fakultas}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-800">
                  <div className="flex items-center gap-2">
                    <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.nama_fakultas}</span>
                  </div>
                </td>
                <td
                  className="py-3.5 px-4 text-slate-500 font-medium max-w-xs truncate"
                  title={item.deskripsi || ""}
                >
                  {item.deskripsi || (
                    <span className="text-slate-300 italic">
                      Tidak ada deskripsi
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Link
                      to={`/faculties/edit/${item.id}`}
                      className="p-1.5 text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition cursor-pointer"
                      title="Ubah Data"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onOpenDeleteModal(item)}
                      className="p-1.5 text-rose-600 bg-rose-50 border border-rose-100 rounded hover:bg-rose-100 transition cursor-pointer"
                      title="Hapus Data"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="py-12 px-4 text-center text-slate-400 font-medium"
              >
                Data master fakultas kosong atau tidak ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
