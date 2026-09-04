"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemWiseSales } from "../../../../store/slices/analyticsSlice";
import { fetchBranches } from "../../../../store/slices/branchSlice";

import StatCard from "../../../../components/ui/StatCard";
import {
  DollarSign,
  Coins,
  Building2,
  ShoppingCart,
  Download,
  Search,
  ArrowUpDown,
  UtensilsCrossed,
  ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import PosAdminPagination from "../../../menu/components/PosAdminPagination";
import DateRangePicker from "../../../../components/ui/DateRangePicker";

function fmt(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

export default function ItemWiseSalesReport() {
  const [collapsed, setCollapsed] = useState(false);
  const [branchFilter, setBranchFilter] = useState("");
  const [search, setSearch] = useState("");

  const [sortField, setSortField] = useState("revenue");
  const [sortOrder, setSortOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [dateValue, setDateValue] = useState({
    startDate: null,
    endDate: null,
  });

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const businessId = user?.businesses?.[0]?.id;

  const { branches } = useSelector((state) => state.branch);
  const { itemSales, itemSalesLoading } = useSelector(
    (state) => state.analytics,
  );

  // Fetch branches once
  useEffect(() => {
    if (businessId) {
      dispatch(fetchBranches(businessId));
    }
  }, [businessId, dispatch]);

  // Auto-select first branch when branches load
  useEffect(() => {
    if (!branchFilter && branches && branches.length > 0) {
      setBranchFilter(branches[0].id);
    }
  }, [branches, branchFilter]);

  // Fetch analytics when branch or date changes
  useEffect(() => {
    if (branchFilter) {
      dispatch(
        fetchItemWiseSales({
          timeRange: dateValue.startDate && dateValue.endDate ? null : "today",
          startDate: dateValue.startDate,
          endDate: dateValue.endDate,
          branchId: branchFilter,
        }),
      );
    }
  }, [dispatch, branchFilter, dateValue]);

  const items = itemSales || [];

  // Filtering
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()),
  );

  // Sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortField === "name" || sortField === "category") {
      return sortOrder === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    } else {
      return sortOrder === "asc"
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
  });

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, branchFilter, items.length]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return (
        <ArrowUpDown
          size={14}
          className="text-brand-muted inline ml-1 opacity-50"
        />
      );
    return (
      <ArrowUpDown
        size={14}
        className={`text-brand-primary inline ml-1 ${sortOrder === "desc" ? "" : "rotate-180"}`}
      />
    );
  };

  const totalRevenue = items.reduce((sum, item) => sum + item.revenue, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col bg-brand-bg font-sans">
      <div className="flex flex-1 min-w-0 flex-col">
        <main className="flex-1 px-6 py-6">
          <div className="space-y-6 pb-12">
            {/* Header & Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link
                  href="/reports/other"
                  className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors mb-2"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Reports
                </Link>
                <h2 className="text-2xl font-bold text-brand-dark">
                  Item-wise Sales
                </h2>
                <p className="mt-1 text-sm text-brand-muted">
                  Detailed breakdown of every item sold.
                </p>
              </div>

              <div className="flex flex-1 justify-end flex-wrap items-center gap-3">
                <div className="flex flex-1 items-center gap-2 px-4 py-2 bg-white border border-brand-border rounded-lg max-w-md shadow-sm transition-colors focus-within:border-brand-border">
                  <Search size={16} className="text-brand-muted/70 shrink-0" />
                  <input
                    className="w-full text-sm bg-transparent outline-none text-brand-dark placeholder:text-brand-muted/70"
                    placeholder="Search by item name or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <DateRangePicker
                  value={dateValue}
                  onChange={(newValue) => setDateValue(newValue)}
                  placeholder="Select Date Range"
                />

                <div className="relative flex items-center gap-2 bg-white border border-brand-border rounded-xl px-3 py-2 shadow-sm">
                  <Building2 size={14} className="text-brand-muted shrink-0" />
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="text-sm font-semibold text-brand-dark outline-none bg-transparent cursor-pointer pr-2 max-w-[150px] truncate"
                  >
                    {branches?.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-dark text-white hover:bg-brand-dark/90 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2">
                  <Download size={16} /> Export
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  label="Total Revenue"
                  value={`₹${fmt(totalRevenue)}`}
                  subtext="From selected period"
                  icon={<DollarSign size={16} />}
                />
                <StatCard
                  label="Items Sold"
                  value={fmt(totalQuantity)}
                  subtext="Total quantities across all items"
                  icon={<ShoppingCart size={16} />}
                />
                <StatCard
                  label="Unique Items"
                  value={items.length}
                  subtext="Individual products sold"
                  icon={<Coins size={16} />}
                />
              </div>
            </section>

            {/* Data Table Area */}
            <div className="rounded-2xl border border-brand-border/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden flex flex-col">
              {/* Search Bar */}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-bg/80 text-[11px] font-black text-brand-muted/70 uppercase tracking-wider">
                      <th
                        className="py-3.5 px-6 cursor-pointer hover:text-brand-dark transition-colors"
                        onClick={() => handleSort("name")}
                      >
                        Item Name <SortIcon field="name" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-brand-dark transition-colors"
                        onClick={() => handleSort("category")}
                      >
                        Category <SortIcon field="category" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-brand-dark transition-colors text-right"
                        onClick={() => handleSort("price")}
                      >
                        Base Price <SortIcon field="price" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-brand-dark transition-colors text-center"
                        onClick={() => handleSort("quantity")}
                      >
                        Qty Sold <SortIcon field="quantity" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-brand-dark transition-colors text-right"
                        onClick={() => handleSort("revenue")}
                      >
                        Net Revenue <SortIcon field="revenue" />
                      </th>
                      <th className="py-3.5 px-6 text-right">% of Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/50 text-xs">
                    {itemSalesLoading ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-12 text-center text-brand-muted/70"
                        >
                          <p className="font-bold text-brand-dark">
                            Loading data...
                          </p>
                        </td>
                      </tr>
                    ) : sortedItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-12 text-center text-brand-muted/70"
                        >
                          <UtensilsCrossed
                            size={36}
                            className="mx-auto mb-2 text-brand-muted/70"
                          />
                          <p className="font-bold text-brand-dark">
                            No items found
                          </p>
                          <p className="text-xs text-brand-muted/70 mt-0.5">
                            Try adjusting your search query or selected branch.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedItems.map((item, idx) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                          key={item.name}
                          className="hover:bg-brand-bg/60 transition-colors duration-150"
                        >
                          <td className="py-3 px-6 font-medium text-brand-dark">
                            <span className="font-bold text-brand-dark text-sm block">
                              {item.name}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-brand-light text-brand-dark border border-brand-border/60">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-brand-dark text-sm">
                            ₹{fmt(item.price)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="font-semibold text-brand-dark text-sm">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-bold text-brand-primary text-sm">
                              ₹{fmt(item.revenue)}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[11px] font-bold text-brand-muted w-10 text-right">
                                {item.percentage}%
                              </span>
                              <div className="w-16 h-1.5 bg-brand-light rounded-full overflow-hidden border border-brand-border">
                                <div
                                  className="h-full bg-brand-primary rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-brand-border">
                <PosAdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={(size) => {
                    setItemsPerPage(size);
                    setCurrentPage(1);
                  }}
                  totalItems={sortedItems.length}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
