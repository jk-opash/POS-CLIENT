import Card from "../ui/Card";
import { 
  Clock, 
  RefreshCcw, 
  TrendingUp, 
  ConciergeBell, 
  ShoppingBag,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OnlineOrdersWidget() {
  // Generate mock data for the chart (30 days)
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const day = i + 4;
    const baseVal = 25000 + Math.random() * 25000; 
    return {
      date: `${day > 30 ? day - 30 : day}${day === 1 || day === 31 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'}`,
      val1: baseVal * 0.2, // Purple (Delivery/Other)
      val2: baseVal * 0.4, // Light blue (Take away)
      val3: baseVal * 0.4, // Yellow (Dine in)
      total: baseVal
    };
  });

  return (
    <Card padding="p-0" className="bg-white rounded-xl shadow-sm border border-slate-200">
      
      {/* Top Header Section */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <Clock size={16} />
          <span>Order synced 4 Hours ago & POS synced 3 Hours ago.</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <select className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-md px-4 py-2 pr-10 outline-none hover:bg-slate-50 cursor-pointer">
              <option>4th Sep to 3rd Oct</option>
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>Custom Range</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50 transition-colors">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-3 gap-6 p-6">
        
        {/* Total Sales */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative group hover:border-blue-100 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="text-slate-500 font-bold text-sm">Total Sales</div>
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">₹ 1,193,551</div>
          <div className="text-slate-500 font-medium text-sm">5,856 Orders</div>
          <button className="absolute bottom-5 right-5 text-slate-400 hover:text-slate-600">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Dine in */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative group hover:border-amber-100 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="text-slate-500 font-bold text-sm">Dine in</div>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <ConciergeBell size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">₹ 559,155</div>
          <div className="text-slate-500 font-medium text-sm">2,665 Orders</div>
          <button className="absolute bottom-5 right-5 text-slate-400 hover:text-slate-600">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Take Away */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative group hover:border-blue-100 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="text-slate-500 font-bold text-sm">Take Away</div>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">₹ 511,935</div>
          <div className="text-slate-500 font-medium text-sm">2,735 Orders</div>
          <button className="absolute bottom-5 right-5 text-slate-400 hover:text-slate-600">
            <MoreVertical size={20} />
          </button>
        </div>

      </div>

      {/* Stacked Bar Chart with Recharts */}
      <div className="px-6 pb-6 mt-4">
        <div className="h-64 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 0, left: -10, bottom: 20 }}
              barSize={12}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, dy: 10, angle: -45, textAnchor: 'end' }} 
                interval={0}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickFormatter={(value) => value === 0 ? '₹ 0' : `₹ ${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`₹ ${Math.round(value).toLocaleString()}`, undefined]}
                labelStyle={{ fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}
              />
              <Bar dataKey="val1" stackId="a" fill="#818cf8" name="Delivery" />
              <Bar dataKey="val2" stackId="a" fill="#38bdf8" name="Take Away" />
              <Bar dataKey="val3" stackId="a" fill="#fbbf24" name="Dine in" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </Card>
  );
}
