import React from "react";

export const LandingFooter: React.FC = () => {
  const footerLinks = [
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

  return (
    <footer className="bg-white border-t border-slate-300/80 py-7 px-[4%] md:px-[7%] lg:px-[10%] text-center text-slate-400 text-[10px] md:text-[12.5px] transition-colors duration-300">
      <div className="mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img
            src={"/images/logo/colors.png"}
            className="w-[90px] md:w-[100px] h-auto"
            alt="E-Asset"
          />
        </div>

        <p className="font-medium order-3 sm:order-2 text-slate-500">
          &copy; {new Date().getFullYear()} E-Asset. Created By{" "}
          <span className="color-span-g">Final Project All</span>
        </p>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-slate-500 order-2 sm:order-3 font-semibold">
          {footerLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleScrollToSection(link.id)}
              className="hover:bg-brand-gradient hover:bg-clip-text hover:text-transparent transition-all cursor-pointer text-left bg-transparent border-none p-0"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};
