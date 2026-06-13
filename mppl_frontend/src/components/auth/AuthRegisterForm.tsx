import React from "react";

interface AuthRegisterFormProps {
  nama: string;
  setNama: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  passwordConfirmation: string;
  setPasswordConfirmation: (val: string) => void;
  agreeTerms: boolean;
  setAgreeTerms: (val: boolean) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const AuthRegisterForm: React.FC<AuthRegisterFormProps> = ({
  nama,
  setNama,
  email,
  setEmail,
  password,
  setPassword,
  passwordConfirmation,
  setPasswordConfirmation,
  agreeTerms,
  setAgreeTerms,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isLoading,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      <div className="fade-up-gsap flex flex-col w-full">
        <label className="mb-1.5 text-sm font-semibold text-slate-700">
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Masukkan nama lengkap anda"
          className="border border-slate-200 rounded-md py-2.5 px-4 text-sm outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 bg-white text-slate-900 transition-all disabled:opacity-60"
          disabled={isLoading}
        />
      </div>

      <div className="fade-up-gsap flex flex-col w-full">
        <label className="mb-1.5 text-sm font-semibold text-slate-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Masukkan alamat email anda"
          className="border border-slate-200 rounded-md py-2.5 px-4 text-sm outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 bg-white text-slate-900 transition-all disabled:opacity-60"
          autoComplete="email"
          disabled={isLoading}
        />
      </div>

      <div className="fade-up-gsap flex flex-col w-full relative">
        <label className="mb-1.5 text-sm font-semibold text-slate-700">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan password anda"
          className="border border-slate-200 rounded-md py-2.5 pl-4 pr-12 text-sm outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 bg-white text-slate-900 transition-all disabled:opacity-60"
          autoComplete="new-password"
          disabled={isLoading}
        />
        <button
          type="button"
          className="absolute right-4 top-[29.2px] cursor-pointer text-slate-400 hover:text-[#059669] transition-colors flex items-center h-9 select-none bg-transparent border-none"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          <i
            className={`bx ${showPassword ? "bx-hide" : "bx-show"} text-xl`}
          ></i>
        </button>
      </div>

      <div className="fade-up-gsap flex flex-col w-full relative">
        <label className="mb-1.5 text-sm font-semibold text-slate-700">
          Konfirmasi Password <span className="text-red-500">*</span>
        </label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder="Ulangi password anda"
          className="border border-slate-200 rounded-md py-2.5 pl-4 pr-12 text-sm outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 bg-white text-slate-900 transition-all disabled:opacity-60"
          autoComplete="new-password"
          disabled={isLoading}
        />
        <button
          type="button"
          className="absolute right-4 top-[29.2px] cursor-pointer text-slate-400 hover:text-[#059669] transition-colors flex items-center h-9 select-none bg-transparent border-none"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          tabIndex={-1}
        >
          <i
            className={`bx ${showConfirmPassword ? "bx-hide" : "bx-show"} text-xl`}
          ></i>
        </button>
      </div>

      <div className="fade-up-gsap flex items-start gap-3 py-2">
        <input
          type="checkbox"
          id="agree"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="mt-1 accent-[#059669] w-4 h-4 rounded border-slate-300 shrink-0"
          disabled={isLoading}
        />
        <label
          htmlFor="agree"
          className="text-[13px] leading-5 text-slate-500 text-justify cursor-pointer select-none font-medium"
        >
          Ya, saya menyetujui Ketentuan Layanan, Kebijakan Privasi, serta
          prosedur peminjaman, sirkulasi, dan pengembalian aset yang berlaku di
          E-Asset.
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="left-content-gsap w-full py-2.5 bg-gradient-to-r from-[#059669] to-[#009688] text-white rounded-md text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/10 hover:brightness-110 active:scale-[0.99] relative z-20 cursor-pointer"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Mendaftarkan Akun...</span>
          </>
        ) : (
          "Daftar Sekarang"
        )}
      </button>
    </form>
  );
};
