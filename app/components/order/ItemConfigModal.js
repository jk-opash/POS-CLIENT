import { useState } from "react";
import { X, CheckCircle, Plus, Minus } from "lucide-react";
import { getImageUrl } from "../../lib/utils";

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
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md flex justify-center items-end md:items-center z-50 p-0 md:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white w-full md:w-[500px] max-w-full h-[85vh] md:h-auto md:max-h-[90vh] rounded-t-3xl md:rounded-[2rem] md:rounded-b-[2rem] shadow-2xl flex flex-col relative shrink-0 overflow-hidden ring-1 ring-brand-border animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 ease-out z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 md:w-10 md:h-10 rounded-full bg-surface-2/80 backdrop-blur hover:bg-surface-3 flex items-center justify-center text-brand-muted hover:text-brand-dark z-20 transition-all shadow-sm hover:shadow"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="overflow-y-auto px-4 pt-6 pb-24">
          {item.image_url && (
            <div className="w-full h-48 md:h-56 -mt-6 -mx-4 mb-4 relative overflow-hidden bg-brand-light shrink-0">
              <img
                src={getImageUrl(item.image_url)}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          <h2 className="text-xl font-black text-brand-dark mb-1">
            {item.name}
          </h2>
          {item.description && (
            <p className="text-brand-muted text-sm mb-4">{item.description}</p>
          )}

          {/* Variants */}
          {item.variants && item.variants.length > 0 && (
            <div className="mb-5">
              <h3 className="font-bold text-brand-dark mb-2">Size / Variant</h3>
              <div className="flex flex-col gap-2">
                {item.variants.map((v, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                      selectedVariant?.name === v.name
                        ? "border-brand-primary bg-brand-primaryLight"
                        : "border-brand-light bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedVariant?.name === v.name
                            ? "border-brand-primary"
                            : "border-brand-muted"
                        }`}
                      >
                        {selectedVariant?.name === v.name && (
                          <div className="w-2.5 h-2.5 bg-brand-primary rounded-full" />
                        )}
                      </div>
                      <span className="font-bold text-sm text-brand-dark">
                        {v.name}
                      </span>
                    </div>
                    <span className="font-bold text-brand-dark">
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
              <h3 className="font-bold text-brand-dark mb-2">Add-ons</h3>
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
                            ? "border-brand-primary bg-brand-primaryLight"
                            : "border-brand-light bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-brand-primary bg-brand-primary"
                                : "border-brand-muted"
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
                          <span className="font-bold text-sm text-brand-dark">
                            {addon.name}
                          </span>
                        </div>
                        <span className="font-bold text-brand-dark">
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
                  }),
                )}
              </div>
            </div>
          )}

          {/* Spice Level */}
          {item.spice_level_enabled && (
            <div className="mb-5">
              <h3 className="font-bold text-brand-dark mb-2">Spice Level</h3>
              <div className="flex flex-wrap gap-2">
                {["Mild", "Medium", "Spicy", "Extra Spicy"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSpiceLevel(level)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                      spiceLevel === level
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-brand-light bg-white text-brand-dark"
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
        <div className="bg-white/90 backdrop-blur-md border-t border-brand-border/60 p-3 md:p-5 flex items-center gap-3 md:gap-4 shrink-0 relative z-20">
          {/* Quantity Selector */}
          <div className="flex items-center bg-surface-2 rounded-xl p-1 shrink-0 border border-brand-border shadow-sm">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-brand-dark active:scale-95 transition-all hover:bg-brand-light"
            >
              <Minus size={16} strokeWidth={3} />
            </button>
            <span className="w-8 md:w-12 text-center font-bold text-brand-dark text-sm md:text-base">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-brand-dark active:scale-95 transition-all hover:bg-brand-light"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 bg-brand-primary text-white font-bold py-3 md:py-3.5 rounded-xl flex items-center justify-between px-4 md:px-6 transition-all shadow-lg shadow-brand-primary/30 hover:bg-brand-primaryDark hover:-translate-y-0.5 active:scale-95 hover:shadow-xl hover:shadow-brand-primary/40 text-sm md:text-base"
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
