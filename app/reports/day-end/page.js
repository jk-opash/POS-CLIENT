'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { Printer, Calendar, ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, Wallet, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

// --- MOCK DATA ---
const DAY_END_DATA = {
  date: '28 July 2026',
  shift: 'Full Day',
  manager: 'Admin',
  openingBalance: 5000,
  closingBalance: 87500,
  totalOrders: 142,
  cancelledOrders: 3,
  discountsGiven: 1250,
  netSales: 82500,
  taxCollected: 4125,
  grossSales: 86625,
  tenders: [
    { type: 'Cash', amount: 12500, transactions: 24, icon: Coins, color: 'text-amber-500', bg: 'bg-amber-50' },
    { type: 'Credit/Debit Card', amount: 45000, transactions: 65, icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' },
    { type: 'UPI', amount: 29125, transactions: 53, icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ],
  categorySales: [
    { name: 'Food', amount: 55000, percentage: 66 },
    { name: 'Beverages', amount: 20000, percentage: 24 },
    { name: 'Desserts', amount: 7500, percentage: 10 },
  ],
  pettyCash: [
    { reason: 'Milk Purchase', amount: 250, type: 'out' },
    { reason: 'Vendor Payment', amount: 1500, type: 'out' },
  ]
};

export default function DayEndReport() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Day End Summary</h1>
              <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                <Calendar size={16} /> {DAY_END_DATA.date} • {DAY_END_DATA.shift} • Manager: {DAY_END_DATA.manager}
              </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:bg-slate-700 transition-colors">
              <Printer size={18} /> Print Day End (Z-Report)
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: Main KPIs & Tenders */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Sales Overview */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Sales Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Gross Sales</div>
                    <div className="text-2xl font-black text-slate-800">₹{DAY_END_DATA.grossSales.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Net Sales</div>
                    <div className="text-2xl font-black text-emerald-600">₹{DAY_END_DATA.netSales.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Tax Collected</div>
                    <div className="text-2xl font-black text-slate-800">₹{DAY_END_DATA.taxCollected.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Discounts</div>
                    <div className="text-2xl font-black text-rose-500">₹{DAY_END_DATA.discountsGiven.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Tender Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DAY_END_DATA.tenders.map((tender, i) => (
                    <div key={i} className={`p-5 rounded-2xl border border-slate-100 ${tender.bg}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${tender.color}`}>
                          <tender.icon size={20} />
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-500 uppercase">{tender.transactions} Txns</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-slate-600 mb-1">{tender.type}</div>
                      <div className={`text-2xl font-black ${tender.color}`}>₹{tender.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Sales */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Category Sales</h2>
                <div className="space-y-4">
                  {DAY_END_DATA.categorySales.map((cat, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-700">{cat.name}</span>
                        <div className="text-right">
                          <span className="font-black text-slate-800">₹{cat.amount.toLocaleString()}</span>
                          <span className="text-xs font-bold text-slate-400 ml-2">({cat.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${cat.percentage}%` }} 
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Cash Register & Summary */}
            <div className="space-y-6">
              
              <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-6">Cash Register</h2>
                
                <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4">
                  <span className="text-slate-300 font-medium">Opening Balance</span>
                  <span className="font-bold">₹{DAY_END_DATA.openingBalance.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4">
                  <span className="text-slate-300 font-medium flex items-center gap-2"><ArrowUpRight size={16} className="text-emerald-400"/> Cash Sales In</span>
                  <span className="font-bold text-emerald-400">₹{DAY_END_DATA.tenders.find(t=>t.type==='Cash').amount.toLocaleString()}</span>
                </div>

                <div className="mb-4 border-b border-slate-700 pb-4">
                  <span className="text-slate-300 font-medium mb-2 block flex items-center gap-2"><ArrowDownRight size={16} className="text-rose-400"/> Petty Cash Out</span>
                  {DAY_END_DATA.pettyCash.map((pc, i) => (
                    <div key={i} className="flex justify-between text-sm mt-1">
                      <span className="text-slate-400 ml-6">- {pc.reason}</span>
                      <span className="text-rose-400">₹{pc.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-300 font-bold uppercase tracking-wider text-xs">Expected Cash in Drawer</span>
                  <span className="text-3xl font-black text-white">
                    ₹{(DAY_END_DATA.openingBalance + DAY_END_DATA.tenders.find(t=>t.type==='Cash').amount - DAY_END_DATA.pettyCash.reduce((s,p)=>s+p.amount,0)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Order Metrics</h2>
                <div className="divide-y divide-slate-100">
                  <div className="flex justify-between items-center py-3">
                    <span className="font-semibold text-slate-600">Total Orders Processed</span>
                    <span className="font-black text-slate-800 text-lg">{DAY_END_DATA.totalOrders}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-semibold text-slate-600">Cancelled / Void Orders</span>
                    <span className="font-black text-rose-500 text-lg">{DAY_END_DATA.cancelledOrders}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-semibold text-slate-600">Average Order Value</span>
                    <span className="font-black text-slate-800 text-lg">₹{Math.round(DAY_END_DATA.grossSales / DAY_END_DATA.totalOrders).toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
