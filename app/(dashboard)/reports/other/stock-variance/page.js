"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockVariance } from "../../../../store/slices/analyticsSlice";
import { fetchBranches } from "../../../../store/slices/branchSlice";
import StatCard from "../../../../components/ui/StatCard";
import {
  DollarSign,
  FileText,
  Building2,
  Download,
  Search,
  ArrowUpDown,
  ChevronLeft,
  PackageMinus,
  Hash,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import PosAdminPagination from "../../../menu/components/PosAdminPagination";
import DateRangePicker from "../../../../components/ui/DateRangePicker";

function fmt(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export default function StockVarianceReport() {
  const [branchFilter, setBranchFilter] = useState("");
  const [search, setSearch] = useState("");

  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [dateValue, setDateValue] = useState({
    startDate: null,
    endDate: null,
  });

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const businessId = user?.businesses?.[0]?.id || user?.businessId || user?.business_id;

  const { branches } = useSelector((state) => state.branch);
  const { stockVarianceData, stockVarianceLoading } = useSelector(
    (state) => state.analytics,
  );

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

  // Fetch analytics when branch or date changes
  useEffect(() => {
    if (branchFilter) {
      dispatch(
        fetchStockVariance({
          timeRange: dateValue.startDate && dateValue.endDate ? null : "month",
          startDate: dateValue.startDate ? new Date(dateValue.startDate.getTime() - dateValue.startDate.getTimezoneOffset() * 60000).toISOString().split("T")[0] : null,
          endDate: dateValue.endDate ? new Date(dateValue.endDate.getTime() - dateValue.endDate.getTimezoneOffset() * 60000).toISOString().split("T")[0] : null,
          branchId: branchFilter,
        }),
      );
    }
  }, [dispatch, branchFilter, dateValue]);

  const discrepancies = stockVarianceData?.discrepancies || [];
  const totalItemsCounted = stockVarianceData?.totalItemsCounted || 0;
  const totalDiscrepancies = stockVarianceData?.totalDiscrepancies || 0;
  const netValueImpact = stockVarianceData?.netValueImpact || 0;

  // Filtering
  const filteredRecords = discrepancies.filter(
    (rec) =>
      rec.itemName.toLowerCase().includes(search.toLowerCase()) ||
      rec.sku.toLowerCase().includes(search.toLowerCase()),
  );

  // Sorting
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (
      sortField === "itemName" ||
      sortField === "sku" ||
      sortField === "movementType"
    ) {
      return sortOrder === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    } else if (sortField === "date") {
      return sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else {
      return sortOrder === "asc"
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
  });

  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage);
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, branchFilter, discrepancies.length]);

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
        className={`text-brand-primary inline ml-1 ${
          sortOrder === "desc" ? "" : "rotate-180"
        }`}
      />
    );
  };

  const getVarianceBadge = (variance) => {
    if (variance < 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-rose-100 text-rose-600 border border-rose-200/60">
          {variance}
        </span>
      );
    } else if (variance > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-emerald-100 text-emerald-600 border border-emerald-200/60">
          +{variance}
        </span>
      );
    } else {
       return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-500 border border-slate-200/60">
          0
        </span>
      );
    }
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
                  Stock Variance
                </h2>
                <p className="mt-1 text-sm text-brand-muted">
                  Audit discrepancies between physical inventory and system stock.
                </p>
              </div>

              <div className="flex flex-1 justify-end flex-wrap items-center gap-3">
                <div className="flex flex-1 items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg max-w-md shadow-sm transition-colors focus-within:border-blue-500">
                  <Search size={16} className="text-slate-400 shrink-0" />
                  <input
                    className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                    placeholder="Search by item name or SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
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
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2">
                  <Download size={16} /> Export
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                  label="Items Counted"
                  value={totalItemsCounted}
                  subtext="Total ledger adjustments"
                  icon={<Hash size={16} />}
                />
                <StatCard
                  label="Discrepancies"
                  value={totalDiscrepancies}
                  subtext="Items with variances"
                  icon={<AlertCircle size={16} />}
                />
                <StatCard
                  label="Net Value Impact"
                  value={`₹${fmt(Math.abs(netValueImpact))}`}
                  subtext={netValueImpact < 0 ? "Total Value Lost" : netValueImpact > 0 ? "Total Value Gained" : "No Impact"}
                  icon={<DollarSign size={16} />}
                />
              </div>
            </section>

            {/* Data Table Area */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      <th
                        className="py-3.5 px-6 cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort("date")}
                      >
                        Date & Time <SortIcon field="date" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort("itemName")}
                      >
                        Item Name <SortIcon field="itemName" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort("sku")}
                      >
                        SKU <SortIcon field="sku" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-600 transition-colors text-right"
                        onClick={() => handleSort("expectedStock")}
                      >
                        Expected Stock <SortIcon field="expectedStock" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-600 transition-colors text-right"
                        onClick={() => handleSort("actualStock")}
                      >
                        Actual Stock <SortIcon field="actualStock" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-600 transition-colors text-right"
                        onClick={() => handleSort("variance")}
                      >
                        Variance <SortIcon field="variance" />
                      </th>
                      <th
                        className="py-3.5 px-6 cursor-pointer hover:text-slate-600 transition-colors text-right"
                        onClick={() => handleSort("valueImpact")}
                      >
                        Value Impact <SortIcon field="valueImpact" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {stockVarianceLoading ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-12 text-center text-slate-400"
                        >
                          <p className="font-bold text-slate-600">
                            Loading data...
                          </p>
                        </td>
                      </tr>
                    ) : sortedRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-12 text-center text-slate-400"
                        >
                          <PackageMinus
                            size={36}
                            className="mx-auto mb-2 text-slate-300"
                          />
                          <p className="font-bold text-slate-600">
                            No discrepancies found
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Everything looks clean for this selected period!
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedRecords.map((rec, idx) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                          key={rec.id}
                          className="hover:bg-slate-50/60 transition-colors duration-150"
                        >
                          <td className="py-3 px-6 text-slate-600">
                            {new Date(rec.date).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900">
                            <span className="font-bold text-slate-800 text-sm block">
                              {rec.itemName}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{rec.movementType} - {rec.reason}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {rec.sku}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-700">
                            {fmt(rec.expectedStock)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-700">
                            {fmt(rec.actualStock)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {getVarianceBadge(rec.variance)}
                          </td>
                          <td className={`py-3 px-6 text-right font-bold text-sm ${rec.valueImpact < 0 ? 'text-rose-600' : rec.valueImpact > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {rec.valueImpact < 0 ? '-' : ''}₹{fmt(Math.abs(rec.valueImpact))}
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
                  totalItems={sortedRecords.length}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
