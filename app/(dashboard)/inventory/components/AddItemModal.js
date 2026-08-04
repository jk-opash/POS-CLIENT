import React, { useState } from "react";
import { X, AlertCircle, Upload, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { createInventoryItem } from "../../../store/slices/inventorySlice";
import { uid } from "./helpers";

export default function AddItemModal({ branchId, onClose }) {
  const [form, setForm] = useState({
    name: "",
    sku: `SKU-${Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0")}`,
    category: "",
    unit: "pcs",
    currentStock: "",
    reorderLevel: "",
    price: "",
    image: null,
  });
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const CATEGORIES = [
    "Raw Materials",
    "Packaging",
    "Ingredients",
    "Beverages",
    "Dairy",
    "Vegetables",
    "Meat",
    "Grains",
    "Oil",
    "Spices",
    "Dry Goods",
    "Other",
  ];
  const UNITS = ["kg", "g", "L", "ml", "pcs", "box", "dozen"];

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branchId) return setError("Please select a branch first.");
    if (!form.name.trim()) return setError("Item name is required.");
    const finalSku =
      form.sku.trim() ||
      `SKU-${Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")}`;
    if (!form.category) return setError("Category is required.");
    const stock = parseFloat(form.currentStock);
    const reorder = parseFloat(form.reorderLevel);
    const price = parseFloat(form.price);

    if (isNaN(stock) || stock < 0)
      return setError("Valid initial stock required.");
    if (isNaN(reorder) || reorder < 0)
      return setError("Valid reorder level required.");

    try {
      await dispatch(
        createInventoryItem({
          branch_id: branchId,
          name: form.name.trim(),
          sku: finalSku,
          category: form.category,
          unit: form.unit,
          price: isNaN(price) ? 0 : price,
          reorder_level: reorder,
          in_stock: stock,
        }),
      ).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to add item", err);
      setError(
        typeof err === "string" ? err : err.message || "Failed to add item",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800">
            Add Inventory Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Item Name *
              </label>
              <input
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Butter Chicken Masala"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  SKU
                </label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  value={form.sku}
                  onChange={(e) => set("sku", e.target.value)}
                  placeholder="e.g. SPI-001"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 bg-white"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  <option value="">Select...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Unit
                </label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 bg-white"
                  value={form.unit}
                  onChange={(e) => set("unit", e.target.value)}
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Initial Stock *
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  value={form.currentStock}
                  onChange={(e) => set("currentStock", e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Reorder Level *
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  value={form.reorderLevel}
                  onChange={(e) => set("reorderLevel", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Unit Price (₹)
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Item Image
              </label>
              <div
                onClick={() =>
                  set(
                    "image",
                    form.image
                      ? null
                      : "https://picsum.photos/seed/" + uid() + "/200",
                  )
                }
                className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                {form.image ? (
                  <img
                    src={form.image}
                    alt="preview"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <Upload size={24} className="text-slate-300" />
                    <span className="text-xs text-slate-400">
                      Click to mock-upload image
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 bg-white text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20"
            >
              <Save size={15} /> Save Item
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
