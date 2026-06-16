import { motion } from "motion/react";
import { Package, Camera, Wand2, QrCode } from "lucide-react";
import SearchableSelect from "../../../components/ui/SearchableSelect";

interface AssetDataSectionProps {
  variants?: any;
  form: any;
  setForm: (form: any) => void;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  kategoriOptions: any[];
}

export default function AssetDataSection({
  variants,
  form,
  setForm,
  imagePreview,
  fileInputRef,
  handleFileChange,
  kategoriOptions,
}: AssetDataSectionProps) {
  // Fungsi pembantu untuk menghasilkan 10 digit angka acak
  const generateRandomDigits = (): string => {
    return Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10),
    ).join("");
  };

  // 1. Generator Khusus Kode QR
  const handleGenerateQR = () => {
    const randomDigits = generateRandomDigits();
    setForm({
      ...form,
      kode_qr: `E-ASSET-PRODUCTS-${randomDigits}`,
    });
  };

  // 2. Generator Khusus Kode Barang
  const handleGenerateKodeBarang = () => {
    const randomDigits = generateRandomDigits();
    setForm({
      ...form,
      kode_barang: `E-ASSET-CP-${randomDigits}`,
    });
  };

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
        <Package className="w-4 h-4 z-10" />
        <h3 className="text-xs font-bold uppercase tracking-wide z-10">
          A. Atribut Data Utama Aset
        </h3>
      </div>

      <div className="p-6 space-y-6 relative z-20 overflow-visible">
        {/* Row Atas: Foto Barang & Live Preview QR Code */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Foto Barang Section */}
          <div className="lg:col-span-2 flex flex-col items-center sm:flex-row gap-5 p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <div className="relative w-24 h-24 bg-slate-100 rounded-xl overflow-hidden border border-slate-300/60 shadow-inner group shrink-0 aspect-square flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview Aset"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 p-2 select-none">
                  <Package className="w-8 h-8 opacity-70 stroke-[1.5]" />
                </div>
              )}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              >
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left space-y-2">
              <h5 className="text-xs font-semibold text-slate-700">
                Foto Fisik Barang / Aset
              </h5>
              <p className="text-[11px] text-slate-400 max-w-xs font-normal leading-normal">
                Sistem memotong file secara otomatis dengan proporsi rasio
                kuadrat sempurna{" "}
                <span className="font-medium text-slate-600">(1:1)</span>. Maks.
                2 MB.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-[11px] font-semibold text-slate-700 transition shadow-xs cursor-pointer"
              >
                Pilih Berkas Gambar
              </button>
            </div>
          </div>

          {/* Live Preview QR Code Section (Native API, Bebas Error Bundler) */}
          <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <div className="w-24 h-24 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center shrink-0 p-2 select-none overflow-hidden">
              {form.kode_qr ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(form.kode_qr)}`}
                  alt="Live QR Code"
                  className="w-full h-full object-contain animate-fade-in"
                  loading="lazy"
                />
              ) : (
                <div className="text-center flex flex-col items-center justify-center text-slate-300">
                  <QrCode className="w-8 h-8 stroke-[1.2] mb-1" />
                  <span className="text-[9px] font-medium uppercase tracking-wider">
                    No Data
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-teal-600" />
                Live QR Identifier
              </h5>
              <p className="text-[10px] text-slate-400 font-normal leading-normal max-w-[180px] break-all font-mono">
                {form.kode_qr
                  ? form.kode_qr
                  : "Menunggu input kode QR pengenal..."}
              </p>
            </div>
          </div>
        </div>

        {/* Input Data Identitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nama Barang */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5 tracking-wide">
              Nama Barang / Aset <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan nama barang operasional..."
              value={form.nama_barang || ""}
              onChange={(e) =>
                setForm({ ...form, nama_barang: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm font-normal text-slate-800 placeholder:text-slate-400/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200"
            />
          </div>

          {/* Kode QR Pengenal */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5 tracking-wide">
              Kode QR Pengenal <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Contoh: E-ASSET-PRODUCTS-0123456789"
                value={form.kode_qr || ""}
                onChange={(e) => setForm({ ...form, kode_qr: e.target.value })}
                className="w-full pl-3.5 pr-12 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg font-mono text-xs font-normal text-slate-800 tracking-wide placeholder:font-sans placeholder:text-slate-400/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleGenerateQR}
                title="Generate Kode QR Saja"
                className="absolute right-2 px-2 py-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors duration-200 cursor-pointer group"
              >
                <Wand2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Kode Inventaris Barang */}
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5 tracking-wide">
              Kode Inventaris Barang <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Contoh: E-ASSET-CP-0123456789"
                value={form.kode_barang || ""}
                onChange={(e) =>
                  setForm({ ...form, kode_barang: e.target.value })
                }
                className="w-full pl-3.5 pr-12 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleGenerateKodeBarang}
                title="Generate Kode Barang Saja"
                className="absolute right-2 px-2 py-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors duration-200 cursor-pointer group"
              >
                <Wand2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Kategori Kluster Aset */}
          <SearchableSelect
            label="Kategori Kluster Aset"
            placeholder="-- Pilih Kelompok Kategori --"
            options={(kategoriOptions || []).map((k) => ({
              id: k.id,
              label: k.nama_kategori || "",
              subLabel: k.kode_kategori,
            }))}
            value={form.kategori_aset_id}
            onChange={(val) => setForm({ ...form, kategori_aset_id: val })}
          />
        </div>
      </div>
    </motion.div>
  );
}
