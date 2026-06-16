import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import api from "../../utils/api";

import UserProfileHeader from "../../components/profile/UserProfileHeader";
import { UserSummaryCard } from "../../components/profile/UserSummaryCard";
import { ProfileForm } from "../../components/profile/ProfileForm";
import { DeleteAccountModal } from "../../components/profile/DeleteAccountModal";
import { NotificationToast } from "../../components/ui/NotificationToast";
import DashboardLayout from "../../layouts/DashboardLayout";
import ImageCropModal from "../../components/users/extra/ImageCropModal";

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

export default function UserProfile() {
  useDocumentTitle("Pengaturan Profil");

  const [user, setUser] = useState<any>(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isProdiLoading, setIsProdiLoading] = useState(false);

  // Master Data State
  const [fakultasOptions, setFakultasOptions] = useState<DropdownItem[]>([]);
  const [prodiOptions, setProdiOptions] = useState<DropdownItem[]>([]);

  const [toastConfig, setToastConfig] = useState<{
    messages: string[];
    type: "success" | "danger";
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nim_nip: "",
    alamat: "",
    fakultas_id: "",
    program_studi_id: "",
    password: "",
    password_confirmation: "",
  });

  // Guard flag untuk mencegah penghapusan prodi_id saat pertamakali load data profil
  const isInitialRender = useRef(true);

  // Image Cropper State
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Helper parsing path gambar dari server storage
  const getProfileImage = (profilePath: string | null) => {
    if (!profilePath || profilePath === "default-profile.png" || profilePath.trim() === "") {
      return null;
    }
    if (profilePath.startsWith("http://") || profilePath.startsWith("https://")) {
      return profilePath;
    }
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
    return apiBaseUrl.replace("/api", "") + "/storage/" + profilePath;
  };

  // 1. Load Fakultas dan Data User di awal
  useEffect(() => {
    loadInitialData();
  }, []);

  // 2. Fetch Data Prodi secara dinamis berdasarkan perubahan `fakultas_id`
  useEffect(() => {
    if (formData.fakultas_id) {
      fetchProdiByFaculty(formData.fakultas_id);
    } else {
      setProdiOptions([]);
      if (!isInitialRender.current) {
        setFormData((prev) => ({ ...prev, program_studi_id: "" }));
      }
    }
  }, [formData.fakultas_id]);

  const loadInitialData = async () => {
    setIsFetchLoading(true);
    isInitialRender.current = true;

    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (!token) return;

      const fakultasRes = await api.get("/faculties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFakultasOptions(fakultasRes.data.data || fakultasRes.data);

      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        setUser(userObj);

        const fId = userObj.fakultas_id ? String(userObj.fakultas_id) : "";
        const pId = userObj.program_studi_id ? String(userObj.program_studi_id) : "";

        setFormData({
          name: userObj.name || "",
          email: userObj.email || "",
          nim_nip: userObj.nim_nip || "",
          alamat: userObj.alamat || "",
          fakultas_id: fId,
          program_studi_id: pId,
          password: "",
          password_confirmation: "",
        });

        if (fId) {
          await fetchProdiByFaculty(fId, pId);
        }

        const rawProfile = userObj.profile || userObj.profile_url;
        const fullyParsedImg = getProfileImage(rawProfile);
        setImagePreview(fullyParsedImg);
      }
    } catch (err: any) {
      console.error("Gagal menyinkronkan data profil:", err);
      setToastConfig({
        messages: ["Gagal memuat konfigurasi master data dari server."],
        type: "danger",
      });
    } finally {
      setIsFetchLoading(false);
      setTimeout(() => {
        isInitialRender.current = false;
      }, 300);
    }
  };

  const fetchProdiByFaculty = async (facultyId: string, initialProdiId?: string) => {
    setIsProdiLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/faculties/${facultyId}/prodi`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const prodiData = res.data.data || [];
      setProdiOptions(prodiData);

      if (!isInitialRender.current && !initialProdiId) {
        const isExist = prodiData.some((p: any) => String(p.id) === String(formData.program_studi_id));
        if (!isExist) {
          setFormData((prev) => ({ ...prev, program_studi_id: "" }));
        }
      }
    } catch (err) {
      console.error("Gagal memuat data prodi berdasarkan fakultas:", err);
      setProdiOptions([]);
    } finally {
      setIsProdiLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File | null) => {
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
        setImagePreview(croppedUrl); // Menampilkan pratinjau gambar baru lokal

        const file = new File([blob], "profile_cropped.png", { type: "image/png" });
        setSelectedFile(file);
        setIsCropModalOpen(false);
      }, "image/png");
    } catch (e) {
      console.error("Gagal memotong gambar:", e);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    setToastConfig(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("email", formData.email.trim());
      data.append("nim_nip", formData.nim_nip ? formData.nim_nip.trim() : "");
      data.append("alamat", formData.alamat ? formData.alamat.trim() : "");
      data.append("fakultas_id", formData.fakultas_id);
      data.append("program_studi_id", formData.program_studi_id);

      if (formData.password.trim() !== "") {
        data.append("password", formData.password);
        data.append("password_confirmation", formData.password_confirmation);
      }

      if (selectedFile) {
        data.append("profile", selectedFile);
      }

      data.append("_method", "PUT");

      const response = await api.post("/profile/update", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const responseData = response.data;
      const updatedUser = responseData.data || responseData.user || responseData;

      if (response.status === 200 || responseData.status === "success") {
        setToastConfig({
          messages: [responseData.message || "Profil Anda berhasil diperbarui."],
          type: "success",
        });

        setUser(updatedUser);
        setSelectedFile(null);
        setImageSrc(null);
        
        // Perbarui preview gambar utama dari server response terbaru
        const rawProfile = updatedUser.profile || updatedUser.profile_url;
        setImagePreview(getProfileImage(rawProfile));

        setFormData((prev) => ({
          ...prev,
          password: "",
          password_confirmation: "",
        }));

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const newUserSession = { ...parsed, ...updatedUser };
          localStorage.setItem("user", JSON.stringify(newUserSession));
        }

        window.dispatchEvent(new Event("storage"));
      }
    } catch (err: any) {
      console.error(err);
      const dataResponse = err.response?.data;
      let parsedMessages: string[] = [];

      if (err.response && err.response.status === 422) {
        const nestedErrors = dataResponse?.errors;
        if (typeof nestedErrors === "object" && nestedErrors !== null) {
          parsedMessages = Object.values(nestedErrors).flat() as string[];
        } else {
          parsedMessages = [dataResponse?.message || "Validasi gagal."];
        }
        setToastConfig({ messages: parsedMessages, type: "danger" });
      } else {
        setToastConfig({
          messages: [dataResponse?.message || "Terjadi kesalahan sistem."],
          type: "danger",
        });
      }
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteAccountSubmit = async () => {
    setIsSubmitLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await api.delete("/profile/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setIsDeleteModalOpen(false);
        setToastConfig({
          messages: ["Akun Anda telah berhasil dihapus secara permanen."],
          type: "success",
        });
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
          window.location.replace("/auth/login");
        }, 2000);
      }
    } catch (err: any) {
      setToastConfig({
        messages: [err.response?.data?.message || "Gagal menghapus akun."],
        type: "danger",
      });
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-slate-50 text-slate-900 font-sans flex flex-col min-h-screen relative">
        <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
          {toastConfig && (
            <NotificationToast
              messages={toastConfig.messages}
              type={toastConfig.type}
              onClose={() => setToastConfig(null)}
            />
          )}

          <UserProfileHeader isFetchLoading={isFetchLoading} onRefresh={loadInitialData} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* KARTU SUMMARY - SEKARANG MENERIMA PROP FILE CHANGE YANG TEPAT */}
            <UserSummaryCard
              userName={user?.name || "User"}
              email={user?.email || ""}
              role={user?.role || "umum"}
              profileUrl={imagePreview} 
              onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
              onFileChange={handleFileChange}
              isImageSelected={!!selectedFile}
            />

            <ProfileForm
              formData={formData}
              fakultasLists={fakultasOptions}
              prodiLists={prodiOptions}
              isFetchLoading={isFetchLoading}
              isProdiLoading={isProdiLoading}
              isSubmitLoading={isSubmitLoading}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onSubmit={handleUpdateProfile}
            />
          </div>

          <AnimatePresence>
            {isDeleteModalOpen && (
              <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                isSubmitLoading={isSubmitLoading}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirmDelete={handleDeleteAccountSubmit}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isCropModalOpen && imageSrc && (
              <ImageCropModal
                isOpen={isCropModalOpen}
                imageSrc={imageSrc}
                crop={crop}
                zoom={zoom}
                setCrop={setCrop}
                setZoom={setZoom}
                onCropComplete={onCropComplete}
                onClose={() => {
                  setIsCropModalOpen(false);
                  setImageSrc(null);
                }}
                onApply={createCroppedImage}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}