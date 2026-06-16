import React, { useState, useEffect, useRef } from "react";
import { ShieldAlert, Trash2, Clock, Camera } from "lucide-react";

interface UserSummaryCardProps {
  userName: string;
  email: string;
  role: string;
  profileUrl?: string;
  onOpenDeleteModal: () => void;
  onFileChange: (file: File | null) => void;
  isImageSelected: boolean;
}

export const UserSummaryCard: React.FC<UserSummaryCardProps> = ({
  userName = "",
  email = "",
  role = "",
  profileUrl,
  onOpenDeleteModal,
  onFileChange,
  isImageSelected = false,
}) => {
  const [time, setTime] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setTime(`${formatter.format(now)} WIB`);
      } catch (e) {
        // Fallback jika browser lawas tidak mendukung timezone spesifik
        setTime(new Date().toLocaleTimeString());
      }
    };
    
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  const getInitial = () => {
    if (userName && typeof userName === 'string') {
      return userName.charAt(0).toUpperCase();
    }
    return "?";
  };

  return (
    <div className="lg:col-span-1 w-full space-y-4">
      <div className="bg-white border border-info-border shadow-sm p-5 flex flex-col items-center text-center">
        
        {/* AVATAR DENGAN FALLBACK GAMBAR */}
        <div className="relative group">
          {profileUrl ? (
            <img
              src={profileUrl}
              alt={userName}
              className="w-20 h-20 rounded-full object-cover mb-3 shadow-md border-2 border-slate-200"
              onError={(e) => {
                (e.target as any).src =
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=0b2f9f&color=fff`;
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0b2f9f] to-[#00809d] flex items-center justify-center text-white text-3xl font-black mb-3 shadow-inner">
              {getInitial()}
            </div>
          )}
        </div>

        {/* INPUT UNTUK UNGGAH FOTO PROFIL */}
        <div className="flex flex-col items-center mb-4 w-full">
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (onFileChange) onFileChange(file);
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`flex items-center justify-center gap-1.5 border px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all shadow-xs cursor-pointer ${
              isImageSelected 
                ? "bg-teal-50 text-teal-700 border-teal-200" 
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isImageSelected ? "Foto Terpilih (Ubah)" : "Ganti Foto"}</span>
          </button>
        </div>

        <h2 className="text-base font-bold text-slate-800 max-w-full truncate px-2">
          {userName || "Nama Pengguna"}
        </h2>

        {/* BADGE ROLE USER */}
        <span className="mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
          Role: {role || "-"}
        </span>

        <p className="text-xs text-slate-500 font-medium break-all mt-2 max-w-full">
          {email || "Mendapatkan data email..."}
        </p>

        <div className="w-full border-t border-slate-100 my-4 pt-4 text-left space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Waktu Regional Kontrol
          </span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-50 text-[#0b2f9f] border border-blue-100 shadow-xs">
            <Clock className="w-3 h-3 text-[#0b2f9f]" />
            <span>{time || "Memuat jam..."}</span>
          </div>
        </div>
      </div>

      {/* DANGER DESTRUCTION ZONE */}
      <div className="bg-rose-50 border border-rose-300 p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-rose-900">
              Zona Penghapusan Akun
            </h3>
            <p className="text-xs text-rose-700 leading-relaxed">
              Menghapus akun akan memusnahkan semua hak akses sirkulasi
              inventarisasi aset Anda secara permanen.
            </p>
            <button
              type="button"
              onClick={onOpenDeleteModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus Akun Saya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};