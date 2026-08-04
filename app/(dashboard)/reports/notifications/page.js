"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import {
  Mail,
  MessageSquare,
  Smartphone,
  Bell,
  Plus,
  CheckCircle2,
  Clock,
  X,
  Settings2,
} from "lucide-react";
import { motion } from "framer-motion";

// --- MOCK DATA ---
const NOTIFICATIONS = [
  {
    id: "n1",
    name: "Daily Sales Summary",
    trigger: "Daily at 11:59 PM",
    type: "Email",
    icon: Mail,
    color: "text-blue-500",
    bg: "bg-blue-50",
    status: "Active",
    recipients: ["owner@posystem.com", "manager@posystem.com"],
  },
  {
    id: "n2",
    name: "Low Inventory Alert",
    trigger: "On threshold breach",
    type: "SMS",
    icon: Smartphone,
    color: "text-amber-500",
    bg: "bg-amber-50",
    status: "Active",
    recipients: ["+91 98765 43210"],
  },
  {
    id: "n3",
    name: "Weekly Performance",
    trigger: "Sunday at 10:00 AM",
    type: "WhatsApp",
    icon: MessageSquare,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    status: "Paused",
    recipients: ["+91 98765 43210"],
  },
  {
    id: "n4",
    name: "Large Void / Discount Alert",
    trigger: "Amount > ₹1000",
    type: "App Push",
    icon: Bell,
    color: "text-purple-500",
    bg: "bg-purple-50",
    status: "Active",
    recipients: ["Admin App"],
  },
];

export default function ReportNotifications() {
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const toggleStatus = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, status: n.status === "Active" ? "Paused" : "Active" }
          : n,
      ),
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <Topbar onMenuClick={() => setCollapsed((c) => !c)} />
        <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
          {/* Header (Fixed / Non-scrolling) */}
          <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                  Automated Report Alerts
                </h1>
                <p className="text-slate-500 text-xs font-medium mt-0.5">
                  Schedule automated reports and alerts via Email, SMS, WhatsApp, and Push Notifications.
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">
                <Plus size={15} /> Create Alert
              </button>
            </div>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 group hover:border-slate-300 transition-colors"
                >
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}
                    >
                      <notif.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-800 mb-0.5">
                        {notif.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          <Clock size={10} /> {notif.trigger}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded border ${notif.type === "Email" ? "bg-blue-50 text-blue-600 border-blue-100" : notif.type === "SMS" ? "bg-amber-50 text-amber-600 border-amber-100" : notif.type === "WhatsApp" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-purple-50 text-purple-600 border-purple-100"}`}
                        >
                          {notif.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recipients */}
                  <div className="flex-1 border-l border-slate-100 pl-4 py-1 hidden md:block">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Sending To
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {notif.recipients.map((rec, i) => (
                        <span
                          key={i}
                          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md"
                        >
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 md:border-l border-slate-100 md:pl-4 mt-2 md:mt-0">
                    <button
                      onClick={() => toggleStatus(notif.id)}
                      className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none ${notif.status === "Active" ? "bg-emerald-500" : "bg-slate-300"}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notif.status === "Active" ? "translate-x-5" : "translate-x-1"}`}
                      />
                    </button>
                    <div className="w-14">
                      <span
                        className={`text-xs font-bold ${notif.status === "Active" ? "text-emerald-500" : "text-slate-400"}`}
                      >
                        {notif.status}
                      </span>
                    </div>
                    <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                      <Settings2 size={16} />
                    </button>
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
