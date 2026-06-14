import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { XCircle, RefreshCw } from "lucide-react";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useAuthSession } from "../../../hooks/useAuthSession";
import api from "../../../utils/api";

import KategoriAsetHeader from "../../../components/categories_assets/KategoriAsetHeader";
import KategoriAsetFilters from "../../../components/categories_assets/KategoriAsetFilters";
import KategoriAsetTable from "../../../components/categories_assets/KategoriAsetTable";
import TablePagination from "../../../components/ui/TablePagination";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { NotificationToast } from "../../../components/ui/NotificationToast";

interface KategoriAset {
  id: number;
  kode_kategori: string;
  nama_kategori: string;
  deskripsi: string | null;
  created_at: string;
}

export default function KategoriAsetPage() {
  useDocumentTitle("Manajemen Master Kategori Aset");
  const { token } = useAuthSession();

  const [categories, setCategories] = useState<KategoriAset[]>([]);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [toastType, setToastType] = useState<"success" | "danger">("success");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState<KategoriAset | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (token) fetchCategoryData();
  }, [token]);

  const fetchCategoryData = async () => {
    setIsFetchLoading(true);
    setErrorMsg("");
    try {
      const response = await api.get("/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = response.data.data || response.data;
      setCategories(Array.isArray(result) ? result : []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        "Gagal memuat master data kategori aset dari server Laravel.",
      );
    } finally {
      setIsFetchLoading(false);
    }
  };

  const handleOpenDeleteModal = (item: KategoriAset) => {
    setSelectedKategori(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedKategori) return;
    setIsSubmitLoading(true);
    try {
      await api.delete(`/categories/${selectedKategori.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToastType("success");
      setToastMessages([
        `Kategori ${selectedKategori.nama_kategori} berhasil dihapus secara permanen.`,
      ]);

      setIsDeleteModalOpen(false);
      setSelectedKategori(null);
      fetchCategoryData();
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

  const filteredCategories = categories.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      !query ||
      item.kode_kategori.toLowerCase().includes(query) ||
      item.nama_kategori.toLowerCase().includes(query) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(query))
    );
  });

  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentDataSlice = filteredCategories.slice(
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

      <div className="bg-slate-50 text-slate-900 font-sans flex flex-col min-h-screen relative">
        <div className="flex flex-col w-full p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
          <KategoriAsetHeader
            isFetchLoading={isFetchLoading}
            onRefresh={fetchCategoryData}
          />

          <KategoriAsetFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-md">
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          <div className="bg-white border border-info-border shadow-md overflow-hidden flex flex-col">
            <KategoriAsetTable
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
                    Hapus Kategori Aset?
                  </h4>
                  <p className="text-[11px] text-rose-500 font-semibold mt-0.5 uppercase tracking-wider">
                    Tindakan Irreversible
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed bg-slate-50 p-3.5 border border-slate-100 rounded-md">
                Apakah Anda yakin ingin menghapus kategori aset{" "}
                <strong className="text-slate-900 font-bold block mt-1">
                  {selectedKategori?.nama_kategori} (
                  {selectedKategori?.kode_kategori})
                </strong>
                Tindakan ini permanen dan berpotensi memutus relasi inventaris
                barang yang terkait di database.
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
    </DashboardLayout>
  );
}
