import Card, { CardHeader, CardTitle } from "../../ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useSelector } from "react-redux";
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f97316", // Orange
  "#eab308", // Yellow
  "#10b981", // Emerald
  "#06b6d4", // Cyan
];

export default function BranchExpensesChart() {
  const { stats } = useSelector((state) => state.analytics);
  const totalExpenses = stats?.totalExpenses || 0;
  const rawCategories = stats?.expenseCategories || [];

  // Transform or fallback to defaults if empty
  let categories =
    rawCategories.length > 0
      ? rawCategories
      : [
          { label: "Gas", val: 0 },
          { label: "Electricity", val: 0 },
          { label: "Water", val: 0 },
          { label: "Petty Cash", val: 0 },
        ];

  // Sort by value descending
  categories = [...categories].sort((a, b) => b.val - a.val);

  const chartData = categories.map((cat, i) => ({
    name: cat.label,
    value: cat.val,
    color: COLORS[i % COLORS.length],
  }));

  const formatCurrency = (val) =>
    val.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <Card padding="md" className="h-full flex flex-col">
      <CardHeader className="flex flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-primaryLight/50 rounded-xl">
            <PieChartIcon className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <CardTitle>Expenses Breakdown</CardTitle>
            <p className="text-[13px] text-brand-muted mt-0.5 font-medium">
              Cost distribution across categories
            </p>
          </div>
        </div>
      </CardHeader>

      <div className="flex flex-col items-center gap-8 flex-1 pb-4 px-2">
        {/* Chart Side */}
        <div className="relative w-48 h-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                dataKey="value"
                stroke="none"
                paddingAngle={4}
                cornerRadius={6}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow:
                    "0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  fontSize: "13px",
                  fontWeight: "600",
                  padding: "8px 12px",
                }}
                itemStyle={{ color: "#1E293B", paddingBottom: "2px" }}
                formatter={(value) => `₹ ${formatCurrency(value)}`}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
              Total
            </span>
            <span className="text-lg font-extrabold text-brand-dark mt-0.5">
              ₹{formatCurrency(totalExpenses)}
            </span>
          </div>
        </div>

        {/* List Side */}
        <div className="flex-1 w-full space-y-4 max-h-[220px] overflow-y-auto pr-3">
          {chartData.length === 0 || totalExpenses === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-brand-muted font-medium">
              No expenses recorded
            </div>
          ) : (
            chartData.map((e) => {
              const percent =
                totalExpenses > 0 ? (e.value / totalExpenses) * 100 : 0;
              return (
                <div key={e.name} className="flex flex-col gap-2 group">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-brand-dark flex items-center gap-2.5">
                      {e.name}
                    </span>
                    <span className="font-bold text-brand-dark">
                      ₹ {formatCurrency(e.value)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-brand-light h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: e.color,
                        }}
                      ></div>
                    </div>
                    <span className="text-[11px] font-bold text-brand-muted w-9 text-right">
                      {percent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}
