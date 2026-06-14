import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChevronDown, X } from "lucide-react";

interface Option {
  id: number | string;
  label: string;
  subLabel?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.subLabel &&
        opt.subLabel.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const selectedOption = options.find(
    (opt) => String(opt.id) === String(value),
  );

  return (
    <div className="w-full relative" ref={containerRef}>
      <label className="block text-xs font-medium text-slate-500 uppercase mb-1.5 tracking-wide">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 bg-slate-50 border border-info-border rounded-md text-sm font-medium flex items-center justify-between transition-all duration-200 ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-slate-100/50"
        } ${isOpen ? "ring-2 ring-primary/20 border-primary bg-white" : ""}`}
      >
        <span
          className={
            selectedOption ? "text-slate-800" : "text-slate-400 font-normal"
          }
        >
          {selectedOption
            ? selectedOption.subLabel
              ? `${selectedOption.label} (${selectedOption.subLabel})`
              : selectedOption.label
            : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && !disabled && (
            <X
              className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500 transition-colors mr-1"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setSearchQuery("");
              }}
            />
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-md shadow-xl max-h-60 overflow-hidden flex flex-col"
          >
            <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2 sticky top-0">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
              <input
                type="text"
                placeholder="Ketik untuk mencari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-transparent text-xs font-medium text-slate-700 outline-hidden border-none p-1 focus:ring-0"
              />
            </div>

            <div className="overflow-y-auto flex-1 max-h-44 divide-y divide-slate-50">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => {
                      onChange(String(opt.id));
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`px-4 py-2.5 text-xs font-medium cursor-pointer transition-colors flex items-center justify-between ${
                      String(value) === String(opt.id)
                        ? "bg-primary/5 text-primary"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {opt.subLabel && (
                      <span className="text-[10px] font-mono tracking-wider bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
                        {opt.subLabel}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-4 text-center text-xs text-slate-400 italic">
                  Data tidak ditemukan
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
