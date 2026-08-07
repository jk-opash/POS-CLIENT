import Card from "../ui/Card";
import { RefreshCcw } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, CartesianGrid, Cell } from 'recharts';

export default function DiscountWidget() {
  return (
    <Card
      title="Discount"
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
        <span className="text-sm text-slate-500 font-medium">Total Discount: </span>
        <span className="text-xl text-slate-800 font-bold ml-1">₹ 14,321.50</span>
      </div>
      <div className="h-64 pt-2 pb-2 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={[
              { name: "Mon", value: 35 },
              { name: "Tue", value: 60 },
              { name: "Wed", value: 45 },
              { name: "Thu", value: 20 },
              { name: "Fri", value: 80 },
              { name: "Sat", value: 100 },
              { name: "Sun", value: 30 }
            ]} 
            margin={{ top: 0, right: 0, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, dy: 10 }}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`₹ ${value}`, 'Discount']}
              labelStyle={{ fontWeight: 'bold', color: '#64748b', marginBottom: '4px' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
              {[35, 60, 45, 20, 80, 100, 30].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry > 50 ? '#fbbf24' : '#fef08a'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
