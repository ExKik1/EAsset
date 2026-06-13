import { motion } from "motion/react";

export default function FooterMain() {
  return (
    <>
      <footer className="h-15 sm:h-13 bg-[#e0e0e0] border-t border-info-border flex flex-col sm:flex-row items-center justify-center sm:justify-between px-4 sm:px-8 text-[9px] sm:text-[10px] text-slate-500 font-medium py-2.5 sm:py-0.5 shrink-0 select-none gap-1 sm:gap-0">
        <div className="flex items-center space-x-1.5">
          <span>SYSTEM STATUS:</span>
          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-600 font-black uppercase text-[8px] sm:text-[9px] tracking-wider">
              Operational
            </span>
          </div>
        </div>

        <div className="flex space-x-4 sm:space-x-6 font-bold tracking-wide">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-brand-gradient bg-clip-text text-transparent uppercase"
          >
            SECURE PROTOCOL ACTIVE
          </motion.span>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-brand-gradient bg-clip-text text-transparent uppercase font-mono"
          >
            LATENCY: &gt;5ms
          </motion.span>
        </div>
      </footer>
    </>
  );
}
