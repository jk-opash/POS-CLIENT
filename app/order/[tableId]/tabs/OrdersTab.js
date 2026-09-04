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
      <div className="w-16 h-16 bg-gradient-to-br from-brand-primaryLight to-brand-purple rounded-[1.4rem] flex items-center justify-center border border-brand-primaryLight">
        <Coffee size={30} className="text-brand-primary" />
      </div>
    </motion.div>
    <h2
      className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-black via-slate-800 to-brand-dark drop-shadow-sm mb-2 tracking-tight"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {title}
    </h2>
    <p className="text-brand-muted max-w-[240px] mx-auto text-sm leading-relaxed mb-7">
      {desc}
    </p>
    {onGoToMenu && (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onGoToMenu}
        className="px-7 py-3.5 bg-gradient-to-r from-black to-brand-dark text-white font-bold rounded-2xl shadow-lg shadow-brand-primary/25 text-sm tracking-wide"
      >
        Browse Menu
      </motion.button>
    )}
  </div>
);

const statusConfig = {
  new: {
    label: "New",
    bg: "bg-brand-warningLight",
    text: "text-brand-warning",
    border: "border-brand-warningLight",
  },
  preparing: {
    label: "Preparing",
    bg: "bg-brand-primaryLight",
    text: "text-brand-primary",
    border: "border-brand-primaryLight",
  },
  accepted: {
    label: "Accepted",
    bg: "bg-brand-primaryLight",
    text: "text-brand-primary",
    border: "border-brand-primaryLight",
  },
  served: {
    label: "Served",
    bg: "bg-brand-successLight",
    text: "text-brand-success",
    border: "border-brand-successLight",
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
        <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-brand-light/80">
          <div>
            <h2
              className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-black via-slate-800 to-brand-dark tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Active Orders
            </h2>
            <p className="text-[10px] font-bold text-brand-muted mt-0.5 uppercase tracking-widest">
              Currently being prepared
            </p>
          </div>
          <div className="bg-brand-warningLight text-brand-warning p-3 rounded-2xl border border-brand-warningLight shadow-sm">
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
              bg: "bg-brand-light",
              text: "text-brand-dark",
              border: "border-brand-light",
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
                    ? "bg-brand-successLight/60 border-brand-successLight/50"
                    : "bg-white/80 border-brand-light"
                }`}
              >
                {/* Qty badge */}
                <div
                  className={`w-11 h-11 rounded-xl border flex flex-col items-center justify-center shrink-0 shadow-sm ${
                    isServed
                      ? "bg-brand-successLight border-brand-successLight"
                      : "bg-brand-light border-brand-light"
                  }`}
                >
                  <span className="text-base font-black text-brand-dark leading-none">
                    {item.quantity}
                  </span>
                  <span className="text-[9px] font-bold text-brand-muted leading-none">
                    ×
                  </span>
                </div>

                {/* Name + details */}
                <div className="flex-1 min-w-0">
                  <div className="overflow-hidden mb-1">
                    <p className="font-black text-transparent bg-clip-text bg-gradient-to-r from-black via-slate-800 to-brand-dark text-[14px] leading-tight drop-shadow-sm inline-block">
                      {item.product?.name || item.item?.name || "Unknown Item"}
                    </p>
                  </div>

                  {/* Customizations */}
                  {(item.variant ||
                    item.addons?.length > 0 ||
                    item.spiceLevel) && (
                    <div className="flex flex-wrap gap-1">
                      {item.variant && (
                        <span className="inline-flex bg-brand-primaryLight text-brand-primary text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                          {item.variant.name}
                        </span>
                      )}
                      {item.addons?.length > 0 && (
                        <span className="inline-flex bg-brand-light text-brand-muted text-[11px] font-bold px-1.5 py-0.5 rounded-full">
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
                  <p className="text-[15px] font-black text-brand-dark">
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
        className="relative overflow-hidden rounded-[2rem] border border-brand-dark shadow-2xl shadow-brand-primary/25"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-slate-950 to-brand-dark" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-purple/15 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative p-6 text-white">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={14} className="text-brand-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
              Running Total
            </span>
          </div>

          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-brand-muted mb-1">
                Total so far
              </p>
              <p className="text-xs text-brand-muted">
                Includes all active items
              </p>
            </div>
            <p className="text-4xl font-black tracking-tighter">
              ₹{orderTotal.toFixed(2)}
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-5" />

          <button className="w-full py-4 bg-white text-brand-dark text-[15px] font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-primaryLight active:scale-[0.98] transition-all shadow-sm">
            <CheckCircle size={18} className="text-brand-success" />
            Request Bill
          </button>
        </div>
      </motion.div>
    </div>
  );
}
