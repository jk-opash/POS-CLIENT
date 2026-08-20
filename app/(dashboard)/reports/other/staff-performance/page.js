"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaffPerformance } from "@/app/store/slices/analyticsSlice";
import { fetchBranches } from "@/app/store/slices/branchSlice";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Search,
  Download,
  Calendar,
  Building2,
  Wallet,
  TrendingUp,
  Receipt,
  UtensilsCrossed,
  ChevronLeft,
  ArrowUpDown
} from "lucide-react";
import PosAdminPagination from "@/app/(dashboard)/menu/components/PosAdminPagination";
import StatCard from "../../../../components/ui/StatCard";
import DateRangePicker from "../../../../components/ui/DateRangePicker";
import * as XLSX from "xlsx";

function fmt(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export default function StaffPerformanceReport() {
  const dispatch = useDispatch();

  const {
    staffPerformanceData,
    staffPerformanceLoading,
    staffPerformanceError,
  } = useSelector((state) => state.analytics);
  const { branches } = useSelector((state) => state.branch);

  const { user } = useSelector((state) => state.auth);
  const businessId = user?.businesses?.[0]?.id || user?.businessId || user?.business_id;

  const [branchFilter, setBranchFilter] = useState("");
  const [search, setSearch] = useState("");

  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [dateValue, setDateValue] = useState({
    startDate: null,
    endDate: null,
  });

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
        fetchStaffPerformance({
          timeRange: dateValue.startDate && dateValue.endDate ? null : "today",
          startDate: dateValue.startDate ? new Date(dateValue.startDate.getTime() - dateValue.startDate.getTimezoneOffset() * 60000).toISOString().split("T")[0] : null,
          endDate: dateValue.endDate ? new Date(dateValue.endDate.getTime() - dateValue.endDate.getTimezoneOffset() * 60000).toISOString().split("T")[0] : null,
          branchId: branchFilter,
        }),
      );
    }
  }, [dispatch, branchFilter, dateValue]);

  // Calculations
  const stats = staffPerformanceData || {
    totalStaffActive: 0,
    totalSales: 0,
    totalOrdersHandled: 0,
    staffData: [],
  };

  const staffList = stats.staffData || [];

  // Filtering
  const filteredRecords = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.role.toLowerCase().includes(search.toLowerCase()),
  );

  // Sorting
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortField === "name" || sortField === "role") {
      return sortOrder === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
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
  }, [search, branchFilter, staffList.length]);

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

  const handleExport = () => {
    if (!filteredRecords.length) {
      alert("No data to export");
      return;
    }
    const exportData = filteredRecords.map((r) => ({
      "Staff Name": r.name,
      Role: r.role,
      "Orders Handled": r.ordersHandled,
      "Tables Served": r.tablesServed,
      "Sales Generated": Number(r.salesGenerated).toFixed(2),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Staff_Performance");
    XLSX.writeFile(wb, `staff_performance_${new Date().getTime()}.xlsx`);
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
                  Staff Performance
                </h2>
                <p className="mt-1 text-sm text-brand-muted">
                  Track sales, orders, and tables managed by your team
                </p>
              </div>

              <div className="flex flex-1 justify-end flex-wrap items-center gap-3">
                <div className="flex flex-1 items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg max-w-md shadow-sm transition-colors focus-within:border-blue-500">
                  <Search size={16} className="text-slate-400 shrink-0" />
                  <input
                    className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                    placeholder="Search by name or role..."
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total Active Staff"
                  value={stats.totalStaffActive}
                  subtext="Team members ringing orders"
                  icon={<Users size={16} />}
                />
                <StatCard
                  label="Total Sales Generated"
                  value={`₹${fmt(stats.totalSales)}`}
                  subtext="Gross revenue across staff"
                  icon={<Wallet size={16} />}
                />
                <StatCard
                  label="Total Orders Handled"
                  value={stats.totalOrdersHandled}
                  subtext="Combined order volume"
                  icon={<Receipt size={16} />}
                />
                <StatCard
                  label="Avg Orders / Staff"
                  value={
                    stats.totalStaffActive > 0
                      ? Math.round(stats.totalOrdersHandled / stats.totalStaffActive)
                      : 0
                  }
                  subtext="Efficiency metric"
                  icon={<TrendingUp size={16} />}
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
                        onClick={() => handleSort("name")}
                      >
                        Staff Name <SortIcon field="name" />
                      </th>
                      <th
                        className="py-3.5 px-6 cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort("role")}
                      >
                        Role <SortIcon field="role" />
                      </th>
                      <th
                        className="py-3.5 px-6 text-right cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort("ordersHandled")}
                      >
                        Orders Handled <SortIcon field="ordersHandled" />
                      </th>
                      <th
                        className="py-3.5 px-6 text-right cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort("tablesServed")}
                      >
                        Tables Served <SortIcon field="tablesServed" />
                      </th>
                      <th
                        className="py-3.5 px-6 text-right cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort("salesGenerated")}
                      >
                        Sales Generated <SortIcon field="salesGenerated" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 bg-white text-sm font-medium text-slate-700">
                    {staffPerformanceLoading ? (
                      <tr>
                        <td colSpan="5" className="py-12">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            <p className="mt-4 text-slate-500 text-sm">
                              Loading staff performance data...
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : paginatedRecords.length > 0 ? (
                      paginatedRecords.map((staff, idx) => (
                        <tr
                          key={staff.id}
                          className="group hover:bg-slate-50/50 transition-all duration-200"
                        >
                          <td className="py-3.5 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200/80">
                                {staff.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-slate-800 font-bold">
                                {staff.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-6 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-500 border border-slate-200/60">
                              {staff.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-right whitespace-nowrap">
                            <span className="text-slate-600 font-semibold">
                              {staff.ordersHandled}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5 text-slate-600">
                              <UtensilsCrossed className="w-3.5 h-3.5 text-slate-400 opacity-60" />
                              <span className="font-semibold">
                                {staff.tablesServed}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-6 text-right whitespace-nowrap">
                            <span className="font-black text-slate-800">
                              ₹{fmt(staff.salesGenerated)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-12">
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <Users className="w-12 h-12 text-slate-300 mb-3" />
                            <p className="text-sm font-semibold">No staff records found</p>
                            <p className="text-xs text-slate-400 mt-1">
                              Try adjusting your date range or filters
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!staffPerformanceLoading && totalPages > 1 && (
                <div className="border-t border-slate-200/60 p-4 bg-slate-50/50">
                  <PosAdminPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
