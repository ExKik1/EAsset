import { Link } from "react-router-dom";
import { Edit2, Trash2, User, RefreshCw, Mail } from "lucide-react";
import { motion } from "motion/react";

interface UserData {
  id: number;
  name: string;
  email: string;
  nim_nip: string | null;
  role: string;
  profile: string | null;
  fakultas?: { nama_fakultas: string };
  program_studi?: { nama_prodi: string };
}

interface UserTableProps {
  currentData: UserData[];
  isFetchLoading: boolean;
  indexOfFirstItem: number;
  onOpenDeleteModal: (item: UserData) => void;
}

export default function UserTable({
  currentData,
  isFetchLoading,
  indexOfFirstItem,
  onOpenDeleteModal,
}: UserTableProps) {
  const getProfileImage = (profilePath: string | null) => {
    if (
      !profilePath ||
      profilePath === "default-profile.png" ||
      profilePath.trim() === ""
    ) {
      return null;
    }
    if (
      profilePath.startsWith("http://") ||
      profilePath.startsWith("https://")
    ) {
      return profilePath;
    }
    const apiBaseUrl =
      import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
    return apiBaseUrl.replace("/api", "") + "/storage/" + profilePath;
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse table-auto">
        <thead className="relative bg-brand-gradient text-white overflow-hidden">
          <tr className="absolute inset-0 pointer-events-none overflow-hidden block w-full h-full">
            <td
              colSpan={6}
              className="absolute inset-0 p-0 block w-full h-full"
            >
              <motion.div
                animate={{ x: ["-100%", "200%"], opacity: [0, 0.15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </td>
          </tr>
          <tr className="border-b border-white/10 font-black text-[10px] sm:text-[11px] uppercase tracking-wider">
            <th className="py-3.5 px-4 w-12 text-center text-white">No</th>
            <th className="py-3.5 px-4 w-16 text-white">Profil</th>
            <th className="py-3.5 px-4 min-w-[180px] text-white">
              Nama & Kredensial
            </th>
            <th className="py-3.5 px-4 w-36 text-white">NIM / NIP</th>
            <th className="py-3.5 px-4 w-28 text-white">Otoritas</th>
            <th className="py-3.5 px-4 min-w-[180px] text-white">
              Fakultas / Prodi
            </th>
            <th className="py-3.5 px-4 w-28 text-center text-white">Aksi</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-slate-700 text-xs sm:text-sm">
          {isFetchLoading ? (
            <tr>
              <td
                colSpan={7}
                className="py-8 px-4 text-center text-slate-400 font-medium"
              >
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0b2f9f]" />
                  Mendapatkan data berkas informasi pengguna...
                </div>
              </td>
            </tr>
          ) : currentData.length > 0 ? (
            currentData.map((item, index) => {
              const imgUrl = getProfileImage(item.profile);
              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-400 font-bold">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-3.5 px-4">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={item.name}
                        className="w-9 h-9 object-cover rounded-full border border-slate-200 shadow-xs"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          const parent = (e.target as HTMLImageElement)
                            .parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-9 h-9 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center border border-slate-200"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-9 h-9 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center border border-slate-200">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 shrink-0" />
                      {item.email}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-700">
                    {item.nim_nip || "-"}
                  </td>
                  <td className="py-3.5 px-4">
                    {(() => {
                      const currentRole = item.role?.toLowerCase();

                      let badgeStyle =
                        "bg-slate-100 text-slate-600 border border-slate-200";

                      if (currentRole === "admin") {
                        badgeStyle =
                          "bg-rose-50 text-rose-600 border border-rose-200";
                      } else if (currentRole === "kerumahtanggaan") {
                        badgeStyle =
                          "bg-blue-50 text-blue-600 border border-blue-200";
                      } else if (currentRole === "umum") {
                        badgeStyle =
                          "bg-emerald-50 text-emerald-600 border border-emerald-200";
                      }

                      return (
                        <span
                          className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${badgeStyle}`}
                        >
                          {item.role}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <div className="text-slate-600 font-semibold">
                      {item.fakultas?.nama_fakultas || "-"}
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      {item.program_studi?.nama_prodi || "-"}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        to={`/data-users/edit/${item.id}`}
                        className="p-1.5 text-blue-600 bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition cursor-pointer"
                        title="Ubah Profil"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onOpenDeleteModal(item)}
                        className="p-1.5 text-rose-600 bg-rose-50 border border-rose-100 rounded hover:bg-rose-100 transition cursor-pointer"
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={7}
                className="py-12 px-4 text-center text-slate-400 font-medium italic"
              >
                Data master acuan pengguna tidak ditemukan dalam database.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
