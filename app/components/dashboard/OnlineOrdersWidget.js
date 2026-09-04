import Card from "../ui/Card";
import { Clock, TrendingUp, ConciergeBell, ShoppingBag } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../ui/StatCard";
import { useSelector } from "react-redux";

export default function OnlineOrdersWidget() {
  const { stats } = useSelector((state) => state.analytics);
  const chartData = stats?.chartData || [];

  const totalSales = stats?.totalSales || 0;
  const onlineSales = stats?.onlineSales || 0;
  const offlineSales = totalSales - onlineSales;
  const numOrders = stats?.numOrders || 0;

  return (
    <Card padding="none" className="overflow-hidden flex flex-col">
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-6 py-5 border-b border-brand-border/60 bg-white/40">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-brand-dark">
            Revenue Over Time
          </h3>
          <div className="flex items-center gap-2 text-brand-muted text-xs font-medium">
            <Clock size={14} />
            <span>Order synced 4 Hours ago & POS synced 3 Hours ago.</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <StatCard
          label="Total Sales"
          value={`₹ ${totalSales.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
          subtext={`${numOrders} Orders`}
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          label="Dine in"
          value={`₹ ${offlineSales.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
          subtext={`Offline Orders`}
          icon={<ConciergeBell size={16} />}
        />
        <StatCard
          label="Take Away / Online"
          value={`₹ ${onlineSales.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
          subtext={`Online Orders`}
          icon={<ShoppingBag size={16} />}
        />
      </div>

      {/* Chart Section */}
      <div className="px-6 pb-6 pt-2 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorDineIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D97706" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTakeAway" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4B5563", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4B5563", fontSize: 12, fontWeight: 500 }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              dx={-10}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dineIn =
                    payload.find((p) => p.dataKey === "val3")?.value || 0;
                  const takeAway =
                    payload.find((p) => p.dataKey === "val2")?.value || 0;
                  return (
                    <div className="rounded-xl border border-brand-border bg-white/90 backdrop-blur-md p-4 shadow-[var(--shadow-glass-hover)]">
                      <p className="mb-3 text-xs font-bold text-brand-muted uppercase tracking-wider">
                        {label}
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-warning"></div>
                            <span className="text-sm font-semibold text-brand-dark">
                              Dine in
                            </span>
                          </div>
                          <span className="font-bold text-brand-warning">
                            ₹
                            {dineIn.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                            <span className="text-sm font-semibold text-brand-dark">
                              Take Away
                            </span>
                          </div>
                          <span className="font-bold text-brand-primary">
                            ₹
                            {takeAway.toLocaleString(undefined, {
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
              dataKey="val3"
              stroke="#D97706"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorDineIn)"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="val2"
              stroke="#2563EB"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTakeAway)"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
