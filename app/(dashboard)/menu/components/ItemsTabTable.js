import React from "react";
import { UtensilsCrossed, Edit2, Trash2, AlertTriangle } from "lucide-react";
import PosAdminBadge from "./PosAdminBadge";
import PosAdminPagination from "./PosAdminPagination";

export default function ItemsTabTable({
  paginatedItems,
  filteredItems,
  categories,
  toggleAvailable,
  openEditItem,
  deleteItem,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
}) {
  const getFoodBadgeVariant = (foodType, isVeg) => {
    const type = foodType?.toLowerCase() || (isVeg ? "veg" : "non-veg");
    switch (type) {
      case "veg":
        return { variant: "success", label: "Veg" };
      case "non-veg":
      case "non_veg":
        return { variant: "danger", label: "Non-Veg" };
      case "egg":
        return { variant: "warning", label: "Egg" };
      case "vegan":
        return { variant: "info", label: "Vegan" };
      default:
        return { variant: "muted", label: foodType || "General" };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-6">Item Name</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Base Price</th>
              <th className="py-3.5 px-4">Variants / Add-ons</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <UtensilsCrossed
                    size={36}
                    className="mx-auto mb-2 text-slate-300"
                  />
                  <p className="font-bold text-slate-600">
                    No menu items found
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Try resetting filters or adding a new menu item.
                  </p>
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => {
                const category = categories.find(
                  (c) => c.id === item.categoryId || c.id === item.category_id,
                );
                const categoryName = category?.name || "General";
                const subCategoryName =
                  category?.sub_categories?.find(
                    (s) => s.id === item.sub_category,
                  )?.name || "No Sub Category Found";
                const isAvailable = item.status === "Active";
                const foodBadge = getFoodBadgeVariant(
                  item.food_type,
                  item.vegetarian,
                );

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 transition-colors duration-150 cursor-pointer"
                    // onClick={() => openEditItem(item)}
                  >
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                            <UtensilsCrossed size={16} />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-800 text-sm block">
                            {item.name}
                          </span>
                          {subCategoryName === "No Sub Category Found" ? (
                            <span className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                              <AlertTriangle size={12} />
                              {subCategoryName}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                              {subCategoryName}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <PosAdminBadge variant="muted">
                        {categoryName}
                      </PosAdminBadge>
                    </td>
                    <td className="py-3 px-4">
                      <PosAdminBadge variant={foodBadge.variant} dot>
                        {foodBadge.label}
                      </PosAdminBadge>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                      ₹
                      {Number(
                        item.price || item.base_price || 0,
                      ).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.variants?.length > 0 && (
                          <div className="group relative flex items-center cursor-default">
                            <PosAdminBadge variant="info">
                              {item.variants.length} Variants
                            </PosAdminBadge>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out">
                              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[11px] font-medium p-3 rounded-xl shadow-[0_10px_25px_-5px_rgba(59,130,246,0.5)] border border-blue-400/50 w-max max-w-[240px] whitespace-pre-wrap text-left leading-relaxed relative">
                                {item.variants.map(v => `${v.name} (₹${v.price})`).join('\n')}
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 border-b border-r border-blue-400/50 rotate-45"></div>
                              </div>
                            </div>
                          </div>
                        )}
                        {(item.addonGroups?.length > 0 || item.addon_categories?.length > 0) && (
                          <div className="group relative flex items-center cursor-default">
                            <PosAdminBadge variant="purple">
                              {item.addonGroups?.length || item.addon_categories?.length}{" "}
                              Add-ons
                            </PosAdminBadge>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out">
                              <div className="bg-gradient-to-br from-violet-500 to-violet-600 text-white text-[11px] font-medium p-3 rounded-xl shadow-[0_10px_25px_-5px_rgba(139,92,246,0.5)] border border-violet-400/50 w-max max-w-[260px] whitespace-pre-wrap text-left leading-relaxed relative">
                                {(item.addonGroups || item.addon_categories || []).map(cat => `${cat.name}: ${cat.options?.map(o => o.name).join(', ')}`).join('\n')}
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-violet-600 border-b border-r border-violet-400/50 rotate-45"></div>
                              </div>
                            </div>
                          </div>
                        )}
                        {item.spice_level_enabled && (
                          <div className="group relative flex items-center cursor-default">
                            <PosAdminBadge variant="warning">Spice</PosAdminBadge>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out">
                              <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 text-[11px] font-bold p-2.5 rounded-xl shadow-[0_10px_25px_-5px_rgba(245,158,11,0.5)] border border-amber-300/50 w-max whitespace-nowrap relative">
                                Customers can choose spice level
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-500 border-b border-r border-amber-300/50 rotate-45"></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td
                      className="py-3 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={() => toggleAvailable(item.id)}>
                        <PosAdminBadge
                          variant={isAvailable ? "success" : "danger"}
                          dot
                        >
                          {isAvailable ? "ACTIVE" : "INACTIVE"}
                        </PosAdminBadge>
                      </button>
                    </td>
                    <td
                      className="py-3 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditItem(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100">
        <PosAdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          }}
          totalItems={filteredItems.length}
        />
      </div>
    </div>
  );
}
