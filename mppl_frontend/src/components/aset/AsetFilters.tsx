import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Tag,
  SlidersHorizontal,
  Layers,
} from "lucide-react";

interface KategoriOpsi {
  id: number;
  nama_kategori: string;
}

interface AsetFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedKategori: string;
  setSelectedKategori: (kategori: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  daftarKategori: KategoriOpsi[];
}

export default function AsetFilters({
  searchQuery,
  setSearchQuery,
  selectedKategori,
  setSelectedKategori,
  selectedStatus,
  setSelectedStatus,
  daftarKategori,
}: AsetFiltersProps) {
  // State untuk custom searchable dropdown kategori
  const [isOpenKategori, setIsOpenKategori] = useState(false);
  const [searchKategoriQuery, setSearchKategoriQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown jika pengguna mengklik di luar area komponen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenKategori(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Menyaring daftar opsi kategori berdasarkan input pencarian dropdown
  const filteredKategoriOptions = daftarKategori.filter((kat) =>
    kat.nama_kategori.toLowerCase().includes(searchKategoriQuery.toLowerCase()),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3 sm:p-4 border border-info-border shadow-sm">
      {/* 1. Input Pencarian Utama Text Global */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama, kode barang, qr..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg bg-slate-50 border border-[#cecece] focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/20 focus:border-[#0b2f9f] text-xs sm:text-sm shadow-inner text-slate-700 font-medium placeholder:text-slate-400 transition-all"
        />
      </div>

      {/* 2. Custom Searchable Dropdown Select - Kategori Aset */}
      <div className="relative w-full" ref={dropdownRef}>
        <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />

        {/* Tombol Utama Trigger Dropdown */}
        <button
          type="button"
          onClick={() => {
            setIsOpenKategori(!isOpenKategori);
            setSearchKategoriQuery(""); // Reset keyword cari internal dropdown saat dibuka
          }}
          className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-lg bg-slate-50 border border-[#cecece] focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/20 focus:border-[#0b2f9f] text-xs sm:text-sm shadow-inner text-slate-700 font-medium text-left flex items-center justify-between transition-all"
        >
          <span
            className={selectedKategori ? "text-slate-700" : "text-slate-400"}
          >
            {selectedKategori || "Pilih / Cari Kategori Klasifikasi..."}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpenKategori ? "rotate-180" : ""}`}
          />
        </button>

        {/* Panel Menu Pilihan Dropdown yang bisa dicari */}
        {isOpenKategori && (
          <div className="absolute left-0 mt-1.5 w-full bg-white border border-[#cecece] rounded-lg shadow-xl z-50 overflow-hidden max-h-60 flex flex-col">
            {/* Input Pencarian Internal di dalam Dropdown */}
            <div className="p-2 border-b border-slate-100 bg-slate-50 relative shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Ketik untuk mencari kategori..."
                value={searchKategoriQuery}
                onChange={(e) => setSearchKategoriQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded border border-slate-200 bg-white focus:outline-none focus:border-[#0b2f9f] focus:ring-1 focus:ring-[#0b2f9f]/20 text-xs text-slate-700 font-medium"
              />
            </div>

            {/* List Opsi Data */}
            <div className="overflow-y-auto flex-1 text-xs sm:text-sm text-slate-700 font-medium">
              <button
                type="button"
                onClick={() => {
                  setSelectedKategori("");
                  setIsOpenKategori(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 ${!selectedKategori ? "bg-blue-50/60 text-[#0b2f9f] font-semibold" : ""}`}
              >
                Semua Kategori
              </button>

              {filteredKategoriOptions.length > 0 ? (
                filteredKategoriOptions.map((kat) => (
                  <button
                    key={kat.id}
                    type="button"
                    onClick={() => {
                      setSelectedKategori(kat.nama_kategori);
                      setIsOpenKategori(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 transition-colors ${selectedKategori === kat.nama_kategori ? "bg-blue-50/60 text-[#0b2f9f] font-semibold" : ""}`}
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span>{kat.nama_kategori}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-slate-400 italic text-xs">
                  Kategori tidak ditemukan
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Filter Status Aset Dropdown Standard */}
      <div className="relative w-full">
        <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-lg bg-slate-50 border border-[#cecece] focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/20 focus:border-[#0b2f9f] text-xs sm:text-sm shadow-inner text-slate-700 font-medium appearance-none cursor-pointer transition-all"
        >
          <option value="">Semua Status Barang</option>
          <option value="tersedia">Tersedia</option>
          <option value="dipinjam">Dipinjam</option>
          <option value="rusak">Rusak</option>
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
          ▼
        </div>
      </div>
    </div>
  );
}
