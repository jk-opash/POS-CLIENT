import Card from "../ui/Card";
import { RefreshCcw } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function TaxesWidget() {
  return (
    <Card
      title="Taxes"
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
        <span className="text-sm text-slate-500 font-medium">Taxes: </span>
        <span className="text-xl text-slate-800 font-bold ml-1">₹ 2,294.52</span>
      </div>
      <div className="h-64 mt-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { name: "GST", value: 1850.50, color: "#fbbf24" },
                { name: "Home Tax", value: 444.02, color: "#38bdf8" },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              dataKey="value"
              stroke="none"
              paddingAngle={5}
            >
              {
                [
                  { name: "GST", value: 1850.50, color: "#fbbf24" },
                  { name: "Home Tax", value: 444.02, color: "#38bdf8" },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))
              }
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }}
              formatter={(value) => `₹ ${value.toLocaleString()}`}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Custom Legend */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="text-xs text-slate-500 font-bold">GST</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-400"></span>
            <span className="text-xs text-slate-500 font-bold">Home Tax</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
