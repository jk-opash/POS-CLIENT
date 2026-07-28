"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { 
  Filter, 
  Download, 
  Save, 
  Calendar, 
  Columns, 
  ChevronDown, 
  CheckSquare, 
  Square,
  Search,
  MoreVertical,
  BarChart2,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  RefreshCcw
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_DATA = [
  { id: "ORD-9281", date: "28 Jul, 14:32", outlet: "Indiranagar (Main)", phone: "9876543210", mode: "UPI", subtotal: 850.00, discount: 50.00, tax: 42.50, total: 842.50, status: "Success" },
  { id: "ORD-9282", date: "28 Jul, 14:45", outlet: "Koramangala", phone: "8765432109", mode: "Credit Card", subtotal: 1240.00, discount: 0.00, tax: 62.00, total: 1302.00, status: "Success" },
  { id: "ORD-9283", date: "28 Jul, 15:02", outlet: "Indiranagar (Main)", phone: "7654321098", mode: "Cash", subtotal: 420.00, discount: 0.00, tax: 21.00, total: 441.00, status: "Success" },
  { id: "ORD-9284", date: "28 Jul, 15:15", outlet: "Ghaziabad Demo", phone: "6543210987", mode: "Zomato", subtotal: 1550.00, discount: 150.00, tax: 77.50, total: 1477.50, status: "Success" },
  { id: "ORD-9285", date: "28 Jul, 15:30", outlet: "Koramangala", phone: "5432109876", mode: "Swiggy", subtotal: 890.00, discount: 0.00, tax: 44.50, total: 934.50, status: "Success" },
  { id: "ORD-9286", date: "28 Jul, 16:05", outlet: "Indiranagar (Main)", phone: "4321098765", mode: "UPI", subtotal: 2100.00, discount: 200.00, tax: 105.00, total: 2005.00, status: "Success" },
  { id: "ORD-9287", date: "28 Jul, 16:22", outlet: "Ghaziabad Demo", phone: "3210987654", mode: "Cash", subtotal: 350.00, discount: 0.00, tax: 17.50, total: 367.50, status: "Success" },
  { id: "ORD-9288", date: "28 Jul, 16:45", outlet: "Koramangala", phone: "2109876543", mode: "Debit Card", subtotal: 670.00, discount: 50.00, tax: 33.50, total: 653.50, status: "Success" },
  { id: "ORD-9289", date: "28 Jul, 17:10", outlet: "Indiranagar (Main)", phone: "1098765432", mode: "UPI", subtotal: 1120.00, discount: 0.00, tax: 56.00, total: 1176.00, status: "Refunded" },
  { id: "ORD-9290", date: "28 Jul, 17:25", outlet: "Koramangala", phone: "9876543211", mode: "Zomato", subtotal: 2450.00, discount: 250.00, tax: 122.50, total: 2322.50, status: "Success" },
  { id: "ORD-9291", date: "28 Jul, 17:40", outlet: "Ghaziabad Demo", phone: "8765432110", mode: "Swiggy", subtotal: 780.00, discount: 0.00, tax: 39.00, total: 819.00, status: "Success" },
  { id: "ORD-9292", date: "28 Jul, 18:05", outlet: "Indiranagar (Main)", phone: "7654321109", mode: "Credit Card", subtotal: 3200.00, discount: 500.00, tax: 160.00, total: 2860.00, status: "Success" },
  { id: "ORD-9293", date: "28 Jul, 18:15", outlet: "Koramangala", phone: "6543211098", mode: "Cash", subtotal: 150.00, discount: 0.00, tax: 7.50, total: 157.50, status: "Success" },
  { id: "ORD-9294", date: "28 Jul, 18:35", outlet: "Indiranagar (Main)", phone: "5432110987", mode: "UPI", subtotal: 940.00, discount: 0.00, tax: 47.00, total: 987.00, status: "Cancelled" },
  { id: "ORD-9295", date: "28 Jul, 18:50", outlet: "Ghaziabad Demo", phone: "4321109876", mode: "UPI", subtotal: 1250.00, discount: 100.00, tax: 62.50, total: 1212.50, status: "Success" },
];

