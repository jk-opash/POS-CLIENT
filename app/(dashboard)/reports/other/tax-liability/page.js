"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaxLiability } from "../../../../store/slices/analyticsSlice";
import { fetchBranches } from "../../../../store/slices/branchSlice";

import StatCard from "../../../../components/ui/StatCard";
import {
  DollarSign,
  FileText,
  Building2,
  Download,
  Search,
  ArrowUpDown,
  UtensilsCrossed,
  ChevronLeft,
  Percent,
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

export default function TaxLiabilityReport() {
  const [collapsed, setCollapsed] = useState(false);
  const [branchFilter, setBranchFilter] = useState("");
  const [search, setSearch] = useState("");

  const [sortField, setSortField] = useState("issued_at");
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
  const { taxData, taxDataLoading } = useSelector((state) => state.analytics);

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
        fetchTaxLiability({
          timeRange: dateValue.startDate && dateValue.endDate ? null : "today",
          startDate: dateValue.startDate,
          endDate: dateValue.endDate,
          branchId: branchFilter,
        }),
      );
    }
  }, [dispatch, branchFilter, dateValue]);

  const invoices = taxData?.invoices || [];
  const totalTaxableValue = taxData?.totalTaxableValue || 0;
  const totalTaxCollected = taxData?.totalTaxCollected || 0;
  const totalRevenue = taxData?.totalRevenue || 0;

  // Filtering
  const filteredInvoices = invoices.filter((inv) =>
    inv.invoice_number.toLowerCase().includes(search.toLowerCase()),
  );

  // Sorting
  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (sortField === "invoice_number") {
      return sortOrder === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    } else if (sortField === "issued_at") {
      return sortOrder === "asc"
        ? new Date(a.issued_at) - new Date(b.issued_at)
        : new Date(b.issued_at) - new Date(a.issued_at);
    } else {
      return sortOrder === "asc"
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
  });

  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
  const paginatedInvoices = sortedInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, branchFilter, invoices.length]);

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
                  Tax & GST Liability
                </h2>
                <p className="mt-1 text-sm text-brand-muted">
                  Comprehensive summary of collected taxes for filing returns.
                </p>
              </div>

              <div className="flex flex-1 justify-end flex-wrap items-center gap-3">
                <div className="flex flex-1 items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg max-w-md shadow-sm transition-colors focus-within:border-blue-500">
                  <Search size={16} className="text-slate-400 shrink-0" />
                  <input
                    className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                    placeholder="Search invoice number..."
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total Taxable Value"
                  value={`₹${fmt(totalTaxableValue)}`}
                  subtext="Base amount for tax"
                  icon={<DollarSign size={16} />}
                />
                <StatCard
                  label="Total Tax Collected"
                  value={`₹${fmt(totalTaxCollected)}`}
                  subtext="Aggregate tax amount"
                  icon={<Percent size={16} />}
                />
                <StatCard
                  label="Total Revenue"
                  value={`₹${fmt(totalRevenue)}`}
                  subtext="Gross sales including tax"
                  icon={<DollarSign size={16} />}
                />
                <StatCard
                  label="Invoices"
                  value={invoices.length}
                  subtext="Count of invoices"
                  icon={<FileText size={16} />}
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
                        onClick={() => handleSort("issued_at")}
                      >
                        Invoice Date <SortIcon field="issued_at" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => handleSort("invoice_number")}
                      >
                        Invoice # <SortIcon field="invoice_number" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-600 transition-colors text-right"
                        onClick={() => handleSort("taxableValue")}
                      >
                        Taxable Value <SortIcon field="taxableValue" />
                      </th>
                      <th className="py-3.5 px-4 text-right">CGST (2.5%)</th>
                      <th className="py-3.5 px-4 text-right">SGST (2.5%)</th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-slate-600 transition-colors text-right"
                        onClick={() => handleSort("taxAmount")}
                      >
                        Total Tax <SortIcon field="taxAmount" />
                      </th>
                      <th
                        className="py-3.5 px-6 cursor-pointer hover:text-slate-600 transition-colors text-right"
                        onClick={() => handleSort("totalAmount")}
                      >
                        Net Amount <SortIcon field="totalAmount" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {taxDataLoading ? (
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
                    ) : sortedInvoices.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-12 text-center text-slate-400"
                        >
                          <FileText
                            size={36}
                            className="mx-auto mb-2 text-slate-300"
                          />
                          <p className="font-bold text-slate-600">
                            No invoices found
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Try adjusting your search query or selected branch.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedInvoices.map((inv, idx) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                          key={inv.id}
                          className="hover:bg-slate-50/60 transition-colors duration-150"
                        >
                          <td className="py-3 px-6 text-slate-600">
                            {new Date(inv.issued_at).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900">
                            <span className="font-bold text-slate-800 text-sm block">
                              {inv.invoice_number}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-slate-700">
                            ₹{fmt(inv.taxableValue)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-700">
                            ₹{fmt(inv.taxAmount / 2)}
                          </td>
                          <td className="py-3 px-4 text-right text-slate-700">
                            ₹{fmt(inv.taxAmount / 2)}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-blue-600 text-sm">
                            ₹{fmt(inv.taxAmount)}
                          </td>
                          <td className="py-3 px-6 text-right font-bold text-emerald-600 text-sm">
                            ₹{fmt(inv.totalAmount)}
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
                  totalItems={sortedInvoices.length}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
