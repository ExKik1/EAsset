import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, ArrowLeft, PackageCheck, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

interface PeminjamanItem {
  id: number; kode_peminjaman: string; qty: number; waktu_pinjam: string;
  nama_peminjam: string; nama_barang: string; kode_qr: string; nim_nip: string | null;
}

export default function CheckinPage() {
  useDocumentTitle("Checkin Pengembalian — E-Asset");
  const navigate = useNavigate();

  const [aktif,     setAktif]     = useState<PeminjamanItem[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<PeminjamanItem | null>(null);
  const [kondisi,   setKondisi]   = useState<"bagus"|"rusak">("bagus");
  const [fotoBaru,  setFotoBaru]  = useState("");
  const [deskRusak, setDeskRusak] = useState("");
  const [submitting,setSubmitting]= useState(false);
  const [errMsg,    setErrMsg]    = useState("");
  const [success,   setSuccess]   = useState(false);
  const [search,    setSearch]    = useState("");

  const loadAktif = async () => {
    setLoading(true);
    try {
      const res = await api.get("/borrowing/history?status=aktif");
      setAktif(res.data.data ?? []);
    } catch { setAktif([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAktif(); }, []);

  const handleCheckin = async () => {
    if (!selected) return;
    if (kondisi === "rusak" && !fotoBaru.trim()) { setErrMsg("Keterangan foto/bukti kondisi rusak wajib diisi."); return; }
    setSubmitting(true); setErrMsg("");
    try {
      await api.post("/borrowing/checkin", {
        peminjaman_id: selected.id, kondisi_kembali: kondisi,
        foto_baru: kondisi === "rusak" ? fotoBaru : null,
        deskripsi_rusak: kondisi === "rusak" ? deskRusak : null,
      });
      setSuccess(true);
      await loadAktif();
    } catch (e: any) {
      setErrMsg(e?.response?.data?.message ?? "Gagal memproses checkin.");
    } finally { setSubmitting(false); }
  };

  const filtered = aktif.filter(p =>
    !search ||
    p.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
    p.kode_peminjaman.toLowerCase().includes(search.toLowerCase()) ||
    p.nama_peminjam.toLowerCase().includes(search.toLowerCase())
  );

  if (success && selected) return (
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        className="bg-white border border-emerald-200 rounded-2xl p-8 text-center max-w-sm w-full shadow-sm space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <PackageCheck className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-black text-slate-800">Checkin Berhasil!</h2>
        <p className="text-sm text-slate-500">
          <span className="font-bold text-slate-700">{selected.nama_barang}</span> telah dikembalikan dengan kondisi{" "}
          <span className={`font-bold ${kondisi === "bagus" ? "text-emerald-600" : "text-rose-600"}`}>{kondisi}</span>.
        </p>
        <div className="flex gap-3">
          <button onClick={() => { setSuccess(false); setSelected(null); setKondisi("bagus"); setFotoBaru(""); setDeskRusak(""); }}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">
            Checkin Lagi
          </button>
          <button onClick={() => navigate("/borrowing/history")}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#0b2f9f] to-[#00809d] text-white rounded-xl text-sm font-bold hover:opacity-90 transition">
            Riwayat
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col gap-5 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 transition">
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-800">Checkin Pengembalian</h1>
          <p className="text-xs text-slate-500">Pilih transaksi aktif untuk diproses pengembaliannya</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari peminjam, barang, atau kode peminjaman…"
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daftar aktif */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 font-bold text-sm text-slate-700">
            Peminjaman Aktif ({filtered.length})
          </div>
          {loading ? (
            <div className="py-10 flex justify-center"><div className="w-8 h-8 border-4 border-[#0b2f9f]/20 border-t-[#0b2f9f] rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">Tidak ada peminjaman aktif</div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
              {filtered.map(p => (
                <button key={p.id} onClick={() => { setSelected(p); setKondisi("bagus"); setFotoBaru(""); setDeskRusak(""); setErrMsg(""); }}
                  className={`w-full text-left px-5 py-4 hover:bg-slate-50 transition ${selected?.id === p.id ? "bg-blue-50" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{p.nama_barang}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{p.nama_peminjam} · {p.qty} unit</p>
                      <p className="text-[10px] font-mono text-[#0b2f9f] mt-0.5">{p.kode_peminjaman}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">
                        {new Date(p.waktu_pinjam).toLocaleDateString("id-ID", { day:"2-digit", month:"short" })}
                      </span>
                      {selected?.id === p.id && (
                        <div className="w-2 h-2 bg-[#0b2f9f] rounded-full ml-auto mt-1" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form checkin */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div key="checkin-form" initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4 self-start">
              <h2 className="font-bold text-slate-700">Proses Pengembalian</h2>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800 text-sm">{selected.nama_barang}</p>
                <p className="text-xs text-slate-500">{selected.nama_peminjam} · {selected.qty} unit</p>
                <p className="text-[10px] font-mono text-[#0b2f9f]">{selected.kode_peminjaman}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">Kondisi Barang Kembali *</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["bagus","rusak"] as const).map(k => (
                    <button key={k} type="button" onClick={() => setKondisi(k)}
                      className={`py-2.5 rounded-xl text-sm font-bold border-2 transition ${kondisi === k
                        ? k === "bagus" ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-rose-400 bg-rose-50 text-rose-700"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                      {k === "bagus" ? "✓ Bagus" : "⚠ Rusak"}
                    </button>
                  ))}
                </div>
              </div>

              {kondisi === "rusak" && (
                <AnimatePresence>
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} className="space-y-3 overflow-hidden">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Keterangan / Bukti Kerusakan *</label>
                      <input type="text" value={fotoBaru} onChange={e => setFotoBaru(e.target.value)}
                        placeholder="Deskripsikan atau link foto kerusakan"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Detail Kerusakan</label>
                      <textarea rows={3} value={deskRusak} onChange={e => setDeskRusak(e.target.value)}
                        placeholder="Jelaskan kerusakan yang terjadi…"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {errMsg && (
                <div className="flex items-center gap-2 bg-rose-50 text-rose-700 text-xs p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" /><span>{errMsg}</span>
                </div>
              )}

              <button onClick={handleCheckin} disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-[#0b2f9f] to-[#00809d] text-white rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-50">
                {submitting ? "Memproses..." : "Konfirmasi Pengembalian"}
              </button>
            </motion.div>
          ) : (
            <motion.div key="checkin-empty" initial={{ opacity:0 }} animate={{ opacity:1 }}
              className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Pilih transaksi di sebelah kiri</p>
                <p className="text-xs mt-1">untuk memproses pengembalian</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
