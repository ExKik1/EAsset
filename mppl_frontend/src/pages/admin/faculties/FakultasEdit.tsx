import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  FileText,
  Edit3,
  RotateCcw,
} from "lucide-react";
import { useAuthSession } from "../../../hooks/useAuthSession";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import api from "../../../utils/api";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { NotificationToast } from "../../../components/ui/NotificationToast";

export default function FakultasEdit() {
  useDocumentTitle("Ubah Data Master Fakultas");
  const { token } = useAuthSession();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [form, setForm] = useState({
    kode_fakultas: "",
    nama_fakultas: "",
    deskripsi: "",
  });

  const handleResetForm = () => {
    setForm({
      kode_fakultas: "",
      nama_fakultas: "",
      deskripsi: "",
    });
  };

  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [toastType, setToastType] = useState<"success" | "danger">("success");

  useEffect(() => {
    if (token && id) fetchExistingFakultas();
  }, [token, id]);

  const fetchExistingFakultas = async () => {
    try {
      const response = await api.get(`/faculties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data.data || response.data;
      setForm({
        kode_fakultas: data.kode_fakultas || "",
        nama_fakultas: data.nama_fakultas || "",
        deskripsi: data.deskripsi || "",
      });
    } catch (err) {
      console.error(err);
      setToastType("danger");
      setToastMessages(["Gagal mengambil data detail fakultas dari server."]);
      setTimeout(() => {
        navigate("/faculties");
      }, 1500);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      await api.put(`/faculties/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToastType("success");
      setToastMessages(["Perubahan master data fakultas berhasil disimpan!"]);

      setTimeout(() => {
        navigate("/faculties");
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
        } else if (Array.isArray(mainMessage)) {
          parsedMessages = mainMessage;
        } else if (mainMessage && typeof mainMessage === "object") {
          parsedMessages = Object.values(mainMessage).flat() as string[];
        } else if (typeof mainMessage === "string") {
          parsedMessages = [mainMessage];
        }
      }

      if (parsedMessages.length === 0) {
        parsedMessages = [
          "Terjadi galat saat memperbarui data master fakultas.",
        ];
      }

      setToastType("danger");
      setToastMessages(parsedMessages);
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
        <div className="flex flex-col w-full p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6 max-w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 border border-info-border shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Edit3 className="w-5 h-5 text-primary" />
                <h3 className="text-xl sm:text-2xl font-black color-span-g tracking-tight">
                  Ubah Data Fakultas
                </h3>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm">
                Formulir pembaruan entitas master data fakultas pada lingkungan
                civitas akademik.
              </p>
            </div>

            <Link
              to="/faculties"
              className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition rounded-md shadow-sm cursor-pointer h-fit self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Tabel</span>
            </Link>
          </div>

          <div className="bg-white border border-info-border shadow-md overflow-hidden mb-2">
            <div className="relative overflow-hidden px-6 py-4 bg-brand-gradient border-b border-slate-200/70 flex items-center gap-2 text-white">
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                  opacity: [0, 0.2, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
              />
              <FileText className="w-4 h-4 z-10" />
              <h3 className="text-xs font-bold uppercase tracking-wide z-10">
                Informasi Utama Atribut Fakultas
              </h3>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wide">
                    Kode Fakultas <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: FIK"
                    value={form.kode_fakultas}
                    onChange={(e) =>
                      setForm({ ...form, kode_fakultas: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-info-border rounded-md font-mono text-sm font-semibold text-slate-800 uppercase tracking-wide placeholder:font-sans placeholder:font-normal placeholder:normal-case focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wide">
                    Nama Fakultas <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Fakultas Ilmu Komputer"
                    value={form.nama_fakultas}
                    onChange={(e) =>
                      setForm({ ...form, nama_fakultas: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-info-border rounded-md text-sm font-semibold text-slate-800 placeholder:font-normal focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 tracking-wide">
                  Deskripsi / Keterangan
                </label>
                <textarea
                  placeholder="Berikan deskripsi atau cakupan singkat mengenai fakultas ini (opsional)..."
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
                  disabled={isSubmitLoading}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-brand-gradient rounded-md shadow-md shadow-emerald-950/10 hover:brightness-105 active:scale-[0.98] disabled:opacity-50 cursor-pointer transition-all duration-200"
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
