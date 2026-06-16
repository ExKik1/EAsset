import { Search, Terminal } from "lucide-react";

interface LogAuditFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  actionFilter: string;
  setActionFilter: (action: string) => void;
}

export default function LogAuditFilters({
  searchQuery,
  setSearchQuery,
  actionFilter,
  setActionFilter,
}: LogAuditFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-3 sm:p-4 border border-info-border shadow-sm">
      {/* Kolom Pencarian Teks */}
      <div className="relative w-full md:col-span-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan pelaksana (User), deskripsi kronologi, atau alamat IP..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg bg-slate-50 border border-[#cecece] focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/20 focus:border-[#0b2f9f] text-xs sm:text-sm shadow-inner"
        />
      </div>

      {/* Filter Tipe Aksi */}
      <div className="relative w-full md:col-span-1">
        <Terminal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg bg-slate-50 border border-[#cecece] focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/20 focus:border-[#0b2f9f] text-xs sm:text-sm shadow-inner cursor-pointer appearance-none"
        >
          <option value="">Semua Aksi</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="AUTH">AUTH / LOGIN</option>
        </select>
      </div>
    </div>
  );
}