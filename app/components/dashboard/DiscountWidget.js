import Card, { CardHeader, CardTitle } from "../ui/Card";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useSelector } from "react-redux";

export default function DiscountWidget() {
  const { stats } = useSelector((state) => state.analytics);
  const discounts = stats?.discounts || 0;

  const chartData = stats?.chartData || [];

  return (
    <Card padding="md">
      <CardHeader className="flex flex-row justify-between items-center mb-4">
        <CardTitle>Discount</CardTitle>
      </CardHeader>
      <div className="text-center mb-6">
        <span className="text-sm text-brand-muted font-medium">
          Total Discount:{" "}
        </span>
        <span className="text-xl text-brand-dark font-bold ml-1">
          ₹ {discounts.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </span>
      </div>
      <div className="h-64 pt-2 pb-2 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorDiscount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D97706" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
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
                  const val =
                    payload.find((p) => p.dataKey === "discount")?.value || 0;
                  return (
                    <div className="rounded-xl border border-brand-border bg-white/90 backdrop-blur-md p-4 shadow-[var(--shadow-glass-hover)]">
                      <p className="mb-3 text-xs font-bold text-brand-muted uppercase tracking-wider">
                        {label}
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#D97706]"></div>
                            <span className="text-sm font-semibold text-brand-dark">
                              Discount
                            </span>
                          </div>
                          <span className="font-bold text-[#D97706]">
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
              dataKey="discount"
              stroke="#D97706"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorDiscount)"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
