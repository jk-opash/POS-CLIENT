import { AlertTriangle, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteConfirmModal({ item, onConfirm, onClose }) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-6 text-center"
        >
          <div className="w-16 h-16 bg-brand-dangerLight rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-brand-danger" />
          </div>
          
          <h2 className="text-xl font-bold text-brand-dark mb-2">
            Archive Supplier
          </h2>
          <p className="text-brand-muted mb-6">
            Are you sure you want to archive <strong>{item.name}</strong>? This will soft-delete the supplier and mark them as archived.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-brand-light hover:bg-brand-border text-brand-dark font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 px-4 bg-brand-danger hover:bg-brand-danger text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Yes, Archive
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
