import React from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DeleteConfirmModal({ item, onConfirm, onClose }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center"
      >
        <div className="w-16 h-16 bg-brand-dangerLight rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={28} className="text-brand-danger" />
        </div>
        <h2 className="text-xl font-black text-brand-dark mb-2">Delete Item?</h2>
        <p className="text-brand-muted text-sm mb-6">
          Are you sure you want to delete{" "}
          <strong className="text-brand-dark">{item.name}</strong>? This action
          cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-brand-border text-brand-dark font-bold rounded-xl text-sm hover:bg-brand-bg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-brand-danger text-white font-bold rounded-xl text-sm hover:bg-brand-danger/90 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
