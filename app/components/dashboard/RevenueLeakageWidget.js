import Card, { CardHeader, CardTitle } from "../ui/Card";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardAnalytics } from "../../store/slices/analyticsSlice";

export default function RevenueLeakageWidget() {
  const [timeRange, setTimeRange] = useState("");
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.analytics);
  const cancelledOrders = stats?.cancelledOrders || 0;

  const handleFilterChange = (e) => {
    const range = e.target.value;
    setTimeRange(range);
    dispatch(fetchDashboardAnalytics({ timeRange: range }));
  };

  return (
    <Card padding="md">
      <CardHeader className="flex flex-row justify-between items-center mb-4">
        <CardTitle>Revenue Leakage</CardTitle>
        <div className="flex items-center gap-2">
          <select 
            value={timeRange}
            onChange={handleFilterChange}
            className="bg-brand-light text-xs px-2 h-7 border border-brand-light rounded-md text-brand-dark outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button 
            onClick={() => {
              setTimeRange("");
              dispatch(fetchDashboardAnalytics({}));
            }}
            className="bg-brand-light border border-brand-light text-brand-muted rounded-md w-7 h-7 flex items-center justify-center hover:bg-brand-light transition-colors"
          >
            <RefreshCcw size={14} />
          </button>
        </div>
      </CardHeader>
      <div className="grid grid-cols-3 gap-y-8 gap-x-6 py-2">
        {[
          { val: "0", label: "Bills Modified" },
          { val: "0", label: "Bills Re-Printed" },
          { val: "₹ 0", label: "Waived Off", color: "text-brand-danger" },
          { val: cancelledOrders.toString(), label: "KOTs Cancelled" },
          { val: "0", label: "Modified KOTs" },
          { val: "0", label: "Not Used In Bills" },
        ].map((item, i) => (
          <div key={i} className="border-l-2 border-brand-light pl-3">
            <div className={`text-[22px] font-bold tracking-tight mb-0.5 ${item.color || 'text-brand-dark'}`}>{item.val}</div>
            <div className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider leading-tight">{item.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
