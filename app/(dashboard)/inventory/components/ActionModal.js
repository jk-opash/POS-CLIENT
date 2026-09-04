import React, { useState } from "react";
import { X, Search, AlertCircle, ArrowUpCircle, ArrowDownCircle, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function ActionModal({
  visible,
  onClose,
  type,
  initialItem,
  inventory,
  onSubmit,
}) {
  const [productSearch, setProductSearch] = useState(initialItem?.name || "");
  const [selectedProduct, setSelectedProduct] = useState(initialItem || null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [adjType, setAdjType] = useState("remove");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const ADD_REASONS = [
    "Stock Correction (Found)",
    "Supplier Over-delivery",
    "Customer Return",
    "Other Addition",
  ];
  const REMOVE_REASONS = [
    "Stock Correction (Lost)",
    "Damage/Spoilage",
    "Promotional/Giveaway",
    "Return to Supplier",
    "Theft/Loss",
  ];
  const QUARANTINE_REASONS = [
    "Damaged in Transit",
    "Quality Check Pending",
    "Expired/Spoiled",
    "Recall",
  ];

  const titles = {
    adjustments: "Inventory Adjustment",
    quarantine: "Log Quarantine Issue",
    transfers: "New Stock Transfer",
    replenish: "Order Replenishment",
    count: "Start Stock Count",
  };

  const filteredItems = inventory.filter(
    (i) =>
      i.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (i.sku || "").toLowerCase().includes(productSearch.toLowerCase()),
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!selectedProduct) return setError("Please select a product.");
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) return setError("Valid quantity is required.");
    if (!reason) return setError("Reason is required.");
    const delta =
      (type === "adjustments" && adjType === "remove") || type === "quarantine"
        ? -qty
        : qty;
    onSubmit(selectedProduct, delta, reason, notes);
    onClose();
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
          <h2 className="text-xl font-black text-brand-dark">
            {titles[type] || "Inventory Action"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-light rounded-xl text-brand-muted/70 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-brand-dangerLight border border-brand-danger/20 text-brand-dark text-sm px-4 py-3 rounded-xl">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            {/* Product selector */}
            <div className="relative">
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-1.5">
                Product
              </label>
              <div className="flex items-center gap-2 border border-brand-border rounded-xl px-3 py-2.5">
                <Search size={14} className="text-brand-muted/70 shrink-0" />
                <input
                  className="flex-1 text-sm outline-none text-brand-dark"
                  placeholder="Search by name or SKU..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setSelectedProduct(null);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
                {selectedProduct && (
                  <span className="text-[10px] font-bold bg-brand-successLight text-brand-success px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              {showDropdown && productSearch && !selectedProduct && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-brand-border rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                  {filteredItems.slice(0, 8).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedProduct(item);
                        setProductSearch(item.name);
                        setShowDropdown(false);
                      }}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-brand-bg cursor-pointer border-b border-brand-border last:border-0"
                    >
                      <div>
                        <div className="font-bold text-sm text-brand-dark">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-brand-muted/70">
                          {item.sku}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-brand-dark">
                        {item.currentStock} {item.unit}
                      </span>
                    </div>
                  ))}
                  {filteredItems.length === 0 && (
                    <div className="px-4 py-3 text-sm text-brand-muted/70">
                      No items found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Adjustment type toggle (only for adjustments) */}
            {type === "adjustments" && (
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-1.5">
                  Action
                </label>
                <div className="flex rounded-xl border border-brand-border overflow-hidden bg-brand-bg p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAdjType("add");
                      setReason("");
                    }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${adjType === "add" ? "bg-white text-brand-success shadow-sm" : "text-brand-muted/70 hover:text-brand-dark"}`}
                  >
                    <ArrowUpCircle size={14} className="inline mr-1.5" />
                    Add Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdjType("remove");
                      setReason("");
                    }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${adjType === "remove" ? "bg-white text-brand-danger shadow-sm" : "text-brand-muted/70 hover:text-brand-dark"}`}
                  >
                    <ArrowDownCircle size={14} className="inline mr-1.5" />
                    Remove Stock
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-1.5">
                  Quantity
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-muted/70"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-1.5">
                  Reason
                </label>
                <select
                  className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:border-brand-muted/70"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select...</option>
                  {(type === "quarantine"
                    ? QUARANTINE_REASONS
                    : adjType === "add"
                      ? ADD_REASONS
                      : REMOVE_REASONS
                  ).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedProduct && quantity && (
              <div className="bg-brand-bg rounded-xl px-4 py-3 text-sm border border-brand-border">
                <span className="text-brand-muted">New stock will be: </span>
                <span className="font-black text-brand-dark">
                  {Math.max(
                    0,
                    (selectedProduct.currentStock || 0) +
                      ((type === "adjustments" && adjType === "remove") ||
                      type === "quarantine"
                        ? -1
                        : 1) *
                        Math.abs(parseFloat(quantity) || 0),
                  ).toFixed(1)}{" "}
                  {selectedProduct.unit}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-1.5">
                Additional Notes
              </label>
              <textarea
                className="w-full border border-brand-border rounded-xl px-3 py-2.5 text-sm outline-none resize-none focus:border-brand-muted/70"
                rows={3}
                placeholder="Optional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-brand-border bg-brand-bg">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-brand-border bg-white text-brand-dark font-bold rounded-xl text-sm hover:bg-brand-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-success text-white font-bold rounded-xl text-sm hover:bg-brand-success/90 transition-colors shadow-md shadow-brand-success/20"
            >
              <Save size={15} /> Submit
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
