import React from "react";
import { motion } from "framer-motion";

interface ScrollAnimateSectionProps {
  children: React.ReactNode;
}

const ScrollAnimateSection = ({ children }: ScrollAnimateSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export const LandingAbout: React.FC = () => {
  return (
    <section
      id="about"
      className="py-16 sm:py-20 bg-white border-y border-slate-200/80 px-[4%] md:px-[7%] lg:px-[10%] transition-colors duration-300"
    >
      <ScrollAnimateSection>
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="space-y-4 text-left">
            <h2 className="badge-span-g text-xs font-bold uppercase tracking-widest text-[#059669] bg-emerald-50 px-3 py-1 rounded-md inline-block">
              Tentang Platform
            </h2>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-800 tracking-tight leading-snug">
              Transformasi Digital{" "}
              <span className="text-[#059669]">Manajemen Aset</span> Layanan
              Kampus <span className="text-[#009688]">Satu Atap</span>
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Dibuat sebagai solusi modern atas kendala pencatatan manual buku
              inventaris, E-Asset hadir untuk menyederhanakan birokrasi
              sirkulasi peminjaman dan pengembalian alat laboratorium serta
              logistik operasional secara real-time langsung dari perangkat
              Anda.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Dengan mengandalkan identifikasi kode QR yang unik pada setiap
              unit barang, sistem ini mampu memvalidasi ketersediaan aset secara
              akurat. Langkah ini efektif untuk memutus risiko terjadinya
              pemesanan ganda (double booking) serta mendokumentasikan riwayat
              penanggung jawab terakhir secara aman dan transparan.
            </p>
          </div>

          <motion.div
            transition={{ duration: 0.3 }}
            className="p-[1px] rounded-xl bg-slate-200 hover:bg-gradient-to-r hover:from-[#059669] hover:to-[#009688] transition-all duration-300 shadow-inner group"
          >
            <div className="bg-slate-50 rounded-xl p-5 sm:p-6 space-y-3 sm:space-y-4 font-mono text-xs text-slate-600 text-left w-full h-full">
              <div className="flex justify-between border-b border-slate-200 pb-2 group-hover:border-slate-300">
                <span className="text-slate-500 font-bold group-hover:text-[#059669] transition-colors">
                  [E-Asset System Core]
                </span>
                <span className="text-emerald-500 font-bold animate-pulse">
                  ● READY
                </span>
              </div>
              <p className="transition-colors duration-300 group-hover:text-slate-800">
                &gt; Sinkronisasi database sirkulasi alat utama... [cite: 87]
              </p>
              <p className="transition-colors duration-300 group-hover:text-slate-800">
                &gt; Generator kode QR dan modul pemindaian siap.
              </p>
              <p className="transition-colors duration-300 group-hover:text-slate-800">
                &gt; Sistem enkripsi log peminjaman token akun aktif.
              </p>
              <p className="text-[#009688] font-bold transition-all duration-300 group-hover:text-[#059669]">
                &gt; Validasi real-time siap mencegah terjadinya double
                booking[cite: 22, 31].
              </p>
            </div>
          </motion.div>
        </div>
      </ScrollAnimateSection>
    </section>
  );
};
