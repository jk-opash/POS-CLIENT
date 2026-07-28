"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  ChevronDown,
  ShieldAlert,
  Trash2,
  Tag,
  LogIn,
  LogOut,
  Settings,
  Banknote,
  Receipt,
  MoreVertical,
  AlertTriangle
} from "lucide-react";

const MOCK_LOGS = [
  { id: 'LOG-8902', time: '28 Jul, 16:45:21', user: 'Rahul Sharma', role: 'Cashier', type: 'Transaction', action: 'Order Voided', details: 'Voided Order #1042 (₹ 450). Reason: Customer walked out.', terminal: 'Bandra - POS 1', severity: 'critical' },
  { id: 'LOG-8901', time: '28 Jul, 16:30:05', user: 'Amit Patel', role: 'Manager', type: 'Settings', action: 'Tax Config Changed', details: 'Updated "Beverages" GST rate from 5% to 18%.', terminal: 'Web Dashboard', severity: 'warning' },
  { id: 'LOG-8900', time: '28 Jul, 16:15:44', user: 'Neha Gupta', role: 'Cashier', type: 'Transaction', action: 'Manual Discount', details: 'Applied 50% custom discount on Order #1038.', terminal: 'Andheri - POS 2', severity: 'critical' },
  { id: 'LOG-8899', time: '28 Jul, 15:50:10', user: 'System', role: 'Automated', type: 'System', action: 'End of Day Sync', details: 'Successfully synced 452 offline orders to cloud.', terminal: 'Server', severity: 'info' },
  { id: 'LOG-8898', time: '28 Jul, 15:22:00', user: 'Rahul Sharma', role: 'Cashier', type: 'Cash', action: 'Drawer Opened', details: 'Cash drawer opened (No Sale) via terminal button.', terminal: 'Bandra - POS 1', severity: 'warning' },
  { id: 'LOG-8897', time: '28 Jul, 14:10:30', user: 'Sneha Rao', role: 'Admin', type: 'Authentication', action: 'Login Success', details: 'Successful login via IP 192.168.1.45', terminal: 'Web Dashboard', severity: 'info' },
  { id: 'LOG-8896', time: '28 Jul, 13:45:12', user: 'Unknown', role: 'Unknown', type: 'Authentication', action: 'Failed Login', details: '3 failed login attempts for user "amit.p@restro.com"', terminal: 'Mobile App', severity: 'critical' },
  { id: 'LOG-8895', time: '28 Jul, 12:30:00', user: 'Amit Patel', role: 'Manager', type: 'Transaction', action: 'Refund Issued', details: 'Refunded ₹ 1250 for Order #0988 to Credit Card.', terminal: 'Bandra - POS 1', severity: 'warning' },
  { id: 'LOG-8894', time: '28 Jul, 10:15:00', user: 'Neha Gupta', role: 'Cashier', type: 'Authentication', action: 'Shift Started', details: 'Clocked in. Opening float declared: ₹ 5000.', terminal: 'Andheri - POS 2', severity: 'info' },
  { id: 'LOG-8893', time: '28 Jul, 09:05:00', user: 'System', role: 'Automated', type: 'Menu', action: 'Menu Synced', details: 'Zomato/Swiggy menu items & prices updated.', terminal: 'API Gateway', severity: 'info' },
];

export default function UserLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const filteredLogs = MOCK_LOGS.filter(log => {
    const matchesTab = activeTab === 'All' || log.type === activeTab;
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getActionIcon = (action, severity) => {
    if (action.includes('Void')) return <Trash2 size={16} className="text-rose-500" />;
    if (action.includes('Discount')) return <Tag size={16} className="text-amber-500" />;
    if (action.includes('Login')) return <LogIn size={16} className={severity === 'critical' ? 'text-rose-500' : 'text-emerald-500'} />;
    if (action.includes('Config') || action.includes('Settings')) return <Settings size={16} className="text-slate-500" />;
    if (action.includes('Drawer') || action.includes('Refund')) return <Banknote size={16} className="text-amber-500" />;
    if (severity === 'critical') return <ShieldAlert size={16} className="text-rose-500" />;
    return <Receipt size={16} className="text-blue-500" />;
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-md text-[11px] font-bold border border-rose-100 flex items-center gap-1 w-max"><AlertTriangle size={12}/> Critical</span>;
      case 'warning':
        return <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md text-[11px] font-bold border border-amber-100 flex items-center gap-1 w-max">Warning</span>;
      default:
        return <span className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md text-[11px] font-bold border border-slate-200 flex items-center gap-1 w-max">Info</span>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-hidden flex flex-col p-8">
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-1">Audit Logs</h1>
              <p className="text-sm font-medium text-slate-500">Track and monitor all user activities across your POS network.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                  <Calendar size={16} className="text-slate-400" /> 
                  Today (28 Jul)
                  <ChevronDown size={14} className="text-slate-400 ml-1" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-700 shadow-sm hover:bg-emerald-100 transition-colors">
                <Download size={16} className="text-emerald-500" /> Export CSV
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
            
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex gap-2">
                {['All', 'Transaction', 'Authentication', 'Cash', 'Settings'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeTab === tab 
                        ? 'bg-slate-800 text-white shadow-sm' 
                        : 'text-slate-500 hover:bg-slate-200/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search logs..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
                  />
                </div>
                <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            {/* Logs Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider">Timestamp / ID</th>
                    <th className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider">User</th>
                    <th className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider">Action</th>
                    <th className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider">Details</th>
                    <th className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider">Terminal</th>
                    <th className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider text-right">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-700">{log.time}</div>
                        <div className="text-[11px] font-medium text-slate-400 mt-0.5 font-mono">{log.id}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-700">{log.user}</div>
                        <div className="text-xs font-medium text-slate-500 mt-0.5">{log.role}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                            log.severity === 'critical' ? 'bg-rose-50' : 
                            log.severity === 'warning' ? 'bg-amber-50' : 'bg-slate-100'
                          }`}>
                            {getActionIcon(log.action, log.severity)}
                          </div>
                          <span className="font-bold text-slate-700">{log.action}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-600 font-medium whitespace-normal max-w-md line-clamp-2">
                          {log.details}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-500">
                        {log.terminal}
                      </td>
                      <td className="py-4 px-6 text-right flex justify-end">
                        {getSeverityBadge(log.severity)}
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-16 text-center text-slate-500 font-medium">
                        <ShieldAlert size={48} className="mx-auto text-slate-200 mb-4" />
                        No logs match your current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
