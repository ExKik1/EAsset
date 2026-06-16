import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Package, 
  QrCode, 
  Layers, 
  Boxes, 
  CheckCircle2, 
  FileText, 
  Edit3,
  Image as ImageIcon 
} from "lucide-react";
import { useAuthSession } from "../../../hooks/useAuthSession";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { NotificationToast } from "../../../components/ui/NotificationToast";
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

export default function AssetDetail() {
  useDocumentTitle("Detail Informasi Aset");
  const { kode_qr } = useParams<{ kode_qr: string }>();
  const { token } = useAuthSession();

  const [asset, setAsset] = useState<AsetData | null>(null);
  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [toastType, setToastType] = useState<"success" | "danger">("success");

  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage/";

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        if (kode_qr) {
          const res = await api.get(`/assets/${kode_qr}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAsset(res.data.data);
        }
      } catch (err) {
        console.error("Gagal memuat detail data aset", err);
        setToastType("danger");
        setToastMessages(["Gagal mengambil informasi komparatif dari logistik server."]);
      }
    };

    if (token) fetchAssetData();
  }, [token, kode_qr]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "tersedia":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
            Tersedia
          </span>
        );
      case "dipinjam":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
            Dipinjam
          </span>
        );
      case "rusak":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 rounded-md">
            Rusak
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200 rounded-md">
            -
          </span>
        );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout>
      <NotificationToast
        messages={toastMessages}
        type={toastType}
        onClose={() => setToastMessages([])}
      />

      <div className="bg-slate-50 text-slate-900 font-sans flex flex-col min-h-screen w-full">
        {asset ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col w-full p-4 md:p-8 space-y-6 max-w-7xl mx-auto"
          >
            {/* Header Panel */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 border border-slate-200/80 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-5 h-5 text-[#0b2f9f]" />
                  <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#0b2f9f] to-[#00809d] bg-clip-text text-transparent tracking-tight">
                    Deskripsi Detail Aset
                  </h3>
                </div>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Informasi menyeluruh spesifikasi logistik barang, registrasi kode, serta kondisi saat ini.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Link
                  to={`/assets/edit/${asset.kode_qr}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-brand-gradient hover:brightness-105 transition rounded-md shadow-xs cursor-pointer h-fit"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Ubah Data Aset</span>
                </Link>

                <Link
                  to="/assets"
                  className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition rounded-md shadow-xs cursor-pointer h-fit"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </Link>
              </div>
            </motion.div>

            {/* Main Info Section Container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Kolom Kiri: Visualisasi Foto & QR Code Stand */}
              <div className="space-y-6 lg:col-span-1">
                {/* Panel Foto Barang */}
                <motion.div variants={itemVariants} className="bg-white p-5 border border-slate-200/60 shadow-xs flex flex-col items-center">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 self-start">Visualisasi Dokumentasi</h4>
                  {asset.foto_barang ? (
                    <img
                      src={`${STORAGE_URL}${asset.foto_barang}`}
                      alt={asset.nama_barang}
                      className="w-full aspect-square object-cover rounded-lg border border-slate-100 bg-slate-50 shadow-inner"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image+Found";
                      }}
                    />
                  ) : (
                    <div className="w-full aspect-square rounded-lg border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-300 gap-2">
                      <ImageIcon className="w-10 h-10 stroke-[1.2]" />
                      <span className="text-xs font-medium text-slate-400">Berkas foto tidak tersedia</span>
                    </div>
                  )}
                </motion.div>

                {/* Panel QR Code Identifikasi */}
                <motion.div variants={itemVariants} className="bg-white p-5 border border-slate-200/60 shadow-xs flex flex-col items-center">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 self-start">Kode QR Registrasi</h4>
                  <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-xs mb-3">
                    <QRCode value={asset.kode_qr} size={140} viewBox={`0 0 250 250`} />
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded border border-slate-200 tracking-wide select-all">
                    {asset.kode_qr}
                  </span>
                </motion.div>
              </div>

              {/* Kolom Kanan: Atribut Detail Data Logistik */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div variants={itemVariants} className="bg-white p-6 border border-slate-200/60 shadow-xs space-y-6">
                  
                  {/* Blok Judul Utama */}
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-snug">
                      {asset.nama_barang}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>Kategori: </span>
                        <span className="text-slate-800 font-bold">
                          {asset.kategori_aset?.nama_kategori || "Uncategorized"}
                        </span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <QrCode className="w-3.5 h-3.5 text-slate-400" />
                        <span>ID Sistem: </span>
                        <span className="text-slate-800 font-mono font-bold">{asset.kode_barang}</span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Ringkasan Status & Inventori */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 mb-2 text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                        <h5 className="text-[11px] font-bold uppercase tracking-wider">Kondisi / Status</h5>
                      </div>
                      <div>{getStatusBadge(asset.status)}</div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 mb-1 text-slate-400">
                        <Boxes className="w-4 h-4 text-slate-400" />
                        <h5 className="text-[11px] font-bold uppercase tracking-wider">Ketersediaan Stok</h5>
                      </div>
                      <p className="text-xl font-semibold text-slate-800 font-mono">
                        {asset.stok} <span className="text-xs font-sans text-slate-400 font-medium">Unit</span>
                      </p>
                    </div>
                  </div>

                  {/* Keterangan Deskripsi Lengkap */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <h5 className="text-[11px] font-bold uppercase tracking-wider">Deskripsi / Catatan Audit</h5>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 min-h-[120px]">
                      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                        {asset.deskripsi || "Tidak ada keterangan deskripsi tambahan untuk entitas inventaris barang ini."}
                      </p>
                    </div>
                  </div>

                </motion.div>
              </div>

            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-32">
            <p className="text-slate-400 text-sm italic">Mendapatkan data spesifikasi aset...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}