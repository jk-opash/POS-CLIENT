import Card, { CardHeader, CardTitle } from "../ui/Card";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardAnalytics } from "../../store/slices/analyticsSlice";

export default function ExpensesWidget() {
  const [timeRange, setTimeRange] = useState("");
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.analytics);
  const totalExpenses = stats?.totalExpenses || 0;
  const rawCategories = stats?.expenseCategories || [];
  
  // Transform or fallback to defaults if empty
  const categories = rawCategories.length > 0 ? rawCategories : [
    { label: "Gas", color: "bg-emerald-400", val: 0 },
    { label: "Electricity", color: "bg-sky-400", val: 0 },
    { label: "Water", color: "bg-blue-500", val: 0 },
    { label: "Petty Cash", color: "bg-amber-400", val: 0 },
  ];

  const chartData = categories.map((cat, i) => ({
    name: cat.label,
    value: cat.val,
    color: ['#34d399', '#38bdf8', '#3b82f6', '#fbbf24'][i % 4]
  }));

  return (
    <Card padding="md">
      <CardHeader className="flex flex-row justify-between items-center mb-4">
        <CardTitle>Expenses</CardTitle>
        <div className="flex items-center gap-2">
          <select 
            value={timeRange}
            onChange={(e) => {
              const range = e.target.value;
              setTimeRange(range);
              dispatch(fetchDashboardAnalytics({ timeRange: range }));
            }}
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
        <span className="text-sm text-slate-500 font-medium">Total Expenses: </span>
        <span className="text-xl text-slate-800 font-bold ml-1">₹ {totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
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
                {
                  chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))
                }
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }}
                formatter={(value) => `₹ ${value}`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-slate-800 font-bold text-sm">100%</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 flex-1">
          {categories.map((e, i) => (
            <div key={e.label} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${['bg-emerald-400', 'bg-sky-400', 'bg-blue-500', 'bg-amber-400'][i % 4]}`}></span>
                <span className="text-xs text-slate-500 font-medium">{e.label}</span>
              </div>
              <span className="text-xs text-slate-800 font-bold">₹ {e.val}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-right mt-4">
        <a href="#" className="text-blue-600 text-xs font-bold hover:underline">View All &rarr;</a>
      </div>
    </Card>
  );
}
