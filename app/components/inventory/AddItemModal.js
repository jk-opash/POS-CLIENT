import { useState } from "react";
import { AlertCircle, Upload, Save } from "lucide-react";
import { useDispatch } from "react-redux";
import { createInventoryItem } from "../../store/slices/inventorySlice";
import { uid } from "../../lib/helpers";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

export default function AddItemModal({ branchId, onClose }) {
  const [errors, setErrors] = useState({});
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
    { value: "", label: "Select..." },
    ...[
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
    ].map(c => ({ value: c, label: c }))
  ];

  const UNITS = ["kg", "g", "L", "ml", "pcs", "box", "dozen"].map(u => ({ value: u, label: u }));

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
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Add Inventory Item"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 bg-brand-dangerLight border border-brand-danger/20 text-brand-danger text-sm px-4 py-3 rounded-xl">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        
        <Input
          label="Item Name *"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Butter Chicken Masala"
          error={errors.name}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="SKU"
            value={form.sku}
            onChange={(e) => set("sku", e.target.value)}
            placeholder="e.g. SPI-001"
            error={errors.sku}
          />
          <Select
            label="Category *"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            options={CATEGORIES}
            error={errors.category}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Unit"
            value={form.unit}
            onChange={(e) => set("unit", e.target.value)}
            options={UNITS}
            error={errors.unit}
          />
          <Input
            label="Initial Stock *"
            type="number"
            value={form.currentStock}
            onChange={(e) => set("currentStock", e.target.value)}
            placeholder="0"
            error={errors.currentStock}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Reorder Level *"
            type="number"
            value={form.reorderLevel}
            onChange={(e) => set("reorderLevel", e.target.value)}
            placeholder="0"
            error={errors.reorderLevel}
          />
          <Input
            label="Unit Price (₹)"
            type="number"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="0.00"
            error={errors.price}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-brand-muted mb-1.5 block">
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
            className="border border-dashed border-brand-border rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:bg-white hover:border-brand-primary transition-colors shadow-sm"
          >
            {form.image ? (
              <img
                src={form.image}
                alt="preview"
                className="w-full h-28 md:h-36 object-cover rounded-lg"
              />
            ) : (
              <>
                <Upload size={24} className="text-brand-muted/70" />
                <span className="text-sm font-medium text-brand-muted">
                  Click to mock-upload image
                </span>
              </>
            )}
          </div>
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
            Save Item
          </Button>
        </div>
      </form>
    </Modal>
  );
}
