import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, History, RefreshCw, Filter, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

interface HistoryItem {
  id: number; kode_peminjaman: string; qty: number; jaminan: string;
  waktu_pinjam: string; waktu_kembali: string | null; kondisi_kembali: string | null;
  deskripsi_pinjam: string | null; deskripsi_rusak: string | null;
  nama_peminjam: string; nim_nip: string | null;
  nama_barang: string; kode_qr: string; nama_kategori: string;
  diproses_oleh_nama: string | null;
}

export default function HistoryPage() {
  useDocumentTitle("Riwayat Sirkulasi — E-Asset");
  const { user } = useAuth();
  const navigate  = useNavigate();
  const isStaff   = user?.role === "admin" || user?.role === "kerumahtanggaan";

  const [data,    setData]    = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<"semua"|"aktif"|"kembali">("semua");
  const [search,  setSearch]  = useState("");
  const [expanded,setExpanded]= useState<number | null>(null);

  const load = async (f = filter) => {
    setLoading(true);
    try {
      const params = f !== "semua" ? `?status=${f}` : "";
      const res = await api.get(`/borrowing/history${params}`);
      setData(res.data.data ?? []);
    } catch { setData([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleFilter = (f: typeof filter) => { setFilter(f); load(f); };

  const filtered = data.filter(d =>
    !search ||
    d.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
    d.kode_peminjaman.toLowerCase().includes(search.toLowerCase()) ||
    d.nama_peminjam.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col gap-5 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 transition">
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-black text-slate-800">Riwayat Sirkulasi</h1>
          <p className="text-xs text-slate-500">
            {isStaff ? "Semua riwayat peminjaman aset kampus" : "Riwayat peminjaman Anda"}
          </p>
        </div>
        <button onClick={() => load()} className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-500">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari barang, peminjam, kode…"
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/30"
        />
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {(["semua","aktif","kembali"] as const).map(f => (
            <button key={f} onClick={() => handleFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                filter === f ? "bg-white shadow-sm text-[#0b2f9f]" : "text-slate-500 hover:text-slate-700"}`}>
              {f === "aktif" ? "Aktif" : f === "kembali" ? "Kembali" : "Semua"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-[#0b2f9f]/20 border-t-[#0b2f9f] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Tidak ada riwayat ditemukan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => {
            const isKembali = !!item.waktu_kembali;
            return (
              <motion.div key={item.id}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.03 }}
                className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition ${
                  expanded === item.id ? "border-[#0b2f9f]/30" : "border-slate-200"}`}>
                <button className="w-full text-left px-5 py-4 hover:bg-slate-50 transition"
                  onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl shrink-0 ${isKembali ? "bg-emerald-100" : "bg-amber-100"}`}>
                        {isKembali
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          : <Clock className="w-4 h-4 text-amber-600" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{item.nama_barang}</p>
                        {isStaff && <p className="text-xs text-slate-500">{item.nama_peminjam}</p>}
                        <p className="text-[10px] font-mono text-slate-400">{item.kode_peminjaman}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isKembali ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {isKembali ? "Kembali" : "Dipinjam"}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(item.waktu_pinjam).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"2-digit"})}
                      </p>
                    </div>
                  </div>
                </button>

                {expanded === item.id && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
                    className="border-t border-slate-100 px-5 py-4 bg-slate-50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      {[
                        ["Kode QR", item.kode_qr],
                        ["Kategori", item.nama_kategori],
                        ["Qty", `${item.qty} unit`],
                        ["Jaminan", item.jaminan],
                        ["Waktu Pinjam", new Date(item.waktu_pinjam).toLocaleString("id-ID")],
                        isKembali && ["Waktu Kembali", new Date(item.waktu_kembali!).toLocaleString("id-ID")],
                        isKembali && ["Kondisi", item.kondisi_kembali ?? "-"],
                        isStaff && isKembali && ["Diproses Oleh", item.diproses_oleh_nama ?? "-"],
                        item.deskripsi_pinjam && ["Keperluan", item.deskripsi_pinjam],
                        item.deskripsi_rusak  && ["Ket. Rusak", item.deskripsi_rusak],
                      ].filter(Boolean).map(([label, value], idx) => (
                        <div key={idx} className="bg-white rounded-xl p-3 border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                          <p className="font-semibold text-slate-700 mt-0.5 break-words">{value}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
