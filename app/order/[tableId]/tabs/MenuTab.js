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
      <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <UtensilsCrossed size={24} className="text-slate-300" />
        </div>
        <p className="text-base font-bold text-slate-800">No items available</p>
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
            <h2 className="text-xl font-black text-slate-900 px-1 border-b border-slate-200 pb-2">
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
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-2">
                      {subCat} ({items.length})
                    </h3>
                  )}

                  <div className="grid grid-cols-1 gap-3">
                    {items.map((item) => {
                      const inCartCount = cart
                        .filter((c) => c.item.id === item.id)
                        .reduce((sum, c) => sum + c.quantity, 0);

                      return (
                        <div
                          key={item.id}
                          className={`group p-3 rounded-3xl shadow-sm border flex gap-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                            inCartCount > 0
                              ? "bg-indigo-50/50 border-indigo-200"
                              : "bg-white border-slate-100"
                          }`}
                        >
                          <div className="relative w-15 h-15 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50 shadow-inner">
                            {item.image_url ? (
                              <img
                                src={getImageUrl(item.image_url)}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <UtensilsCrossed size={32} strokeWidth={1.5} />
                              </div>
                            )}
                            {item.food_type &&
                              getFoodTypeColor(item.food_type) && (
                                <div className="absolute top-2 left-2 bg-white p-1 rounded shadow-sm">
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                      backgroundColor: getFoodTypeColor(
                                        item.food_type,
                                      ),
                                    }}
                                  ></div>
                                </div>
                              )}
                            {inCartCount > 0 && (
                              <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                                x{inCartCount}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-slate-900 text-base leading-tight">
                                {item.name}
                              </h3>
                            </div>

                            <div className="flex items-center justify-between ">
                              <span className="font-medium text-slate-500 text-sm tracking-tight">
                                {branch?.currency}{" "}
                                <span className="text-lg font-black text-green-700">
                                  {parseFloat(item.base_price).toFixed(2)}
                                </span>
                              </span>
                              <div className="flex items-center gap-2">
                                {inCartCount > 0 && (
                                  <button
                                    onClick={() => handleQuickRemove(item)}
                                    className="w-9 h-9 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all duration-300 active:scale-90 shadow-sm"
                                  >
                                    <Minus size={18} strokeWidth={3} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleQuickAdd(item)}
                                  className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300 active:scale-90 shadow-sm"
                                >
                                  <Plus size={18} strokeWidth={3} />
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
