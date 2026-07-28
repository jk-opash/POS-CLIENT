"use client";

import { useState } from "react";
import { useOrders } from "./components/Providers";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCard from "./components/ui/StatCard";
import SupplierHubWidget from "./components/dashboard/SupplierHubWidget";
import MarketplaceWidget from "./components/dashboard/MarketplaceWidget";
import ProductsWidget from "./components/dashboard/ProductsWidget";
import SupportWidget from "./components/dashboard/SupportWidget";
import ExpensesWidget from "./components/dashboard/ExpensesWidget";
import OrderStatisticsWidget from "./components/dashboard/OrderStatisticsWidget";
import RevenueLeakageWidget from "./components/dashboard/RevenueLeakageWidget";
import ContactAMWidget from "./components/dashboard/ContactAMWidget";
import DiscountWidget from "./components/dashboard/DiscountWidget";
import TotalSalesBreakdownWidget from "./components/dashboard/TotalSalesBreakdownWidget";
import TaxesWidget from "./components/dashboard/TaxesWidget";
import OutletStatisticsWidget from "./components/dashboard/OutletStatisticsWidget";
import OnlineOrdersWidget from "./components/dashboard/OnlineOrdersWidget";
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

function fmt(n) {
  return Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { orders } = useOrders();

  const totalSales = orders.reduce((acc, o) => acc + (o.total || 0), 0) || 45890.50;
  const netSales = totalSales * 0.85 || 38920.00;
  const numOrders = orders.length || 142;
  const onlineSales = orders.filter((o) => o.type === "delivery").reduce((acc, o) => acc + (o.total || 0), 0) || 12450.00;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={() => setCollapsed((c) => !c)} />
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
            <h1 className="text-[20px] md:text-[22px] font-black text-slate-800 m-0 tracking-tight">
              Outlets Statistics
            </h1>
            <div className="flex flex-wrap gap-2 md:gap-3 items-center">
              <button className="px-3 md:px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                📤 Export
              </button>
              <button className="px-3 md:px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                ⊞ Zone
              </button>
              <select className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-100">
                <option>Today</option>
                <option>Yesterday</option>
                <option>This Week</option>
              </select>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col gap-6 md:gap-8">
            {/* KPIs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                label="No. Of Orders"
                value={numOrders}
                subtext="No. of Invoices generated"
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
              <StatCard
                label="Taxes"
                value={fmt(totalSales * 0.05)}
                subtext="Taxes recorded on POS"
                icon={<ScrollText size={16} />}
                isGrey
              />
              <StatCard
                label="Discounts"
                value="0.00"
                subtext="0% of My Amount"
                icon={<Tag size={16} />}
                isGrey
              />
            </div>

            <OutletStatisticsWidget />

            <OnlineOrdersWidget onlineSales={onlineSales} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <ExpensesWidget />
              <OrderStatisticsWidget />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <RevenueLeakageWidget />
              <ProductsWidget />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <DiscountWidget />
              <TotalSalesBreakdownWidget />
              <TaxesWidget />
            </div>
          </div>

          <div className="mt-8 pb-12"></div>
        </main>
      </div>
    </div>
  );
}
