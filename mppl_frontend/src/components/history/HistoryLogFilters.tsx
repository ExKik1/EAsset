import { Search, Filter } from "lucide-react";

interface HistoryLogFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "all" | "success" | "failed";
  setStatusFilter: (status: "all" | "success" | "failed") => void;
}

export default function HistoryLogFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: HistoryLogFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3 sm:p-4 border border-info-border shadow-sm">
      <div className="relative md:col-span-2">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama file, ukuran, tipe aksi, tanggal..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg bg-slate-50 border border-[#cecece] focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/20 focus:border-[#0b2f9f] text-xs sm:text-sm shadow-inner"
        />
      </div>

      <div className="relative">
        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="w-full pl-10 pr-8 py-2 sm:py-2.5 rounded-lg bg-slate-50 border border-[#cecece] focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/20 focus:border-[#0b2f9f] text-xs sm:text-sm appearance-none cursor-pointer font-medium text-slate-700 shadow-sm"
        >
          <option value="all">Semua Status (All)</option>
          <option value="success">Sukses (Success)</option>
          <option value="failed">Gagal (Failed)</option>
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0" />
      </div>
    </div>
  );
}
