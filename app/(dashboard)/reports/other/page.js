"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  Search,
  Sparkles,
  FileSpreadsheet,
  FileDown,
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
        desc: "Detailed breakdown of every item sold across all outlets.",
        icon: ShoppingCart,
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-100",
      },
      {
        id: "r2",
        name: "Tax & GST Liability",
        desc: "Comprehensive summary of collected taxes for filing returns.",
        icon: FileText,
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-100",
      },
      {
        id: "r3",
        name: "Discounts & Voids",
        desc: "Audit log of all discounts, comped items, and cancelled orders.",
        icon: Percent,
        color: "text-rose-600",
        bg: "bg-rose-50 border-rose-100",
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
        desc: "Sales generated, orders handled, and tables served per staff member.",
        icon: Users,
        color: "text-purple-600",
        bg: "bg-purple-50 border-purple-100",
      },
      {
        id: "r5",
        name: "Hourly Trends",
        desc: "Peak operating hours, sales velocity, and customer footfall analytics.",
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50 border-amber-100",
      },
    ],
  },
  {
    id: "c3",
    title: "Inventory & Stock",
    reports: [
      {
        id: "r6",
        name: "Expense Report",
        desc: "Show all the expense records done from the outlets",
        icon: Package,
        color: "text-indigo-600",
        bg: "bg-indigo-50 border-indigo-100",
      },
      {
        id: "r7",
        name: "Stock Variance",
        desc: "Audit discrepancies between physical inventory and system stock.",
        icon: TrendingUp,
        color: "text-cyan-600",
        bg: "bg-cyan-50 border-cyan-100",
      },
    ],
  },
];

export default function OtherReports() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  const filteredCategories = REPORT_CATEGORIES.map((cat) => {
    const matchingReports = cat.reports.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.desc.toLowerCase().includes(search.toLowerCase()),
    );
    return { ...cat, reports: matchingReports };
  }).filter((cat) => {
    if (selectedCat !== "all" && cat.id !== selectedCat) return false;
    return cat.reports.length > 0;
  });

  return (
    <div className="flex flex-col bg-slate-50 font-sans">
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  Other Reports
                  <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                    <Sparkles size={12} /> Analytics
                  </span>
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                  Access specialized operational, financial, and inventory
                  reports.
                </p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-md active:scale-95">
                <Download size={16} /> Export All Reports
              </button>
            </div>

            {/* Controls: Search & Category Filter Pills */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl flex-1">
                <Search size={18} className="text-slate-400 shrink-0" />
                <input
                  className="w-full text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  placeholder="Search reports by title or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedCat("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCat === "all"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  All Reports
                </button>
                {REPORT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCat === cat.id
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Report Categories & Cards */}
            <div className="space-y-8">
              {filteredCategories.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                  <FileText size={48} className="mx-auto mb-3 text-slate-300" />
                  <h3 className="text-lg font-bold text-slate-700">
                    No reports found
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Try adjusting your search query or selected category.
                  </p>
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <div key={category.id} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                        {category.title}
                      </h2>
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                        {category.reports.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {category.reports.map((report) => (
                        <motion.div
                          key={report.id}
                          whileHover={{ y: -3 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => {
                            if (report.id === "r1") {
                              router.push("/reports/other/item-wise");
                            } else if (report.id === "r2") {
                              router.push("/reports/other/tax-liability");
                            } else if (report.id === "r3") {
                              router.push("/reports/other/discounts-voids");
                            } else if (report.id === "r5") {
                              router.push("/reports/other/hourly-trends");
                            } else if (report.id === "r7") {
                              router.push("/reports/other/stock-variance");
                            } else if (report.id === "r4") {
                              router.push("/reports/other/staff-performance");
                            } else if (report.id === "r6") {
                              router.push("/reports/other/expense");
                            }
                          }}
                          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div
                                className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${report.bg} ${report.color}`}
                              >
                                <report.icon size={22} />
                              </div>
                              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                <ChevronRight size={16} />
                              </div>
                            </div>
                            <h3 className="text-lg font-black text-slate-800 mb-1.5 group-hover:text-blue-600 transition-colors">
                              {report.name}
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                              {report.desc}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex gap-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <FileSpreadsheet size={10} /> Excel
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <FileDown size={10} /> PDF
                              </span>
                            </div>
                            <span className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                              Generate →
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
