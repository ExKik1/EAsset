import { Menu, User, Bell, QrCode } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarMainProps {
  onToggleSidebar: () => void;
  userName: string;
  userRole: "admin" | "kerumahtanggaan" | "umum";
}

export default function NavbarMain({
  onToggleSidebar,
  userName,
  userRole,
}: NavbarMainProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#059669] to-[#009688] text-white flex items-center justify-between px-4 sm:px-6 shadow-md z-30 overflow-hidden">
      <div className="flex items-center space-x-3 min-w-0 z-10">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-white/10 rounded-lg transition-all cursor-pointer active:scale-95 shrink-0"
          aria-label="Toggle Navigation Side"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        <div className="flex items-center space-x-2 min-w-0">
          <QrCode className="w-5 h-5 text-white/90 shrink-0 hidden xs:block" />
          <span className="text-white font-black tracking-widest text-base sm:text-lg truncate">
            E-Asset
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4 text-sm font-medium z-10 shrink-0">
        <button className="p-2 hover:bg-white/10 rounded-full text-white/90 relative cursor-pointer transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        <div className="h-4 w-px bg-white/20"></div>

        {/* Profil Akun Badge Dinamis */}
        <Link
          to="/profile"
          className="flex items-center space-x-2 border border-white/15 bg-white/5 hover:bg-white/15 py-1.5 px-3 rounded-xl transition-all shadow-sm group"
        >
          <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-white/80" />
          </div>
          <div className="flex flex-col text-left hidden md:flex min-w-0">
            <span className="text-white font-bold text-[11px] leading-none max-w-[100px] truncate">
              {userName}
            </span>
            <span className="text-white/70 font-medium text-[9px] uppercase tracking-wider mt-1 leading-none">
              {userRole}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
