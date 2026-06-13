import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSplitAnimation } from "../../hooks/useSplitAnimation";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import api from "../../utils/api";

import { AuthToast } from "../../components/auth/AuthToast";
import { AuthBannerSlider } from "../../components/auth/AuthBannerSlider";
import { AuthRegisterForm } from "../../components/auth/AuthRegisterForm";

const Register = () => {
  useDocumentTitle("Registrasi");
  const container = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [nama, setNama] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [toast, setToast] = useState<{
    messages: string[];
    type: "success" | "danger";
  } | null>(null);

  const slides = [
    { id: 1, src: "/images/auth/dashboard-1.png" },
    { id: 2, src: "/images/auth/dashboard-2.jpg" },
    { id: 3, src: "/images/auth/dashboard-3.webp" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (toast) {
      const toastTimer = setTimeout(() => {
        setToast(null);
      }, 6000);
      return () => clearInterval(toastTimer);
    }
  }, [toast]);

  useSplitAnimation(container);

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreeTerms) {
      setToast({
        messages: [
          "Anda harus menyetujui Ketentuan Layanan, Kebijakan Privasi, dan Prosedur Peminjaman Aset untuk melanjutkan.",
        ],
        type: "danger",
      });
      return;
    }

    setIsLoading(true);
    setToast(null);

    try {
      await api.post("/auth/register", {
        name: nama,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      });

      setToast({
        messages: ["Registrasi Berhasil! Mengalihkan ke halaman login..."],
        type: "success",
      });

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error: any) {
      if (error.response && error.response.data) {
        const responseData = error.response.data;

        if (responseData.errors) {
          const errorLists = Object.values(
            responseData.errors,
          ).flat() as string[];
          setToast({ messages: errorLists, type: "danger" });
        } else {
          setToast({
            messages: [
              responseData.message ||
                "Gagal melakukan registrasi, periksa kembali data anda.",
            ],
            type: "danger",
          });
        }
      } else {
        setToast({
          messages: [
            "Gagal terhubung ke server E-Asset. Silakan coba lagi nanti.",
          ],
          type: "danger",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section
        ref={container}
        className="flex flex-col md:flex-row w-full min-h-screen relative overflow-x-hidden bg-white"
      >
        {toast && (
          <AuthToast
            messages={toast.messages}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <AuthBannerSlider
          slides={slides}
          slideIndex={slideIndex}
          onDotClick={(index) => setSlideIndex(index)}
          title="E-Asset"
          subtitle="Sirkulasi Inventaris Praktis dengan QR Code"
          description="Dapatkan akses penuh ke platform monitoring E-Asset. Daftarkan akun sivitas akademika atau anggota Anda sekarang untuk mulai melakukan peminjaman mandiri, memantau ketersediaan alat lab/kantor, serta mengonfirmasi log pengembalian secara real-time."
        />

        <div
          id="auth-form-section"
          className="flex-[1_1_100%] md:flex-[1_1_45%] flex flex-col justify-center min-h-screen p-8 sm:p-12 md:p-[5%] bg-white scroll-mt-6"
        >
          <div className="flex flex-col mb-6">
            <Link to="/" className="mb-4 inline-block">
              <img
                src="/images/logo/colors.png"
                className="w-[110px] h-auto"
                alt="E-Asset"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </Link>
            <h1 className="headline-animate-gsap text-2xl font-black text-slate-900">
              Bergabung Sekarang di{" "}
              <span className="inline-block bg-gradient-to-r from-[#059669] to-[#009688] bg-clip-text text-transparent">
                E-Asset
              </span>
              .
            </h1>
            <p className="fade-up-gsap text-sm mt-1 text-slate-500 leading-relaxed">
              Daftarkan diri Anda untuk kemudahan akses sirkulasi peminjaman
              aset, pelacakan status ketersediaan barang, dan transparansi log
              logistik.
            </p>
          </div>

          <AuthRegisterForm
            nama={nama}
            setNama={setNama}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            passwordConfirmation={passwordConfirmation}
            setPasswordConfirmation={setPasswordConfirmation}
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            isLoading={isLoading}
            onSubmit={handleRegisterSubmit}
          />

          <p className="fade-up-gsap text-center text-sm mt-6 text-slate-500">
            Anda sudah punya akun?{" "}
            <Link
              to="/auth/login"
              className="bg-gradient-to-r from-[#059669] to-[#009688] bg-clip-text text-transparent font-bold hover:brightness-110 transition-all"
            >
              Sign In
            </Link>{" "}
            sekarang
          </p>
        </div>
      </section>
    </>
  );
};

export default Register;
