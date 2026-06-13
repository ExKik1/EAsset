import { useRef } from "react";
import { Link } from "react-router-dom";
import { useSplitAnimation } from "../../hooks/useSplitAnimation";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("404 - Halaman Tidak Ditemukan");
  const container = useRef<HTMLElement>(null);
  const imagePath = "/images/errors/not-found.png";

  useSplitAnimation(container);

  return (
    <section
      ref={container}
      className="flex min-h-screen w-full flex-col justify-between bg-white relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30 mix-blend-multiply">
        <div
          className="absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-tr from-[#059669] to-[#009688] blur-[80px] top-[-10%] left-[-10%]"
          style={{
            animation: "moveCircleOne 25s infinite alternate ease-in-out",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full bg-gradient-to-br from-teal-400 to-emerald-300 blur-[90px] bottom-[15%] right-[-5%]"
          style={{
            animation: "moveCircleTwo 20s infinite alternate ease-in-out",
          }}
        />
        <div
          className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-r from-[#009688] to-slate-200 blur-[100px] top-[40%] left-[30%]"
          style={{
            animation: "moveCircleThree 22s infinite alternate ease-in-out",
          }}
        />
      </div>

      <style>{`
        @keyframes moveCircleOne {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(100px, 80px) scale(1.1); }
          100% { transform: translate(-50px, 40px) scale(0.9); }
        }
        @keyframes moveCircleTwo {
          0% { transform: translate(0px, 0px) scale(0.9); }
          50% { transform: translate(-80px, -120px) scale(1.1); }
          100% { transform: translate(40px, 50px) scale(1); }
        }
        @keyframes moveCircleThree {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-50px, 60px) scale(0.85); }
          100% { transform: translate(60px, -40px) scale(1.05); }
        }
      `}</style>

      <div className="flex-grow flex flex-col lg:flex-row items-center justify-center p-6 text-center gap-6 md:gap-12 z-10 max-w-7xl mx-auto w-full">
        <div className="mb-4 max-w-md fade-in-e left-content-gsap">
          <img
            src={imagePath}
            alt="404 Halaman Tidak Ditemukan"
            className="w-full h-auto object-contain image-reveal-gsap drop-shadow-xl"
          />
        </div>

        <div className="max-w-xl lg:text-left">
          <div className="mb-3 fade-up-gsap flex justify-center md:justify-start">
            <span className="text-xl font-black tracking-widest bg-gradient-to-r from-[#059669] to-[#009688] bg-clip-text text-transparent uppercase">
              E-Asset
            </span>
          </div>

          <h1 className="error-code text-center md:text-left text-7xl md:text-8xl font-black bg-gradient-to-r from-[#059669] to-[#009688] bg-clip-text text-transparent uppercaseSub fade-up-gsap tracking-tight">
            404
          </h1>

          <h2 className="headline-animate-gsap mt-2 text-2xl md:text-4xl font-black text-slate-800 leading-tight">
            Oops! Halaman Tidak{" "}
            <span className="bg-gradient-to-r from-[#059669] to-[#009688] bg-clip-text text-transparent">
              Ditemukan
            </span>
            .
          </h2>

          <p className="fade-up-gsap mt-4 text-sm md:text-base text-slate-500 leading-relaxed">
            Sepertinya tautan sirkulasi yang Anda tuju salah, inventaris data
            barang telah diubah, atau masa aktif sesi pemindaian QR Code Anda
            telah berakhir demi keamanan data penanggung jawab.
          </p>

          <div className="mt-8 second-fade-up-gsap">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[#059669] to-[#009688] px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/10 hover:shadow-xl hover:brightness-105 active:scale-98 transition-all duration-200"
            >
              <i className="bx bx-home-alt text-lg"></i>
              Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>

      <footer className="w-full py-5 text-center text-xs text-slate-500 border-t border-slate-100 z-10 bg-white/60 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} E-Asset. Created By{" "}
        <span className="color-span-g font-semibold text-[#059669]">
          Team Dev
        </span>
      </footer>
    </section>
  );
};

export default NotFound;
