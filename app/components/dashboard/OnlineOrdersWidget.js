import Card, { CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { 
  Clock, 
  RefreshCcw, 
  TrendingUp, 
  ConciergeBell, 
  ShoppingBag,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from "../ui/StatCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardAnalytics } from "../../store/slices/analyticsSlice";

export default function OnlineOrdersWidget() {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.analytics);
  const chartData = stats?.chartData || [];

  const handleFilterChange = (e) => {
    const timeRange = e.target.value;
    dispatch(fetchDashboardAnalytics({ timeRange }));
  };

  const totalSales = stats?.totalSales || 0;
  const onlineSales = stats?.onlineSales || 0;
  const offlineSales = totalSales - onlineSales;
  const numOrders = stats?.numOrders || 0;

  return (
    <Card padding="none" className="overflow-hidden flex flex-col">
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center px-6 py-5 border-b border-brand-border/60 bg-white/40">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-brand-dark">Revenue Over Time</h3>
          <div className="flex items-center gap-2 text-brand-muted text-xs font-medium">
            <Clock size={14} />
            <span>Order synced 4 Hours ago & POS synced 3 Hours ago.</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <div className="relative group">
            <select 
              onChange={handleFilterChange}
              className="appearance-none bg-white border border-brand-border text-brand-dark text-sm font-semibold rounded-lg px-4 py-2 pr-10 outline-none hover:bg-brand-light cursor-pointer shadow-sm transition-colors"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-2.5 text-brand-muted pointer-events-none" />
          </div>
          <button 
            onClick={() => dispatch(fetchDashboardAnalytics({}))}
            className="p-2 bg-white border border-brand-border rounded-lg text-brand-muted hover:bg-brand-light hover:text-brand-dark transition-colors shadow-sm"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <StatCard
          label="Total Sales"
          value={`₹ ${totalSales.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
          subtext={`${numOrders} Orders`}
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          label="Dine in"
          value={`₹ ${offlineSales.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
          subtext={`Offline Orders`}
          icon={<ConciergeBell size={16} />}
        />
        <StatCard
          label="Take Away / Online"
          value={`₹ ${onlineSales.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
          subtext={`Online Orders`}
          icon={<ShoppingBag size={16} />}
        />
      </div>

      {/* Chart Section */}
      <div className="px-6 pb-6 pt-2 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDineIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTakeAway" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              dx={-10}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dineIn = payload.find(p => p.dataKey === 'val3')?.value || 0;
                  const takeAway = payload.find(p => p.dataKey === 'val2')?.value || 0;
                  return (
                    <div className="rounded-xl border border-brand-border bg-white/90 backdrop-blur-md p-4 shadow-[var(--shadow-glass-hover)]">
                      <p className="mb-3 text-xs font-bold text-brand-muted uppercase tracking-wider">{label}</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-warning"></div>
                            <span className="text-sm font-semibold text-brand-dark">Dine in</span>
                          </div>
                          <span className="font-bold text-brand-warning">
                            ₹{dineIn.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                            <span className="text-sm font-semibold text-brand-dark">Take Away</span>
                          </div>
                          <span className="font-bold text-brand-primary">
                            ₹{takeAway.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="val3" 
              stackId="1"
              stroke="#f59e0b" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorDineIn)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area 
              type="monotone" 
              dataKey="val2" 
              stackId="1"
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTakeAway)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
