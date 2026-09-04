import { UtensilsCrossed, Plus, Minus } from "lucide-react";
import { getImageUrl } from "../../../lib/utils";

const getFoodTypeColor = (type) => {
  if (!type) return null;

  const t = type;
  if (t === "Dessert") return "#2563EB"; // ThemeColors.blue
  if (t === "Beverage") return "#8B5CF6"; // ThemeColors.violet
  if (t === "Veg") return "#22C55E"; // ThemeColors.veg
  if (t === "Non-Veg") return "#EF4444"; // ThemeColors.nonVeg
  if (t === "Egg") return "#ffdd00"; // ThemeColors.egg
  if (t === "Vegan") return "#15803D"; // ThemeColors.vegan
  if (t === "Jain") return "#F97316"; // ThemeColors.jain
  return "#9CA3AF"; // muted
};

export default function MenuTab({
  displayItems,
  categories,
  cart,
  branch,
  handleQuickAdd,
  handleQuickRemove,
}) {
  if (!displayItems || displayItems.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-brand-light flex flex-col items-center">
        <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-4">
          <UtensilsCrossed size={24} className="text-brand-muted" />
        </div>
        <p className="text-base font-bold text-brand-dark">No items available</p>
      </div>
    );
  }

  // Group items by category and subcategory
  const grouped = {};
  displayItems.forEach((item) => {
    const catId = item.category_id || "unassigned";
    const category = categories?.find((c) => c.id === catId);

    let subCatName = "Other";
    if (item.sub_category) {
      subCatName =
        category?.sub_categories?.find((s) => s.id === item.sub_category)
          ?.name || item.sub_category;
    }

    if (!grouped[catId]) {
      grouped[catId] = {
        name:
          category?.name ||
          (catId === "unassigned" ? "Unassigned" : "Other Category"),
        subcategories: {},
      };
    }

    if (!grouped[catId].subcategories[subCatName]) {
      grouped[catId].subcategories[subCatName] = [];
    }

    grouped[catId].subcategories[subCatName].push(item);
  });

  const hasMultipleCategories = Object.keys(grouped).length > 1;

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([catId, categoryData]) => (
        <div key={catId} className="space-y-4">
          {hasMultipleCategories && (
            <h2 className="text-xl font-black text-brand-dark px-1 border-b border-brand-light pb-2">
              {categoryData.name}
            </h2>
          )}

          <div className="space-y-4">
            {Object.entries(categoryData.subcategories).map(
              ([subCat, items]) => (
                <div key={subCat} className="space-y-2.5">
                  {/* Only show subcategory title if it's explicitly set, or if there's more than one subcat */}
                  {(subCat !== "Other" ||
                    Object.keys(categoryData.subcategories).length > 1) && (
                    <h3 className="text-sm font-bold text-brand-muted uppercase tracking-wider px-2">
                      {subCat} ({items.length})
                    </h3>
                  )}

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {items.map((item) => {
                      const inCartCount = cart
                        .filter((c) => c.item.id === item.id)
                        .reduce((sum, c) => sum + c.quantity, 0);

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleQuickAdd(item)}
                          className={`group relative bg-white rounded-2xl shadow-sm overflow-hidden border flex flex-col transition-all duration-300 hover:shadow-md cursor-pointer ${
                            inCartCount > 0
                              ? "border-brand-primary"
                              : "border-brand-light"
                          }`}
                        >
                          <div className="relative w-full aspect-[16/9] bg-brand-light">
                            {item.image_url ? (
                              <img
                                src={getImageUrl(item.image_url)}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-brand-muted">
                                <UtensilsCrossed size={32} strokeWidth={1.5} />
                              </div>
                            )}

                            {/* Best Seller Badge Example */}
                            {item.is_best_seller && (
                              <div className="absolute bottom-0 right-0 bg-brand-danger text-white text-[10px] font-bold px-2 py-0.5 rounded-tl-lg">
                                Best Seller
                              </div>
                            )}

                            {/* In Cart Badge */}
                            {inCartCount > 0 && (
                              <div className="absolute top-2 right-2 bg-brand-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md z-10">
                                {inCartCount}
                              </div>
                            )}
                          </div>

                          <div className="p-3 flex flex-col justify-between flex-1">
                            <div className="w-full overflow-hidden">
                              <h3 className=" font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-dark via-slate-700 to-brand-muted text-[13px] leading-tight mb-1 drop-shadow-sm inline-block">
                                {item.name}
                              </h3>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              <span className="font-bold text-brand-dark text-sm">
                                {branch?.currency}{" "}
                                <span className="font-black text-brand-success text-lg">
                                  {parseFloat(item.base_price).toFixed(2)}
                                </span>
                              </span>
                              {/* Quantity Controls - Show if in cart */}
                              <div
                                className="flex items-center gap-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {inCartCount > 0 && (
                                  <button
                                    onClick={() => handleQuickRemove(item)}
                                    className="w-6 h-6 bg-brand-light text-brand-dark rounded-full flex items-center justify-center hover:bg-brand-light transition-colors"
                                  >
                                    <Minus size={12} strokeWidth={2.5} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleQuickAdd(item)}
                                  className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors"
                                >
                                  <Plus size={12} strokeWidth={2.5} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
