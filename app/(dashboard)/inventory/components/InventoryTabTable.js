import React from "react";
import { Settings2, Trash2, Package } from "lucide-react";
import PosAdminBadge from "../../menu/components/PosAdminBadge";
import PosAdminPagination from "../../menu/components/PosAdminPagination";
import { useRouter } from "next/navigation";

function getBadgeStyle(status) {
  switch (status) {
    case "Normal":
      return "success";
    case "Low":
      return "warning";
    case "Critical":
      return "danger";
    case "Out of Stock":
      return "danger";
    default:
      return "muted";
  }
}

export default function InventoryTabTable({
  paginatedItems,
  filteredItems,
  onAdjust,
  onDelete,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
}) {
  const router = useRouter();
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-6">Item</th>
              <th className="py-3.5 px-4">SKU</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 text-right">In Stock</th>
              <th className="py-3.5 px-4 text-right">Reorder</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Value</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <Package size={36} className="mx-auto mb-2 text-slate-300" />
                  <p className="font-bold text-slate-600">No items found</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Try resetting filters or adding a new item.
                  </p>
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => {
                const isZero = item.currentStock <= 0;
                const isCrit =
                  !isZero && item.currentStock <= item.reorderLevel * 0.5;
                const isLow =
                  !isZero && !isCrit && item.currentStock <= item.reorderLevel;
                const stockColor = isZero
                  ? "text-red-600"
                  : isCrit
                    ? "text-orange-600"
                    : isLow
                      ? "text-amber-600"
                      : "text-emerald-600";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 transition-colors duration-150 cursor-pointer"
                    onClick={() => router.push("/inventory/" + item.id)}
                  >
                    <td className="py-3 px-6 font-bold text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-xs">
                      {item.sku}
                    </td>
                    <td className="py-3 px-4">
                      <PosAdminBadge variant="muted">{item.category}</PosAdminBadge>
                    </td>
                    <td className={`py-3 px-4 text-right font-black ${stockColor}`}>
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">
                      {item.reorderLevel} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <PosAdminBadge variant={getBadgeStyle(item.status)} dot={item.status === 'Normal' || item.status === 'Out of Stock'}>
                        {item.status.toUpperCase()}
                      </PosAdminBadge>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-700">
                      ₹
                      {(item.currentStock * item.cost).toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td
                      className="py-3 px-6 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onAdjust(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Adjust Stock"
                        >
                          <Settings2 size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
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
