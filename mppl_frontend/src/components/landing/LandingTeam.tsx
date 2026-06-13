import React from "react";
import { motion as FramerMotion } from "framer-motion";
import { Code } from "lucide-react";

interface TeamMember {
  name: string;
  nim: string;
  major: string;
  image: string;
  instagram: string;
  linkedin: string;
}

const ScrollAnimateSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <FramerMotion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      {children}
    </FramerMotion.div>
  );
};

export const LandingTeam: React.FC = () => {
  const team: TeamMember[] = [
    {
      name: "Sofyan Khoiron Mukhlis",
      nim: "24SA11A033",
      major: "Informatika",
      image: "/images/profile/profile-default-first-r.png",
      instagram: "https://www.instagram.com/sofyankhoiron/",
      linkedin: "https://www.linkedin.com/in/sofyan-khoiron-213012355",
    },
    {
      name: "Nuril Rizqian Ar Ridho",
      nim: "24SA11A088",
      major: "Informatika",
      image: "/images/profile/profile-default-second-r.png",
      instagram: "https://www.instagram.com/ex.kik1/",
      linkedin: "https://www.linkedin.com/in/nuril-rizqian-883292372",
    },
    {
      name: "Rahmat Hidayat",
      nim: "24SA11A092",
      major: "Informatika",
      image: "/images/profile/profile-default-third-r.png",
      instagram: "https://www.instagram.com/mattaicontent/",
      linkedin: "http://www.linkedin.com/in/rahmat-hidayat-b91486388",
    },
    {
      name: "Igo Tegar Prambudhy",
      nim: "24SA11A159",
      major: "Informatika",
      image: "/images/profile/profile-default-fourth-r.png",
      instagram: "https://www.instagram.com/tgar_igohy/",
      linkedin: "https://www.linkedin.com/in/igo-tegar-prambudhy",
    },
  ];

  return (
    <section
      id="team"
      className="py-16 sm:py-20 bg-white border-t border-slate-200 px-[4%] md:px-[7%] lg:px-[10%] transition-colors duration-300"
    >
      <ScrollAnimateSection>
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <h2 className="badge-span-g ">Tim Pengembang</h2>
          <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            <span className="color-span-g">Talenta</span> di Balik Layar
          </h3>
          <p className="text-slate-500 text-md">
            Berkomitmen kolaboratif menyajikan antarmuka interaktif dan
            perlindungan sistem berkas yang reliabel.
          </p>
        </div>
      </ScrollAnimateSection>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {team.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-md border border-info-border shadow-sm overflow-hidden flex flex-col text-left group transition-colors duration-300"
          >
            <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:bg-brand-gradient group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <h4 className="font-black bg-brand-gradient bg-clip-text text-transparent text-base tracking-tight leading-snug">
                  {member.name}
                </h4>
                <p className="text-sm font-mono font-bold text-slate-600">
                  {member.nim}
                </p>
                <p className="text-[12.5px] text-slate-500 font-medium">
                  {member.major}
                </p>
              </div>
              <div className="pt-3 border-t border-info-border flex items-center gap-2">
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-slate-50 hover:bg-rose-100 text-slate-500 hover:text-rose-600 border border-info-border hover:border-rose-200 transition-colors"
                  title="Instagram Profile"
                >
                  <i className="bx bxl-instagram text-lg leading-none"></i>
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-sm bg-slate-50 hover:bg-blue-100 text-slate-500 hover:text-blue-700 border border-info-border hover:border-blue-200 transition-colors"
                  title="LinkedIn Profile"
                >
                  <i className="bx bxl-linkedin text-lg leading-none"></i>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
