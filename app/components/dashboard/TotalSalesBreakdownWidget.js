import Card, { CardHeader, CardTitle } from "../ui/Card";
import { RefreshCcw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

export default function TotalSalesBreakdownWidget() {
  const data = [
    { label: "Cash", val: 18472.5, color: "#14B8A6" },
    { label: "Card", val: 12250.0, color: "#2563EB" },
    { label: "Wallet", val: 2718.0, color: "#059669" },
    { label: "Due", val: 0, color: "#E2E8F0" },
    { label: "Other", val: 0, color: "#E2E8F0" },
    { label: "Paid", val: 12450.0, color: "#D97706" },
    { label: "COD", val: 0, color: "#E2E8F0" },
  ];

  return (
    <Card padding="md" className="flex flex-col">
      <CardHeader className="flex flex-row justify-between items-center mb-6">
        <CardTitle>Total Sales Breakdown</CardTitle>
        <div className="flex items-center gap-2">
          <select className="bg-white text-xs px-3 h-8 border border-brand-border rounded-lg text-brand-dark font-medium outline-none focus:ring-2 focus:ring-brand-primary/20 shadow-sm">
            <option>Today</option>
            <option>Yesterday</option>
            <option>This Week</option>
          </select>
          <button className="bg-white border border-brand-border text-brand-muted rounded-lg w-8 h-8 flex items-center justify-center hover:bg-brand-light hover:text-brand-dark transition-colors shadow-sm">
            <RefreshCcw size={14} />
          </button>
        </div>
      </CardHeader>
      
      <div className="text-center mb-4">
        <span className="text-sm text-brand-muted font-semibold uppercase tracking-wider">Total: </span>
        <span className="text-2xl text-brand-dark font-black ml-1">₹ 45,890.50</span>
      </div>
      
      <div className="h-64 mt-2 -ml-4 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical" 
            data={data}
            margin={{ top: 0, right: 30, left: 30, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 600 }} 
            />
            <Tooltip 
              cursor={{ fill: '#F8F9FA' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-brand-border bg-white/90 backdrop-blur-md p-3 shadow-[var(--shadow-glass-hover)]">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].payload.color }}></div>
                        <span className="text-sm font-semibold text-brand-dark">{label}</span>
                        <span className="font-bold ml-2" style={{ color: payload[0].payload.color }}>
                          ₹{payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="val" radius={[0, 6, 6, 0]} barSize={14}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
