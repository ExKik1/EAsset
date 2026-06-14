import { motion } from "motion/react";
import Cropper from "react-easy-crop";
import { X, Check } from "lucide-react";

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  crop: { x: number; y: number };
  zoom: number;
  setCrop: (crop: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onClose: () => void;
  onApply: () => void;
}

export default function ImageCropModal({
  isOpen,
  imageSrc,
  crop,
  zoom,
  setCrop,
  setZoom,
  onCropComplete,
  onClose,
  onApply,
}: ImageCropModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden flex flex-col border border-slate-200"
      >
        {/* Header Modal */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">
            Sesuaikan Proporsi Foto (1:1)
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Area Cropper */}
        <div className="relative w-full h-72 bg-slate-900">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        {/* Slider Zoom */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 space-y-1.5">
          <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Perbesar/Perkecil
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
        </div>

        {/* Footer Tombol Aksi */}
        <div className="px-4 py-3 flex justify-end gap-2 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Terapkan Potongan</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
