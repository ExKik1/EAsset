import React from "react";
import { motion } from "framer-motion";

interface Partner {
  name: string;
  logoUrl: string;
}

export const LandingPartnersLogos: React.FC = () => {
  const partners: Partner[] = [
    {
      name: "Kerumahtanggaan",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/2/28/Logo_Amikom_Purwokerto.png",
    },
    {
      name: "Laboratorium Informatika",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/2/28/Logo_Amikom_Purwokerto.png",
    },
    {
      name: "Logistik & Sarpras",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/2/28/Logo_Amikom_Purwokerto.png",
    },
    {
      name: "Perpustakaan & Media",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/2/28/Logo_Amikom_Purwokerto.png",
    },
    {
      name: "Fakultas Ilmu Komputer",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/2/28/Logo_Amikom_Purwokerto.png",
    },
    {
      name: "Unit Kegiatan Mahasiswa",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/2/28/Logo_Amikom_Purwokerto.png",
    },
  ];

  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-5 md:py-7 bg-gradient-to-r from-[#059669] to-[#009688] overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-[4%] md:px-[7%] mb-4 md:mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
          Terintegrasi dengan Unit Kerumahtanggaan, Laboratorium, dan Inventaris
          Pusat Kampus
        </p>
      </div>

      <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 md:before:w-40 before:bg-gradient-to-r before:from-[#059669]/60 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 md:after:w-40 after:bg-gradient-to-l after:from-[#009688]/60 after:to-transparent">
        <motion.div
          className="flex gap-16 md:gap-24 w-max items-center py-4 px-8 cursor-pointer"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            ease: "linear",
            duration: 40,
            repeat: Infinity,
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex items-center justify-center gap-2 group transition-all duration-300"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src={partner.logoUrl}
                  alt={`${partner.name} Logo`}
                  className="max-w-full max-h-full object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200"
                />
              </div>
              <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors whitespace-nowrap">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
