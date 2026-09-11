import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DeleteConfirmModal({ item, onConfirm, onClose }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md flex justify-center items-end md:items-center z-50 p-0 md:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white w-full md:w-[400px] rounded-t-3xl md:rounded-[2rem] md:rounded-b-[2rem] shadow-2xl relative z-10 flex flex-col p-6 md:p-8 text-center ring-1 ring-brand-border"
      >
        <div className="w-16 h-16 bg-brand-dangerLight rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={28} className="text-brand-danger" />
        </div>
        <h2 className="text-xl font-black text-brand-dark mb-2">
          Delete Item?
        </h2>
        <p className="text-brand-muted text-sm mb-6">
          Are you sure you want to delete{" "}
          <strong className="text-brand-dark">{item.name}</strong>? This action
          cannot be undone.
        </p>
        <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-brand-border text-brand-dark font-bold rounded-xl text-sm hover:bg-surface-2 transition-all shadow-sm active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-brand-danger text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-danger/30 hover:bg-red-600 hover:shadow-xl hover:shadow-brand-danger/40 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
