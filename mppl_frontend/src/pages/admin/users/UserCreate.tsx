import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Save, UserPlus, RefreshCw, RotateCcw } from "lucide-react";
import { useAuthSession } from "../../../hooks/useAuthSession";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { NotificationToast } from "../../../components/ui/NotificationToast";

// Import Sub-Komponen Terpisah
import PersonalDataSection from "../../../components/users/extra/PersonalDataSection";
import AccountCredentialSection from "../../../components/users/extra/AccountCredentialSection";
import AcademicAffiliationSection from "../../../components/users/extra/AcademicAffiliationSection";
import ImageCropModal from "../../../components/users/extra/ImageCropModal"; // Komponen baru

interface DropdownItem {
  id: number;
  nama_fakultas?: string;
  kode_fakultas?: string;
  nama_prodi?: string;
  kode_prodi?: string;
  fakultas_id?: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function UserCreate() {
  useDocumentTitle("Tambah Pengguna Sistem Baru");
  const { token } = useAuthSession();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [fakultasOptions, setFakultasOptions] = useState<DropdownItem[]>([]);
  const [prodiOptions, setProdiOptions] = useState<DropdownItem[]>([]);

  // State Crop Manajemen
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const [form, setForm] = useState({
    nim_nip: "",
    name: "",
    email: "",
    password: "",
    role: "",
    fakultas_id: "",
    program_studi_id: "",
    alamat: "",
  });

  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [toastType, setToastType] = useState<"success" | "danger">("success");

  useEffect(() => {
    if (token) {
      fetchFakultas();
      fetchProdi();
    }
  }, [token]);

  const fetchFakultas = async () => {
    try {
      const res = await api.get("/faculties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFakultasOptions(res.data.data || res.data);
    } catch (err) {
      console.error("Gagal mengambil master fakultas", err);
    }
  };

  const fetchProdi = async () => {
    try {
      const res = await api.get("/prodi", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdiOptions(res.data.data || res.data);
    } catch (err) {
      console.error("Gagal mengambil master program studi", err);
    }
  };

  const filteredProdiOptions = useMemo(() => {
    if (!form.fakultas_id) return [];
    return prodiOptions.filter(
      (prodi) => String(prodi.fakultas_id) === String(form.fakultas_id),
    );
  }, [form.fakultas_id, prodiOptions]);

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

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

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
        croppedAreaPixels.height,
      );

      canvas.toBlob((blob) => {
        if (!blob) return;
        const croppedUrl = URL.createObjectURL(blob);
        setImagePreview(croppedUrl);

        const file = new File([blob], "profile_cropped.png", {
          type: "image/png",
        });
        setProfileFile(file);
        setIsCropModalOpen(false);
      }, "image/png");
    } catch (e) {
      console.error("Gagal memotong gambar", e);
    }
  };

  const handleResetForm = () => {
    setForm({
      nim_nip: "",
      name: "",
      email: "",
      password: "",
      role: "",
      fakultas_id: "",
      program_studi_id: "",
      alamat: "",
    });
    setProfileFile(null);
    setImagePreview(null);
    setImageSrc(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setToastMessages([]);

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== "") formData.append(key, val);
    });
    if (profileFile) {
      formData.append("profile", profileFile);
    }

    try {
      await api.post("/data-users", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setToastType("success");
      setToastMessages([
        "Akun pengguna baru berhasil ditambahkan ke dalam basis data!",
      ]);
      setTimeout(() => navigate("/data-users"), 1500);
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
        parsedMessages.length
          ? parsedMessages
          : ["Terjadi galat teknis saat memproses registrasi data."],
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
                <UserPlus className="w-5 h-5 text-primary" />
                <h3 className="text-xl sm:text-2xl font-black color-span-g tracking-tight">
                  Tambah Pengguna Baru
                </h3>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm">
                Registrasi entitas pengguna dan otoritas hak akses lingkungan
                civitas akademik.
              </p>
            </div>

            <Link
              to="/data-users"
              className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition rounded-md shadow-sm cursor-pointer h-fit self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Tabel</span>
            </Link>
          </motion.div>

          {/* Form Utama */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <PersonalDataSection
              variants={itemVariants}
              form={form}
              setForm={setForm}
              imagePreview={imagePreview}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
            />

            <AccountCredentialSection
              variants={itemVariants}
              form={form}
              setForm={setForm}
            />

            <AcademicAffiliationSection
              variants={itemVariants}
              form={form}
              setForm={setForm}
              fakultasOptions={fakultasOptions}
              filteredProdiOptions={filteredProdiOptions}
            />

            {/* Footer Form Button Actions */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex items-center justify-end gap-3 pt-2"
            >
              <button
                type="button"
                onClick={handleResetForm}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-md transition-all duration-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Form</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-brand-gradient rounded-md shadow-md shadow-emerald-950/10 hover:brightness-105 active:scale-[0.98] disabled:opacity-50 cursor-pointer transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan Entitas...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Pengguna</span>
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      {/* PENGGUNAAN KOMPONEN CROPPER BARU */}
      <AnimatePresence>
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
      </AnimatePresence>
    </DashboardLayout>
  );
}
