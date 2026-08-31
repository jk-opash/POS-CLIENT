import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { getBadgeStyle } from "./helpers";
import StockBar from "./StockBar";
import { getImageUrl } from "../../../lib/utils";

export default function ItemDetailModal({ item, onClose, onAdjust }) {
  if (!item) return null;
  const stockColor =
    item.currentStock <= 0
      ? "text-red-600"
      : item.currentStock <= item.reorderLevel * 0.5
        ? "text-orange-600"
        : item.currentStock <= item.reorderLevel
          ? "text-amber-600"
          : "text-emerald-600";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-800">Item Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {item.image_url && (
            <img
              src={getImageUrl(item.image_url)}
              alt={item.name}
              className="w-full h-36 object-cover rounded-xl"
            />
          )}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xl font-black text-slate-800">
                {item.name}
              </div>
              <div className="text-xs font-mono text-slate-400 mt-0.5">
                {item.sku}
              </div>
            </div>
            <span
              className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${getBadgeStyle(item.status)}`}
            >
              {item.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Category", item.category],
              ["Unit", item.unit],
              [
                "In Stock",
                <span className={`font-black ${stockColor}`}>
                  {item.currentStock}
                </span>,
              ],
              ["Reorder At", item.reorderLevel],
              ["Cost Price", `₹${item.cost}`],
              ["Unit Price", `₹${item.price}`],
              ["Reserved", item.reserved || 0],
              ["Last Counted", item.lastCounted],
            ].map(([label, value], i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  {label}
                </div>
                <div className="text-sm font-bold text-slate-800">{value}</div>
              </div>
            ))}
          </div>
          <div className="pt-1">
            <StockBar current={item.currentStock} reorder={item.reorderLevel} />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onAdjust(item);
            }}
            className="flex-1 py-2.5 bg-slate-800 text-white font-bold rounded-xl text-sm hover:bg-slate-700 transition-colors"
          >
            Adjust Stock
          </button>
        </div>
      </motion.div>
    </div>
  );
}
