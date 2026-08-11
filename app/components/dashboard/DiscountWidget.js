import Card, { CardHeader, CardTitle } from "../ui/Card";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, CartesianGrid, Cell } from 'recharts';
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardAnalytics } from "../../store/slices/analyticsSlice";

export default function DiscountWidget() {
  const [timeRange, setTimeRange] = useState("");
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.analytics);
  const discounts = stats?.discounts || 0;
  
  const discountByDay = stats?.discountByDay || [
    { name: "Mon", value: 0 },
    { name: "Tue", value: 0 },
    { name: "Wed", value: 0 },
    { name: "Thu", value: 0 },
    { name: "Fri", value: 0 },
    { name: "Sat", value: 0 },
    { name: "Sun", value: 0 }
  ];

  const handleFilterChange = (e) => {
    const range = e.target.value;
    setTimeRange(range);
    dispatch(fetchDashboardAnalytics({ timeRange: range }));
  };

  return (
    <Card padding="md">
      <CardHeader className="flex flex-row justify-between items-center mb-4">
        <CardTitle>Discount</CardTitle>
        <div className="flex items-center gap-2">
          <select 
            value={timeRange}
            onChange={handleFilterChange}
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
        <span className="text-sm text-slate-500 font-medium">Total Discount: </span>
        <span className="text-xl text-slate-800 font-bold ml-1">₹ {discounts.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
      </div>
      <div className="h-64 pt-2 pb-2 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={discountByDay} 
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
              {discountByDay.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value > 50 ? '#fbbf24' : '#fef08a'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
