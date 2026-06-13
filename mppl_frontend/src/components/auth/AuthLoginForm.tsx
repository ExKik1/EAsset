import React from "react";

interface AuthLoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const AuthLoginForm: React.FC<AuthLoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  isLoading,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      <div className="fade-up-gsap flex flex-col w-full">
        <label className="mb-1.5 text-sm font-semibold text-slate-700">
          Email <span className="text-rose-500">*</span>
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
          Password <span className="text-rose-500">*</span>
        </label>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan password anda"
          className="border border-slate-200 rounded-md py-2.5 pl-4 pr-12 text-sm outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 bg-white text-slate-900 transition-all disabled:opacity-60"
          autoComplete="current-password"
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

      <div className="fade-up-gsap flex items-center justify-between text-xs py-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="accent-[#059669] w-4 h-4 rounded border-slate-300 cursor-pointer"
            disabled={isLoading}
          />
          <label
            htmlFor="remember"
            className="cursor-pointer text-slate-600 font-medium select-none"
          >
            Ingatkan saya
          </label>
        </div>
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
            <span>Sedang Masuk...</span>
          </>
        ) : (
          "Masuk"
        )}
      </button>
    </form>
  );
};
