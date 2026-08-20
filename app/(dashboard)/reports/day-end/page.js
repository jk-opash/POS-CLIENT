"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardAnalytics } from "../../../store/slices/analyticsSlice";
import { fetchBranches } from "../../../store/slices/branchSlice";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import StatCard from "../../../components/ui/StatCard";
import Card from "../../../components/ui/Card";
import {
  Printer,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  CreditCard,
  Wallet,
  Coins,
  Receipt,
  UserCheck,
  Clock,
  ShieldAlert,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";

function fmt(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

export default function DayEndReport() {
  const [collapsed, setCollapsed] = useState(false);
  const [branchFilter, setBranchFilter] = useState("");
  const [openingBalance, setOpeningBalance] = useState(0);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState("0");

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const businessId = user?.businesses?.[0]?.id;

  const { branches } = useSelector((state) => state.branch);
  const { stats, loading } = useSelector((state) => state.analytics);

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

  // Fetch analytics when branch changes
  useEffect(() => {
    if (branchFilter) {
      dispatch(
        fetchDashboardAnalytics({ timeRange: "today", branchId: branchFilter }),
      );
    }
  }, [dispatch, branchFilter]);

  const dateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Use empty stats if loading to prevent flashing stale data from other pages
  const displayStats = loading ? {} : stats || {};

  // Map Stats
  const grossSales = displayStats.totalSales || 0;
  const netSales = displayStats.netSales || 0;
  const taxCollected = displayStats.taxes || 0;
  const discountsGiven = displayStats.discounts || 0;

  const cashCol = displayStats.cashCollection || 0;
  const cardCol = displayStats.cardCollection || 0;
  const upiCol = displayStats.upiCollection || 0;

  const totalOrders = displayStats.numOrders || 0;
  const cancelledOrders = displayStats.cancelledOrders || 0;
  const aov = totalOrders > 0 ? Math.round(grossSales / totalOrders) : 0;

  const topProducts = displayStats.topProducts || [];
  const pettyCash = displayStats.expenseCategories || [];

  const expectedCash =
    openingBalance + cashCol - pettyCash.reduce((s, p) => s + p.val, 0);

  const tenders = [
    {
      type: "Cash",
      amount: cashCol,
      icon: Coins,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      progressBg: "bg-amber-500",
    },
    {
      type: "Credit/Debit Card",
      amount: cardCol,
      icon: CreditCard,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
      progressBg: "bg-blue-500",
    },
    {
      type: "UPI / Digital",
      amount: upiCol,
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
      progressBg: "bg-emerald-500",
    },
  ];

  return (
    <div className="flex flex-col bg-slate-50">
      <div className="flex flex-1 min-w-0 flex-col">
        <main className="flex-1 px-6 py-6">
          <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-brand-dark">
                  Day End Summary (Z-Report)
                </h2>

                <p className="mt-1 text-sm text-brand-muted">
                  Daily closing report and cash reconciliation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Branch Selector (Matched with menu/page.js) */}
                <div className="relative flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                  <Building2 size={14} className="text-slate-500 shrink-0" />
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="text-sm font-semibold text-slate-700 outline-none bg-transparent cursor-pointer pr-2"
                  >
                    {branches?.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
                >
                  <Printer size={16} /> Print Z-Report
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-dark">
                Sales Metrics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Gross Sales"
                  value={`₹${fmt(grossSales)}`}
                  subtext="Total billings"
                  icon={<DollarSign size={16} />}
                />
                <StatCard
                  label="Net Sales"
                  value={`₹${fmt(netSales)}`}
                  subtext="After taxes & disc."
                  icon={<Wallet size={16} />}
                />
                <StatCard
                  label="Tax Collected"
                  value={`₹${fmt(taxCollected)}`}
                  subtext="GST Liability"
                  icon={<Receipt size={16} />}
                />
                <StatCard
                  label="Discounts"
                  value={`₹${fmt(discountsGiven)}`}
                  subtext={`${cancelledOrders} void orders`}
                  icon={<ShieldAlert size={16} />}
                />
              </div>
            </section>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* LEFT COLUMN */}
              <div className="xl:col-span-2 space-y-6">
                {/* Tender Breakdown */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-border">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-dark">
                      Tender / Payment Breakdown
                    </h3>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                      Channels
                    </span>
                  </div>

                  <div className="flex flex-col gap-5">
                    {tenders.map((tender, i) => {
                      const pct =
                        grossSales > 0
                          ? Math.round((tender.amount / grossSales) * 100)
                          : 0;
                      return (
                        <div key={i} className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border bg-white border-brand-border shadow-sm ${tender.color}`}
                          >
                            <tender.icon size={22} />
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-sm font-bold text-slate-700">
                                {tender.type}
                              </span>
                              <span className="text-sm font-black text-brand-dark">
                                ₹{fmt(tender.amount)}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.8, delay: 0.1 * i }}
                                  className={`h-full rounded-full ${tender.progressBg}`}
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-500 w-8 text-right">
                                {pct}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Top Products */}
                <Card className="p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-dark mb-4">
                    Top Products Sales
                  </h3>
                  <div className="space-y-4">
                    {topProducts.length === 0 && !loading && (
                      <div className="text-sm text-brand-muted font-medium">
                        No sales recorded for this period.
                      </div>
                    )}
                    {topProducts.map((prod, i) => {
                      const maxRevenue =
                        topProducts.length > 0 ? topProducts[0].revenue : 0;

                      const pct =
                        grossSales > 0
                          ? Math.round((prod.revenue / grossSales) * 100)
                          : 0;

                      const barWidth =
                        maxRevenue > 0
                          ? Math.round((prod.revenue / maxRevenue) * 100)
                          : 0;

                      const colors = [
                        "bg-brand-primary",
                        "bg-emerald-500",
                        "bg-purple-500",
                        "bg-amber-500",
                        "bg-rose-500",
                      ];
                      const color = colors[i % colors.length];
                      return (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-brand-dark">
                              {prod.name}
                            </span>
                            <div className="text-right">
                              <span className="font-black text-brand-dark mr-2">
                                ₹{fmt(prod.revenue)}
                              </span>
                              <span className="text-xs font-bold text-brand-muted">
                                ({pct}%)
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${barWidth}%` }}
                              transition={{ duration: 0.8, delay: 0.1 * i }}
                              className={`h-full ${color} rounded-full`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* Cash Register */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-brand-border">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-dark">
                      Cash Reconciliation
                    </h3>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-200">
                      Live
                    </span>
                  </div>

                  <div className="space-y-3.5 text-sm">
                    <div className="flex justify-between items-center text-brand-muted">
                      <span className="font-medium flex items-center gap-2">
                        Opening Balance
                        {!isEditingBalance && (
                          <button
                            onClick={() => setIsEditingBalance(true)}
                            className="text-brand-muted hover:text-brand-primary p-1 rounded-md transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </button>
                        )}
                      </span>
                      {isEditingBalance ? (
                        <div className="flex items-center gap-2">
                          <span className="text-brand-dark font-medium">₹</span>
                          <input
                            type="number"
                            value={balanceInput}
                            onChange={(e) => setBalanceInput(e.target.value)}
                            className="w-20 border border-brand-border rounded-md px-2 py-1 text-sm font-bold text-brand-dark focus:outline-none focus:border-brand-primary"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setOpeningBalance(Number(balanceInput) || 0);
                                setIsEditingBalance(false);
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              setOpeningBalance(Number(balanceInput) || 0);
                              setIsEditingBalance(false);
                            }}
                            className="text-xs bg-brand-primary text-white px-2 py-1 rounded-md font-medium"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span className="font-bold text-brand-dark">
                          ₹{fmt(openingBalance)}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-emerald-600">
                      <span className="font-medium flex items-center gap-1.5">
                        <ArrowUpRight size={16} /> Cash Sales
                      </span>
                      <span className="font-bold">+₹{fmt(cashCol)}</span>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-brand-border">
                      <span className="text-xs font-bold text-brand-muted flex items-center gap-1.5">
                        <ArrowDownRight size={14} className="text-rose-500" />{" "}
                        Petty Cash Payouts
                      </span>
                      {pettyCash.length === 0 && (
                        <div className="text-[10px] text-brand-muted pl-5">
                          No expenses recorded
                        </div>
                      )}
                      {pettyCash.map((pc, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-xs text-rose-500 pl-5"
                        >
                          <span>- {pc.label}</span>
                          <span>-₹{fmt(pc.val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-border">
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block">
                      Expected Drawer Cash
                    </span>
                    <span className="text-3xl font-black text-brand-dark">
                      ₹{fmt(expectedCash)}
                    </span>
                  </div>
                </Card>

                {/* Order Metrics */}
                <Card className="p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-dark mb-4">
                    Key Order Metrics
                  </h3>
                  <div className="divide-y divide-slate-100">
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm font-semibold text-brand-muted">
                        Total Orders
                      </span>
                      <span className="font-black text-brand-dark text-base">
                        {totalOrders}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm font-semibold text-brand-muted">
                        Cancelled / Voided
                      </span>
                      <span className="font-black text-rose-500 text-base">
                        {cancelledOrders}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm font-semibold text-brand-muted">
                        Average Order Value
                      </span>
                      <span className="font-black text-brand-dark text-base">
                        ₹{fmt(aov)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
