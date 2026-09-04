"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardAnalytics } from "../../store/slices/analyticsSlice";
import LottieLoader from "../../components/common/LottieLoader";

import StatCard from "../../components/ui/StatCard";

import ExpensesWidget from "../../components/dashboard/ExpensesWidget";
import OrderStatisticsWidget from "../../components/dashboard/OrderStatisticsWidget";
import PaymentStatisticsWidget from "../../components/dashboard/PaymentStatisticsWidget";
import DiscountWidget from "../../components/dashboard/DiscountWidget";
import TaxesWidget from "../../components/dashboard/TaxesWidget";
import OutletStatisticsWidget from "../../components/dashboard/OutletStatisticsWidget";
import OnlineOrdersWidget from "../../components/dashboard/OnlineOrdersWidget";
import ProductsWidget from "../../components/dashboard/ProductsWidget";

import { cn } from "../../lib/utils";

import {
  TrendingUp,
  BarChart3,
  Receipt,
  Wallet,
  Banknote,
  Globe,
  ScrollText,
  Tag,
  ChevronDown,
  RefreshCcw,
} from "lucide-react";

function fmt(value) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("today");

  const { stats, loading, error } = useSelector((state) => state.analytics);

  const handleFilterChange = (e) => {
    const newRange = e.target.value;
    setTimeRange(newRange);
    dispatch(fetchDashboardAnalytics({ timeRange: newRange }));
  };

  useEffect(() => {
    dispatch(fetchDashboardAnalytics({ timeRange: "today" }));
  }, [dispatch]);

  if (loading) {
    return <LottieLoader fullScreen text="Loading Dashboard..." />;
  }

  const totalSales = stats?.totalSales || 0;
  const netSales = stats?.netSales || 0;
  const onlineSales = stats?.onlineSales || 0;
  const numOrders = stats?.numOrders || 0;
  const cashCollection = stats?.cashCollection || 0;
  const expenses = stats?.totalExpenses || 0;
  const taxes = stats?.taxes || 0;
  const discounts = stats?.discounts || 0;

  return (
    <div className="flex flex-col bg-brand-bg">
      <div className="flex flex-1 min-w-0 flex-col">
        <main className="flex-1 px-6 py-6">
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
              <div className="flex items-center gap-3 mt-4 lg:mt-0">
                <div className="relative group">
                  <select
                    value={timeRange}
                    onChange={handleFilterChange}
                    className="appearance-none bg-white border border-brand-border text-brand-dark text-sm font-semibold rounded-lg px-4 py-2 pr-10 outline-none hover:bg-brand-light cursor-pointer shadow-sm transition-colors"
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-2.5 text-brand-muted pointer-events-none"
                  />
                </div>
                <button
                  onClick={() =>
                    dispatch(fetchDashboardAnalytics({ timeRange }))
                  }
                  className="p-2 bg-white border border-brand-border rounded-lg text-brand-muted hover:bg-brand-light hover:text-brand-dark transition-colors shadow-sm"
                >
                  <RefreshCcw size={16} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="rounded-t-2xl border-b border-brand-border bg-white/60 px-2 backdrop-blur">
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
                        ? "border-brand-primary text-brand-primary"
                        : "border-transparent text-brand-muted hover:border-brand-borderHover hover:text-brand-dark",
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
                      value={fmt(cashCollection)}
                      subtext="Cash payments received"
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
                      value={fmt(expenses)}
                      subtext="Expenses recorded"
                      icon={<Wallet size={16} />}
                      isGrey
                    />

                    <StatCard
                      label="Taxes"
                      value={fmt(taxes)}
                      subtext="Taxes recorded"
                      icon={<ScrollText size={16} />}
                      isGrey
                    />

                    <StatCard
                      label="Discounts"
                      value={fmt(discounts)}
                      subtext="Discounts given"
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
                <PaymentStatisticsWidget />
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
                  <TaxesWidget />
                  <DiscountWidget />
                  <ExpensesWidget />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
