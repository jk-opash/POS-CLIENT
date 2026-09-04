"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiscountsVoids } from "../../../../store/slices/analyticsSlice";
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
  Percent,
  XCircle,
  Gift,
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

export default function DiscountsVoidsReport() {
  const [collapsed, setCollapsed] = useState(false);
  const [branchFilter, setBranchFilter] = useState("");
  const [search, setSearch] = useState("");

  const [sortField, setSortField] = useState("created_at");
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
  const { discountsVoidsData, discountsVoidsLoading } = useSelector(
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
        fetchDiscountsVoids({
          timeRange: dateValue.startDate && dateValue.endDate ? null : "today",
          startDate: dateValue.startDate,
          endDate: dateValue.endDate,
          branchId: branchFilter,
        }),
      );
    }
  }, [dispatch, branchFilter, dateValue]);

  const orders = discountsVoidsData?.orders || [];
  const totalDiscountAmount = discountsVoidsData?.totalDiscountAmount || 0;
  const cancelledCount = discountsVoidsData?.cancelledCount || 0;
  const compedCount = discountsVoidsData?.compedCount || 0;
  const totalValueLost = discountsVoidsData?.totalValueLost || 0;

  // Filtering
  const filteredOrders = orders.filter(
    (ord) =>
      ord.order_number.toLowerCase().includes(search.toLowerCase()) ||
      ord.type.toLowerCase().includes(search.toLowerCase()),
  );

  // Sorting
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (
      sortField === "order_number" ||
      sortField === "type" ||
      sortField === "status"
    ) {
      return sortOrder === "asc"
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    } else if (sortField === "created_at") {
      return sortOrder === "asc"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
    } else {
      return sortOrder === "asc"
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
  });

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, branchFilter, orders.length]);

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

  const getTypeBadge = (type) => {
    switch (type) {
      case "Discount":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-brand-light text-brand-dark border border-brand-border/60">
            <Percent size={10} /> {type}
          </span>
        );
      case "Void":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-brand-light text-brand-dark border border-brand-border/60">
            <XCircle size={10} /> {type}
          </span>
        );
      case "Comped":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-brand-light text-brand-dark border border-brand-border/60">
            <Gift size={10} /> {type}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-brand-bg text-brand-muted border border-brand-border/60">
            {type}
          </span>
        );
    }
  };

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
                  Discounts & Voids
                </h2>
                <p className="mt-1 text-sm text-brand-muted">
                  Audit log of all discounts, comped items, and cancelled
                  orders.
                </p>
              </div>

              <div className="flex flex-1 justify-end flex-wrap items-center gap-3">
                <div className="flex flex-1 items-center gap-2 px-4 py-2 bg-white border border-brand-border rounded-lg max-w-md shadow-sm transition-colors focus-within:border-brand-primary">
                  <Search size={16} className="text-brand-muted/70 shrink-0" />
                  <input
                    className="w-full text-sm bg-transparent outline-none text-brand-dark placeholder:text-brand-muted/70"
                    placeholder="Search by order number or type..."
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

                <button className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-dark text-white hover:bg-brand-primary transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2">
                  <Download size={16} /> Export
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total Impact"
                  value={`₹${fmt(totalValueLost)}`}
                  subtext="Approximate revenue lost"
                  icon={<DollarSign size={16} />}
                />
                <StatCard
                  label="Total Discounts"
                  value={`₹${fmt(totalDiscountAmount)}`}
                  subtext="Aggregate discount amount"
                  icon={<Percent size={16} />}
                />
                <StatCard
                  label="Voided Orders"
                  value={cancelledCount}
                  subtext="Cancelled / Voided"
                  icon={<XCircle size={16} />}
                />
                <StatCard
                  label="Comped Orders"
                  value={compedCount}
                  subtext="Complimentary items"
                  icon={<Gift size={16} />}
                />
              </div>
            </section>

            {/* Data Table Area */}
            <div className="rounded-2xl border border-brand-border/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-bg/80 text-[11px] font-black text-brand-muted/70 uppercase tracking-wider">
                      <th
                        className="py-3.5 px-6 cursor-pointer hover:text-brand-dark transition-colors"
                        onClick={() => handleSort("created_at")}
                      >
                        Date & Time <SortIcon field="created_at" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-brand-dark transition-colors"
                        onClick={() => handleSort("order_number")}
                      >
                        Order # <SortIcon field="order_number" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-brand-dark transition-colors"
                        onClick={() => handleSort("type")}
                      >
                        Flag Type <SortIcon field="type" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-brand-dark transition-colors text-right"
                        onClick={() => handleSort("subtotal")}
                      >
                        Subtotal <SortIcon field="subtotal" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-brand-dark transition-colors text-right"
                        onClick={() => handleSort("discount_amount")}
                      >
                        Discount <SortIcon field="discount_amount" />
                      </th>
                      <th
                        className="py-3.5 px-4 cursor-pointer hover:text-brand-dark transition-colors text-right"
                        onClick={() => handleSort("total_amount")}
                      >
                        Net Total <SortIcon field="total_amount" />
                      </th>
                      <th
                        className="py-3.5 px-6 cursor-pointer hover:text-brand-dark transition-colors text-right"
                        onClick={() => handleSort("lostValue")}
                      >
                        Lost Value <SortIcon field="lostValue" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-muted text-xs">
                    {discountsVoidsLoading ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-12 text-center text-brand-muted/70"
                        >
                          <p className="font-bold text-brand-dark">
                            Loading data...
                          </p>
                        </td>
                      </tr>
                    ) : sortedOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-12 text-center text-brand-muted/70"
                        >
                          <FileText
                            size={36}
                            className="mx-auto mb-2 text-brand-muted/70"
                          />
                          <p className="font-bold text-brand-dark">
                            No flagged orders found
                          </p>
                          <p className="text-xs text-brand-muted/70 mt-0.5">
                            Everything looks clean for this selected period!
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((ord, idx) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                          key={ord.id}
                          className="hover:bg-brand-bg/60 transition-colors duration-150"
                        >
                          <td className="py-3 px-6 text-brand-dark">
                            {new Date(ord.created_at).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-3 px-4 font-medium text-brand-dark">
                            <span className="font-bold text-brand-dark text-sm block">
                              {ord.order_number}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {getTypeBadge(ord.type)}
                          </td>
                          <td className="py-3 px-4 text-right text-brand-dark">
                            ₹{fmt(ord.subtotal)}
                          </td>
                          <td className="py-3 px-4 text-right text-brand-dark">
                            ₹{fmt(ord.discount_amount)}
                          </td>
                          <td className="py-3 px-4 text-right text-brand-dark font-semibold">
                            ₹{fmt(ord.total_amount)}
                          </td>
                          <td className="py-3 px-6 text-right font-bold text-brand-danger text-sm">
                            ₹{fmt(ord.lostValue)}
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
                  totalItems={sortedOrders.length}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
