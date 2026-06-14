import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { XCircle, RefreshCw } from "lucide-react";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useAuthSession } from "../../../hooks/useAuthSession";
import api from "../../../utils/api";

import ProdiHeader from "../../../components/prodi/ProdiHeader";
import ProdiFilters from "../../../components/prodi/ProdiFilters";
import ProdiTable from "../../../components/prodi/ProdiTable";
import TablePagination from "../../../components/ui/TablePagination";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { NotificationToast } from "../../../components/ui/NotificationToast";

interface FakultasRelation {
  id: number;
  kode_fakultas: string;
  nama_fakultas: string;
}

interface Prodi {
  id: number;
  fakultas_id: number;
  kode_prodi: string;
  nama_prodi: string;
  deskripsi: string | null;
  created_at: string;
  fakultas?: FakultasRelation;
}

export default function ProdiPage() {
  useDocumentTitle("Manajemen Master Program Studi");
  const { token } = useAuthSession();

  const [prodiList, setProdiList] = useState<Prodi[]>([]);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [toastType, setToastType] = useState<"success" | "danger">("success");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProdi, setSelectedProdi] = useState<Prodi | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (token) fetchProdiData();
  }, [token]);

  const fetchProdiData = async () => {
    setIsFetchLoading(true);
    setErrorMsg("");
    try {
      const response = await api.get("/prodi", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = response.data.data || response.data;
      setProdiList(Array.isArray(result) ? result : []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        "Gagal memuat master data program studi dari server Laravel.",
      );
    } finally {
      setIsFetchLoading(false);
    }
  };

  const handleOpenDeleteModal = (item: Prodi) => {
    setSelectedProdi(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedProdi) return;
    setIsSubmitLoading(true);
    try {
      await api.delete(`/prodi/${selectedProdi.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToastType("success");
      setToastMessages([
        `Program Studi ${selectedProdi.nama_prodi} berhasil dihapus secara permanen.`,
      ]);

      setIsDeleteModalOpen(false);
      setSelectedProdi(null);
      fetchProdiData();
    } catch (err: any) {
      console.error(err);
      const errMsg =
        err.response?.data?.message || "Gagal menghapus data dari server.";
      setToastType("danger");
      setToastMessages([errMsg]);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const filteredProdi = prodiList.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      !query ||
      item.kode_prodi.toLowerCase().includes(query) ||
      item.nama_prodi.toLowerCase().includes(query) ||
      (item.fakultas?.nama_fakultas &&
        item.fakultas.nama_fakultas.toLowerCase().includes(query)) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(query))
    );
  });

  const totalItems = filteredProdi.length;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentDataSlice = filteredProdi.slice(
    indexOfFirstItem,
    indexOfLastItem,
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
          <ProdiHeader
            isFetchLoading={isFetchLoading}
            onRefresh={fetchProdiData}
          />

          <ProdiFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-md">
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          <div className="bg-white border border-info-border shadow-md overflow-hidden flex flex-col">
            <ProdiTable
              currentData={currentDataSlice}
              isFetchLoading={isFetchLoading}
              indexOfFirstItem={indexOfFirstItem}
              onOpenDeleteModal={handleOpenDeleteModal}
            />

            <TablePagination
              perPage={perPage}
              setPerPage={setPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              totalPages={totalPages}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
            />
          </div>
        </div>

        <AnimatePresence>
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDeleteModalOpen(false)}
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="bg-white rounded-md shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden relative z-10 p-6 space-y-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-md text-rose-600 shrink-0">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-base">
                      Hapus Data Prodi?
                    </h4>
                    <p className="text-[11px] text-rose-500 font-semibold mt-0.5 uppercase tracking-wider">
                      Tindakan Irreversible
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed bg-slate-50 p-3.5 border border-slate-100 rounded-md">
                  Apakah Anda yakin menghapus program studi{" "}
                  <strong className="text-slate-900 font-bold block mt-1">
                    {selectedProdi?.nama_prodi} ({selectedProdi?.kode_prodi})
                  </strong>
                  Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
                </p>

                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer transition-all duration-200 border border-transparent hover:border-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSubmit}
                    disabled={isSubmitLoading}
                    className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md shadow-md shadow-rose-600/10 disabled:opacity-50 cursor-pointer transition-all duration-200 flex items-center gap-2"
                  >
                    {isSubmitLoading ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Menghapus...</span>
                      </>
                    ) : (
                      <span>Ya, Hapus Data</span>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
