"use client";
import { CheckCircle, ChefHat, Coffee, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const EmptyState = ({ title, desc, onGoToMenu }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
      animate={{ scale: 1, opacity: 1, rotate: 3 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="w-24 h-24 bg-white/80 backdrop-blur-xl rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-white"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[1.4rem] flex items-center justify-center border border-indigo-100">
        <Coffee size={30} className="text-indigo-300" />
      </div>
    </motion.div>
    <h2
      className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-black via-slate-800 to-slate-700 drop-shadow-sm mb-2 tracking-tight"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {title}
    </h2>
    <p className="text-slate-500 max-w-[240px] mx-auto text-sm leading-relaxed mb-7">
      {desc}
    </p>
    {onGoToMenu && (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onGoToMenu}
        className="px-7 py-3.5 bg-gradient-to-r from-black to-slate-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 text-sm tracking-wide"
      >
        Browse Menu
      </motion.button>
    )}
  </div>
);

const statusConfig = {
  new: {
    label: "New",
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  preparing: {
    label: "Preparing",
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  accepted: {
    label: "Accepted",
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  served: {
    label: "Served",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
};

export default function OrdersTab({ placedOrders, onGoToMenu }) {
  if (!placedOrders || placedOrders.length === 0) {
    return (
      <EmptyState
        title="No Active Orders"
        desc="Looks like your table is empty. Head over to the menu to explore our delicious offerings!"
        onGoToMenu={onGoToMenu}
      />
    );
  }

  const orderTotal = placedOrders.reduce((sum, item) => {
    if (!item) return sum;
    if (item?.status?.toLowerCase() === "cancelled") return sum;
    const basePrice = parseFloat(
      item?.variant?.price || item?.product?.price || item?.item?.price || 0,
    );
    const addonsPrice = (item?.addons || []).reduce(
      (s, a) => s + parseFloat(a?.price || 0),
      0,
    );
    return sum + (basePrice + addonsPrice) * (item?.quantity || 1);
  }, 0);

  const activeItems = placedOrders.filter(
    (item) => item && item?.status?.toLowerCase() !== "cancelled",
  );

  if (activeItems.length === 0 && placedOrders.length > 0) {
    return (
      <EmptyState
        title="All Done!"
        desc="All your ordered items have been cancelled or there are no active items."
        onGoToMenu={onGoToMenu}
      />
    );
  }

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Active Orders Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-slate-100/80">
          <div>
            <h2
              className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-black via-slate-800 to-slate-700 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Active Orders
            </h2>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
              Currently being prepared
            </p>
          </div>
          <div className="bg-amber-50 text-amber-500 p-3 rounded-2xl border border-amber-100 shadow-sm">
            <ChefHat size={22} />
          </div>
        </div>

        {/* Items List */}
        <div className="p-4 space-y-3">
          {activeItems.map((item, idx) => {
            const basePrice = parseFloat(
              item.variant?.price ||
                item.product?.price ||
                item.item?.price ||
                0,
            );
            const addonsPrice = (item.addons || []).reduce(
              (s, a) => s + parseFloat(a.price || 0),
              0,
            );
            const calculatedTotal = (basePrice + addonsPrice) * item.quantity;
            const statusKey = item.status?.toLowerCase();
            const cfg = statusConfig[statusKey] || {
              label: item.status,
              bg: "bg-slate-100",
              text: "text-slate-600",
              border: "border-slate-200",
            };
            const isServed = statusKey === "served";

            return (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.05,
                  type: "spring",
                  stiffness: 280,
                  damping: 24,
                }}
                className={`relative flex gap-3 items-start p-3.5 rounded-2xl border transition-all ${
                  isServed
                    ? "bg-emerald-50/60 border-emerald-200/50"
                    : "bg-white/80 border-slate-100"
                }`}
              >
                {/* Qty badge */}
                <div
                  className={`w-11 h-11 rounded-xl border flex flex-col items-center justify-center shrink-0 shadow-sm ${
                    isServed
                      ? "bg-emerald-50 border-emerald-100"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <span className="text-base font-black text-slate-700 leading-none">
                    {item.quantity}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 leading-none">
                    ×
                  </span>
                </div>

                {/* Name + details */}
                <div className="flex-1 min-w-0">
                  <div className="overflow-hidden mb-1">
                    <p className="font-black text-transparent bg-clip-text bg-gradient-to-r from-black via-slate-800 to-slate-700 text-[14px] leading-tight drop-shadow-sm inline-block">
                      {item.product?.name || item.item?.name || "Unknown Item"}
                    </p>
                  </div>

                  {/* Customizations */}
                  {(item.variant ||
                    item.addons?.length > 0 ||
                    item.spiceLevel) && (
                    <div className="flex flex-wrap gap-1">
                      {item.variant && (
                        <span className="inline-flex bg-indigo-50 text-indigo-600 text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                          {item.variant.name}
                        </span>
                      )}
                      {item.addons?.length > 0 && (
                        <span className="inline-flex bg-slate-100 text-slate-500 text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                          {item.addons.map((a) => a.name).join(", ")}
                        </span>
                      )}
                      {item.spiceLevel && (
                        <span className="inline-flex bg-orange-50 text-orange-500 text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                          🌶 {item.spiceLevel}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Status badge — absolute top-right */}
                  <span
                    className={`absolute top-2.5 right-3 inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                  >
                    {statusKey === "preparing" && <Clock size={8} />}
                    {isServed && <CheckCircle size={8} />}
                    {cfg.label}
                  </span>
                </div>

                {/* Price */}
                <div className="shrink-0 text-right mt-auto">
                  <p className="text-[15px] font-black text-slate-800">
                    ₹{calculatedTotal.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Running Total / Request Bill Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-slate-800 shadow-2xl shadow-indigo-900/25"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/15 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative p-6 text-white">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={14} className="text-indigo-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
              Running Total
            </span>
          </div>

          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">
                Total so far
              </p>
              <p className="text-xs text-slate-500">
                Includes all active items
              </p>
            </div>
            <p className="text-4xl font-black tracking-tighter">
              ₹{orderTotal.toFixed(2)}
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-5" />

          <button className="w-full py-4 bg-white text-slate-900 text-[15px] font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-50 active:scale-[0.98] transition-all shadow-sm">
            <CheckCircle size={18} className="text-emerald-500" />
            Request Bill
          </button>
        </div>
      </motion.div>
    </div>
  );
}
