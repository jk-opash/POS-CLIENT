import Card, { CardHeader, CardTitle } from "../ui/Card";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardAnalytics } from "../../store/slices/analyticsSlice";

export default function ProductsWidget() {
  const [timeRange, setTimeRange] = useState("");
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.analytics);

  const topProducts = stats?.topProducts || [];

  const handleFilterChange = (e) => {
    const range = e.target.value;
    setTimeRange(range);
    dispatch(fetchDashboardAnalytics({ timeRange: range }));
  };

  return (
    <Card padding="md">
      <CardHeader className="flex flex-row justify-between items-center mb-4">
        <CardTitle>Top Selling Dishes</CardTitle>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={handleFilterChange}
            className="bg-slate-50 text-xs px-2 h-7 border border-slate-200 rounded-md text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
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
            className="bg-slate-50 border border-slate-200 text-slate-500 rounded-md w-7 h-7 flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <RefreshCcw size={14} />
          </button>
        </div>
      </CardHeader>

      <div className="flex flex-col mt-2">
        {topProducts.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-400">
            No data available
          </div>
        )}

        {topProducts.map((item, i) => (
          <div
            key={i}
            className={`flex justify-between items-center py-4 ${i < topProducts.length - 1 ? "border-b border-slate-100" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-slate-800 font-bold text-sm">
                #{i + 1}
              </div>
              <div className="flex flex-col">
                <span className="text-slate-800 text-sm font-bold">
                  {item.name}
                </span>
                <span className="text-slate-400 text-xs font-medium mt-0.5">
                  ₹{item.price}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-slate-800 text-sm font-bold">
                {item.count || 0} Orders
              </span>
              <span className="text-emerald-500 text-xs font-bold mt-0.5">
                {item.trend || "+0%"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
