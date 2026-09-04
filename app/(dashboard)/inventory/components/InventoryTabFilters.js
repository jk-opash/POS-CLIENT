import React from "react";
import { Search, Filter } from "lucide-react";

export default function InventoryTabFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  catFilter,
  setCatFilter,
  branchFilter,
  setBranchFilter,
  categories,
  statuses,
  branches,
}) {
  return (
    <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="flex items-center gap-2 px-3.5 py-2 bg-brand-bg border border-brand-border rounded-xl flex-1">
        <Search size={16} className="text-brand-muted/70 shrink-0" />
        <input
          className="w-full text-xs bg-transparent outline-none text-brand-dark placeholder:text-brand-muted/70 font-medium"
          placeholder="Search items by name or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-brand-bg border border-brand-border rounded-xl px-3 py-2 text-xs font-bold text-brand-dark flex items-center gap-2">
          <Filter size={14} className="text-brand-muted/70" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent outline-none cursor-pointer text-xs"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
