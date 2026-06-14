import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  FileText,
  Edit3,
  Camera,
} from "lucide-react";
import { useAuthSession } from "../../../hooks/useAuthSession";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { NotificationToast } from "../../../components/ui/NotificationToast";
import SearchableSelect from "../../../components/ui/SearchableSelect";

interface DropdownItem {
  id: number;
  nama_fakultas?: string;
  kode_fakultas?: string;
  nama_prodi?: string;
  kode_prodi?: string;
}

export default function UserEdit() {
  useDocumentTitle("Ubah Master Entitas Pengguna");
  const { token } = useAuthSession();
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [fakultasOptions, setFakultasOptions] = useState<DropdownItem[]>([]);
  const [prodiOptions, setProdiOptions] = useState<DropdownItem[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    nim_nip: "",
    name: "",
    email: "",
    password: "", // Kosongkan jika password tidak diganti
    role: "",
    fakultas_id: "",
    program_studi_id: "",
    alamat: "",
  });
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [toastType, setToastType] = useState<"success" | "danger">("success");

  useEffect(() => {
    if (token) {
      fetchFakultas();
      fetchProdi();
      if (id) fetchExistingUser();
    }
  }, [token, id]);

  const fetchFakultas = async () => {
    try {
      const res = await api.get("/faculties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFakultasOptions(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProdi = async () => {
    try {
      const res = await api.get("/prodi", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdiOptions(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExistingUser = async () => {
    try {
      const res = await api.get(`/data-users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const u = res.data.data;
      setForm({
        nim_nip: u.nim_nip || "",
        name: u.name || "",
        email: u.email || "",
        password: "",
        role: u.role || "",
        fakultas_id: u.fakultas_id ? String(u.fakultas_id) : "",
        program_studi_id: u.program_studi_id ? String(u.program_studi_id) : "",
        alamat: u.alamat || "",
      });

      if (u.profile) {
        // Asumsi base URL untuk aset storage Laravel
        const backendAssetUrl =
          import.meta.env.VITE_API_URL?.replace("/api", "") + "/storage/";
        setImagePreview(
          u.profile.startsWith("http")
            ? u.profile
            : backendAssetUrl + u.profile,
        );
      }
    } catch (err) {
      setToastType("danger");
      setToastMessages(["Gagal mengambil data informasi detail akun."]);
      setTimeout(() => navigate("/data-users"), 1500);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (key === "password" && val === "") return; // Abaikan password jika dikosongkan
      formData.append(key, val);
    });

    if (profileFile) formData.append("profile", profileFile);

    // Syarat Mutlak Laravel: Operasi update file via multipart/form-data harus disamarkan dengan POST + parameter _method
    formData.append("_method", "PUT");

    try {
      await api.post(`/data-users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setToastType("success");
      setToastMessages([
        "Sinkronisasi perubahan berkas pengguna sukses diperbarui!",
      ]);
      setTimeout(() => navigate("/data-users"), 1500);
    } catch (err: any) {
      console.error(err);
      const dataResponse = err.response?.data;
      let parsedMessages: string[] = [];
      if (dataResponse && dataResponse.errors) {
        parsedMessages = Object.values(dataResponse.errors).flat() as string[];
      } else if (dataResponse?.message) {
        parsedMessages = [dataResponse.message];
      }
      setToastMessages(
        parsedMessages.length
          ? parsedMessages
          : ["Terjadi kegagalan pembaruan berkas data."],
      );
      setToastType("danger");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <NotificationToast
        messages={toastMessages}
        type={toastType}
        onClose={() => setToastMessages([])}
      />

      <div className="bg-slate-50 text-slate-900 font-sans flex flex-col w-full relative">
        <div className="flex flex-col w-full p-6 md:p-8 lg:p-10 space-y-6 max-w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 border border-info-border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black color-span-g tracking-tight">
                  Ubah Informasi Pengguna
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Mutasi dan sinkronisasi informasi akun pengguna civitas
                  akademik.
                </p>
              </div>
            </div>
            <Link
              to="/data-users"
              className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition rounded-md shadow-sm h-fit self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Tabel</span>
            </Link>
          </div>

          <div className="bg-white border border-info-border shadow-md overflow-hidden mb-2">
            <div className="relative overflow-hidden px-6 py-4 bg-brand-gradient border-b border-slate-200/70 flex items-center gap-2 text-white">
              <FileText className="w-4 h-4 z-10" />
              <h3 className="text-xs font-bold uppercase tracking-wide z-10">
                Atribut Akun Komparasi Lama
              </h3>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div className="flex flex-col items-center sm:flex-row gap-5 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <div className="relative w-24 h-24 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-md group shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                      No Image
                    </div>
                  )}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-center sm:text-left space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-800">
                    Ubah Berkas Foto Profil
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Biarkan kosong jika tidak berkeinginan mengubah gambar ikon
                    utama profil.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded text-xs font-bold text-slate-700 transition shadow-xs"
                  >
                    Ganti Foto Baru
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wide">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-info-border rounded-md text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wide">
                    NIM / NIP / Kode Unik
                  </label>
                  <input
                    type="text"
                    value={form.nim_nip}
                    onChange={(e) =>
                      setForm({ ...form, nim_nip: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-info-border rounded-md font-mono text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wide">
                    Alamat E-mail <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-info-border rounded-md text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wide">
                    Kata Sandi Baru (Opsional)
                  </label>
                  <input
                    type="password"
                    placeholder="Kosongkan jika password tidak ingin diubah..."
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-info-border rounded-md text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wide">
                    Hak Otoritas Akses (Role){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-info-border rounded-md text-sm font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 cursor-pointer"
                  >
                    <option value="admin">Administrator</option>
                    <option value="kerumahtanggaan">Kerumahtanggaan</option>
                    <option value="umum">Umum / Civitas</option>
                  </select>
                </div>

                <SearchableSelect
                  label="Fakultas Induk"
                  placeholder="-- Pilih Fakultas --"
                  options={fakultasOptions.map((f) => ({
                    id: f.id,
                    label: f.nama_fakultas || "",
                    subLabel: f.kode_fakultas,
                  }))}
                  value={form.fakultas_id}
                  onChange={(val) => setForm({ ...form, fakultas_id: val })}
                />

                <div className="md:col-span-2">
                  <SearchableSelect
                    label="Program Studi Manajemen"
                    placeholder="-- Pilih Program Studi --"
                    options={prodiOptions.map((p) => ({
                      id: p.id,
                      label: p.nama_prodi || "",
                      subLabel: p.kode_prodi,
                    }))}
                    value={form.program_studi_id}
                    onChange={(val) =>
                      setForm({ ...form, program_studi_id: val })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wide">
                  Alamat Rumah Lengkap
                </label>
                <textarea
                  rows={3}
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-info-border rounded-md text-sm text-slate-700 leading-relaxed focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Link
                  to="/data-users"
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-md transition duration-200"
                >
                  Batalkan
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitLoading}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-brand-gradient rounded-md shadow-md hover:brightness-105 active:scale-[0.98] disabled:opacity-50 transition duration-200"
                >
                  {isSubmitLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
