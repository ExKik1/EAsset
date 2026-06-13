import React, { useState, useRef } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  MapPin,
  Building,
  GraduationCap,
  Image,
} from "lucide-react";

interface ProfileFormProps {
  formData: any;
  fakultasLists: any[];
  filteredProdi: any[];
  isFetchLoading: boolean;
  isSubmitLoading: boolean;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  fakultasLists,
  filteredProdi,
  isFetchLoading,
  isSubmitLoading,
  onInputChange,
  onFileChange,
  onSubmit,
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFileChange(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="lg:col-span-2 w-full">
      <form
        onSubmit={onSubmit}
        className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden"
      >
        <div className="p-4 sm:p-6 space-y-6">
          {/* SECTION 1: PERSONAL INFORMATION */}
          <div className="space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-[#0b2f9f] uppercase tracking-wider border-b border-slate-100 pb-2">
              Informasi Personal & Akademik
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onInputChange}
                    disabled={isFetchLoading}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#0b2f9f] focus:bg-white transition-all disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Alamat Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    disabled={isFetchLoading}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#0b2f9f] focus:bg-white transition-all disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  NIM / NIP
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="nim_nip"
                    value={formData.nim_nip}
                    onChange={onInputChange}
                    disabled={isFetchLoading}
                    placeholder="Masukkan nomor identitas"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#0b2f9f] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* UPLOAD FOTO PROFIL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Foto Profil
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <Image className="w-4 h-4 text-slate-500" />
                    Pilih Gambar
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLocalFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {previewUrl && (
                    <span className="text-[11px] text-emerald-600 font-medium truncate max-w-[150px]">
                      Berkas terpilih terpantau
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* SELEKSI KAMPUS BERELASI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Fakultas
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Building className="w-4 h-4" />
                  </span>
                  <select
                    name="fakultas_id"
                    value={formData.fakultas_id}
                    onChange={onInputChange}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#0b2f9f] focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="">-- Pilih Fakultas --</option>
                    {fakultasLists.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nama_fakultas}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Program Studi
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <GraduationCap className="w-4 h-4" />
                  </span>
                  <select
                    name="program_studi_id"
                    value={formData.program_studi_id}
                    onChange={onInputChange}
                    disabled={!formData.fakultas_id}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#0b2f9f] focus:bg-white transition-all appearance-none disabled:bg-slate-200/60 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {formData.fakultas_id
                        ? "-- Pilih Program Studi --"
                        : "Pilih fakultas dahulu"}
                    </option>
                    {filteredProdi.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama_prodi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Alamat Tempat Tinggal
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">
                  <MapPin className="w-4 h-4" />
                </span>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={onInputChange}
                  rows={3}
                  placeholder="Alamat lengkap domisili saat ini..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#0b2f9f] focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PASSWORD CREATION */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col gap-0.5 border-b border-slate-100 pb-2">
              <h3 className="text-xs sm:text-sm font-bold text-[#0b2f9f] uppercase tracking-wider">
                Perbarui Kata Sandi Keamanan
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                Kosongkan kolom sandi jika Anda tidak berniat merubahnya.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Password Baru
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={onInputChange}
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#0b2f9f] focus:bg-white transition-all"
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={onInputChange}
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#0b2f9f] focus:bg-white transition-all"
                    placeholder="Ulangi password baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-100 px-4 sm:px-6 py-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitLoading || isFetchLoading}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#0b2f9f] to-[#00809d] hover:brightness-110 text-white text-xs sm:text-sm font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan Perubahan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
