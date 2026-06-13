import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { XCircle } from "lucide-react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

import NavbarMain from "../../components/NavbarMain";
import SidebarMain from "../../components/SidebarMain";
import FooterMain from "../../components/FooterMain";
import api from "../../utils/api";

import HistoryLogHeader from "../../components/history/HistoryLogHeader";
import HistoryLogFilters from "../../components/history/HistoryLogFilters";
import HistoryLogTable from "../../components/history/HistoryLogTable";
import HistoryLogPagination from "../../components/history/HistoryLogPagination";

interface LogData {
  id: number;
  file_name: string;
  file_size: string;
  action_type: "encrypt" | "decrypt";
  status: "success" | "failed";
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export default function HistoryLog() {
  useDocumentTitle("History Logs");
  const [logs, setLogs] = useState<LogData[]>([]);
  const [userName, setUserName] = useState<string>("Memuat Sesi...");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isFetchLoading, setIsFetchLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "success" | "failed"
  >("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        const extractedName =
          data.name ||
          (data.user && data.user.name) ||
          (data.data && data.data.name) ||
          "Authenticated User";

        setUserName(extractedName);
      } catch (err) {
        console.error("Gagal mengambil data profil:", err);
        setUserName("Offline Mode User");
      }
    };

    fetchUserProfile();
    fetchLogsData();
  }, []);

  const fetchLogsData = async () => {
    setIsFetchLoading(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await api.get("/logs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const logsResult = response.data.data || response.data;
      setLogs(Array.isArray(logsResult) ? logsResult : []);
    } catch (err: any) {
      console.error("Gagal mengambil log riwayat:", err);
      setErrorMsg("Gagal memuat riwayat data aktivitas dari server Laravel.");
    } finally {
      setIsFetchLoading(false);
    }
  };

  const handleLogout = () => {
    const pendingMessage = sessionStorage.getItem("logout_success_message");
    const rememberEmail = localStorage.getItem("fluxion_remember_email");
    localStorage.removeItem("token");
    localStorage.clear();
    sessionStorage.clear();

    if (rememberEmail) {
      localStorage.setItem("fluxion_remember_email", rememberEmail);
    }

    if (pendingMessage) {
      sessionStorage.setItem("logout_success_message", pendingMessage);
    }

    window.location.replace("/auth/login");
  };

  const filteredLogs = logs.filter((log) => {
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      log.file_name.toLowerCase().includes(query) ||
      log.file_size.toLowerCase().includes(query) ||
      log.action_type.toLowerCase().includes(query) ||
      (log.ip_address && log.ip_address.toLowerCase().includes(query)) ||
      (log.user_agent && log.user_agent.toLowerCase().includes(query)) ||
      new Date(log.created_at)
        .toLocaleDateString("id-ID")
        .toLowerCase()
        .includes(query);

    return matchesStatus && matchesSearch;
  });

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const indexOfLastItem = currentPage * perPage;
  const indexOfFirstItem = indexOfLastItem - perPage;
  const currentLogsSlice = filteredLogs.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  return (
    <div className="bg-slate-50 text-slate-900 font-sans lg:overflow-hidden flex flex-col min-h-screen">
      <NavbarMain
        onOpenSidebar={() => setMobileSidebarOpen(true)}
        userName={userName}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <SidebarMain
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          file={null}
          userName={userName}
          onLogout={handleLogout}
        />

        <div className="flex flex-col w-full">
          <div className="flex flex-col w-full overflow-y-auto bg-slate-100 py-6 px-3 sm:px-6 lg:px-8 pb-16 sm:pb-20">
            <div className="max-w-6xl mx-auto w-full space-y-4 sm:space-y-6">
              <HistoryLogHeader
                isFetchLoading={isFetchLoading}
                onRefresh={fetchLogsData}
              />

              <HistoryLogFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />

              <AnimatePresence mode="wait">
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-lg flex items-center gap-3 shadow-sm"
                  >
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    <p className="font-medium">{errorMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-white border border-info-border shadow-md overflow-hidden flex flex-col">
                <HistoryLogTable
                  currentLogs={currentLogsSlice}
                  isFetchLoading={isFetchLoading}
                  indexOfFirstItem={indexOfFirstItem}
                />

                <HistoryLogPagination
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
          <FooterMain />
        </div>
      </main>
    </div>
  );
}
