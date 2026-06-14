import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldAlert, Eye, EyeOff } from "lucide-react";

interface AccountCredentialProps {
  variants?: any;
  form: any;
  setForm: (form: any) => void;
}

export default function AccountCredentialSection({
  variants,
  form,
  setForm,
}: AccountCredentialProps) {
  const { id } = useParams<{ id: string }>();
  const [showPassword, setShowPassword] = useState(false);

  // Jika URL memiliki parameter ID, berarti aplikasi berada pada mode "Edit"
  const isEditMode = Boolean(id);

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

        <ShieldAlert className="w-4 h-4 z-10" />
        <h3 className="text-xs font-bold uppercase tracking-wide z-10">
          B. Kredensial Keamanan & Hak Akses
        </h3>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 relative z-20 overflow-visible">
        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5 tracking-wide">
            Alamat E-mail Aktif <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            placeholder="contoh@domain.ac.id"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm font-normal text-slate-800 placeholder:text-slate-400/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5 tracking-wide">
            Kata Sandi (Password){" "}
            {!isEditMode && <span className="text-rose-500">*</span>}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={
                isEditMode
                  ? "Kosongkan jika tidak ingin mengubah password..."
                  : "Minimal 8 kombinasi karakter..."
              }
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-3.5 pr-11 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm font-normal text-slate-800 placeholder:text-slate-400/80 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors focus:outline-hidden"
              title={
                showPassword ? "Sembunyikan Kata Sandi" : "Tampilkan Kata Sandi"
              }
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5 tracking-wide">
            Tingkatan Hak Akses (Role) <span className="text-rose-500">*</span>
          </label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm font-normal text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all duration-200 cursor-pointer"
          >
            <option value="">-- Pilih Tingkatan Role --</option>
            <option value="admin">Administrator</option>
            <option value="kerumahtanggaan">Kerumahtanggaan</option>
            <option value="umum">Umum / Civitas</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}
