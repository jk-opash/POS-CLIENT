"use client";

import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import StatCard from "../components/ui/StatCard";

import ExpensesWidget from "../components/dashboard/ExpensesWidget";
import OrderStatisticsWidget from "../components/dashboard/OrderStatisticsWidget";
import RevenueLeakageWidget from "../components/dashboard/RevenueLeakageWidget";
import DiscountWidget from "../components/dashboard/DiscountWidget";
import TaxesWidget from "../components/dashboard/TaxesWidget";
import OutletStatisticsWidget from "../components/dashboard/OutletStatisticsWidget";
import OnlineOrdersWidget from "../components/dashboard/OnlineOrdersWidget";
import ProductsWidget from "../components/dashboard/ProductsWidget";

import { cn } from "../lib/utils";

import {
  TrendingUp,
  BarChart3,
  Receipt,
  Wallet,
  Banknote,
  Globe,
  ScrollText,
  Tag,
} from "lucide-react";

function fmt(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // TODO: Fetch orders from Redux store once orderSlice is implemented
  const totalSales = 0;
  const netSales = 0;
  const onlineSales = 0;
  const numOrders = 0;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setCollapsed((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-brand-dark">
                  Dashboard Overview
                </h2>

                <p className="mt-1 text-sm text-brand-muted">
                  Real-time overview of your business performance.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-lg border border-brand-border bg-white px-4 py-2 text-sm font-bold shadow-sm hover:bg-brand-light">
                  📤 Export
                </button>

                <button className="rounded-lg border border-brand-border bg-white px-4 py-2 text-sm font-bold shadow-sm hover:bg-brand-light">
                  ⊞ Zone
                </button>

                <select className="rounded-lg border border-brand-border bg-white px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20">
                  <option>Today</option>
                  <option>Yesterday</option>
                  <option>This Week</option>
                </select>
              </div>
            </div>

            {/* Tabs */}
            <div className="rounded-t-2xl border-b border-slate-200 bg-white/60 px-2 backdrop-blur">
              <nav className="-mb-px flex space-x-6 overflow-x-auto">
                {[
                  {
                    id: "overview",
                    label: "Overview",
                  },
                  {
                    id: "sales",
                    label: "Sales & Orders",
                  },
                  {
                    id: "financials",
                    label: "Financials",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "border-b-2 px-2 py-4 text-sm font-bold whitespace-nowrap transition",
                      activeTab === tab.id
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <section>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-dark">
                    Financial Metrics
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                      label="Total Sales"
                      value={fmt(totalSales)}
                      subtext="Total Sales of 5 outlets"
                      icon={<TrendingUp size={16} />}
                    />

                    <StatCard
                      label="Net Sales"
                      value={fmt(netSales)}
                      subtext="Net Sales of 5 outlets"
                      icon={<BarChart3 size={16} />}
                    />

                    <StatCard
                      label="Cash Collection"
                      value={fmt(totalSales - onlineSales)}
                      subtext="72.77% of total sales"
                      icon={<Banknote size={16} />}
                    />

                    <StatCard
                      label="Online Sales"
                      value={fmt(onlineSales)}
                      subtext="27.13% of sales generated"
                      icon={<Globe size={16} />}
                    />
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-dark">
                    Operational Metrics
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                      label="No. Of Orders"
                      value={numOrders}
                      subtext="Invoices generated"
                      icon={<Receipt size={16} />}
                    />

                    <StatCard
                      label="Expenses"
                      value="0.00"
                      subtext="Expenses recorded"
                      icon={<Wallet size={16} />}
                      isGrey
                    />

                    <StatCard
                      label="Taxes"
                      value={fmt(totalSales * 0.05)}
                      subtext="Taxes recorded"
                      icon={<ScrollText size={16} />}
                      isGrey
                    />

                    <StatCard
                      label="Discounts"
                      value="0.00"
                      subtext="0% of total sales"
                      icon={<Tag size={16} />}
                      isGrey
                    />
                  </div>
                </section>

                <OutletStatisticsWidget />
              </div>
            )}

            {/* SALES */}
            {activeTab === "sales" && (
              <div className="space-y-6">
                <OnlineOrdersWidget onlineSales={onlineSales} />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <OrderStatisticsWidget />
                  <ProductsWidget />
                </div>
              </div>
            )}

            {/* FINANCIALS */}
            {activeTab === "financials" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <ExpensesWidget />
                  <RevenueLeakageWidget />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <DiscountWidget />
                  <TaxesWidget />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
