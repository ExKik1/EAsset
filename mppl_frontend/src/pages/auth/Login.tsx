import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSplitAnimation } from "../../hooks/useSplitAnimation";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

import { AuthToast } from "../../components/auth/AuthToast";
import { AuthBannerSlider } from "../../components/auth/AuthBannerSlider";
import { AuthLoginForm } from "../../components/auth/AuthLoginForm";

const Login = () => {
  useDocumentTitle("Login");
  const container = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);
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
    const savedEmail = localStorage.getItem("e-asset_remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setToast({
        messages: [location.state.message],
        type: "success",
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
      return () => clearTimeout(toastTimer);
    }
  }, [toast]);

  useEffect(() => {
    const logoutMessage = sessionStorage.getItem("logout_success_message");
    if (logoutMessage) {
      setToast({
        messages: [logoutMessage],
        type: "success",
      });
      sessionStorage.removeItem("logout_success_message");
    }
  }, []);

  useSplitAnimation(container);

  const from = location.state?.from?.pathname || "/main";

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setToast(null);

    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      const { access_token, user } = response.data;

      if (rememberMe) {
        localStorage.setItem("e-asset_remember_email", email);
      } else {
        localStorage.removeItem("e-asset_remember_email");
      }

      setToast({
        messages: ["Login Berhasil! Mengalihkan ke dashboard..."],
        type: "success",
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      login(access_token, user);
      navigate(from, { replace: true });
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
            messages: [responseData.message || "Email atau password salah."],
            type: "danger",
          });
        }
      } else {
        setToast({
          messages: [
            "Gagal terhubung ke server E-Asset. Silakan coba beberapa saat lagi.",
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
          subtitle="Sistem Monitoring Peminjaman Alat & Aset"
          description="Platform digital inventarisasi kampus terintegrasi QR Code. Mempermudah pelacakan sirkulasi barang, mempercepat validasi check-out/check-in, serta mengeliminasi risiko kehilangan log inventaris."
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
                alt="E-Asset Logo"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </Link>
            <h1 className="headline-animate-gsap text-2xl font-black text-slate-900">
              Selamat Datang di{" "}
              <span className="inline-block bg-gradient-to-r from-[#059669] to-[#009688] bg-clip-text text-transparent">
                E-Asset
              </span>
              .
            </h1>
            <p className="fade-up-gsap text-sm mt-1 text-slate-500 leading-relaxed">
              Masukkan email dan password akun Anda untuk mengakses fitur
              peminjaman mandiri, scanner QR Code, dan monitoring inventaris.
            </p>
          </div>

          <AuthLoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            isLoading={isLoading}
            onSubmit={handleLoginSubmit}
          />

          <p className="bg-glow-gsap text-center text-sm mt-6 text-slate-500">
            Anda belum punya akun?{" "}
            <Link
              to="/auth/register"
              className="bg-gradient-to-r from-[#059669] to-[#009688] bg-clip-text text-transparent font-bold hover:brightness-110 transition-all"
            >
              Sign Up
            </Link>{" "}
            sekarang
          </p>
        </div>
      </section>
    </>
  );
};

export default Login;