const COLUMNS = [
  "Order ID", "Date & Time", "Outlet", "Customer Phone", "Payment Mode", "Subtotal", "Discount", "Tax", "Grand Total", "Status"
];

function fmt(n) {
  return Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

export default function DynamicReportsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("data"); // 'data' or 'visual'
  
  // Calculate Summaries
  const totalOrders = MOCK_DATA.length;
  const totalRevenue = MOCK_DATA.reduce((acc, row) => acc + (row.status === "Success" ? row.total : 0), 0);
  const totalDiscount = MOCK_DATA.reduce((acc, row) => acc + row.discount, 0);
  const avgOrderValue = totalRevenue / MOCK_DATA.filter(r => r.status === "Success").length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={() => setCollapsed((c) => !c)} />
        
        <main className="flex-1 flex overflow-hidden">
          
          {/* LEFT SIDEBAR: Configuration Panel */}
          <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col overflow-hidden shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Filter size={18} className="text-blue-500" />
                Report Builder
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Configure your custom report parameters.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
              
              {/* Data Source */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Data Source</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                    <option>Sales & Invoices</option>
                    <option>Inventory & Stock</option>
                    <option>Staff Attendance</option>
                    <option>CRM & Loyalty</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Date Range</label>
                <div className="relative mb-3">
                  <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                    <option>Today</option>
                    <option>Yesterday</option>
                    <option>Last 7 Days</option>
                    <option>This Month</option>
                    <option>Custom Range</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50/50 text-blue-600 border border-blue-100 px-4 py-2.5 rounded-xl font-medium">
                  <Calendar size={16} className="shrink-0" />
                  28 Jul 2026
                </div>
              </div>

              {/* Dimensions / Group By */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Group By (Rows)</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                    <option>None (Raw Data)</option>
                    <option>Outlet</option>
                    <option>Payment Mode</option>
                    <option>Hour of Day</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Metrics / Columns */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Metrics (Columns)</span>
                  <span className="text-blue-500 text-[10px] cursor-pointer hover:underline">Select All</span>
                </label>
                <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                  {COLUMNS.map((col, idx) => (
                    <label key={col} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                      <div className="text-blue-500">
                        {idx < 9 ? <CheckSquare size={18} className="fill-blue-50" /> : <Square size={18} className="text-slate-300 group-hover:text-slate-400" />}
                      </div>
                      <span className={`text-sm font-medium ${idx < 9 ? 'text-slate-700' : 'text-slate-500'}`}>{col}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl shadow-sm hover:bg-slate-100 transition-colors">
                Clear
              </button>
              <button className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-sm hover:bg-blue-700 hover:shadow transition-all">
                Generate
              </button>
            </div>
          </div>

          {/* MAIN PANE: Report Preview */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
            
            {/* Top Toolbar */}
            <div className="px-8 py-6 flex items-center justify-between z-10 relative">
              <div>
                <h1 className="text-[22px] font-black text-slate-800 m-0 tracking-tight mb-1">
                  Custom Sales Report
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Calendar size={12}/> Today (28 Jul)</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><RefreshCcw size={12}/> Generated 2 mins ago</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-slate-200/50 p-1 rounded-xl flex mr-2">
                  <button onClick={() => setActiveTab('data')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'data' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Data Table</button>
                  <button onClick={() => setActiveTab('visual')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'visual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Visuals</button>
                </div>

                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                  <Save size={16} className="text-slate-400" /> Save Template
                </button>
                
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-700 shadow-sm hover:bg-emerald-100 transition-colors">
                    <Download size={16} className="text-emerald-500" /> Export
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-12">
              
              {/* KPI Summary Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5"><Receipt size={64}/></div>
                  <div className="text-sm font-bold text-slate-500 mb-2 relative z-10">Total Orders</div>
                  <div className="text-3xl font-black text-slate-800 relative z-10">{totalOrders}</div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5"><TrendingUp size={64}/></div>
                  <div className="text-sm font-bold text-slate-500 mb-2 relative z-10">Net Revenue</div>
                  <div className="text-3xl font-black text-slate-800 relative z-10">₹ {fmt(totalRevenue)}</div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5"><BarChart2 size={64}/></div>
                  <div className="text-sm font-bold text-slate-500 mb-2 relative z-10">Avg. Order Value</div>
                  <div className="text-3xl font-black text-slate-800 relative z-10">₹ {fmt(avgOrderValue)}</div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5"><FileSpreadsheet size={64}/></div>
                  <div className="text-sm font-bold text-slate-500 mb-2 relative z-10">Total Discounts</div>
                  <div className="text-3xl font-black text-slate-800 relative z-10">₹ {fmt(totalDiscount)}</div>
                </div>
              </div>

              {activeTab === 'data' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                  {/* Table Header/Search */}
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="relative w-64">
                      <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search in report..." 
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
                      />
                    </div>
                    <div className="text-sm font-bold text-slate-500">
                      Showing 1-15 of 15 rows
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          {COLUMNS.slice(0, 9).map((col) => (
                            <th key={col} className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_DATA.map((row, i) => (
                          <tr key={i} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors group cursor-default">
                            <td className="py-4 px-6 text-blue-600 font-bold">{row.id}</td>
                            <td className="py-4 px-6 text-slate-600 font-medium">{row.date}</td>
                            <td className="py-4 px-6 text-slate-800 font-semibold">{row.outlet}</td>
                            <td className="py-4 px-6 text-slate-500">{row.phone}</td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                row.mode === 'UPI' ? 'bg-purple-50 text-purple-600' :
                                row.mode === 'Cash' ? 'bg-emerald-50 text-emerald-600' :
                                row.mode === 'Zomato' ? 'bg-rose-50 text-rose-600' :
                                row.mode === 'Swiggy' ? 'bg-orange-50 text-orange-600' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {row.mode}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-slate-700 font-medium text-right">₹ {fmt(row.subtotal)}</td>
                            <td className="py-4 px-6 text-rose-500 font-medium text-right">{row.discount > 0 ? `-₹ ${fmt(row.discount)}` : '-'}</td>
                            <td className="py-4 px-6 text-slate-500 font-medium text-right">₹ {fmt(row.tax)}</td>
                            <td className="py-4 px-6 text-slate-800 font-bold text-right">₹ {fmt(row.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-50 border-t border-slate-200">
                          <td colSpan={5} className="py-4 px-6 text-right font-black text-slate-800 text-sm">GRAND TOTAL</td>
                          <td className="py-4 px-6 font-bold text-slate-800 text-right">₹ {fmt(MOCK_DATA.reduce((acc, r) => acc + r.subtotal, 0))}</td>
                          <td className="py-4 px-6 font-bold text-rose-500 text-right">-₹ {fmt(totalDiscount)}</td>
                          <td className="py-4 px-6 font-bold text-slate-800 text-right">₹ {fmt(MOCK_DATA.reduce((acc, r) => acc + r.tax, 0))}</td>
                          <td className="py-4 px-6 font-black text-blue-600 text-right text-base">₹ {fmt(MOCK_DATA.reduce((acc, r) => acc + r.total, 0))}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'visual' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 h-[500px] flex flex-col items-center justify-center text-center">
                  <div className="w-64 h-64 relative mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Dine In", value: 10 },
                            { name: "Takeaway", value: 3 },
                            { name: "Online", value: 2 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          dataKey="value"
                          stroke="none"
                        >
                          {
                            [
                              { name: "Dine In", color: "#60a5fa" },
                              { name: "Takeaway", color: "#34d399" },
                              { name: "Online", color: "#fbbf24" },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))
                          }
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-black text-slate-800">15</span>
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Orders</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Visual Insights Mode</h3>
                  <p className="text-slate-500 max-w-md mt-2">Charts and graphs are automatically generated based on the selected dimensions and metrics in your data source.</p>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
      
      {/* Custom Scrollbar Styles for the column selector */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
}
