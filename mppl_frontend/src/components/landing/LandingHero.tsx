import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode, ArrowRight } from "lucide-react";

export const LandingHero: React.FC = () => {
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header
      id="home"
      className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 bg-gradient-to-b from-emerald-50/40 to-slate-50 px-[4%] md:px-[7%] lg:px-[10%] text-center overflow-hidden transition-colors duration-300"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30 mix-blend-multiply">
        <motion.div
          className="absolute w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-tr from-[#059669] to-[#009688] blur-[90px] top-[-10%] left-[-10%]"
          animate={{
            x: [0, 120, 40, -40, 0],
            y: [0, 60, 140, 40, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-[300px] h-[300px] md:w-[550px] md:h-[550px] rounded-full bg-gradient-to-br from-teal-400 to-emerald-300 blur-[70px] bottom-[-5%] right-[-5%]"
          animate={{
            x: [0, -120, -60, 30, 0],
            y: [0, -80, -140, -40, 0],
            rotate: [0, -90, -180, -270, 360],
            scale: [0.9, 1.05, 0.85, 1.02, 0.9],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-[250px] h-[250px] md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-r from-[#009688] to-slate-200 blur-[65px] top-[20%] left-[-15%]"
          animate={{
            x: [0, 100, 160, 60, 0],
            y: [0, 120, 40, -60, 0],
            rotate: [0, 120, 240, 360],
            scale: [1, 0.9, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative mx-auto space-y-6 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-100/80 text-[10px] sm:text-xs font-bold text-[#059669]"
        >
          <QrCode className="w-3.5 h-3.5" /> Sistem Peminjaman Alat & Aset
          Berbasis QR Code
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight"
        >
          Sirkulasi Inventaris Praktis <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#059669] to-[#009688] bg-clip-text text-transparent">
            Dengan Peminjaman Mandiri
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-500 text-xs sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-2"
        >
          Dapatkan akses penuh untuk melakukan peminjaman alat laboratorium,
          fasilitas kantor, hingga logistik operasional secara mandiri. Cukup
          pindai QR Code barang untuk mengonfirmasi log peminjaman dan
          pengembalian Anda secara transparan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-2 flex flex-col sm:flex-row justify-center gap-3 max-w-xs sm:max-w-none mx-auto"
        >
          <Link
            to="/auth/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#059669] to-[#009688] hover:from-[#047857] hover:to-[#008074] rounded-md shadow-md shadow-emerald-600/20 group active:scale-98 transition-all duration-200"
          >
            Mulai Pinjam Aset{" "}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            type="button"
            onClick={() => handleScrollToSection("about")}
            className="inline-flex items-center justify-center px-6 py-3 text-xs sm:text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md shadow-sm active:scale-98 transition-all duration-200 cursor-pointer"
          >
            Pelajari Alur QR Code
          </button>
        </motion.div>
      </div>
    </header>
  );
};
