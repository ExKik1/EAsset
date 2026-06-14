import { motion } from "motion/react";
import { User, Camera } from "lucide-react";

interface PersonalDataProps {
  variants?: any;
  form: any;
  setForm: (form: any) => void;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PersonalDataSection({
  variants,
  form,
  setForm,
  imagePreview,
  fileInputRef,
  handleFileChange,
}: PersonalDataProps) {
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

        <User className="w-4 h-4 z-10" />
        <h3 className="text-xs font-bold uppercase tracking-wide z-10">
          A. Atribut Data Personal
        </h3>
      </div>

      <div className="p-6 space-y-6 relative z-20 overflow-visible">
        <div className="flex flex-col items-center sm:flex-row gap-5 p-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <div className="relative w-24 h-24 bg-slate-200 rounded-xl overflow-hidden border border-slate-300/60 shadow-inner group shrink-0 aspect-square">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 text-[10px] uppercase tracking-wider text-center p-2">
                <User className="w-5 h-5 mb-1 opacity-60" />
                Tanpa Foto
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
              Foto Profil Pengguna
            </h5>
            <p className="text-[11px] text-slate-400 max-w-xs font-normal leading-normal">
              Sistem memotong file secara otomatis dengan proporsi rasio kuadrat
              sempurna <span className="font-medium text-slate-600">(1:1)</span>
              . Maks. 2 MB.
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5 tracking-wide">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan nama lengkap sesuai identitas resmi..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm font-normal text-slate-800 placeholder:text-slate-400/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5 tracking-wide">
              Nomor Induk Identitas (NIM / NIP / Kode Unik)
            </label>
            <input
              type="text"
              placeholder="Contoh: 24SA11A159"
              value={form.nim_nip}
              onChange={(e) => setForm({ ...form, nim_nip: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg font-mono text-sm font-normal text-slate-800 tracking-wide placeholder:font-sans placeholder:text-slate-400/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5 tracking-wide">
            Alamat Tempat Tinggal Domisili
          </label>
          <textarea
            placeholder="Tulis rincian alamat rumah, jalan, nomor blok, RT/RW, dan kota asal..."
            rows={3}
            value={form.alamat}
            onChange={(e) => setForm({ ...form, alamat: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm font-normal text-slate-700 leading-relaxed placeholder:text-slate-400/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200 resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
}
