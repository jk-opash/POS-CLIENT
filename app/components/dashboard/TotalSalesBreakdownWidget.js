import Card from "../ui/Card";
import { RefreshCcw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

export default function TotalSalesBreakdownWidget() {
  return (
    <Card
      title="Total Sales Breakdown"
      action={
        <div className="flex items-center gap-2">
          <select className="bg-slate-50 text-xs px-2 h-7 border border-slate-200 rounded-md text-slate-700 outline-none focus:ring-2 focus:ring-blue-100">
            <option>Today</option>
          </select>
          <button className="bg-slate-50 border border-slate-200 text-slate-500 rounded-md w-7 h-7 flex items-center justify-center hover:bg-slate-100 transition-colors">
            <RefreshCcw size={14} />
          </button>
        </div>
      }
    >
      <div className="text-center mb-6">
        <span className="text-sm text-slate-500 font-medium">Total: </span>
        <span className="text-xl text-slate-800 font-bold ml-1">₹ 45,890.50</span>
      </div>
      <div className="h-64 mt-4 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical" 
            data={[
              { label: "Cash", val: 18472.5, color: "#38bdf8" },
              { label: "Card", val: 12250.0, color: "#3b82f6" },
              { label: "Wallet", val: 2718.0, color: "#34d399" },
              { label: "Due", val: 0, color: "#e2e8f0" },
              { label: "Other", val: 0, color: "#e2e8f0" },
              { label: "Paid", val: 12450.0, color: "#fbbf24" },
              { label: "COD", val: 0, color: "#e2e8f0" },
            ]}
            margin={{ top: 0, right: 30, left: 30, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} 
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }}
              formatter={(value) => `₹ ${value.toLocaleString()}`}
            />
            <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={16}>
              {[
                { label: "Cash", val: 18472.5, color: "#38bdf8" },
                { label: "Card", val: 12250.0, color: "#3b82f6" },
                { label: "Wallet", val: 2718.0, color: "#34d399" },
                { label: "Due", val: 0, color: "#e2e8f0" },
                { label: "Other", val: 0, color: "#e2e8f0" },
                { label: "Paid", val: 12450.0, color: "#fbbf24" },
                { label: "COD", val: 0, color: "#e2e8f0" },
              ].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
