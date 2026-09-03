import { useState } from "react";
import { X, CheckCircle, Plus, Minus } from "lucide-react";
import { getImageUrl } from "../../../lib/utils";

export default function ItemConfigModal({ item, currency, onClose, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    item.variants && item.variants.length > 0 ? item.variants[0] : null,
  );
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [spiceLevel, setSpiceLevel] = useState(
    item.spice_level_enabled ? "Medium" : null,
  );

  const basePrice = selectedVariant
    ? parseFloat(selectedVariant.price)
    : parseFloat(item.base_price);

  const addonsPrice = selectedAddons.reduce(
    (sum, a) => sum + parseFloat(a.price),
    0,
  );
  const unitPrice = basePrice + addonsPrice;
  const totalPrice = unitPrice * quantity;

  const handleToggleAddon = (addon) => {
    const exists = selectedAddons.find((a) => a.name === addon.name);
    if (exists) {
      setSelectedAddons(selectedAddons.filter((a) => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAdd = () => {
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      item,
      quantity,
      variant: selectedVariant,
      addons: selectedAddons,
      spiceLevel,
      unitPrice,
      totalPrice,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white w-full max-h-[85vh] rounded-t-[2rem] shadow-2xl relative z-10 flex flex-col animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 z-10 hover:bg-slate-200"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto px-4 pt-6 pb-24">
          {item.image_url && (
            <div className="w-full h-40 rounded-2xl overflow-hidden bg-slate-100 mb-4">
              <img
                src={getImageUrl(item.image_url)}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h2 className="text-xl font-black text-slate-900 mb-1">
            {item.name}
          </h2>
          {item.description && (
            <p className="text-slate-500 text-sm mb-4">{item.description}</p>
          )}

          {/* Variants */}
          {item.variants && item.variants.length > 0 && (
            <div className="mb-5">
              <h3 className="font-bold text-slate-900 mb-2">Size / Variant</h3>
              <div className="flex flex-col gap-2">
                {item.variants.map((v, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                      selectedVariant?.name === v.name
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedVariant?.name === v.name
                            ? "border-indigo-600"
                            : "border-slate-300"
                        }`}
                      >
                        {selectedVariant?.name === v.name && (
                          <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                        )}
                      </div>
                      <span className="font-bold text-sm text-slate-800">
                        {v.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {currency} {parseFloat(v.price).toFixed(2)}
                    </span>
                    <input
                      type="radio"
                      className="hidden"
                      checked={selectedVariant?.name === v.name}
                      onChange={() => setSelectedVariant(v)}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Addons */}
          {item.addon_categories && item.addon_categories.length > 0 && (
            <div className="mb-5">
              <h3 className="font-bold text-slate-900 mb-2">Add-ons</h3>
              <div className="flex flex-col gap-2">
                {item.addon_categories.flatMap((cat) =>
                  cat.options?.map((addon, idx) => {
                    const isSelected = selectedAddons.find(
                      (a) => a.name === addon.name,
                    );
                    return (
                      <label
                        key={`${cat.name}-${idx}`}
                        className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-slate-100 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-indigo-600 bg-indigo-600"
                                : "border-slate-300"
                            }`}
                          >
                            {isSelected && (
                              <CheckCircle
                                size={14}
                                className="text-white"
                                strokeWidth={3}
                              />
                            )}
                          </div>
                          <span className="font-bold text-sm text-slate-800">
                            {addon.name}
                          </span>
                        </div>
                        <span className="font-bold text-slate-900">
                          + {currency} {parseFloat(addon.price).toFixed(2)}
                        </span>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={!!isSelected}
                          onChange={() => handleToggleAddon(addon)}
                        />
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Spice Level */}
          {item.spice_level_enabled && (
            <div className="mb-5">
              <h3 className="font-bold text-slate-900 mb-2">Spice Level</h3>
              <div className="flex flex-wrap gap-2">
                {["Mild", "Medium", "Spicy", "Extra Spicy"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSpiceLevel(level)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                      spiceLevel === level
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-slate-100 bg-white text-slate-600"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 p-4 flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 active:scale-95"
            >
              <Minus size={18} strokeWidth={3} />
            </button>
            <span className="w-10 text-center font-bold text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 active:scale-95"
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 bg-slate-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-between px-5 hover:bg-slate-800 transition-colors active:scale-95 shadow-lg shadow-slate-900/20"
          >
            <span>Add Item</span>
            <span>
              {currency} {totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
