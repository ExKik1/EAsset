import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { XCircle, RefreshCw } from "lucide-react";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useAuthSession } from "../../../hooks/useAuthSession";
import api from "../../../utils/api";

import UserHeader from "../../../components/users/UserHeader";
import UserFilters from "../../../components/users/UserFilters";
import UserTable from "../../../components/users/UserTable";
import TablePagination from "../../../components/ui/TablePagination";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { NotificationToast } from "../../../components/ui/NotificationToast";

interface UserData {
  id: number;
  name: string;
  email: string;
  nim_nip: string | null;
  role: string;
  profile: string | null;
  fakultas?: { nama_fakultas: string };
  program_studi?: { nama_prodi: string };
}

export default function UserPage() {
  useDocumentTitle("Manajemen Otentikasi Pengguna");
  const { token } = useAuthSession();

  const [userList, setUserList] = useState<UserData[]>([]);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [toastType, setToastType] = useState<"success" | "danger">("success");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (token) fetchUserData();
  }, [token]);

  const fetchUserData = async () => {
    setIsFetchLoading(true);
    setErrorMsg("");
    try {
      const response = await api.get("/data-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = response.data.data || response.data;
      setUserList(Array.isArray(result) ? result : []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        "Gagal memuat master data operasional pengguna dari server Laravel.",
      );
    } finally {
      setIsFetchLoading(false);
    }
  };

  const handleOpenDeleteModal = (item: UserData) => {
    setSelectedUser(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;
    setIsSubmitLoading(true);
    try {
      await api.delete(`/data-users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToastType("success");
      setToastMessages([
        `Akun internal ${selectedUser.name} berhasil dihapus permanen.`,
      ]);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUserData();
    } catch (err: any) {
      console.error(err);
      const errMsg =
        err.response?.data?.message || "Gagal menghapus entitas pengguna.";
      setToastType("danger");
      setToastMessages([errMsg]);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const filteredUsers = userList.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      (item.nim_nip && item.nim_nip.toLowerCase().includes(query)) ||
      item.role.toLowerCase().includes(query) ||
      (item.fakultas?.nama_fakultas &&
        item.fakultas.nama_fakultas.toLowerCase().includes(query)) ||
      (item.program_studi?.nama_prodi &&
        item.program_studi.nama_prodi.toLowerCase().includes(query))
    );
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentDataSlice = filteredUsers.slice(
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
          <UserHeader
            isFetchLoading={isFetchLoading}
            onRefresh={fetchUserData}
          />
          <UserFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-md">
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          <div className="bg-white border border-info-border shadow-md overflow-hidden flex flex-col">
            <UserTable
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
                      Hapus Hak Akses User?
                    </h4>
                    <p className="text-[11px] text-rose-500 font-semibold mt-0.5 uppercase tracking-wider">
                      Tindakan Irreversible
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed bg-slate-50 p-3.5 border border-slate-100 rounded-md">
                  Apakah Anda yakin menghapus data pengguna atas nama:
                  <strong className="text-slate-900 font-bold block mt-1">
                    {selectedUser?.name} ({selectedUser?.email})
                  </strong>
                  Semua sesi masuk, riwayat operasional, dan parameter relasi
                  data terkait akan terputus.
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
                      <span>Ya, Hapus Akun</span>
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
