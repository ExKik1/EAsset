import { useEffect, useState } from "react";
import { LandingNavbar } from "../../components/landing/LandingNavbar";
import { LandingHero } from "../../components/landing/LandingHero";
import { LandingPartnersLogos } from "../../components/landing/LandingPartnerLogos";
import { LandingAbout } from "../../components/landing/LandingAbout";
import { LandingFeatures } from "../../components/landing/LandingFeatures";
import { LandingTeam } from "../../components/landing/LandingTeam";
import { LandingFaq } from "../../components/landing/LandingFaq";
import { LandingFooter } from "../../components/landing/LandingFooter";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function LandingPage() {
  useDocumentTitle("Welcome");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const sections = document.querySelectorAll("header, section");
    const options = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id || "home");
        }
      });
    }, options);

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen overflow-x-hidden transition-colors duration-300">
      <LandingNavbar
        activeSection={activeSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <LandingHero />
      <LandingPartnersLogos />
      <LandingAbout />
      <LandingFeatures />
      <LandingTeam />
      <LandingFaq />
      <LandingFooter />
    </div>
  );
}
