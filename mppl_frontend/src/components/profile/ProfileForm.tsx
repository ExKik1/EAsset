import React, { useState, useRef, useEffect, useMemo } from "react";
import { Save, Search, ChevronDown, X, Eye, EyeOff, User, ShieldAlert, RefreshCw, Undo2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownItem {
  id: number;
  nama_fakultas?: string;
  nama_prodi?: string;
  kode_fakultas?: string;
}

interface ProfileFormProps {
  formData: any;
  fakultasLists: DropdownItem[];
  prodiLists: DropdownItem[];
  isSubmitLoading?: boolean; // Loading status untuk satu tombol submit utama
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;      // Handler simpan satu pintu
}

export function ProfileForm({
  formData = {},
  fakultasLists = [],
  prodiLists = [],
  isSubmitLoading = false,
  onInputChange,
  onSelectChange,
  onSubmit,
}: ProfileFormProps) {
  
  // State visibilitas field kata sandi
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Transformasi data master aman dengan nama variabel standar yang valid
  const { fakultasOptions, prodiOptions } = useMemo(() => {
    const fOptions = Array.isArray(fakultasLists)
      ? fakultasLists.map((f) => ({
          id: f?.id,
          label: f?.nama_fakultas || "",
          subLabel: f?.kode_fakultas || "",
        }))
      : [];

    const pOptions = Array.isArray(prodiLists)
      ? prodiLists.map((p) => ({
          id: p?.id,
          label: p?.nama_prodi || "",
        }))
      : [];

    return { fakultasOptions: fOptions, prodiOptions: pOptions };
  }, [fakultasLists, prodiLists]);

  // Interseptor submit untuk mencegah default browser behavior (refresh & URL query)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <div className="lg:col-span-2">
      <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
        
        {/* CARD 1: INFORMASI DASAR & AKADEMIK */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white border border-info-border shadow-sm overflow-hidden"
        >
          {/* Header dengan Gradasi Tematik & Efek Animasi Shimmer */}
          <div className="relative overflow-hidden bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 px-5 py-4 flex items-center gap-3.5 shadow-sm">
            {/* Layer Animasi Cahaya Bergerak */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay">
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                  opacity: [0, 0.15, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </div>

            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm text-white shrink-0 relative z-10">
              <User className="w-5 h-5" />
            </div>
            <div className="relative z-10">
              <h4 className="text-sm font-bold text-white tracking-wide">Informasi Dasar & Akademik</h4>
              <p className="text-teal-50/80 text-[11px] font-medium mt-0.5">Perbarui data informasi personal, instansi, dan akun akademik Anda.</p>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            {/* Baris Nama & NIM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  disabled={isSubmitLoading}
                  value={formData?.name || ""}
                  onChange={onInputChange}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-700">NIM / NIP</label>
                <input
                  type="text"
                  name="nim_nip"
                  disabled={isSubmitLoading}
                  value={formData?.nim_nip || ""}
                  onChange={onInputChange}
                  placeholder="Contoh: 24SA11A001"
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Alamat Email</label>
              <input
                type="email"
                name="email"
                disabled={isSubmitLoading}
                value={formData?.email || ""}
                onChange={onInputChange}
                placeholder="nama@universitas.ac.id"
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Pemilihan Fakultas & Prodi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Fakultas</label>
                <SearchableSelect
                  options={fakultasOptions}
                  selectedValue={formData?.fakultas_id || ""}
                  placeholder="-- Pilih Fakultas --"
                  disabled={isSubmitLoading}
                  onSelect={(val) => onSelectChange("fakultas_id", val)}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Program Studi</label>
                <SearchableSelect
                  options={prodiOptions}
                  selectedValue={formData?.program_studi_id || ""}
                  placeholder={!formData?.fakultas_id ? "Pilih fakultas terlebih dahulu" : "-- Pilih Program Studi --"}
                  disabled={!formData?.fakultas_id || isSubmitLoading}
                  onSelect={(val) => onSelectChange("program_studi_id", val)}
                />
              </div>
            </div>

            {/* Alamat */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Alamat Rumah</label>
              <textarea
                name="alamat"
                disabled={isSubmitLoading}
                value={formData?.alamat || ""}
                onChange={onInputChange}
                rows={3}
                placeholder="Tuliskan alamat domisili lengkap Anda saat ini..."
                className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition resize-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </motion.div>

        {/* CARD 2: KEAMANAN & UBAH PASSWORD */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="bg-white border border-info-border shadow-sm overflow-hidden"
        >
          {/* Header dengan Gradasi Tematik Keamanan & Efek Animasi Shimmer */}
          <div className="relative overflow-hidden bg-brand-gradient px-5 py-4 flex items-center gap-3.5 shadow-sm">
            {/* Layer Animasi Cahaya Bergerak */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay">
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                  opacity: [0, 0.15, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </div>

            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm text-white shrink-0 relative z-10">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="relative z-10">
              <h4 className="text-sm font-bold text-white tracking-wide">Keamanan Akun</h4>
              <p className="text-slate-200 text-[11px] font-medium mt-0.5">Perbarui kredensial kata sandi berkala Anda untuk proteksi hak akses akun.</p>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            {/* Kata Sandi Lama */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Kata Sandi Lama</label>
              <div className="relative w-full">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="old_password"
                  disabled={isSubmitLoading}
                  value={formData?.old_password || ""}
                  onChange={onInputChange}
                  placeholder="Masukkan kata sandi lama Anda saat ini"
                  className="w-full text-sm pl-3 pr-10 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  disabled={isSubmitLoading}
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:hover:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Kata Sandi Baru & Konfirmasi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kata Sandi Baru</label>
                <div className="relative w-full">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="password"
                    disabled={isSubmitLoading}
                    value={formData?.password || ""}
                    onChange={onInputChange}
                    placeholder="Buat kombinasi sandi baru"
                    className="w-full text-sm pl-3 pr-10 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    disabled={isSubmitLoading}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:hover:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Konfirmasi Kata Sandi</label>
                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    disabled={isSubmitLoading}
                    value={formData?.password_confirmation || ""}
                    onChange={onInputChange}
                    placeholder="Ulangi kombinasi sandi baru"
                    className="w-full text-sm pl-3 pr-10 py-2 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    disabled={isSubmitLoading}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:hover:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TOMBOL AKSI BERSAMA (DI LUAR KEDUA CARD) */}
        <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-2">
          {/* Tombol Simpan Utama */}
          <button
            type="submit"
            disabled={isSubmitLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-700/60 text-white font-bold text-xs rounded-lg transition w-full sm:w-fit cursor-pointer disabled:cursor-not-allowed shadow-sm select-none"
          >
            {isSubmitLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan Seluruh Perubahan...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Semua Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

interface Option {
  id: number | string;
  label: string;
  subLabel?: string;
}

interface SearchableSelectProps {
  options: Option[];
  selectedValue: string | number;
  placeholder: string;
  disabled?: boolean;
  onSelect: (value: string) => void;
}

function SearchableSelect({
  options = [],
  selectedValue,
  placeholder,
  disabled = false,
  onSelect,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!isOpen) setSearchQuery("");
  }, [isOpen]);

  const selectedOption = options.find((opt) => String(opt.id) === String(selectedValue));

  const filteredOptions = options.filter(
    (opt) =>
      opt?.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt?.subLabel && opt?.subLabel?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div ref={containerRef} className="relative w-full z-20">
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full text-left text-sm px-3 py-2 border border-slate-200 rounded-lg bg-slate-50/50 transition-all duration-200 ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400"
            : "cursor-pointer hover:bg-slate-100/50"
        } ${isOpen ? "ring-2 ring-teal-100 border-teal-500 bg-white" : ""}`}
      >
        <span className={selectedOption ? "text-slate-800 font-medium" : "text-slate-400"}>
          {selectedOption
            ? selectedOption.subLabel
              ? `${selectedOption.label} (${selectedOption.subLabel})`
              : selectedOption.label
            : placeholder}
        </span>
        <div className="flex items-center gap-1.5">
          {selectedValue && !disabled && (
            <X
              className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSelect("");
                setSearchQuery("");
              }}
            />
          )}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 w-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col"
          >
            <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2 sticky top-0">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              <input
                type="text"
                placeholder="Ketik untuk mencari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-transparent text-xs font-medium text-slate-700 border-none outline-none focus:ring-0 p-1"
                autoFocus
              />
            </div>

            <div className="overflow-y-auto flex-1 max-h-44 divide-y divide-slate-50">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = String(opt.id) === String(selectedValue);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => {
                        onSelect(String(opt.id));
                        setIsOpen(false);
                      }}
                      className={`px-4 py-2.5 text-xs font-medium cursor-pointer transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-teal-50 text-teal-700 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {opt.subLabel && (
                        <span className={`text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded border transition-colors ${
                          isSelected 
                            ? "bg-teal-600/10 border-teal-500/20 text-teal-700"
                            : "bg-slate-100 border-slate-200 text-slate-500"
                        }`}>
                          {opt.subLabel}
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-4 text-center text-xs text-slate-400 italic">
                  Data tidak ditemukan
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}