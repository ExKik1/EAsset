import { ChevronLeft, ChevronRight } from "lucide-react";

interface FakultasPaginationProps {
  perPage: number;
  setPerPage: (value: number) => void;
  currentPage: number;
  setCurrentPage: (value: number | ((prev: number) => number)) => void;
  totalItems: number;
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
}

export default function FakultasPagination({
  perPage,
  setPerPage,
  currentPage,
  setCurrentPage,
  totalItems,
  totalPages,
  indexOfFirstItem,
  indexOfLastItem,
}: FakultasPaginationProps) {
  return (
    <div className="bg-slate-50 px-4 py-4 border-t border-info-border flex flex-col sm:flex-row gap-4 items-center justify-between text-xs font-medium text-slate-500">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto text-center sm:text-left justify-center">
        <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-[#cecece] shadow-sm">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Show:
          </span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-transparent focus:outline-none font-bold text-slate-700 cursor-pointer text-xs"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <span>
          Menampilkan <b>{totalItems > 0 ? indexOfFirstItem + 1 : 0}</b> -{" "}
          <b>{Math.min(indexOfLastItem, totalItems)}</b> dari{" "}
          <b>{totalItems}</b> data.
        </span>
      </div>

      <div className="flex items-center gap-1.5 justify-center w-full sm:w-auto">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 bg-white border border-[#cecece] rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 px-1">
          <span className="text-slate-400">Halaman</span>
          <span className="font-bold text-slate-800 px-2 py-1 bg-white border border-info-border rounded-lg min-w-8 text-center shadow-inner">
            {currentPage}
          </span>
          <span className="text-slate-400">dari</span>
          <span className="font-bold text-slate-600">{totalPages}</span>
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="p-2 bg-white border border-[#cecece] rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
