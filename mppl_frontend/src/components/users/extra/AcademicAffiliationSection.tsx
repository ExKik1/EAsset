import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";
import SearchableSelect from "../../../components/ui/SearchableSelect";

interface AcademicAffiliationProps {
  variants?: any;
  form: any;
  setForm: (form: any) => void;
  fakultasOptions: any[];
  filteredProdiOptions: any[];
}

export default function AcademicAffiliationSection({
  variants,
  form,
  setForm,
  fakultasOptions,
  filteredProdiOptions,
}: AcademicAffiliationProps) {
  return (
    <motion.div
      variants={variants}
      className="bg-white border border-info-border shadow-md relative"
    >
      <div className="relative overflow-hidden px-6 py-4 bg-brand-gradient border-b border-slate-200/70 flex items-center gap-2 text-white">
        <motion.div
          animate={{
            x: ["-100%", "200%"],
            opacity: [0, 0.2, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
        />

        <GraduationCap className="w-4 h-4 z-10" />
        <h3 className="text-xs font-bold uppercase tracking-wide z-10">
          C. Afiliasi Akademik & Kluster Prodi
        </h3>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 relative z-20 overflow-visible">
        <SearchableSelect
          label="Fakultas Induk"
          placeholder="-- Pilih Fakultas --"
          options={(fakultasOptions || []).map((f) => ({
            id: f.id,
            label: f.nama_fakultas || "",
            subLabel: f.kode_fakultas,
          }))}
          value={form.fakultas_id}
          onChange={(val) => {
            setForm({
              ...form,
              fakultas_id: val,
              program_studi_id: "",
            });
          }}
        />

        <SearchableSelect
          label="Program Studi Manajemen"
          placeholder={
            form.fakultas_id
              ? "-- Pilih Program Studi --"
              : "Silakan pilih fakultas terlebih dahulu"
          }
          disabled={!form.fakultas_id}
          options={(filteredProdiOptions || []).map((p) => ({
            id: p.id,
            label: p.nama_prodi || "",
            subLabel: p.kode_prodi,
          }))}
          value={form.program_studi_id}
          onChange={(val) => setForm({ ...form, program_studi_id: val })}
        />
      </div>
    </motion.div>
  );
}
