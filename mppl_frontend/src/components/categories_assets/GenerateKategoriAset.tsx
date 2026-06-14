import { Wand2 } from "lucide-react";
import { motion } from "motion/react";

interface GenerateKategoriAsetProps {
  label: string;
  value: string;
  placeholder?: string;
  prefixPattern: string; // Contoh: "E-ASSET-CA-"
  length?: number; // Panjang angka random, default: 5
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export default function GenerateKategoriAset({
  label,
  value,
  placeholder = "Contoh: ELEK",
  prefixPattern,
  length = 5,
  required = false,
  disabled = false,
  onChange,
}: GenerateKategoriAsetProps) {
  const generateRandomCode = () => {
    if (disabled) return;

    // Membuat angka random sepanjang X digit angka (0-9)
    let randomNumber = "";
    for (let i = 0; i < length; i++) {
      randomNumber += Math.floor(Math.random() * 10).toString();
    }

    const finalCode = `${prefixPattern}${randomNumber}`;
    onChange(finalCode);
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-medium text-slate-600 uppercase mb-1.5 tracking-wide">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative flex items-center rounded-md bg-slate-50 border border-info-border focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-3.5 pr-12 py-2.5 bg-transparent border-none font-mono text-sm font-normal text-slate-800 tracking-wide placeholder:font-sans placeholder:font-normal placeholder:normal-case outline-hidden focus:ring-0"
        />
        <div className="absolute right-1.5 p-1">
          <motion.button
            type="button"
            disabled={disabled}
            onClick={generateRandomCode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Generate Kode Otomatis"
            className="p-1.5 text-slate-400 hover:text-primary bg-white hover:bg-slate-50 border border-slate-200 rounded-md shadow-2xs cursor-pointer transition-colors disabled:opacity-50"
          >
            <Wand2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
