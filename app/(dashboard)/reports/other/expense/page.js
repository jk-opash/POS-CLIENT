"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenseReport } from "../../../../store/slices/analyticsSlice";
import { fetchBranches } from "../../../../store/slices/branchSlice";
import {
  Wallet,
  TrendingDown,
  Receipt,
  Download,
  Building2,
  Search,
  ArrowUpDown,
  ChevronLeft,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";
import PosAdminPagination from "../../../menu/components/PosAdminPagination";
import StatCard from "../../../../components/ui/StatCard";
import DateRangePicker from "../../../../components/ui/DateRangePicker";
import * as XLSX from "xlsx";

function fmt(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

export default function ExpenseReport() {
  const dispatch = useDispatch();

  // State mapping
  const { user } = useSelector((state) => state.auth);
  const businessId = user?.businessId;
  const { branches } = useSelector((state) => state.branch);

  const stats = useSelector((state) => state.analytics.expenseReportData);
  const loading = useSelector((state) => state.analytics.expenseReportLoading);

  // Filter States
  const [dateValue, setDateValue] = useState({
    startDate: null,
    endDate: null,
  });
  const [branchFilter, setBranchFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Sorting
  const [sortConfig, setSortConfig] = useState({
    key: "expense_date",
    direction: "desc",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Initialize dates to today on mount
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    setDateValue({ startDate: today, endDate: end });
  }, []);

  // Fetch branches once
  useEffect(() => {
    if (businessId && branches.length === 0) {
      dispatch(fetchBranches(businessId));
    }
  }, [businessId, dispatch, branches.length]);

  // Auto-select first branch when branches load
  useEffect(() => {
    if (!branchFilter && branches && branches.length > 0) {
      setBranchFilter(branches[0].id);
    }
  }, [branches, branchFilter]);

  // Fetch report data when filters change
  useEffect(() => {
    if (dateValue.startDate && dateValue.endDate && branchFilter) {
      const fromOffset = dateValue.startDate.getTimezoneOffset() * 60000;
      const toOffset = dateValue.endDate.getTimezoneOffset() * 60000;
      const localFrom = new Date(dateValue.startDate.getTime() - fromOffset);
      const localTo = new Date(dateValue.endDate.getTime() - toOffset);

      dispatch(
        fetchExpenseReport({
          branchId: branchFilter,
          startDate: localFrom.toISOString(),
          endDate: localTo.toISOString(),
        }),
      );
      setCurrentPage(1);
    }
  }, [dateValue, branchFilter, dispatch]);

  const rawData = stats?.expenseData || [];

  // Derived unique categories for filtering
  const categories = useMemo(() => {
    const cats = new Set(rawData.map((i) => i.category));
    return ["All", ...Array.from(cats)].filter(Boolean);
  }, [rawData]);

  // Filtering and Sorting
  const processedData = useMemo(() => {
    let result = [...rawData];

    // Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.description?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q),
      );
    }

    // Category Filter
    if (categoryFilter !== "All") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [rawData, searchQuery, categoryFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedRecords = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, branchFilter, categoryFilter, rawData.length]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ field }) => {
    if (sortConfig.key !== field)
      return (
        <ArrowUpDown
          size={14}
          className="text-brand-muted inline ml-1 opacity-50"
        />
      );
    return (
      <ArrowUpDown
        size={14}
        className={`text-brand-primary inline ml-1 ${sortConfig.direction === "desc" ? "" : "rotate-180"}`}
      />
    );
  };

  // Excel Export
  const handleExport = () => {
    if (!processedData.length) {
      alert("No data to export");
      return;
    }

    const exportData = processedData.map((item) => ({
      Date: new Date(item.expense_date).toLocaleDateString(),
      Category: item.category,
      Description: item.description,
      "Amount (₹)": item.amount,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expense Report");
    XLSX.writeFile(
      wb,
      `Expense_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  return (
    <div className="flex flex-col bg-slate-50 font-sans">
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
                  Expense Report
                </h2>
                <p className="mt-1 text-sm text-brand-muted">
                  Show all the expense records done from the outlets.
                </p>
              </div>

              <div className="flex flex-1 justify-end flex-wrap items-center gap-3">
                <div className="flex flex-1 items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg max-w-md shadow-sm transition-colors focus-within:border-blue-500">
                  <Search size={16} className="text-slate-400 shrink-0" />
                  <input
                    className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="relative flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                  <Filter size={14} className="text-slate-500 shrink-0" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-sm font-semibold text-slate-700 outline-none bg-transparent cursor-pointer pr-2 max-w-[120px] truncate appearance-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <DateRangePicker
                  value={dateValue}
                  onChange={(newValue) => setDateValue(newValue)}
                  placeholder="Select Date Range"
                />

                <div className="relative flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                  <Building2 size={14} className="text-slate-500 shrink-0" />
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="text-sm font-semibold text-slate-700 outline-none bg-transparent cursor-pointer pr-2 max-w-[150px] truncate"
                  >
                    {branches?.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name || b.branch_name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleExport}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
                >
                  <Download size={16} /> Export
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  label="Total Expenses"
                  value={
                    stats?.totalExpense ? `₹${fmt(stats.totalExpense)}` : "₹0"
                  }
                  subtext="Total amount spent"
                  icon={<Wallet size={16} />}
                />
                <StatCard
                  label="Highest Expense Category"
                  value={stats?.highestExpenseCategory || "-"}
                  subtext="Category with most spending"
                  icon={<TrendingDown size={16} />}
                />
                <StatCard
                  label="Total Records"
                  value={stats?.expenseCount || "0"}
                  subtext="Number of expense entries"
                  icon={<Receipt size={16} />}
                />
              </div>
            </section>

            {/* Data Table Area */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden flex flex-col">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      <th
                        className="py-3.5 px-6 cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort("expense_date")}
                      >
                        Date <SortIcon field="expense_date" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort("category")}
                      >
                        Category <SortIcon field="category" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort("description")}
                      >
                        Description <SortIcon field="description" />
                      </th>
                      <th
                        className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort("amount")}
                      >
                        Amount <SortIcon field="amount" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {loading ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-12 text-center text-slate-400"
                        >
                          <p className="font-bold text-slate-600">
                            Loading data...
                          </p>
                        </td>
                      </tr>
                    ) : paginatedRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-12 text-center text-slate-400"
                        >
                          <Receipt
                            size={36}
                            className="mx-auto mb-2 text-slate-300"
                          />
                          <p className="font-bold text-slate-600">
                            No expense records found
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Try adjusting your search query or filters.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedRecords.map((item, idx) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                          key={item.id || idx}
                          className="hover:bg-slate-50/60 transition-colors duration-150"
                        >
                          <td className="py-3 px-6 font-medium text-slate-900">
                            <span className="font-bold text-slate-800 text-sm block">
                              {new Date(item.expense_date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                              })}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-500 border border-slate-200/60">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-900 text-sm">
                            {item.description}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-bold text-slate-900 text-sm">
                              ₹{fmt(item.amount)}
                            </span>
                          </td>
                        </motion.tr>
                      ))
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
                  totalItems={processedData.length}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
