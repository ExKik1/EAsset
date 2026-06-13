import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import api from "../../utils/api";

import UserProfileHeader from "../../components/profile/UserProfileHeader";
import { UserSummaryCard } from "../../components/profile/UserSummaryCard";
import { ProfileForm } from "../../components/profile/ProfileForm";
import { DeleteAccountModal } from "../../components/profile/DeleteAccountModal";
import { NotificationToast } from "../../components/ui/NotificationToast";
import DashboardLayout from "../../layouts/DashboardLayout";

interface Fakultas {
  id: number;
  nama_fakultas: string;
}

interface ProgramStudi {
  id: number;
  fakultas_id: number;
  nama_prodi: string;
}

export default function UserProfile() {
  useDocumentTitle("Pengaturan Profil");

  const [user, setUser] = useState<any>(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isFetchLoading, setIsFetchLoading] = useState(false);

  // State Master Data Berelasi
  const [fakultasLists, setFakultasLists] = useState<Fakultas[]>([]);
  const [filteredProdi, setFilteredProdi] = useState<ProgramStudi[]>([]);

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Load Data Fakultas & Sesi Awal User
  useEffect(() => {
    loadInitialData();
  }, []);

  // Mengambil data Program Studi secara dinamis ketika fakultas_id berubah (Sesuai API Laravel)
  useEffect(() => {
    if (formData.fakultas_id) {
      fetchProdiByFaculty(parseInt(formData.fakultas_id));
    } else {
      setFilteredProdi([]);
      setFormData((prev) => ({ ...prev, program_studi_id: "" }));
    }
  }, [formData.fakultas_id]);

  const loadInitialData = async () => {
    setIsFetchLoading(true);
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (!token) return;

      // 1. Ambil data fakultas dari API
      const fakultasRes = await api.get("/faculties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFakultasLists(fakultasRes.data.data || []);

      // 2. Ambil data user dari local session atau buat endpoint /user jika data di local storage kurang lengkap
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        setUser(userObj);

        setFormData({
          name: userObj.name || "",
          email: userObj.email || "",
          nim_nip: userObj.nim_nip || "",
          alamat: userObj.alamat || "",
          fakultas_id: userObj.fakultas_id
            ? userObj.fakultas_id.toString()
            : "",
          program_studi_id: userObj.program_studi_id
            ? userObj.program_studi_id.toString()
            : "",
          password: "",
          password_confirmation: "",
        });
      }
    } catch (err: any) {
      console.error("Gagal memuat data awal:", err);
      setToastConfig({
        messages: ["Gagal menyinkronkan master data dari server."],
        type: "danger",
      });
    } finally {
      setIsFetchLoading(false);
    }
  };

  const fetchProdiByFaculty = async (facultyId: number) => {
    try {
      const token = localStorage.getItem("token");
      const prodiRes = await api.get(`/faculties/${facultyId}/prodi`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const prodiData = prodiRes.data.data || [];
      setFilteredProdi(prodiData);

      // Jika prodi yang dipilih sebelumnya tidak ada di fakultas yang baru, reset pilihan prodi
      if (
        formData.program_studi_id &&
        !prodiData.some(
          (p: any) => p.id === parseInt(formData.program_studi_id),
        )
      ) {
        setFormData((prev) => ({ ...prev, program_studi_id: "" }));
      }
    } catch (err) {
      console.error("Gagal memuat data Program Studi:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    setToastConfig(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (formData.nim_nip) data.append("nim_nip", formData.nim_nip);
      if (formData.alamat) data.append("alamat", formData.alamat);
      if (formData.fakultas_id)
        data.append("fakultas_id", formData.fakultas_id);
      if (formData.program_studi_id)
        data.append("program_studi_id", formData.program_studi_id);

      if (formData.password.trim() !== "") {
        data.append("password", formData.password);
        data.append("password_confirmation", formData.password_confirmation);
      }

      if (selectedFile) {
        data.append("profile", selectedFile);
      }

      // Gunakan POST dengan Spoofing Method PUT sesuai konfigurasi API Laravel Anda
      data.append("_method", "PUT");

      const response = await api.post("/profile/update", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser =
        response.data.data || response.data.user || response.data;

      if (response.status === 200 || response.data.status === "success") {
        setToastConfig({
          messages: [response.data.message || "Profil berhasil diperbarui."],
          type: "success",
        });

        setUser(updatedUser);
        setSelectedFile(null);
        setFormData((prev) => ({
          ...prev,
          password: "",
          password_confirmation: "",
        }));

        // Sinkronisasi Data Baru ke LocalStorage agar Sidebar & Navbar ikut berubah secara Real-time
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const newUserSession = {
            ...parsed,
            name: updatedUser.name || formData.name,
            email: updatedUser.email || formData.email,
            role: updatedUser.role || parsed.role,
            profile: updatedUser.profile || parsed.profile,
            nim_nip: updatedUser.nim_nip || formData.nim_nip,
            alamat: updatedUser.alamat || formData.alamat,
            fakultas_id: updatedUser.fakultas_id || formData.fakultas_id,
            program_studi_id:
              updatedUser.program_studi_id || formData.program_studi_id,
          };
          localStorage.setItem("user", JSON.stringify(newUserSession));
        }

        // Trigger Event Storage secara lokal agar didengar oleh DashboardLayout
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 422) {
        const allErrors = Object.values(
          err.response.data.errors || {},
        ).flat() as string[];
        setToastConfig({
          messages: allErrors.length > 0 ? allErrors : ["Validasi data gagal."],
          type: "danger",
        });
      } else {
        setToastConfig({
          messages: [
            err.response?.data?.message || "Terjadi kesalahan sistem.",
          ],
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

      // Endpoint disesuaikan dengan Laravel: /profile/delete
      const response = await api.delete("/profile/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setIsDeleteModalOpen(false);
        setToastConfig({
          messages: ["Akun Anda telah berhasil dihapus secara permanen."],
          type: "success",
        });
        setTimeout(() => handleLogout(), 2000);
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

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/auth/login");
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

          <UserProfileHeader
            isFetchLoading={isFetchLoading}
            onRefresh={loadInitialData}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <UserSummaryCard
              userName={user?.name || "User"}
              email={user?.email || ""}
              role={user?.role || "umum"}
              profileUrl={user?.profile}
              onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
            />

            <ProfileForm
              formData={formData}
              fakultasLists={fakultasLists}
              filteredProdi={filteredProdi}
              isFetchLoading={isFetchLoading}
              isSubmitLoading={isSubmitLoading}
              onInputChange={handleInputChange}
              onFileChange={handleFileChange}
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
        </div>
      </div>
    </DashboardLayout>
  );
}
