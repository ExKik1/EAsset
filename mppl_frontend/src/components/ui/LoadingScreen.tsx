import React from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Memuat Data Aset & Sistem QR...",
}) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#059669] to-[#009688] blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative flex flex-col items-center justify-center z-10 space-y-6">
        <div className="relative w-20 h-20">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#059669] border-b-[#009688]"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-4 border-transparent border-r-[#009688] border-l-[#059669] opacity-70"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-6 rounded-full bg-gradient-to-r from-[#059669] to-[#009688]"
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>

        <div className="flex flex-col items-center space-y-1.5 text-center">
          <motion.span
            className="text-lg font-black tracking-widest bg-gradient-to-r from-[#059669] to-[#009688] bg-clip-text text-transparent uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            E-Asset
          </motion.span>
          <span className="text-xs font-bold text-slate-400 tracking-wide uppercase px-4">
            {message}
          </span>
        </div>

        <div className="w-32 h-1 bg-slate-200 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#059669] to-[#009688]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.3, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
};
