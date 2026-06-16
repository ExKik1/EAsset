import { Link } from "react-router-dom";
import {
  Edit,
  Trash2,
  Layers,
  RefreshCw,
  QrCode,
  Image as ImageIcon,
} from "lucide-react";
import { motion } from "motion/react";
import QRCode from "react-qr-code";

interface AsetData {
  id: number;
  kode_qr: string;
  nama_barang: string;
  kode_barang: string;
  kategori_aset_id: number;
  stok: number;
  status: "tersedia" | "dipinjam" | "rusak";
  deskripsi: string | null;
  foto_barang: string | null;
  kategori_aset?: { nama_kategori: string };
}

interface AsetTableProps {
  currentData: AsetData[];
  isFetchLoading: boolean;
  indexOfFirstItem: number;
  onOpenDeleteModal: (item: AsetData) => void;
}

export default function AsetTable({
  currentData,
  isFetchLoading,
  indexOfFirstItem,
  onOpenDeleteModal,
}: AsetTableProps) {
  const STORAGE_URL =
    import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage/";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "tersedia":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
            Tersedia
          </span>
        );
      case "dipinjam":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 rounded">
            Dipinjam
          </span>
        );
      case "rusak":
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 rounded">
            Rusak
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200 rounded">
            -
          </span>
        );
    }
  };

  return (
    /* Menambahkan sedikit padding vertikal ekstra di container luar jika data sedikit */
    <div className="overflow-x-auto w-full pb-4 ">
      <table className="w-full text-left border-collapse table-auto whitespace-nowrap">
        <thead className="relative bg-brand-gradient text-white overflow-hidden">
          {/* Efek Animasi Kilau (Shimmer) Sesuai Referensi */}
          <tr className="absolute inset-0 pointer-events-none overflow-hidden block w-full h-full">
            <td
              colSpan={9}
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
            <th className="py-3.5 px-4 w-20 text-center text-white">
              QR Label
            </th>
            <th className="py-3.5 px-4 w-16 text-center text-white">Foto</th>
            <th className="py-3.5 px-5 min-w-[200px] text-white">
              Informasi Barang
            </th>
            <th className="py-3.5 px-5 min-w-[150px] text-white">
              Kode Registrasi
            </th>
            <th className="py-3.5 px-5 min-w-[180px] text-white">
              Kategori Klasifikasi
            </th>
            <th className="py-3.5 px-5 w-16 text-center text-white">Stok</th>
            <th className="py-3.5 px-5 w-24 text-center text-white">Status</th>
            <th className="py-3.5 px-4 w-24 text-center text-white">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-slate-700 text-xs sm:text-sm">
          {isFetchLoading ? (
            <tr>
              <td
                colSpan={9}
                className="py-12 px-4 text-center text-slate-400 font-medium"
              >
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0b2f9f]" />
                  <span>Mendapatkan data dari server...</span>
                </div>
              </td>
            </tr>
          ) : currentData.length > 0 ? (
            currentData.map((item, index) => {
              {/* Logika untuk menentukan apakah item berada di setengah atas atau setengah bawah tabel */}
              const isHalfBottom = index >= currentData.length / 2;

              return (
                <tr
                  key={item.id}
                  /* Perbaikan Z-Index: tr diberikan relative & hover:z-50 agar popover naik ke atas baris lain */
                  className="hover:bg-slate-50/70 transition-colors relative hover:z-50"
                >
                  {/* No */}
                  <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-400 font-bold">
                    {indexOfFirstItem + index + 1}
                  </td>

                  {/* QR Label */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center">
                      <div
                        className="p-1 bg-white border border-slate-200 rounded shadow-2xs group relative cursor-pointer"
                        title="Perbesar Label QR"
                      >
                        <QRCode
                          value={item.kode_qr}
                          size={36}
                          viewBox={`0 0 250 250`}
                        />
                        
                        {/* Perbaikan Popover QR: Menggunakan kondisi isHalfBottom */}
                        <div
                          className={`absolute hidden group-hover:flex left-1/2 -translate-x-1/2 p-2 bg-white border border-slate-200 shadow-xl rounded z-50 transition-all
                            ${isHalfBottom ? "bottom-full mb-1" : "top-full mt-1"}`}
                        >
                          <QRCode value={item.kode_qr} size={80} />
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Foto Barang */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center">
                      {item.foto_barang ? (
                        <img
                          src={`${STORAGE_URL}${item.foto_barang}`}
                          alt={item.nama_barang}
                          className="w-10 h-10 object-cover rounded-md border border-slate-200/80 bg-slate-50 shadow-2xs"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/100x100?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300">
                          <ImageIcon className="w-4 h-4 stroke-[1.5]" />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Informasi Barang */}
                  <td className="py-3.5 px-5">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-semibold text-sm">
                        {item.nama_barang}
                      </span>
                      <span
                        className="text-[11px] text-slate-400 font-normal max-w-xs truncate"
                        title={item.deskripsi || ""}
                      >
                        {item.deskripsi || "Tidak ada keterangan deskripsi."}
                      </span>
                    </div>
                  </td>

                  {/* Kode Registrasi */}
                  <td className="py-3.5 px-5 font-semibold text-primary">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center">
                        <span className="bg-teal-200/40 px-2 py-0.5 rounded border border-slate-200 font-mono text-xs tracking-wider text-slate-600">
                          {item.kode_barang}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono font-normal">
                        <QrCode className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{item.kode_qr}</span>
                      </div>
                    </div>
                  </td>

                  {/* Kategori Klasifikasi */}
                  <td className="py-3.5 px-5 font-medium text-slate-800">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {item.kategori_aset?.nama_kategori || (
                          <span className="text-slate-300 italic">
                            Uncategorized
                          </span>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Stok */}
                  <td className="py-3.5 px-5 text-center font-mono font-medium text-slate-800">
                    {item.stok}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-5 text-center">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Aksi */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        to={`/assets/edit/${item.kode_qr}`}
                        className="p-1.5 text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition cursor-pointer"
                        title="Ubah Atribut Barang"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onOpenDeleteModal(item)}
                        className="p-1.5 text-rose-600 bg-rose-50 border border-rose-100 rounded hover:bg-rose-100 transition cursor-pointer"
                        title="Hapus Entitas Aset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={9}
                className="py-12 px-4 text-center text-slate-400 font-medium italic"
              >
                Data inventaris barang/aset tidak ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}