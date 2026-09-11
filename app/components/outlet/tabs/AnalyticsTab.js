"use client";

import BranchRevenueChart from "../analytics/BranchRevenueChart";
import BranchPaymentMethods from "../analytics/BranchPaymentMethods";
import BranchTopDishes from "../analytics/BranchTopDishes";
import BranchExpensesChart from "../analytics/BranchExpensesChart";

export default function AnalyticsTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
      <BranchRevenueChart />
      <BranchPaymentMethods />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BranchTopDishes />
        <BranchExpensesChart />
      </div>
    </div>
  );
}
