import Card from "../ui/Card";
import { Clock, Banknote, Smartphone, CreditCard } from "lucide-react";
import StatCard from "../ui/StatCard";
import { useSelector } from "react-redux";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PaymentStatisticsWidget() {
  const { stats } = useSelector((state) => state.analytics);
  const chartData = stats?.chartData || [];

  const cashCollection = stats?.cashCollection || 0;
  const upiCollection = stats?.upiCollection || 0;
  const cardCollection = stats?.cardCollection || 0;

  const formatCurrency = (val) =>
    `₹ ${val.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  return (
    <Card padding="none" className="overflow-hidden flex flex-col h-full mt-6">
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-6 py-5 border-b border-brand-border/60 bg-white/40">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-brand-dark">
            Payment Methods Trends
          </h3>
          <div className="flex items-center gap-2 text-brand-muted text-xs font-medium">
            <Clock size={14} />
            <span>Revenue collection broken down by payment type.</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 pb-2">
        <StatCard
          label="Cash Collected"
          value={formatCurrency(cashCollection)}
          subtext="Cash Payments"
          icon={<Banknote size={16} color="#10b981" />}
        />
        <StatCard
          label="UPI Collected"
          value={formatCurrency(upiCollection)}
          subtext="UPI / Online Transfers"
          icon={<Smartphone size={16} color="#6b21a8" />}
        />
        <StatCard
          label="Card Collected"
          value={formatCurrency(cardCollection)}
          subtext="Credit / Debit Cards"
          icon={<CreditCard size={16} color="#0284c7" />}
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
              <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUpi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b21a8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6b21a8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCard" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
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
                  const cash =
                    payload.find((p) => p.dataKey === "cash")?.value || 0;
                  const upi =
                    payload.find((p) => p.dataKey === "upi")?.value || 0;
                  const card =
                    payload.find((p) => p.dataKey === "card")?.value || 0;
                  return (
                    <div className="rounded-xl border border-brand-border bg-white/90 backdrop-blur-md p-4 shadow-[var(--shadow-glass-hover)]">
                      <p className="mb-3 text-xs font-bold text-brand-muted uppercase tracking-wider">
                        {label}
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-success"></div>
                            <span className="text-sm font-semibold text-brand-dark">
                              Cash
                            </span>
                          </div>
                          <span className="font-bold text-brand-success">
                            ₹
                            {cash.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#6b21a8]"></div>
                            <span className="text-sm font-semibold text-brand-dark">
                              UPI
                            </span>
                          </div>
                          <span className="font-bold text-[#6b21a8]">
                            ₹
                            {upi.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#0284c7]"></div>
                            <span className="text-sm font-semibold text-brand-dark">
                              Card
                            </span>
                          </div>
                          <span className="font-bold text-[#0284c7]">
                            ₹
                            {card.toLocaleString(undefined, {
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
              dataKey="cash"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCash)"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="upi"
              stroke="#6b21a8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorUpi)"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="card"
              stroke="#0284c7"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCard)"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
