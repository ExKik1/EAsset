import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { XCircle, RefreshCw } from "lucide-react";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useAuthSession } from "../../../hooks/useAuthSession";
import api from "../../../utils/api";

import AsetHeader from "../../../components/aset/AsetHeader";
import AsetFilters from "../../../components/aset/AsetFilters";
import AsetTable from "../../../components/aset/AsetTable";
import TablePagination from "../../../components/ui/TablePagination";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { NotificationToast } from "../../../components/ui/NotificationToast";

interface AsetData {
  id: number;
  kode_qr: string;
  nama_barang: string;
  kode_barang: string;
  kategori_aset_id: number;
  stok: number;
  status: "tersedia" | "dipinjam" | "rusak";
  deskripsi: string | null;
  foto_barang: string | null;
  kategori_aset?: { nama_kategori: string };
}

interface KategoriOpsi {
  id: number;
  nama_kategori: string;
}

export default function AsetPage() {
  useDocumentTitle("Sistem Logistik Master Aset");
  const { token } = useAuthSession();

  const [asetList, setAsetList] = useState<AsetData[]>([]);
  const [daftarKategori, setDaftarKategori] = useState<KategoriOpsi[]>([]);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // State Filter Utama & Sinkronisasi Komponen AsetFilters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [toastType, setToastType] = useState<"success" | "danger">("success");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAset, setSelectedAset] = useState<AsetData | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);

  // Reset pagination ke page 1 jika parameter filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedKategori, selectedStatus]);

  useEffect(() => {
    if (token) fetchAsetData();
  }, [token]);

  const fetchAsetData = async () => {
    setIsFetchLoading(true);
    setErrorMsg("");
    try {
      const response = await api.get("/assets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = response.data.data || response.data;
      const validArray = Array.isArray(result) ? result : [];
      setAsetList(validArray);

      // Ekstraksi otomatis daftar kategori unik dari relasi data aset
      const kategoriMap = new Map<number, string>();
      validArray.forEach((item) => {
        if (item.kategori_aset_id && item.kategori_aset?.nama_kategori) {
          kategoriMap.set(
            item.kategori_aset_id,
            item.kategori_aset.nama_kategori,
          );
        }
      });

      const opsiKategori: KategoriOpsi[] = Array.from(
        kategoriMap.entries(),
      ).map(([id, nama_kategori]) => ({ id, nama_kategori }));
      setDaftarKategori(opsiKategori);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Gagal memuat arsitektur database master aset dari server.");
    } finally {
      setIsFetchLoading(false);
    }
  };

  const handleOpenDeleteModal = (item: AsetData) => {
    setSelectedAset(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedAset) return;
    setIsSubmitLoading(true);
    try {
      await api.delete(`/assets/${selectedAset.kode_qr}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToastType("success");
      setToastMessages([
        `Aset ${selectedAset.nama_barang} berhasil diremove dari gudang sistem.`,
      ]);
      setIsDeleteModalOpen(false);
      setSelectedAset(null);
      fetchAsetData();
    } catch (err: any) {
      console.error(err);
      const errMsg =
        err.response?.data?.message || "Gagal menghapus entitas logistik aset.";
      setToastType("danger");
      setToastMessages([errMsg]);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Logika Multi-Filter Terbimbing (Teks Search, Kategori, & Status)
  const filteredAset = asetList.filter((item) => {
    const query = searchQuery.toLowerCase().trim();

    // 1. Filter Teks Pencarian (Diperluas hingga ke deskripsi & nama kategori)
    const matchQuery =
      !query ||
      item.nama_barang.toLowerCase().includes(query) ||
      item.kode_barang.toLowerCase().includes(query) ||
      item.kode_qr.toLowerCase().includes(query) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(query)) ||
      (item.kategori_aset?.nama_kategori &&
        item.kategori_aset.nama_kategori.toLowerCase().includes(query));

    // 2. Filter Dropdown Kategori Aset (Pencarian Tepat/Exact Match)
    const matchKategori =
      !selectedKategori ||
      (item.kategori_aset?.nama_kategori &&
        item.kategori_aset.nama_kategori.toLowerCase() ===
          selectedKategori.toLowerCase());

    // 3. Filter Dropdown Status Logistik
    const matchStatus =
      !selectedStatus ||
      item.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchQuery && matchKategori && matchStatus;
  });

  // Kalkulasi Pembagian Data Halaman (Pagination)
  const totalItems = filteredAset.length;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentDataSlice = filteredAset.slice(
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
          <AsetHeader
            isFetchLoading={isFetchLoading}
            onRefresh={fetchAsetData}
          />

          {/* Pembaruan Props Filter Menggunakan Model Custom Searchable Dropdown */}
          <AsetFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedKategori={selectedKategori}
            setSelectedKategori={setSelectedKategori}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            daftarKategori={daftarKategori}
          />

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-md">
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          <div className="bg-white border border-info-border shadow-md overflow-hidden flex flex-col">
            <AsetTable
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

        {/* Modal Konfirmasi Hapus Data */}
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
                      Hapus Entitas Aset?
                    </h4>
                    <p className="text-[11px] text-rose-500 font-semibold mt-0.5 uppercase tracking-wider">
                      Tindakan Permanen
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed bg-slate-50 p-3.5 border border-slate-100 rounded-md">
                  Apakah Anda yakin menghapus aset logistik berikut:
                  <strong className="text-slate-900 font-bold block mt-1">
                    {selectedAset?.nama_barang} ({selectedAset?.kode_barang})
                  </strong>
                  Penghapusan akan mempengaruhi log audit, pelaporan data
                  sirkulasi, dan record inventaris internal secara permanen.
                </p>

                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer transition-all border border-transparent hover:border-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSubmit}
                    disabled={isSubmitLoading}
                    className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md shadow-md disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitLoading ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Menghapus...</span>
                      </>
                    ) : (
                      <span>Ya, Hapus Aset</span>
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
