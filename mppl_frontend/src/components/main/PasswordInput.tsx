import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  password: string;
  showPassword: boolean;
  activeTab: "encrypt" | "decrypt";
  isLoading: boolean;
  strength: { score: number; label: string; color: string };
  setPassword: (value: string) => void;
  setShowPassword: (value: boolean) => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  showPassword,
  activeTab,
  isLoading,
  strength,
  setPassword,
  setShowPassword,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Master Password
        </label>
        <AnimatePresence>
          {password && activeTab === "encrypt" && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-mono text-[#0b2f9f] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-bold"
            >
              Strength: {strength.label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          placeholder="Masukkan password pengunci..."
          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-[#c7c7c7] focus:outline-none focus:ring-2 focus:ring-[#0b2f9f]/20 focus:border-[#0b2f9f] text-sm font-mono shadow-inner"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          {showPassword ? (
            <Eye className="w-4.5 h-4.5" />
          ) : (
            <EyeOff className="w-4.5 h-4.5" />
          )}
        </button>
      </div>

      {activeTab === "encrypt" && password && (
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mt-1.5">
          <div
            className={`h-full transition-all duration-500 ease-out ${strength.color}`}
          />
        </div>
      )}
    </div>
  );
};
