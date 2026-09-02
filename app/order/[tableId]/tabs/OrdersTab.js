"use client";
import { Clock, CheckCircle, ChefHat, Receipt, Coffee } from "lucide-react";
import { motion } from "framer-motion";

export default function OrdersTab({ placedOrders, onGoToMenu }) {
  if (!placedOrders || placedOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 3 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-[1.8rem] flex items-center justify-center shadow-inner -rotate-3">
            <Coffee size={36} className="text-slate-400" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">
          No Active Orders
        </h2>
        <p className="text-slate-500 max-w-[260px] mx-auto text-[15px] leading-relaxed font-medium mb-8">
          Looks like your table is empty. Head over to the menu to explore our
          delicious offerings!
        </p>
        {onGoToMenu && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoToMenu}
            className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/20 flex items-center gap-2"
          >
            Browse Menu
          </motion.button>
        )}
      </div>
    );
  }

  const orderTotal = placedOrders.reduce((sum, item) => {
    if (!item) return sum;
    // Do not include cancelled items in the bill total
    if (item?.status?.toLowerCase() === "cancelled") return sum;
    const basePrice =
      item?.variant?.price || item?.product?.price || item?.item?.price || 0;
    const addonsPrice = (item?.addons || []).reduce(
      (s, a) => s + (a?.price || 0),
      0,
    );
    return sum + (basePrice + addonsPrice) * (item?.quantity || 1);
  }, 0);

  // Filter out cancelled items from the UI.
  // We can also filter out Served if we only want to show running/preparing orders,
  // but usually Served items should still be visible on the receipt.
  // Let's filter out Cancelled items from the UI completely.
  const activeItems = placedOrders.filter(
    (item) => item && item?.status?.toLowerCase() !== "cancelled",
  );

  if (activeItems.length === 0 && placedOrders.length > 0) {
    // If all items were cancelled, just show the empty state
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 3 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100"
        >
          <div className="w-20 h-20 bg-slate-50 rounded-[1.8rem] flex items-center justify-center shadow-inner -rotate-3">
            <Coffee size={36} className="text-slate-400" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">
          No Active Orders
        </h2>
        <p className="text-slate-500 max-w-[260px] mx-auto text-[15px] leading-relaxed font-medium mb-8">
          All your ordered items have been cancelled or there are no active
          items.
        </p>
        {onGoToMenu && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoToMenu}
            className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/20 flex items-center gap-2"
          >
            Browse Menu
          </motion.button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 pt-2">
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Active Orders
            </h2>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Currently being prepared
            </p>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3.5 rounded-2xl shadow-sm border border-amber-100">
            <ChefHat size={24} />
          </div>
        </div>

        <div className="space-y-4">
          {activeItems.map((item, idx) => {
            const basePrice =
              item.variant?.price ||
              item.product?.price ||
              item.item?.price ||
              0;
            const addonsPrice = (item.addons || []).reduce(
              (sum, a) => sum + (a.price || 0),
              0,
            );
            const calculatedTotal = (basePrice + addonsPrice) * item.quantity;

            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 24,
                }}
                key={item.id || idx}
                className={`group relative flex gap-4 items-start p-4 rounded-2xl transition-colors border ${
                  item.status?.toLowerCase() === "served"
                    ? "bg-emerald-50/50 border-emerald-100/50"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-100"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl shadow-sm border flex items-center justify-center shrink-0 ${
                    item.status?.toLowerCase() === "served"
                      ? "bg-emerald-50 border-emerald-100"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <span className="text-base font-black text-slate-700">
                    {item.quantity}
                  </span>
                  <span className="text-xs font-bold text-slate-400 ml-0.5">
                    x
                  </span>
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="font-bold text-slate-800 text-base leading-tight truncate">
                    {item.product?.name || item.item?.name || "Unknown Item"}
                  </p>

                  <div className="mt-2.5 space-y-1.5">
                    {item.variant && (
                      <p className="text-[13px] font-medium text-slate-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        {item.variant.name}
                      </p>
                    )}
                    {item.addons && item.addons.length > 0 && (
                      <p className="text-[13px] font-medium text-slate-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        {item.addons.map((a) => a.name).join(", ")}
                      </p>
                    )}
                    {item.spiceLevel && (
                      <p className="text-[13px] font-medium text-slate-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        {item.spiceLevel}
                      </p>
                    )}
                  </div>

                  <div className="mt-3.5 flex items-center gap-2">
                    {item.status && (
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${
                          item.status?.toLowerCase() === "new"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : item.status?.toLowerCase() === "preparing"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : item.status?.toLowerCase() === "served"
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 pt-0.5">
                  <p className="text-[17px] font-black text-slate-800 tracking-tight">
                    ₹{calculatedTotal.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl shadow-slate-900/20"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3.5">
            <div className="bg-white/10 p-3 rounded-2xl border border-white/5">
              <Receipt size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                Running Total
              </p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Includes all active items
              </p>
            </div>
          </div>
          <p className="text-3xl font-black tracking-tighter">
            ₹{orderTotal.toFixed(2)}
          </p>
        </div>

        {/* We can wire up the actual 'Request Bill' logic later */}
        <button className="w-full py-4 bg-white text-slate-900 text-[15px] font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm">
          <CheckCircle size={20} className="text-emerald-500" />
          Request Bill
        </button>
      </motion.div>
    </div>
  );
}
