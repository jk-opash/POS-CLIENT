import { Search } from "lucide-react";

export default function SupplierTabFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="flex-1 flex items-center justify-end py-2 px-2 gap-3 min-w-[200px] overflow-x-auto custom-scrollbar">
      {/* Search Input */}
      <div className="relative flex-shrink-0 w-48 sm:w-64">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
        />
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-white border border-brand-border rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-shadow"
        />
      </div>

      {/* Status Filter */}
      <div className="relative flex-shrink-0">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="appearance-none w-36 pl-3 pr-8 py-1.5 bg-white border border-brand-border rounded-lg text-sm text-brand-dark focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
          <option value="Archived">Archived</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-muted">
          <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
