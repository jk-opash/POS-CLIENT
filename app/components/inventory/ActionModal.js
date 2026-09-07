import { useState } from "react";
import {
  Search,
  AlertCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Save,
} from "lucide-react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

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
    { value: "", label: "Select..." },
    { value: "Stock Correction (Found)", label: "Stock Correction (Found)" },
    { value: "Supplier Over-delivery", label: "Supplier Over-delivery" },
    { value: "Customer Return", label: "Customer Return" },
    { value: "Other Addition", label: "Other Addition" },
  ];
  const REMOVE_REASONS = [
    { value: "", label: "Select..." },
    { value: "Stock Correction (Lost)", label: "Stock Correction (Lost)" },
    { value: "Damage/Spoilage", label: "Damage/Spoilage" },
    { value: "Promotional/Giveaway", label: "Promotional/Giveaway" },
    { value: "Return to Supplier", label: "Return to Supplier" },
    { value: "Theft/Loss", label: "Theft/Loss" },
  ];
  const QUARANTINE_REASONS = [
    { value: "", label: "Select..." },
    { value: "Damaged in Transit", label: "Damaged in Transit" },
    { value: "Quality Check Pending", label: "Quality Check Pending" },
    { value: "Expired/Spoiled", label: "Expired/Spoiled" },
    { value: "Recall", label: "Recall" },
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
    <Modal
      isOpen={visible}
      onClose={onClose}
      title={titles[type] || "Inventory Action"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 bg-brand-dangerLight border border-brand-danger/20 text-brand-dark text-sm px-4 py-3 rounded-xl">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Product selector */}
        <div className="relative">
          <Input
            label="Product"
            icon={<Search size={16} />}
            placeholder="Search by name or SKU..."
            value={productSearch}
            onChange={(e) => {
              setProductSearch(e.target.value);
              setSelectedProduct(null);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            iconRight={
              selectedProduct && (
                <span className="text-[10px] font-bold bg-brand-successLight text-brand-success px-2 py-0.5 rounded-full absolute right-3 top-1/2 -translate-y-1/2">
                  Selected
                </span>
              )
            }
          />
          {showDropdown && productSearch && !selectedProduct && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-brand-border rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
              {filteredItems.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedProduct(item);
                    setProductSearch(item.name);
                    setShowDropdown(false);
                  }}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-2 cursor-pointer border-b border-brand-border last:border-0"
                >
                  <div>
                    <div className="font-bold text-sm text-brand-dark">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-brand-muted/70">
                      {item.sku}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-dark bg-brand-bg px-2 py-1 rounded-md">
                    {item.currentStock} {item.unit}
                  </span>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div className="px-4 py-3 text-sm text-brand-muted/70 text-center">
                  No items found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Adjustment type toggle (only for adjustments) */}
        {type === "adjustments" && (
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">
              Action
            </label>
            <div className="flex rounded-xl border border-brand-border overflow-hidden bg-surface-2 p-1 gap-1">
              <button
                type="button"
                onClick={() => {
                  setAdjType("add");
                  setReason("");
                }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${adjType === "add" ? "bg-white text-brand-success shadow-sm" : "text-brand-muted hover:text-brand-dark"}`}
              >
                <ArrowUpCircle size={16} className="inline mr-1.5" />
                Add Stock
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdjType("remove");
                  setReason("");
                }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${adjType === "remove" ? "bg-white text-brand-danger shadow-sm" : "text-brand-muted hover:text-brand-dark"}`}
              >
                <ArrowDownCircle size={16} className="inline mr-1.5" />
                Remove Stock
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Quantity"
            type="number"
            step="0.1"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
          />
          <Select
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            options={
              type === "quarantine"
                ? QUARANTINE_REASONS
                : adjType === "add"
                  ? ADD_REASONS
                  : REMOVE_REASONS
            }
          />
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
          <label className="block text-xs font-semibold text-brand-muted mb-1.5">
            Additional Notes
          </label>
          <textarea
            className="w-full rounded-xl border border-brand-border bg-surface-2 px-4 py-3 text-sm text-brand-dark font-medium placeholder:text-brand-placeholder transition-all duration-300 ease-in-out shadow-sm hover:bg-white hover:border-brand-borderHover focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:bg-white resize-none"
            rows={3}
            placeholder="Optional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t border-brand-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full md:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={<Save size={16} />}
            className="w-full md:w-auto"
          >
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
}
