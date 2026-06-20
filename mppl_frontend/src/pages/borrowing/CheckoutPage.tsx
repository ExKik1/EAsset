import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { QrCode, PackageCheck, AlertCircle, CheckCircle2, Info, ArrowLeft } from "lucide-react";
import api from "../../utils/api";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useAuth } from "../../context/AuthContext";

interface AsetInfo {
  id: number; kode_qr: string; kode_barang: string; nama_barang: string;
  kategori: string; stok: number; status: string; status_label: string; deskripsi: string | null;
}

export default function CheckoutPage() {
  useDocumentTitle("Ajukan Peminjaman — E-Asset");
  const { user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const prefillQr = (location.state as any)?.kode_qr ?? "";

  const [step,     setStep]     = useState<"scan" | "form" | "success">("scan");
  const [qrInput,  setQrInput]  = useState(prefillQr);
  const [aset,     setAset]     = useState<AsetInfo | null>(null);
  const [scanErr,  setScanErr]  = useState("");
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errMsg,   setErrMsg]   = useState("");
  const [kodeResult, setKodeResult] = useState("");

  const [form, setForm] = useState({ qty: 1, jaminan: "", deskripsi: "" });

  // Auto-fetch if prefilled QR from dashboard
  useEffect(() => {
    if (prefillQr) handleScanLookup(prefillQr);
  }, []);

  const handleScanLookup = async (kode = qrInput) => {
    if (!kode.trim()) return;
    setScanning(true); setScanErr(""); setAset(null);
    try {
      const res = await api.get(`/scan-qr/${encodeURIComponent(kode.trim())}`);
      const data: AsetInfo = res.data.data;
      if (data.status === "rusak")    { setScanErr(`Aset "${data.nama_barang}" berstatus rusak, tidak bisa dipinjam.`); return; }
      if (data.stok <= 0)             { setScanErr(`Stok aset "${data.nama_barang}" habis.`); return; }
      if (data.status === "dipinjam" && data.stok <= 0) { setScanErr(`Aset "${data.nama_barang}" sedang dipinjam penuh.`); return; }
      setAset(data);
      setStep("form");
    } catch (e: any) {
      setScanErr(e?.response?.data?.message ?? "QR tidak ditemukan dalam sistem.");
    } finally { setScanning(false); }
  };

  const genKode = () => `PJM-${Date.now()}-${user?.id ?? 0}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aset) return;
    if (!form.jaminan.trim()) { setErrMsg("Jaminan wajib diisi."); return; }
    if (form.qty < 1 || form.qty > aset.stok) { setErrMsg(`Qty harus antara 1–${aset.stok}.`); return; }
    setSubmitting(true); setErrMsg("");
    const kode = genKode();
    try {
      await api.post("/borrowing/checkout", {
        kode_qr: aset.kode_qr, kode_barang: aset.kode_barang,
        kode_peminjaman: kode, qty: form.qty,
        jaminan: form.jaminan, deskripsi_pinjam: form.deskripsi,
      });
      setKodeResult(kode);
      setStep("success");
    } catch (e: any) {
      setErrMsg(e?.response?.data?.message ?? "Gagal memproses peminjaman.");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-4 sm:p-6 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 transition">
          <ArrowLeft className="w-4 h-4 text-slate-500" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-800">Ajukan Peminjaman</h1>
          <p className="text-xs text-slate-500">Scan QR atau masukkan kode barang untuk meminjam</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 — Scan / Input QR */}
        {step === "scan" && (
          <motion.div key="scan" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-700">
                <QrCode className="w-5 h-5 text-[#0b2f9f]" />
                <span className="font-bold">Masukkan Kode QR Barang</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text" value={qrInput} onChange={e => setQrInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleScanLookup()}
                  placeholder="Contoh: QR-ELEK-0001"
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/30"
                />
                <button
                  onClick={() => handleScanLookup()} disabled={!qrInput.trim() || scanning}
                  className="px-5 py-3 bg-gradient-to-r from-[#0b2f9f] to-[#00809d] text-white rounded-xl font-bold text-sm disabled:opacity-40 hover:opacity-90 transition"
                >
                  {scanning ? "..." : "Cari"}
                </button>
              </div>

              <AnimatePresence>
                {scanErr && (
                  <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
                    className="flex items-start gap-2 bg-rose-50 text-rose-700 text-xs p-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{scanErr}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-blue-50 rounded-xl p-3 flex gap-2 text-xs text-blue-700">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Atau gunakan fitur <strong>Scan QR Aset</strong> di menu sidebar untuk memindai via kamera.</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2 — Form Peminjaman */}
        {step === "form" && aset && (
          <motion.div key="form" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="space-y-4">
            {/* Aset info card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-800 text-sm">{aset.nama_barang}</p>
                <p className="text-emerald-600 text-xs mt-0.5">QR: <span className="font-mono">{aset.kode_qr}</span> · {aset.kategori}</p>
                <p className="text-emerald-600 text-xs">Stok tersedia: <strong>{aset.stok}</strong> unit</p>
              </div>
              <button onClick={() => { setStep("scan"); setAset(null); setScanErr(""); }}
                className="ml-auto text-xs text-emerald-600 hover:underline">Ganti</button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-slate-700">Detail Peminjaman</h2>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Jumlah (Qty) *</label>
                <input type="number" min={1} max={aset.stok} value={form.qty}
                  onChange={e => setForm(f => ({...f, qty: Number(e.target.value)}))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Jaminan *</label>
                <input type="text" value={form.jaminan}
                  onChange={e => setForm(f => ({...f, jaminan: e.target.value}))}
                  placeholder="Contoh: KTM, SIM, Kartu Pelajar"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Keperluan (opsional)</label>
                <textarea rows={3} value={form.deskripsi}
                  onChange={e => setForm(f => ({...f, deskripsi: e.target.value}))}
                  placeholder="Tuliskan keperluan peminjaman…"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/30 resize-none"
                />
              </div>

              {errMsg && (
                <div className="flex items-center gap-2 bg-rose-50 text-rose-700 text-xs p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" /><span>{errMsg}</span>
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="w-full py-3 bg-gradient-to-r from-[#0b2f9f] to-[#00809d] text-white rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-50">
                {submitting ? "Memproses..." : "Ajukan Peminjaman"}
              </button>
            </form>
          </motion.div>
        )}

        {/* STEP 3 — Success */}
        {step === "success" && (
          <motion.div key="success" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
            className="bg-white border border-emerald-200 rounded-2xl p-8 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <PackageCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-black text-slate-800">Peminjaman Berhasil!</h2>
            <p className="text-sm text-slate-500">Simpan kode peminjaman Anda untuk pengembalian.</p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Kode Peminjaman</p>
              <p className="font-mono font-black text-[#0b2f9f] text-lg">{kodeResult}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setStep("scan"); setAset(null); setQrInput(""); setKodeResult(""); setForm({qty:1,jaminan:"",deskripsi:""}); }}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                Pinjam Lagi
              </button>
              <button onClick={() => navigate("/borrowing/history")}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#0b2f9f] to-[#00809d] text-white rounded-xl text-sm font-bold hover:opacity-90 transition">
                Lihat Riwayat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
