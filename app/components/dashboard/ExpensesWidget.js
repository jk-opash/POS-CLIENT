import Card, { CardHeader, CardTitle } from "../ui/Card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useSelector } from "react-redux";

export default function ExpensesWidget() {
  const { stats } = useSelector((state) => state.analytics);
  const totalExpenses = stats?.totalExpenses || 0;
  const rawCategories = stats?.expenseCategories || [];

  // Transform or fallback to defaults if empty
  const categories =
    rawCategories.length > 0
      ? rawCategories
      : [
          { label: "Gas", color: "bg-brand-success", val: 0 },
          { label: "Electricity", color: "bg-brand-info", val: 0 },
          { label: "Water", color: "bg-brand-primary", val: 0 },
          { label: "Petty Cash", color: "bg-brand-warning", val: 0 },
        ];

  const chartData = categories.map((cat, i) => ({
    name: cat.label,
    value: cat.val,
    color: ["#059669", "#14B8A6", "#2563EB", "#D97706"][i % 4],
  }));

  return (
    <Card padding="md">
      <CardHeader className="flex flex-row justify-between items-center mb-4">
        <CardTitle>Expenses</CardTitle>
      </CardHeader>
      <div className="text-center mb-6">
        <span className="text-sm text-brand-muted font-medium">
          Total Expenses:{" "}
        </span>
        <span className="text-xl text-brand-dark font-bold ml-1">
          ₹{" "}
          {totalExpenses.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-32 h-32 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                dataKey="value"
                stroke="none"
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontSize: 12,
                }}
                formatter={(value) => `₹ ${value}`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-brand-dark font-bold text-sm">100%</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          {categories.map((e, i) => (
            <div key={e.label} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${["bg-brand-success", "bg-brand-info", "bg-brand-primary", "bg-brand-warning"][i % 4]}`}
                ></span>
                <span className="text-xs text-brand-muted font-medium">
                  {e.label}
                </span>
              </div>
              <span className="text-xs text-brand-dark font-bold">
                ₹ {e.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
