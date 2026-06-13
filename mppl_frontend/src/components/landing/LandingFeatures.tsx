import React from "react";
import { motion } from "framer-motion";
import { QrCode, ShieldCheck, History, UserCheck } from "lucide-react";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  type: "primary" | "secondary";
}

const ScrollAnimateSection = ({ children }: { children: React.ReactNode }) => {
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

export const LandingFeatures: React.FC = () => {
  const features: FeatureItem[] = [
    {
      icon: <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-[#059669]" />,
      title: "Pindai QR Code Unik",
      description:
        "Proses peminjaman dan pengembalian instan hanya dengan melakukan scan QR Code yang tertera pada setiap fisik alat laboratorium atau aset.",
      type: "primary",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#009688]" />,
      title: "Cegah Double Booking",
      description:
        "Sistem validasi otomatis yang mengunci status ketersediaan aset secara real-time untuk menghindari bentrok jadwal peminjaman antar pengguna.",
      type: "secondary",
    },
    {
      icon: <History className="w-5 h-5 sm:w-6 sm:h-6 text-[#059669]" />,
      title: "Riwayat Sirkulasi Digital",
      description:
        "Pencatatan riwayat log peminjaman yang rapi dan transparan, memudahkan pelacakan penanggung jawab terakhir dari suatu instrumen.",
      type: "primary",
    },
    {
      icon: <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#009688]" />,
      title: "Akses Mandiri Terintegrasi",
      description:
        "Kemudahan bagi dosen, asisten, dan mahasiswa untuk mengajukan sirkulasi logistik operasional menggunakan akun sivitas akademika yang sah.",
      type: "secondary",
    },
  ];

  return (
    <section
      id="features"
      className="py-16 sm:py-20 px-[4%] md:px-[7%] lg:px-[10%] transition-colors duration-300 bg-slate-50/50"
    >
      <ScrollAnimateSection>
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
          <h2 className="badge-span-g text-xs font-bold uppercase tracking-widest text-[#059669] bg-emerald-50 px-3 py-1 rounded-md inline-block">
            Keunggulan Aplikasi
          </h2>
          <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sirkulasi Inventaris Modern dengan{" "}
            <span className="text-[#059669]">Sistem QR</span> Praktis
          </h3>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Nikmati efisiensi birokrasi peminjaman sarana prasarana dalam satu
            platform digital terintegrasi yang cepat, akurat, dan akuntabel.
          </p>
        </div>
      </ScrollAnimateSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((feature, idx) => {
          const isPrimary = feature.type === "primary";

          const hoverBorderClass = isPrimary
            ? "hover:border-[#059669]"
            : "hover:border-[#009688]";
          const hoverTitleClass = isPrimary
            ? "group-hover:text-[#059669]"
            : "group-hover:text-[#009688]";
          const hoverIconBgClass = isPrimary
            ? "group-hover:bg-[#059669]/10"
            : "group-hover:bg-[#009688]/10";

          return (
            <motion.div
              key={idx}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left group transition-all duration-300 ${hoverBorderClass}`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 transition-colors duration-300 ${hoverIconBgClass}`}
              >
                {feature.icon}
              </div>
              <h4
                className={`font-black text-slate-800 text-sm sm:text-base mb-2 transition-colors duration-300 ${hoverTitleClass}`}
              >
                {feature.title}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
