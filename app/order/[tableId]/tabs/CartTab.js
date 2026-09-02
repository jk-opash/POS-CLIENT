"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { placePublicOrder } from "../../../store/slices/publicMenuSlice";
import { Trash2, ShoppingCart, Minus, Plus, Tag, Loader2 } from "lucide-react";
import { getImageUrl } from "../../../lib/utils";

export default function CartTab({ cart, setCart, branch, cartTotal, tableId, onOrderPlaced }) {
  const dispatch = useDispatch();
  const tax = cartTotal * 0.05;
  const total = cartTotal + tax;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const orderNumber = `ORD-${branch?.branch_code || "BR"}-${Date.now().toString().slice(-6)}`;
      const kotNumber = `KOT-${orderNumber.split("-").pop()}`;

      const orderData = {
        branch_id: branch?.id,
        order_number: orderNumber,
        order_type: "QR Order",
        table_id: tableId,
        status: "Pending",
        payment_status: "Pending",
        subtotal: cartTotal,
        tax_amount: tax,
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

      const kotData = {
        kot_numbers: [kotNumber],
        running_order: cart.map(sanitizeItem),
        cart_items: [],
        subtotal: cartTotal,
        tax_amount: tax,
        discount_amount: 0,
        total_amount: total,
      };

      await dispatch(placePublicOrder({ orderData, kotData })).unwrap();

      if (onOrderPlaced) {
        onOrderPlaced();
      }

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
      <h2 className="text-xl font-black text-slate-900">Your Cart</h2>

      <AnimatePresence mode="popLayout">
        {cart.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="text-center py-14 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center gap-3"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center">
              <ShoppingCart size={24} className="text-slate-300" />
            </div>
            <div>
              <p className="font-bold text-slate-600">Your cart is empty</p>
              <p className="text-xs text-slate-400 mt-0.5">
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
            {/* Cart Items */}
            <AnimatePresence mode="popLayout">
              {cart.map((cartItem) => (
                <motion.div
                  key={cartItem.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -48, scale: 0.94 }}
                  transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                >
                  <div className="flex gap-3 p-3">
                    {/* Item image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                      {cartItem.item.image_url ? (
                        <img
                          src={getImageUrl(cartItem.item.image_url)}
                          alt={cartItem.item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl">
                          🍽
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">
                          {cartItem.item.name}
                        </h4>
                        <span className="font-black text-slate-900 text-sm shrink-0">
                          {branch?.currency} {cartItem.totalPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Customizations */}
                      {(cartItem.variant ||
                        cartItem.spiceLevel ||
                        cartItem.addons?.length > 0) && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {cartItem.variant && (
                            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <Tag size={9} /> {cartItem.variant.name}
                            </span>
                          )}
                          {cartItem.spiceLevel && (
                            <span className="inline-flex items-center bg-orange-50 text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              🌶 {cartItem.spiceLevel}
                            </span>
                          )}
                          {cartItem.addons?.map((addon, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full"
                            >
                              + {addon.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Qty + Remove */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center bg-slate-100 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQty(cartItem.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-200 active:scale-90 transition-all"
                          >
                            <Minus size={13} strokeWidth={3} />
                          </button>
                          <span className="w-7 text-center text-sm font-black text-slate-900">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(cartItem.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-200 active:scale-90 transition-all"
                          >
                            <Plus size={13} strokeWidth={3} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(cartItem.id)}
                          className="w-7 h-7 bg-red-50 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-100 hover:text-red-500 active:scale-90 transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Order Summary */}
            <motion.div
              layout
              className="bg-slate-900 text-white p-5 rounded-3xl"
            >
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-semibold">
                    {branch?.currency} {cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">GST (5%)</span>
                  <span className="font-semibold">
                    {branch?.currency} {tax.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="h-px bg-slate-700/60 mb-4" />

              <div className="flex justify-between items-center mb-5">
                <span className="font-bold text-base">Total</span>
                <motion.span
                  key={total.toFixed(2)}
                  initial={{ scale: 1.1, color: "#818cf8" }}
                  animate={{ scale: 1, color: "#ffffff" }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-black"
                >
                  {branch?.currency} {total.toFixed(2)}
                </motion.span>
              </div>

              <motion.button
                whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-50 transition-colors text-sm tracking-wide disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending to Kitchen...
                  </>
                ) : (
                  "Place Order →"
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
