import React from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Mouse } from "lucide-react";

interface SlideItem {
  id: number;
  src: string;
}

interface AuthBannerSliderProps {
  slides: SlideItem[];
  slideIndex: number;
  onDotClick: (index: number) => void;
  title?: string;
  subtitle?: string;
  description?: string;
}

export const AuthBannerSlider: React.FC<AuthBannerSliderProps> = ({
  slides,
  slideIndex,
  onDotClick,
  title = "E-Asset",
  subtitle = "Sistem Informasi Gangguan & Pengaduan",
  description = "Pantau proses tindak lanjut laporan infrastruktur dan keamanan secara transparan. Bersama-sama, mari wujudkan lingkungan yang lebih responsif, aman, dan tertata.",
}) => {
  const scrollToForm = () => {
    const formElement = document.getElementById("auth-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    /* Mengubah warna latar belakang banner dari biru ke gradasi Emerald/Teal */
    <div className="left-content-gsap flex flex-col justify-between md:justify-center lg:justify-center xl:justify-between flex-[1_1_100%] md:flex-[1_1_55%] min-h-screen relative text-white p-8 sm:p-12 md:p-[5%] overflow-hidden bg-gradient-to-br from-[#059669] to-[#009688]">
      <div className="absolute -bottom-10 -left-10 w-80 h-80 rounded-full border-[24px] border-white/5 pointer-events-none z-0" />
      <div className="absolute -top-10 -right-1/2 md:-right-20 w-[400px] h-[400px] rounded-full border-[24px] border-white/5 pointer-events-none z-0" />

      <div className="z-10 w-full space-y-4 sm:space-y-6">
        <div>
          <Link
            to="/"
            className="text-white hover:opacity-90 transition-opacity inline-block"
          >
            {/* Mengubah gambar logo mengarah ke aset */}
            <img
              src="/images/logo/white.png"
              className="w-[95px] sm:w-[110px] h-auto"
              alt={title}
              onError={(e) => {
                // Fallback text jika file fisik gambar logo putih belum ditaruh di folder public
                e.currentTarget.style.display = "none";
              }}
            />
            {/* Teks logo cadangan yang tampil jika gambar error / belum di-import */}
            <span className="text-xl font-black tracking-wider block md:hidden">
              E-Asset<span className="text-emerald-200">.</span>
            </span>
          </Link>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h2 className="mb-2 text-xl sm:text-2xl font-black tracking-tight leading-snug">
            {subtitle}
          </h2>
          <p className="text-xs sm:text-sm leading-6 font-light mb-8 text-justify opacity-85">
            {description}
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          {slides.map((_, index) => (
            <span
              key={index}
              onClick={() => onDotClick(index)}
              className={`cursor-pointer h-[4px] inline-block rounded-full transition-all duration-500 ${
                index === slideIndex
                  ? "bg-white w-[24px]"
                  : "bg-white/30 hover:bg-white/60 w-[12px]"
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 w-full my-6 sm:my-8 md:my-0 md:mt-10 flex-1 flex items-center justify-center">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`w-full transition-all duration-700 ${
                index === slideIndex
                  ? "block opacity-100 scale-100"
                  : "hidden opacity-0 scale-95"
              }`}
            >
              <img
                src={slide.src}
                alt={`Dashboard Preview ${slide.id}`}
                className="w-full h-[200px] md:h-[230px] lg:h-[330px] object-cover object-center rounded-xl shadow-2xl"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="z-10 flex justify-center md:hidden pt-2">
        <button
          type="button"
          onClick={scrollToForm}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold hover:bg-white/25 transition-all active:scale-95 shadow-lg"
        >
          <Mouse className="w-3.5 h-3.5" />
          <span>Scroll</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </div>
    </div>
  );
};
