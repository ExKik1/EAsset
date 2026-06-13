import React, { useState, useEffect } from "react";
import { ShieldAlert, Trash2, Clock, ShieldCheck } from "lucide-react";

interface UserSummaryCardProps {
  userName: string;
  email: string;
  role: string;
  profileUrl?: string;
  onOpenDeleteModal: () => void;
}

export const UserSummaryCard: React.FC<UserSummaryCardProps> = ({
  userName,
  email,
  role,
  profileUrl,
  onOpenDeleteModal,
}) => {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTime(`${formatter.format(now)} WIB`);
    };
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="lg:col-span-1 w-full space-y-4">
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col items-center text-center">
        {/* AVATAR DENGAN FALLBACK GAMBAR */}
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={userName}
            className="w-20 h-20 rounded-full object-cover mb-4 shadow-md border-2 border-slate-200"
            onError={(e) => {
              (e.target as any).src =
                `https://ui-avatars.com/api/?name=${userName}&background=0b2f9f&color=fff`;
            }}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0b2f9f] to-[#00809d] flex items-center justify-center text-white text-3xl font-black mb-4 shadow-inner">
            {userName ? userName.charAt(0).toUpperCase() : "?"}
          </div>
        )}

        <h2 className="text-base font-bold text-slate-800 max-w-full truncate px-2">
          {userName}
        </h2>

        {/* BADGE ROLE USER */}
        <span className="mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
          Role: {role}
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
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
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
