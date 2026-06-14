import { Search } from "lucide-react";

interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function UserFilters({
  searchQuery,
  setSearchQuery,
}: UserFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 bg-white p-3 sm:p-4 border border-info-border shadow-sm">
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama, email, NIM/NIP, otoritas role, fakultas, atau prodi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg bg-slate-50 border border-[#cecece] focus:outline-hidden focus:ring-2 focus:ring-[#0b2f9f]/20 focus:border-[#0b2f9f] text-xs sm:text-sm shadow-inner"
        />
      </div>
    </div>
  );
}
