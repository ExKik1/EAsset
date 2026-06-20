import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Camera,
  CameraOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Package,
  Tag,
  Layers,
  Hash,
  BarChart3,
  Clock,
  Info,
  ScanLine,
  X,
} from "lucide-react";
import api from "../../utils/api";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

// ─── Type Definitions ─────────────────────────────────────────────────────────
interface AssetResult {
  id: number;
  kode_qr: string;
  kode_barang: string;
  nama_barang: string;
  kategori: string;
  kode_kategori: string;
  foto_barang: string | null;
  stok: number;
  status: string;
  status_label: string;
  deskripsi: string | null;
  created_at: string;
  updated_at: string;
}

type ScanStatus = "idle" | "scanning" | "found" | "not_found" | "error";

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: string; label: string }> = ({
  status,
  label,
}) => {
  const styles: Record<string, string> = {
    tersedia: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dipinjam: "bg-amber-100 text-amber-700 border-amber-200",
    rusak: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
        styles[status] ?? "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MainContent() {
  useDocumentTitle("Scan QR Aset");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const jsQRRef = useRef<((data: Uint8ClampedArray, w: number, h: number) => { data: string } | null) | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [manualCode, setManualCode] = useState("");
  const [assetResult, setAssetResult] = useState<AssetResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [lastScanned, setLastScanned] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [jsQRLoaded, setJsQRLoaded] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  // ── Load jsQR library from CDN ───────────────────────────────────────────
  useEffect(() => {
    if ((window as any).jsQR) {
      jsQRRef.current = (window as any).jsQR;
      setJsQRLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
    script.async = true;
    script.onload = () => {
      jsQRRef.current = (window as any).jsQR;
      setJsQRLoaded(true);
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // ── Fetch asset from backend ──────────────────────────────────────────────
  const fetchAsset = useCallback(async (kodeQr: string) => {
    if (!kodeQr.trim()) return;
    setIsLoading(true);
    setScanStatus("scanning");
    setAssetResult(null);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/scan-qr/${encodeURIComponent(kodeQr.trim())}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssetResult(res.data.data);
      setScanStatus("found");
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setScanStatus("not_found");
        setErrorMsg(`Kode QR "${kodeQr}" tidak terdaftar dalam sistem E-Asset.`);
      } else {
        setScanStatus("error");
        setErrorMsg("Gagal menghubungi server. Periksa koneksi dan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Start camera ───────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setScanStatus("idle");
      setAssetResult(null);
      setLastScanned("");
    } catch (err: any) {
      const messages: Record<string, string> = {
        NotAllowedError: "Izin kamera ditolak. Aktifkan akses kamera di pengaturan browser.",
        NotFoundError: "Kamera tidak ditemukan pada perangkat ini.",
        NotReadableError: "Kamera sedang digunakan oleh aplikasi lain.",
      };
      setCameraError(messages[err.name] ?? `Kamera error: ${err.message}`);
    }
  }, [facingMode]);

  // ── Stop camera ────────────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
    setScanStatus("idle");
  }, []);

  // ── QR Frame scanning loop ─────────────────────────────────────────────────
  useEffect(() => {
    if (!cameraActive || !jsQRLoaded) return;

    scanIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== 4) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQRRef.current?.(
        imageData.data,
        imageData.width,
        imageData.height
      );

      if (code?.data && code.data !== lastScanned) {
        setLastScanned(code.data);
        stopCamera();
        fetchAsset(code.data);
      }
    }, 300);

    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [cameraActive, jsQRLoaded, lastScanned, fetchAsset, stopCamera]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) fetchAsset(manualCode.trim());
  };

  const handleReset = () => {
    setAssetResult(null);
    setScanStatus("idle");
    setManualCode("");
    setErrorMsg("");
    setLastScanned("");
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-5 py-5 px-2 sm:px-4 max-w-3xl mx-auto w-full">
      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#0b2f9f] to-[#00809d] rounded-2xl p-5 text-white shadow-lg"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-white/20 rounded-xl">
            <ScanLine className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight">Scan QR Aset</h1>
        </div>
        <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
          Aktifkan kamera untuk memindai QR label pada barang, atau masukkan kode QR
          secara manual untuk melihat informasi aset secara instan.
        </p>
      </motion.div>

      {/* ── Camera Panel ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Camera Viewport */}
        <div className="relative bg-slate-900 aspect-video w-full overflow-hidden">
          {cameraActive ? (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                  {/* Scan line animation */}
                  <motion.div
                    animate={{ y: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-2 right-2 h-0.5 bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]"
                  />
                </div>
              </div>
              {/* Live indicator */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white text-[11px] font-bold">LIVE</span>
              </div>
              {/* Flip camera button */}
              <button
                onClick={() => {
                  stopCamera();
                  setFacingMode((f) => (f === "environment" ? "user" : "environment"));
                }}
                className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
                title="Ganti Kamera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 min-h-[220px]">
              <div className="p-5 bg-slate-800 rounded-full">
                <QrCode className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-slate-400 text-sm font-medium">Kamera tidak aktif</p>
              {!jsQRLoaded && (
                <p className="text-slate-500 text-xs">Memuat library QR…</p>
              )}
            </div>
          )}
          {/* Hidden canvas for QR decoding */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Camera error */}
        <AnimatePresence>
          {cameraError && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 py-3 bg-rose-50 border-t border-rose-100 flex items-start gap-2 text-rose-700 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={toggleCamera}
            disabled={!jsQRLoaded}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              cameraActive
                ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
                : jsQRLoaded
                ? "bg-gradient-to-r from-[#0b2f9f] to-[#00809d] text-white shadow-md hover:opacity-90"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {cameraActive ? (
              <>
                <CameraOff className="w-4 h-4" />
                Matikan Kamera
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                {jsQRLoaded ? "Aktifkan Kamera Scan QR" : "Memuat…"}
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* ── Manual Input ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Hash className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-700">Input Kode QR Manual</h2>
        </div>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Contoh: QR-ELEK-0001"
            className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/30 focus:border-[#0b2f9f]"
          />
          <button
            type="submit"
            disabled={!manualCode.trim() || isLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-[#0b2f9f] to-[#00809d] text-white rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Cari</span>
          </button>
        </form>
      </motion.div>

      {/* ── Scan Result ───────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {/* Loading */}
        {scanStatus === "scanning" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 flex flex-col items-center gap-3"
          >
            <div className="w-12 h-12 border-4 border-[#0b2f9f]/20 border-t-[#0b2f9f] rounded-full animate-spin" />
            <p className="text-slate-600 text-sm font-semibold">Memindai data aset…</p>
          </motion.div>
        )}

        {/* Not Found */}
        {scanStatus === "not_found" && (
          <motion.div
            key="notfound"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-amber-800 text-sm">Aset Tidak Ditemukan</p>
              <p className="text-amber-700 text-xs mt-0.5">{errorMsg}</p>
            </div>
            <button onClick={handleReset} className="p-1 hover:bg-amber-100 rounded-lg transition">
              <X className="w-4 h-4 text-amber-500" />
            </button>
          </motion.div>
        )}

        {/* Error */}
        {scanStatus === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-rose-800 text-sm">Gagal Memindai</p>
              <p className="text-rose-700 text-xs mt-0.5">{errorMsg}</p>
            </div>
            <button onClick={handleReset} className="p-1 hover:bg-rose-100 rounded-lg transition">
              <X className="w-4 h-4 text-rose-500" />
            </button>
          </motion.div>
        )}

        {/* Found — Asset Card */}
        {scanStatus === "found" && assetResult && (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-emerald-200 rounded-2xl shadow-md overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4 flex items-center justify-between border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-black text-emerald-700 text-sm">Aset Ditemukan</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={assetResult.status} label={assetResult.status_label} />
                <button onClick={handleReset} className="p-1 hover:bg-emerald-100 rounded-lg transition" title="Tutup">
                  <X className="w-4 h-4 text-emerald-500" />
                </button>
              </div>
            </div>

            {/* Asset Content */}
            <div className="p-5">
              <div className="flex gap-4">
                {/* Photo */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center border border-slate-200">
                  {assetResult.foto_barang ? (
                    <img
                      src={assetResult.foto_barang}
                      alt={assetResult.nama_barang}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-slate-300" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-800 text-base leading-tight">
                    {assetResult.nama_barang}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">{assetResult.kode_barang}</p>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono text-[#0b2f9f] font-bold">{assetResult.kode_qr}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>{assetResult.kategori}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Stok: <strong>{assetResult.stok}</strong> unit</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Update: {assetResult.updated_at}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              {assetResult.deskripsi && (
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-2">
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">{assetResult.deskripsi}</p>
                </div>
              )}

              {/* QR Label detail row */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "No. Aset", value: `#${assetResult.id.toString().padStart(4, "0")}` },
                  { label: "Kode Kategori", value: assetResult.kode_kategori },
                  { label: "QR Label", value: assetResult.kode_qr },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{item.label}</p>
                    <p className="text-xs font-black text-slate-700 mt-0.5 font-mono">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Scan Again button */}
              <button
                onClick={handleReset}
                className="mt-4 w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 text-sm font-semibold hover:border-[#0b2f9f]/40 hover:text-[#0b2f9f] transition flex items-center justify-center gap-2"
              >
                <ScanLine className="w-4 h-4" />
                Scan QR Lainnya
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Info Box ─────────────────────────────────────────── */}
      {scanStatus === "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3"
        >
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-700 space-y-1 leading-relaxed">
            <p className="font-bold">Panduan Penggunaan QR Scanner:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-blue-600">
              <li>Klik <strong>"Aktifkan Kamera Scan QR"</strong> dan izinkan akses kamera.</li>
              <li>Arahkan kamera ke <strong>QR label</strong> yang tertempel pada barang.</li>
              <li>Sistem otomatis mendeteksi dan menampilkan informasi aset.</li>
              <li>Atau masukkan kode QR secara <strong>manual</strong> pada kolom di atas.</li>
            </ol>
            <p className="text-blue-500 mt-1">
              Format kode QR: <span className="font-mono font-bold">QR-[KATEGORI]-[NOMOR]</span>
              {" "}(contoh: QR-ELEK-0001, QR-LAB-0003)
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
