import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Save, PackagePlus, RefreshCw } from "lucide-react";
import { useAuthSession } from "../../../hooks/useAuthSession";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { NotificationToast } from "../../../components/ui/NotificationToast";

import AssetDataSection from "../../../components/aset/extra/AssetDataSection";
import AssetInventorySection from "../../../components/aset/extra/AssetInventorySection";
import ImageCropModal from "../../../components/users/extra/ImageCropModal";

interface KategoriItem {
  id: number;
  nama_kategori: string;
  kode_kategori: string;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function AssetEdit() {
  useDocumentTitle("Perbarui Data Aset");
  const { kode_qr } = useParams<{ kode_qr: string }>();
  
  const { token } = useAuthSession();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [kategoriOptions, setKategoriOptions] = useState<KategoriItem[]>([]);

  // State Crop Image Management
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop={ x: 0, y: 0 }, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const [form, setForm] = useState({
    kode_qr: "",
    nama_barang: "",
    kode_barang: "",
    kategori_aset_id: "",
    stok: "0",
    status: "tersedia",
    deskripsi: "",
  });

  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [toastType, setToastType] = useState<"success" | "danger">("success");

  // Penarikan Data Tunggal Tertarget Berdasarkan Kode QR Parameter URL
  useEffect(() => {
    const fetchAsetTargetData = async () => {
      setIsLoading(true);
      try {
        // 1. Sinkronisasi Data Dropdown Pilihan Kategori
        const katRes = await api.get("/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setKategoriOptions(katRes.data.data || katRes.data);

        // 2. Tarik Detail Record Aset Spesifik
        if (kode_qr) {
          const assetRes = await api.get(`/assets/${kode_qr}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const assetData = assetRes.data.data;

          setForm({
            kode_qr: assetData.kode_qr || "",
            nama_barang: assetData.nama_barang || "",
            kode_barang: assetData.kode_barang || "",
            kategori_aset_id: assetData.kategori_aset_id || "",
            stok: String(assetData.stok ?? 0),
            status: assetData.status || "tersedia",
            deskripsi: assetData.deskripsi || "",
          });

          if (assetData.foto_barang) {
            setImagePreview(
              `${import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage/"}${assetData.foto_barang}`
            );
          }
        }
      } catch (err) {
        console.error("Gagal melakukan inisialisasi form data aset", err);
        setToastType("danger");
        setToastMessages(["Gagal membaca konfigurasi basis data logistik server."]);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchAsetTargetData();
  }, [token, kode_qr]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return;
        const croppedUrl = URL.createObjectURL(blob);
        setImagePreview(croppedUrl);

        const file = new File([blob], "asset_cropped.png", { type: "image/png" });
        setAssetFile(file);
        setIsCropModalOpen(false);
      }, "image/png");
    } catch (e) {
      console.error("Gagal memotong gambar", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setToastMessages([]);

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, val);
    });

    if (assetFile) {
      formData.append("foto_barang", assetFile);
    }

    // Menggunakan Laravel Multipart Form Method Spoofing karena API RESTful memproses file via POST
    formData.append("_method", "PUT");

    try {
      await api.post(`/assets/${kode_qr}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setToastType("success");
      setToastMessages(["Informasi perubahan data aset berhasil diperbarui!"]);
      setTimeout(() => navigate("/assets"), 1500);
    } catch (err: any) {
      console.error(err);
      const dataResponse = err.response?.data;
      let parsedMessages: string[] = [];

      if (dataResponse) {
        const nestedErrors = dataResponse.errors;
        if (typeof nestedErrors === "object" && nestedErrors !== null) {
          parsedMessages = Object.values(nestedErrors).flat() as string[];
        } else if (typeof dataResponse.message === "string") {
          parsedMessages = [dataResponse.message];
        }
      }

      setToastMessages(
        parsedMessages.length ? parsedMessages : ["Terjadi kegagalan komunikasi dengan server API."]
      );
      setToastType("danger");
    } finally {
      setIsLoading(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, ease: "easeOut" },
            },
          }}
          className="flex flex-col w-full p-4 md:p-8 space-y-6 max-w-7xl mx-auto"
        >
          {/* Header Panel */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 border border-info-border shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PackagePlus className="w-5 h-5 text-[#0b2f9f]" />
                <h3 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#0b2f9f] to-[#00809d] bg-clip-text text-transparent tracking-tight">
                  Modifikasi Validasi Aset
                </h3>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm">
                Manajemen pencatatan inventaris barang, pelacakan kode QR, dan audit log fasilitas.
              </p>
            </div>

            <Link
              to="/assets"
              className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition rounded-md shadow-sm cursor-pointer h-fit self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Tabel</span>
            </Link>
          </motion.div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <AssetDataSection
              variants={itemVariants}
              form={form}
              setForm={setForm}
              imagePreview={imagePreview}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              kategoriOptions={kategoriOptions}
            />

            <AssetInventorySection
              variants={itemVariants}
              form={form}
              setForm={setForm}
              isEditMode={true}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-brand-gradient rounded-md shadow-md shadow-emerald-950/10 hover:brightness-105 active:scale-[0.98] disabled:opacity-50 cursor-pointer transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sinkronisasi Data...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <AnimatePresence>
        {isCropModalOpen && (
          <ImageCropModal
            isOpen={isCropModalOpen}
            imageSrc={imageSrc}
            crop={crop}
            zoom={zoom}
            setCrop={setCrop}
            setZoom={setZoom}
            onCropComplete={onCropComplete}
            onClose={() => setIsCropModalOpen(false)}
            onApply={createCroppedImage}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}