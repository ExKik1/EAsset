import { useState, useEffect } from "react";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useAuthSession } from "../../../hooks/useAuthSession";
import api from "../../../utils/api";

import LogAuditHeader from "../../../components/audit_logs/LogAuditHeader";
import LogAuditFilters from "../../../components/audit_logs/LogAuditFilters";
import LogAuditTable from "../../../components/audit_logs/LogAuditTable";
import TablePagination from "../../../components/ui/TablePagination";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { NotificationToast } from "../../../components/ui/NotificationToast";

interface LogAuditItem {
  id: number;
  user_id: number | null;
  aksi: string;
  deskripsi: string;
  alamat_ip: string | null;
  created_at: string;
  user?: {
    name: string;
    email: string;
  } | null;
}

export default function LogAuditPage() {
  useDocumentTitle("Log Audit Aktivitas Sistem");
  const { token } = useAuthSession();

  const [logs, setLogs] = useState<LogAuditItem[]>([]);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [toastMessages, setToastMessages] = useState<string[]>([]);
  const [toastType, setToastType] = useState<"success" | "danger">("success");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);

  // Reset pagination ke page 1 ketika parameter pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, actionFilter]);

  useEffect(() => {
    if (token) fetchAuditLogData();
  }, [token]);

  const fetchAuditLogData = async () => {
    setIsFetchLoading(true);
    setErrorMsg("");
    try {
      const response = await api.get("/audit-logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Menyesuaikan format pembungkusan data API RESTful Laravel
      const result = response.data.data || response.data;
      setLogs(Array.isArray(result) ? result : []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Gagal melakukan penarikan rekam jejak log audit dari repositori server.");
      setToastType("danger");
      setToastMessages(["Koneksi server gagal disinkronkan."]);
    } finally {
      setIsFetchLoading(false);
    }
  };

  // Proses Filtering Client-Side 
  const filteredLogs = logs.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesAction = !actionFilter || item.aksi.toUpperCase().includes(actionFilter.toUpperCase());
    
    const userName = item.user?.name?.toLowerCase() || "system visitor";
    const userEmail = item.user?.email?.toLowerCase() || "";
    const description = item.deskripsi.toLowerCase();
    const ipAddress = item.alamat_ip?.toLowerCase() || "";

    const matchesQuery = 
      !query ||
      userName.includes(query) ||
      userEmail.includes(query) ||
      description.includes(query) ||
      ipAddress.includes(query);

    return matchesAction && matchesQuery;
  });

  // Kalkulasi Pagination Data Slice
  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentDataSlice = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <DashboardLayout>
      <NotificationToast
        messages={toastMessages}
        type={toastType}
        onClose={() => setToastMessages([])}
      />

      <div className="bg-slate-50 text-slate-900 font-sans flex flex-col min-h-screen relative">
        <div className="flex flex-col w-full p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
          {/* Header Panel */}
          <LogAuditHeader
            isFetchLoading={isFetchLoading}
            onRefresh={fetchAuditLogData}
          />

          {/* Filters Panel */}
          <LogAuditFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            actionFilter={actionFilter}
            setActionFilter={setActionFilter}
          />

          {/* Error Message Panel */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-md">
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          {/* Data Table Base Grid */}
          <div className="bg-white border border-info-border shadow-md overflow-hidden flex flex-col">
            <LogAuditTable
              currentData={currentDataSlice}
              isFetchLoading={isFetchLoading}
              indexOfFirstItem={indexOfFirstItem}
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
    </DashboardLayout>
  );
}