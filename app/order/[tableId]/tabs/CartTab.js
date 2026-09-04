"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { placePublicOrder } from "../../../store/slices/publicMenuSlice";
import {
  Trash2,
  ShoppingCart,
  Minus,
  Plus,
  Tag,
  Loader2,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { getImageUrl } from "../../../lib/utils";

export default function CartTab({
  cart,
  setCart,
  branch,
  cartTotal,
  tableId,
  onOrderPlaced,
  activeOrders = [],
}) {
  const dispatch = useDispatch();
  const total = cartTotal;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const pendingOrder = activeOrders?.find(
        (o) => o.status === "Pending" && o.payment_status === "Pending",
      );

      const orderNumber =
        pendingOrder?.order_number ||
        `ORD-${branch?.branch_code || "BR"}-${Date.now().toString().slice(-6)}`;
      const kotNumber = `KOT-${Date.now().toString().slice(-6)}`;

      const orderData = {
        branch_id: branch?.id,
        order_number: orderNumber,
        order_type: "QR Order",
        table_id: tableId,
        status: "Pending",
        payment_status: "Pending",
        subtotal: cartTotal,
        tax_amount: 0,
        discount_amount: 0,
        total_amount: total,
      };

      const sanitizeItem = (item) => ({
        id: item.id,
        kot_number: kotNumber,
        isLockedItem: true,
        added_at: new Date().toISOString(),
        quantity: item.quantity,
        status: "New",
        product: {
          id: item.item.id,
          name: item.item.name,
          category: item.item.category || item.item.category_id || null,
          price: item.unitPrice,
        },
        variant: item.variant
          ? {
              id: item.variant.id,
              name: item.variant.name,
              price: item.variant.price,
            }
          : null,
        addons: (item.addons || []).map((a) => ({
          id: a.id,
          name: a.name,
          price: a.price || 0,
        })),
      });

      const newSanitizedCart = cart.map(sanitizeItem);

      // Merge running_order and totals if pending order exists
      const mergedRunningOrder = pendingOrder
        ? [...(pendingOrder.running_order || []), ...newSanitizedCart]
        : newSanitizedCart;

      const mergedSubtotal = pendingOrder
        ? parseFloat(pendingOrder.subtotal || 0) + cartTotal
        : cartTotal;
      const mergedTotal = pendingOrder
        ? parseFloat(pendingOrder.total_amount || 0) + total
        : total;

      const kotData = {
        kot_numbers: [kotNumber],
        running_order: mergedRunningOrder,
        cart_items: [],
        subtotal: mergedSubtotal.toString(),
        tax_amount: 0,
        discount_amount: 0,
        total_amount: mergedTotal.toString(),
      };

      await dispatch(
        placePublicOrder({
          existingOrderId: pendingOrder?.id,
          orderData,
          kotData,
        }),
      ).unwrap();

      if (onOrderPlaced) onOrderPlaced();
      setCart([]);
      alert("Order sent to kitchen!");
    } catch (error) {
      console.error("Failed to place order:", error);
      alert(
        typeof error === "string"
          ? error
          : "Failed to place order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeItem = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.id !== id) return c;
          const newQty = c.quantity + delta;
          if (newQty < 1) return null;
          return { ...c, quantity: newQty, totalPrice: c.unitPrice * newQty };
        })
        .filter(Boolean),
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-black via-slate-800 to-brand-dark drop-shadow-sm"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Your Cart
        </h2>
        {cart.length > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primaryLight px-2.5 py-1 rounded-full border border-brand-primaryLight">
            {cart.length} item{cart.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {cart.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="text-center py-16 bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm flex flex-col items-center gap-4"
          >
            <motion.div
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 3, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-20 h-20 bg-gradient-to-br from-brand-primaryLight to-brand-purple rounded-[1.5rem] flex items-center justify-center shadow-inner border border-brand-primaryLight"
            >
              <ShoppingCart size={32} className="text-brand-primary" />
            </motion.div>
            <div>
              <p className="font-black text-brand-dark text-base">
                Your cart is empty
              </p>
              <p className="text-xs text-brand-muted mt-1">
                Add items from the menu to get started
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {/* Cart Item Cards */}
            <AnimatePresence mode="popLayout">
              {cart.map((cartItem) => (
                <motion.div
                  key={cartItem.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -56, scale: 0.93 }}
                  transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                  className="bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-sm overflow-hidden"
                >
                  <div className="flex gap-3 p-3">
                    {/* Image */}
                    <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden flex-shrink-0 bg-brand-light border border-brand-light shadow-inner">
                      {cartItem.item.image_url ? (
                        <img
                          src={getImageUrl(cartItem.item.image_url)}
                          alt={cartItem.item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-muted">
                          <UtensilsCrossed size={28} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="overflow-hidden flex-1">
                          <h4 className="font-black text-transparent bg-clip-text bg-gradient-to-r from-black via-slate-800 to-brand-dark text-[14px] leading-snug drop-shadow-sm inline-block">
                            {cartItem.item.name}
                          </h4>
                        </div>
                        <span className="font-black text-brand-dark text-[14px] shrink-0">
                          {branch?.currency} {cartItem.totalPrice.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Tags */}
                        <div>
                          {(cartItem.variant ||
                            cartItem.spiceLevel ||
                            cartItem.addons?.length > 0) && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {cartItem.variant && (
                                <span className="inline-flex items-center gap-1 bg-brand-primaryLight text-brand-primary text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                                  <Tag size={11} /> {cartItem.variant.name}
                                </span>
                              )}
                              {cartItem.spiceLevel && (
                                <span className="inline-flex items-center bg-orange-50 text-orange-500 text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                                  🌶 {cartItem.spiceLevel}
                                </span>
                              )}
                              {cartItem.addons?.map((addon, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center bg-brand-light text-brand-muted text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                                >
                                  + {addon.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Qty + Remove */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center bg-brand-light rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQty(cartItem.id, -1)}
                              className="w-7 h-7 flex items-center justify-center text-brand-dark hover:bg-brand-light active:scale-90 transition-all"
                            >
                              <Minus size={12} strokeWidth={3} />
                            </button>
                            <span className="w-7 text-center text-sm font-black text-brand-dark">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(cartItem.id, 1)}
                              className="w-7 h-7 flex items-center justify-center text-brand-dark hover:bg-brand-light active:scale-90 transition-all"
                            >
                              <Plus size={12} strokeWidth={3} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(cartItem.id)}
                            className="w-7 h-7 bg-brand-dangerLight text-brand-danger rounded-xl flex items-center justify-center hover:bg-brand-dangerLight hover:text-brand-danger active:scale-90 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Order Summary Card */}
            <motion.div
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[2rem] border border-brand-dark shadow-2xl shadow-brand-primary/25 mt-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-slate-950 to-brand-dark" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-purple/15 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

              <div className="relative p-6 text-white">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles size={14} className="text-brand-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                    Order Summary
                  </span>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <motion.span
                    key={total.toFixed(2)}
                    initial={{ scale: 1.15, color: "#818cf8" }}
                    animate={{ scale: 1, color: "#ffffff" }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl font-black tracking-tighter"
                  >
                    {branch?.currency} {total.toFixed(2)}
                  </motion.span>
                </div>

                <motion.button
                  whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-white text-brand-dark font-black rounded-2xl text-[15px] tracking-wide disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-brand-primaryLight active:scale-[0.98] transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending to Kitchen...
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} className="text-brand-primary" />
                      Place Order
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
