import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Save,
  PlusCircle,
  RefreshCw,
  FileText,
  RotateCcw,
  Search,
  ChevronDown,
} from "lucide-react";
import { useAuthSession } from "../../../hooks/useAuthSession";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { NotificationToast } from "../../../components/ui/NotificationToast";

interface FakultasOption {
  id: number;
  nama_fakultas: string;
  kode_fakultas: string;
}

export default function ProdiCreate() {
  useDocumentTitle("Tambah Master Program Studi Baru");
  const { token } = useAuthSession();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [fakultasOptions, setFakultasOptions] = useState<FakultasOption[]>([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    fakultas_id: "",
    kode_prodi: "",
    nama_prodi: "",
    deskripsi: "",
  });

  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [toastType, setToastType] = useState<"success" | "danger">("success");

  useEffect(() => {
    if (token) fetchFakultasOptions();
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchFakultasOptions = async () => {
    try {
      const response = await api.get("/faculties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = response.data.data || response.data;
      setFakultasOptions(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Gagal memuat list fakultas untuk dropdown:", err);
    }
  };

  const handleResetForm = () => {
    setForm({
      fakultas_id: "",
      kode_prodi: "",
      nama_prodi: "",
      deskripsi: "",
    });
    setSearchQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fakultas_id) {
      setToastType("danger");
      setToastMessages(["Silakan pilih fakultas induk terlebih dahulu."]);
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/prodi", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToastType("success");
      setToastMessages([
        "Program Studi baru sukses ditambahkan ke database master data!",
      ]);

      setTimeout(() => {
        navigate("/prodi");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      const dataResponse = err.response?.data;
      let parsedMessages: string[] = [];

      if (dataResponse) {
        const nestedErrors = dataResponse.errors;
        const mainMessage = dataResponse.message;

        if (Array.isArray(nestedErrors)) {
          parsedMessages = nestedErrors;
        } else if (nestedErrors && typeof nestedErrors === "object") {
          parsedMessages = Object.values(nestedErrors).flat() as string[];
        } else if (typeof mainMessage === "string") {
          parsedMessages = [mainMessage];
        }
      }

      if (parsedMessages.length === 0) {
        parsedMessages = [
          "Terjadi galat saat menyimpan data master program studi.",
        ];
      }

      setToastType("danger");
      setToastMessages(parsedMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFakultas = fakultasOptions.filter(
    (f) =>
      f.nama_fakultas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.kode_fakultas.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedFakultasLabel = fakultasOptions.find(
    (f) => String(f.id) === form.fakultas_id,
  );

  return (
    <DashboardLayout>
      <NotificationToast
        messages={toastMessages}
        type={toastType}
        onClose={() => setToastMessages([])}
      />

      <div className="bg-slate-50 text-slate-900 font-sans flex flex-col w-full relative">
        <div className="flex flex-col w-full p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6 max-w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 border border-info-border shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PlusCircle className="w-5 h-5 text-primary" />
                <h3 className="text-xl sm:text-2xl font-black color-span-g tracking-tight">
                  Tambah Program Studi
                </h3>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm">
                Formulir pembuatan entitas master data program studi baru pada
                lingkungan civitas akademik.
              </p>
            </div>

            <Link
              to="/prodi"
              className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition rounded-md shadow-sm cursor-pointer h-fit self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Tabel</span>
            </Link>
          </div>

          <div className="bg-white border border-info-border shadow-md overflow-hidden mb-2">
            <div className="relative overflow-hidden px-6 py-4 bg-brand-gradient border-b border-slate-200/70 flex items-center gap-2 text-white">
              <motion.div
                animate={{ x: ["-100%", "200%"], opacity: [0, 0.2, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
              />
              <FileText className="w-4 h-4 z-10" />
              <h3 className="text-xs font-bold uppercase tracking-wide z-10">
                Informasi Utama Atribut Program Studi
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-1 relative" ref={dropdownRef}>
                  <label className="block text-xs font-medium text-slate-600 uppercase mb-1.5 tracking-wide">
                    Fakultas Induk <span className="text-rose-500">*</span>
                  </label>

                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-info-border rounded-md text-sm font-medium text-slate-800 flex items-center justify-between transition-all duration-200 cursor-pointer hover:bg-slate-100/50"
                  >
                    <span
                      className={
                        selectedFakultasLabel
                          ? "text-slate-800"
                          : "text-slate-400 font-normal"
                      }
                    >
                      {selectedFakultasLabel
                        ? `${selectedFakultasLabel.nama_fakultas} (${selectedFakultasLabel.kode_fakultas})`
                        : "-- Pilih Fakultas --"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-md shadow-xl max-h-64 overflow-hidden flex flex-col"
                      >
                        <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2 sticky top-0">
                          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                          <input
                            type="text"
                            placeholder="Cari nama atau kode..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-transparent text-xs font-medium text-slate-700 outline-hidden border-none p-1 focus:ring-0"
                          />
                        </div>

                        <div className="overflow-y-auto flex-1 max-h-48 divide-y divide-slate-50">
                          {filteredFakultas.length > 0 ? (
                            filteredFakultas.map((f) => (
                              <div
                                key={f.id}
                                onClick={() => {
                                  setForm({
                                    ...form,
                                    fakultas_id: String(f.id),
                                  });
                                  setIsDropdownOpen(false);
                                  setSearchQuery("");
                                }}
                                className={`px-4 py-2.5 text-xs font-medium cursor-pointer transition-colors flex items-center justify-between ${
                                  form.fakultas_id === String(f.id)
                                    ? "bg-primary/5 text-primary"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <span>{f.nama_fakultas}</span>
                                <span className="text-[10px] font-mono tracking-wider bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
                                  {f.kode_fakultas}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-4 text-center text-xs text-slate-400 italic">
                              Fakultas tidak ditemukan
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-slate-600 uppercase mb-1.5 tracking-wide">
                    Kode Prodi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: IF"
                    value={form.kode_prodi}
                    onChange={(e) =>
                      setForm({ ...form, kode_prodi: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-info-border rounded-md font-mono text-sm font-normal text-slate-800 tracking-wide placeholder:font-sans placeholder:font-normal placeholder:normal-case focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-slate-600 uppercase mb-1.5 tracking-wide">
                    Nama Program Studi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Informatika"
                    value={form.nama_prodi}
                    onChange={(e) =>
                      setForm({ ...form, nama_prodi: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-info-border rounded-md text-sm font-normal text-slate-800 placeholder:font-normal focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 uppercase mb-1.5 tracking-wide">
                  Deskripsi / Keterangan
                </label>
                <textarea
                  placeholder="Berikan deskripsi singkat mengenai program studi ini (opsional)..."
                  rows={5}
                  value={form.deskripsi}
                  onChange={(e) =>
                    setForm({ ...form, deskripsi: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-info-border rounded-md text-sm text-slate-700 leading-relaxed placeholder:font-normal focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Prodi</span>
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
