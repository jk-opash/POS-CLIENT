"use client";

import { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
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
  PieChart,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

// --- MOCK DATA ---
const DAY_END_DATA = {
  date: "28 July 2026",
  shift: "Full Day Shift",
  manager: "Admin User",
  openingBalance: 5000,
  closingBalance: 87500,
  totalOrders: 142,
  cancelledOrders: 3,
  discountsGiven: 1250,
  netSales: 82500,
  taxCollected: 4125,
  grossSales: 86625,
  tenders: [
    {
      type: "Cash",
      amount: 12500,
      transactions: 24,
      icon: Coins,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      progressBg: "bg-amber-500",
    },
    {
      type: "Credit/Debit Card",
      amount: 45000,
      transactions: 65,
      icon: CreditCard,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
      progressBg: "bg-blue-500",
    },
    {
      type: "UPI / Digital",
      amount: 29125,
      transactions: 53,
      icon: Wallet,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
      progressBg: "bg-emerald-500",
    },
  ],
  categorySales: [
    { name: "Food Items", amount: 55000, percentage: 66, color: "bg-blue-500" },
    {
      name: "Beverages",
      amount: 20000,
      percentage: 24,
      color: "bg-emerald-500",
    },
    {
      name: "Desserts & Bakery",
      amount: 7500,
      percentage: 10,
      color: "bg-purple-500",
    },
  ],
  pettyCash: [
    { reason: "Milk & Dairy Purchase", amount: 250, type: "out" },
    { reason: "Local Vendor Payment", amount: 1500, type: "out" },
  ],
};

export default function DayEndReport() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedShift, setSelectedShift] = useState("Full Day Shift");

  const expectedCash =
    DAY_END_DATA.openingBalance +
    DAY_END_DATA.tenders.find((t) => t.type === "Cash").amount -
    DAY_END_DATA.pettyCash.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <Topbar onMenuClick={() => setCollapsed((c) => !c)} />
        <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
          {/* Header (Fixed / Non-scrolling) */}
          <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                  Day End Summary (Z-Report)
                </h1>
                <p className="text-slate-500 font-medium mt-0.5 text-xs flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  <span>{DAY_END_DATA.date}</span>
                  <span>•</span>
                  <UserCheck size={14} className="text-slate-400" />
                  <span>Manager: {DAY_END_DATA.manager}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <select
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value)}
                    className="bg-transparent outline-none cursor-pointer"
                  >
                    <option value="Full Day Shift">Full Day Shift</option>
                    <option value="Morning Shift">Morning Shift</option>
                    <option value="Evening Shift">Evening Shift</option>
                  </select>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-all shadow-md active:scale-95"
                >
                  <Printer size={15} /> Print Z-Report
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Sales Overview KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700 font-black">
                    ₹
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Gross Sales
                    </div>
                    <div className="text-2xl font-black text-slate-800">
                      ₹{DAY_END_DATA.grossSales.toLocaleString()}
                    </div>
                    <div className="text-xs font-medium text-slate-400 mt-0.5">
                      Total billings
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-black">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-600/70 mb-1">
                      Net Sales
                    </div>
                    <div className="text-2xl font-black text-emerald-600">
                      ₹{DAY_END_DATA.netSales.toLocaleString()}
                    </div>
                    <div className="text-xs font-medium text-slate-400 mt-0.5">
                      After taxes & disc.
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-black">
                    <Receipt size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600/70 mb-1">
                      Tax Collected
                    </div>
                    <div className="text-2xl font-black text-blue-600">
                      ₹{DAY_END_DATA.taxCollected.toLocaleString()}
                    </div>
                    <div className="text-xs font-medium text-slate-400 mt-0.5">
                      GST Liability
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-black">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-600/70 mb-1">
                      Discounts
                    </div>
                    <div className="text-2xl font-black text-rose-500">
                      ₹{DAY_END_DATA.discountsGiven.toLocaleString()}
                    </div>
                    <div className="text-xs font-medium text-slate-400 mt-0.5">
                      {DAY_END_DATA.cancelledOrders} void orders
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* LEFT COLUMN: Tender & Category Breakdown */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Payment Methods Breakdown */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                      Tender / Payment Breakdown
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {DAY_END_DATA.tenders.map((tender, i) => {
                        const pct = Math.round(
                          (tender.amount / DAY_END_DATA.grossSales) * 100,
                        );
                        return (
                          <div
                            key={i}
                            className={`p-5 rounded-2xl border ${tender.bg} flex flex-col justify-between`}
                          >
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <div
                                  className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${tender.color}`}
                                >
                                  <tender.icon size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
                                  {tender.transactions} Txns
                                </span>
                              </div>
                              <div className="text-sm font-bold text-slate-600 mb-1">
                                {tender.type}
                              </div>
                              <div
                                className={`text-2xl font-black ${tender.color}`}
                              >
                                ₹{tender.amount.toLocaleString()}
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-200/60">
                              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                                <span>Share</span>
                                <span>{pct}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/80 rounded-full overflow-hidden">
                                <div
                                  style={{ width: `${pct}%` }}
                                  className={`h-full rounded-full ${tender.progressBg}`}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Sales */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                      Category Sales Breakdown
                    </h2>
                    <div className="space-y-4">
                      {DAY_END_DATA.categorySales.map((cat, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-slate-700">
                              {cat.name}
                            </span>
                            <div className="text-right">
                              <span className="font-black text-slate-800 mr-2">
                                ₹{cat.amount.toLocaleString()}
                              </span>
                              <span className="text-xs font-bold text-slate-400">
                                ({cat.percentage}%)
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${cat.percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.1 * i }}
                              className={`h-full ${cat.color} rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Cash Register & Summary */}
                <div className="space-y-6">
                  {/* Cash Drawer Calculator */}
                  <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white space-y-5 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <h2 className="text-sm font-black text-slate-300 uppercase tracking-wider">
                        Cash Register Reconciliation
                      </h2>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        Balanced
                      </span>
                    </div>

                    <div className="space-y-3.5 text-sm">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="font-medium">Opening Balance</span>
                        <span className="font-bold text-white">
                          ₹{DAY_END_DATA.openingBalance.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-emerald-400">
                        <span className="font-medium flex items-center gap-1.5">
                          <ArrowUpRight size={16} /> Cash Sales Collected
                        </span>
                        <span className="font-bold">
                          +₹
                          {DAY_END_DATA.tenders
                            .find((t) => t.type === "Cash")
                            .amount.toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-slate-800">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                          <ArrowDownRight size={14} className="text-rose-400" />{" "}
                          Petty Cash Payouts
                        </span>
                        {DAY_END_DATA.pettyCash.map((pc, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-xs text-rose-300 pl-5"
                          >
                            <span>- {pc.reason}</span>
                            <span>-₹{pc.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Expected Drawer Cash
                        </span>
                        <span className="text-3xl font-black text-white">
                          ₹{expectedCash.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Metrics Summary */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                      Key Order Metrics
                    </h2>
                    <div className="divide-y divide-slate-100">
                      <div className="flex justify-between items-center py-3">
                        <span className="text-sm font-semibold text-slate-600">
                          Total Orders Processed
                        </span>
                        <span className="font-black text-slate-800 text-base">
                          {DAY_END_DATA.totalOrders}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-sm font-semibold text-slate-600">
                          Cancelled / Voided Orders
                        </span>
                        <span className="font-black text-rose-500 text-base">
                          {DAY_END_DATA.cancelledOrders}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-sm font-semibold text-slate-600">
                          Average Order Value (AOV)
                        </span>
                        <span className="font-black text-slate-800 text-base">
                          ₹
                          {Math.round(
                            DAY_END_DATA.grossSales / DAY_END_DATA.totalOrders,
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
