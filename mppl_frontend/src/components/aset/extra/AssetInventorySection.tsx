import { motion } from "motion/react";
import { Sliders } from "lucide-react";

interface AssetInventorySectionProps {
  variants?: any;
  form: any;
  setForm: (form: any) => void;
  isEditMode: boolean;
}

export default function AssetInventorySection({
  variants,
  form,
  setForm,
  isEditMode,
}: AssetInventorySectionProps) {
  return (
    <motion.div
      variants={variants}
      className="bg-white border border-info-border shadow-md relative"
    >
      <div className="relative overflow-hidden px-6 py-4 bg-brand-gradient border-b border-slate-200/70 flex items-center gap-2 text-white">
        <motion.div
          animate={{
            x: ["-100%", "200%"],
            opacity: [0, 0.2, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
        />
        <Sliders className="w-4 h-4 z-10" />
        <h3 className="text-xs font-bold uppercase tracking-wide z-10">
          B. Kontrol Inventori & Kondisi Fisik
        </h3>
      </div>

      {/* Perubahan Utama: Memastikan overflow-visible global dan layout grid yang aman */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 relative overflow-visible">
        
        {/* Kolom Kuantitas Stok */}
        <div className="relative z-10">
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5 tracking-wide">
            Kuantitas Stok Barang <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={form.stok}
            onChange={(e) => setForm({ ...form, stok: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200"
          />
        </div>

        {/* Kolom Status Ketersediaan: Diturunkan ke z-0 agar komponen Kategori di atasnya bebas meluncur */}
        <div className="relative z-0">
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5 tracking-wide">
            Status Ketersediaan <span className="text-rose-500">*</span>
          </label>
          <select
            value={form.status}
            disabled={!isEditMode}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200 cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="tersedia">Tersedia (Ready)</option>
            <option value="dipinjam">Sedang Dipinjam</option>
            <option value="rusak">Rusak / Perbaikan</option>
          </select>
        </div>

        {/* Kolom Deskripsi Aset */}
        <div className="md:col-span-2 relative z-0">
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5 tracking-wide">
            Deskripsi & Spesifikasi Keterangan Aset
          </label>
          <textarea
            placeholder="Tulis spesifikasi mendalam, nomor seri, lokasi penyimpanan rak, atau catatan internal barang..."
            rows={3}
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm font-normal text-slate-700 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200 resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
}