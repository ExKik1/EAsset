import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const ScrollAnimateSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export const LandingFaq: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const faqs: FAQItem[] = [
    {
      question:
        "Aset dan alat apa saja yang dapat dipinjam melalui platform E-Asset?",
      answer:
        "E-Asset memfasilitasi peminjaman berbagai macam inventaris institusi, mulai dari alat laboratorium praktikum (seperti mikroskop, instrumen jaringan, komponen elektronika), fasilitas multimedia (proyektor, kamera), hingga sarana logistik operasional kegiatan lainnya.",
    },
    {
      question:
        "Bagaimana cara melakukan peminjaman menggunakan fitur QR Code?",
      answer:
        "Caranya sangat praktis. Anda hanya perlu login ke akun E-Asset Anda, pilih menu peminjaman, lalu gunakan kamera perangkat untuk memindai (scan) QR Code unik yang tertempel pada fisik alat. Sistem akan langsung memvalidasi kecocokan data barang dan mencatat log peminjaman atas nama Anda.",
    },
    {
      question:
        "Bagaimana sistem E-Asset mencegah terjadinya pemesanan ganda (double booking)?",
      answer:
        "E-Asset dilengkapi dengan validasi basis data sirkulasi yang terintegrasi secara instan. Ketika sebuah alat berhasil dipindai dan statusnya berubah menjadi 'Dipinjam', hak akses pemindaian untuk alat tersebut otomatis terkunci bagi pengguna lain sampai unit bersangkutan dikembalikan secara sah.",
    },
    {
      question:
        "Siapa saja yang memiliki hak akses untuk meminjam aset di dalam sistem ini?",
      answer:
        "Sistem ini ditujukan untuk seluruh sivitas akademika atau anggota internal terverifikasi yang memiliki identitas resmi (seperti akun NIM/NIP). Setiap peran pengguna memiliki batas kuota dan otorisasi peminjaman yang disesuaikan dengan kebutuhan inventaris masing-masing.",
    },
    {
      question:
        "Bagaimana alur untuk mengembalikan alat yang telah selesai digunakan?",
      answer:
        "Saat masa peminjaman berakhir, bawa kembali fisik alat ke ruang inventaris atau laboratorium asal, lalu lakukan pemindaian ulang pada QR Code barang melalui menu pengembalian. Petugas atau admin logistik akan melakukan verifikasi fisik sebelum status sirkulasi unit dinyatakan selesai.",
    },
    {
      question:
        "Apa yang terjadi jika saya terlambat mengembalikan alat dari batas waktu yang ditentukan?",
      answer:
        "Sistem akan mencatat log keterlambatan secara otomatis pada riwayat akun Anda. Informasi durasi keterlambatan ini akan menjadi bahan evaluasi admin logistik dalam menyetujui pengajuan sirkulasi peminjaman mandiri Anda berikutnya.",
    },
  ];

  return (
    <section
      id="faq"
      className="py-16 sm:py-20 px-[4%] md:px-[7%] lg:px-[10%] transition-colors duration-300"
    >
      <ScrollAnimateSection>
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-10">
          <h2 className="badge-span-g text-xs font-bold uppercase tracking-widest text-[#059669] bg-emerald-50 px-3 py-1 rounded-md inline-block">
            Tanya Jawab
          </h2>
          <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            <span className="text-[#059669]">FAQ</span> Informasi Aplikasi
          </h3>
          <p className="text-slate-500 text-sm">
            Temukan jawaban lengkap mengenai mekanisme peminjaman mandiri,
            integrasi alur QR Code, dan aturan pengelolaan sirkulasi inventaris
            di platform E-Asset.
          </p>
        </div>
      </ScrollAnimateSection>

      <div className="space-y-4 max-w-4xl mx-auto">
        {faqs.map((faq, index) => {
          const isActive = openFaqIndex === index;

          return (
            <div
              key={index}
              className={`bg-white border rounded-md p-4 text-left shadow-sm transition-all duration-300 ${
                isActive
                  ? "border-[#059669] ring-1 ring-[#059669]/20"
                  : "border-slate-200"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(isActive ? null : index)}
                className="w-full flex justify-between items-center text-left font-bold text-sm gap-4 cursor-pointer"
              >
                <span
                  className={`transition-colors duration-300 ${isActive ? "text-[#059669]" : "text-slate-800"}`}
                >
                  {faq.question}
                </span>
                {isActive ? (
                  <ChevronUp className="w-4 h-4 text-[#059669]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
