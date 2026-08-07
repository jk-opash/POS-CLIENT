import Card from "../ui/Card";
import { RefreshCcw } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function ExpensesWidget() {
  return (
    <Card
      title="Expenses"
      action={
        <button className="bg-slate-50 border border-slate-200 text-slate-500 rounded-md w-7 h-7 flex items-center justify-center hover:bg-slate-100 transition-colors">
          <RefreshCcw size={14} />
        </button>
      }
    >
      <div className="text-center mb-6">
        <span className="text-sm text-slate-500 font-medium">Total Expense: </span>
        <span className="text-xl text-slate-800 font-bold ml-1">₹ 2,450</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-32 h-32 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: "Gas", color: "#34d399", val: 800 },
                  { name: "Electricity", color: "#38bdf8", val: 450 },
                  { name: "Water", color: "#3b82f6", val: 200 },
                  { name: "Petty Cash", color: "#fbbf24", val: 1000 },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                dataKey="val"
                stroke="none"
              >
                {
                  [
                    { name: "Gas", color: "#34d399", val: 800 },
                    { name: "Electricity", color: "#38bdf8", val: 450 },
                    { name: "Water", color: "#3b82f6", val: 200 },
                    { name: "Petty Cash", color: "#fbbf24", val: 1000 },
                  ].map((entry, index) => (
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
          {[
            { label: "Gas", color: "bg-emerald-400", val: 800 },
            { label: "Electricity", color: "bg-sky-400", val: 450 },
            { label: "Water", color: "bg-blue-500", val: 200 },
            { label: "Petty Cash", color: "bg-amber-400", val: 1000 },
          ].map((e) => (
            <div key={e.label} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${e.color}`}></span>
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
