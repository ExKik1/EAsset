import React from "react";
import { motion } from "motion/react";
import { UploadCloud, FileCheck, Trash2 } from "lucide-react";

interface DropzoneInputProps {
  file: File | null;
  activeTab: "encrypt" | "decrypt";
  dragActive: boolean;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  formatBytes: (bytes: number) => string;
}

export const DropzoneInput: React.FC<DropzoneInputProps> = ({
  file,
  activeTab,
  dragActive,
  isLoading,
  fileInputRef,
  onDrag,
  onDrop,
  onFileChange,
  onRemoveFile,
  formatBytes,
}) => {
  if (!file) {
    return (
      <motion.div
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        onDragEnter={onDrag}
        onDragOver={onDrag}
        onDragLeave={onDrag}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 sm:p-10 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center space-y-4 ${
          dragActive
            ? "border-[#0b2f9f] bg-blue-50/50 shadow-inner"
            : "border-[#c7c7c7] hover:border-[#0b2f9f] bg-slate-50 hover:bg-slate-50/80"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={onFileChange}
          className="hidden"
          accept={activeTab === "decrypt" ? ".locked,.enc" : "*"}
        />
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0b2f9f] to-[#00809d] text-white rounded-full flex items-center justify-center shadow-md">
          <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
        </div>
        <div>
          <p className="text-slate-800 font-bold text-sm">
            Tap to pick or drop file here
          </p>
          <p className="text-slate-400 text-[11px] mt-0.5 font-medium">
            {activeTab === "decrypt"
              ? "Accepts .locked or .enc extensions"
              : "Any file format up to 100MB"}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-3 shadow-sm"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-2 bg-gradient-to-br from-[#0b2f9f] to-[#00809d] text-white rounded-lg shadow-sm">
          <FileCheck className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-bold truncate text-slate-800">
            {file.name}
          </p>
          <p className="text-[10px] font-mono text-slate-400 font-semibold">
            {formatBytes(file.size)}
          </p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={onRemoveFile}
        disabled={isLoading}
        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};
