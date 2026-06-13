import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, X } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  isSubmitLoading: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  isSubmitLoading,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative z-10 mx-auto"
      >
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-rose-600">
              <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-slate-900">
                Konfirmasi Hapus Akun
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Apakah Anda yakin ingin menghapus akun ini? Tindakan ini bersifat
            ireversibel (tidak dapat dibatalkan). Semua data Anda akan dihapus
            dari sistem E-Asset.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitLoading}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm rounded-lg bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirmDelete}
              disabled={isSubmitLoading}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-lg shadow transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitLoading ? "Memproses..." : "Ya, Hapus Permanen"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
