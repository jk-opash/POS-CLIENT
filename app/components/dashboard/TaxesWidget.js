import Card, { CardHeader, CardTitle } from "../ui/Card";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardAnalytics } from "../../store/slices/analyticsSlice";

export default function TaxesWidget() {
  const [timeRange, setTimeRange] = useState("");
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.analytics);
  const taxes = stats?.taxes || 0;

  const chartData = stats?.chartData || [];

  const handleFilterChange = (e) => {
    const range = e.target.value;
    setTimeRange(range);
    dispatch(fetchDashboardAnalytics({ timeRange: range }));
  };

  return (
    <Card padding="md">
      <CardHeader className="flex flex-row justify-between items-center mb-4">
        <CardTitle>Taxes</CardTitle>
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
      <div className="text-center mb-6">
        <span className="text-sm text-slate-500 font-medium">
          Total Taxes:{" "}
        </span>
        <span className="text-xl text-slate-800 font-bold ml-1">
          ₹ {taxes.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </span>
      </div>
      <div className="h-64 pt-2 pb-2 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              dx={-10}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val =
                    payload.find((p) => p.dataKey === "tax")?.value || 0;
                  return (
                    <div className="rounded-xl border border-brand-border bg-white/90 backdrop-blur-md p-4 shadow-[var(--shadow-glass-hover)]">
                      <p className="mb-3 text-xs font-bold text-brand-muted uppercase tracking-wider">
                        {label}
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#8b5cf6]"></div>
                            <span className="text-sm font-semibold text-brand-dark">
                              Tax
                            </span>
                          </div>
                          <span className="font-bold text-[#8b5cf6]">
                            ₹
                            {val.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="tax"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTax)"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
