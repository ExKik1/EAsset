import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface LandingNavbarProps {
  activeSection: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  activeSection,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const navLinks = [
    { id: "home", label: "Beranda" },
    { id: "about", label: "Tentang" },
    { id: "features", label: "Fitur" },
    { id: "team", label: "Tim" },
    { id: "faq", label: "FAQ" },
  ];

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const getNavLinkClass = (sectionId: string) => {
    return activeSection === sectionId
      ? "text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-[#009688] font-black text-xs lg:text-sm transition-all duration-300 scale-105 cursor-pointer text-left"
      : "text-slate-600 hover:text-[#059669] font-semibold text-xs lg:text-sm transition-colors duration-300 cursor-pointer text-left";
  };

  const getMobileNavLinkClass = (sectionId: string) => {
    return activeSection === sectionId
      ? "w-full text-left block px-4 py-2.5 rounded-md text-sm font-black bg-emerald-50/60 text-[#059669] border-l-4 border-[#059669] cursor-pointer"
      : "w-full text-left block px-4 py-2.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-[4%] md:px-[7%] lg:px-[10%] transition-colors duration-300">
      <div className="mx-auto">
        <div className="flex justify-between h-[4.5rem] items-center">
          <div
            className="flex items-center gap-2 select-none cursor-pointer"
            onClick={() => handleScrollToSection("home")}
          >
            <img
              src={"/images/logo/logo.png"}
              className="w-[100px] md:w-[110px] h-auto"
              alt="E-Asset Logo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="text-xl font-black text-slate-800 tracking-wider">
              E-Asset<span className="text-[#059669]">.</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-5 lg:space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleScrollToSection(link.id)}
                className={getNavLinkClass(link.id)}
              >
                {link.label}
              </button>
            ))}

            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#059669] to-[#009688] hover:from-[#047857] hover:to-[#008074] rounded-md transition-all shadow-md shadow-emerald-600/10 active:scale-95"
            >
              Get Started
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-slate-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-white border-b border-slate-200 pt-2 pb-4 space-y-1.5 shadow-lg overflow-hidden px-1"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setTimeout(() => handleScrollToSection(link.id), 100);
                }}
                className={getMobileNavLinkClass(link.id)}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 px-3">
              <Link
                to="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#059669] to-[#009688] rounded-md shadow-md shadow-emerald-600/10"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
