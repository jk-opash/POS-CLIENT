"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import {
  FileText,
  Users,
  ShoppingCart,
  Percent,
  TrendingUp,
  Package,
  Clock,
  Download,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

// --- MOCK DATA ---
const REPORT_CATEGORIES = [
  {
    id: "c1",
    title: "Sales & Revenue",
    reports: [
      {
        id: "r1",
        name: "Item-wise Sales",
        desc: "Detailed breakdown of every item sold.",
        icon: ShoppingCart,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
      },
      {
        id: "r2",
        name: "Tax & GST Liability",
        desc: "Summary of collected taxes for filing.",
        icon: FileText,
        color: "text-blue-500",
        bg: "bg-blue-50",
      },
      {
        id: "r3",
        name: "Discounts & Voids",
        desc: "Audit log of all discounts and cancelled orders.",
        icon: Percent,
        color: "text-rose-500",
        bg: "bg-rose-50",
      },
    ],
  },
  {
    id: "c2",
    title: "Operations & Staff",
    reports: [
      {
        id: "r4",
        name: "Staff Performance",
        desc: "Sales generated and tables served per staff.",
        icon: Users,
        color: "text-purple-500",
        bg: "bg-purple-50",
      },
      {
        id: "r5",
        name: "Hourly Trends",
        desc: "Peak hours and customer footfall analytics.",
        icon: Clock,
        color: "text-amber-500",
        bg: "bg-amber-50",
      },
    ],
  },
  {
    id: "c3",
    title: "Inventory & Stock",
    reports: [
      {
        id: "r6",
        name: "Consumption Report",
        desc: "Raw material usage based on recipes.",
        icon: Package,
        color: "text-indigo-500",
        bg: "bg-indigo-50",
      },
      {
        id: "r7",
        name: "Stock Variance",
        desc: "Differences between physical and system stock.",
        icon: TrendingUp,
        color: "text-cyan-500",
        bg: "bg-cyan-50",
      },
    ],
  },
];

export default function OtherReports() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Topbar onMenuClick={() => setCollapsed((c) => !c)} />

        <main className="flex-1 overflow-y-auto p-8">
          <div className=" mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                  Other Reports
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                  Access detailed analytics and specialized reports.
                </p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
                <Download size={18} /> Export All Data
              </button>
            </div>

            <div className="space-y-10">
              {REPORT_CATEGORIES.map((category) => (
                <div key={category.id}>
                  <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 pl-2">
                    {category.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {category.reports.map((report) => (
                      <motion.div
                        key={report.id}
                        whileHover={{ y: -4, scale: 1.01 }}
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer group flex flex-col h-full"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${report.bg} ${report.color}`}
                          >
                            <report.icon size={24} />
                          </div>
                          <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {report.name}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed flex-1">
                          {report.desc}
                        </p>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                            Excel
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                            PDF
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
