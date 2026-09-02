"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuditLogs } from "../../store/slices/auditLogSlice";

import { cn } from "../../lib/utils";

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
  Settings,
  Banknote,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import LottieLoader from "../../components/common/LottieLoader";

const TYPE_MAPPING = {
  Transaction: ["Order", "Invoice", "SubscriptionInvoice", "Transaction"],
  Authentication: ["Admin", "Superadmin", "Authentication"],
  Cash: ["Expense", "Withdrawal", "UtilityBill", "Cash"],
  Settings: [
    "Business",
    "Branch",
    "TeamMember",
    "Zone",
    "Table",
    "MenuCategory",
    "MenuItem",
    "InventoryItem",
    "Supplier",
    "SubscriptionPlan",
    "SupportTicket",
    "Settings",
    "StockLedger",
  ],
};

const TAB_KEYWORDS = {
  Transaction: [
    "void",
    "discount",
    "sale",
    "order",
    "payment",
    "transaction",
    "invoice",
  ],
  Authentication: ["login", "logout", "auth", "session", "credential"],
  Cash: [
    "drawer",
    "refund",
    "cash",
    "till",
    "payout",
    "payin",
    "expense",
    "withdrawal",
  ],
  Settings: [
    "config",
    "settings",
    "system",
    "teammember",
    "activated",
    "reset",
    "branch",
    "tax",
    "role",
    "deactivated",
    "business",
    "zone",
    "table",
    "menu",
  ],
};

const formatDetails = (details) => {
  if (!details || details === "{}") return "-";
  try {
    const parsed = typeof details === "string" ? JSON.parse(details) : details;
    if (typeof parsed === "object" && parsed !== null) {
      const entries = Object.entries(parsed).filter(
        ([k, v]) =>
          v !== null &&
          v !== undefined &&
          v !== "" &&
          k !== "id" &&
          k !== "password_hash",
      );

      if (entries.length === 0) return "No additional details recorded.";

      const descriptions = entries.map(([k, v]) => {
        // Convert keys like "first_name" or "firstName" to "first name"
        const keyName = k
          .replace(/_/g, " ")
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()
          .trim();

        if (typeof v === "object") {
          if (Array.isArray(v)) {
            return `${keyName} updated with ${v.length} items`;
          }
          return `${keyName} modified`;
        }

        if (typeof v === "boolean") {
          return `${keyName} was ${v ? "enabled" : "disabled"}`;
        }

        return `${keyName} set to '${v}'`;
      });

      // Capitalize first letter of the resulting string
      const summary = descriptions.join(", ");
      return summary.charAt(0).toUpperCase() + summary.slice(1) + ".";
    }
    return String(details);
  } catch (e) {
    return String(details);
  }
};

export default function UserLogsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const dispatch = useDispatch();
  const { logs, loading } = useSelector((state) => state.auditLog);

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  const filteredLogs = (logs || []).filter((log) => {
    const rawType = log.type || "";
    const typeLower = rawType.toLowerCase();
    const actionLower = (log.action || "").toLowerCase();

    let matchesTab = false;
    if (activeTab === "All") {
      matchesTab = true;
    } else {
      const tabLower = activeTab.toLowerCase();
      const mappedTypes = TYPE_MAPPING[activeTab] || [];

      // 1. Direct Backend Model Type Match
      if (mappedTypes.some((t) => t.toLowerCase() === typeLower)) {
        matchesTab = true;
      }
      // 2. Fallback Exact String Match
      else if (typeLower === tabLower) {
        matchesTab = true;
      }
      // 3. Fallback Keyword Action Match
      else if (TAB_KEYWORDS[activeTab]) {
        matchesTab = TAB_KEYWORDS[activeTab].some((kw) =>
          actionLower.includes(kw),
        );
      }
    }

    const matchesSearch =
      (log.actor_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (log.action || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const getActionIcon = (action, severity) => {
    if (action.includes("Void"))
      return <Trash2 size={16} className="text-rose-500" />;
    if (action.includes("Discount"))
      return <Tag size={16} className="text-amber-500" />;
    if (action.includes("Login")) {
      return (
        <LogIn
          size={16}
          className={
            severity === "critical" ? "text-rose-500" : "text-emerald-500"
          }
        />
      );
    }
    if (action.includes("Config") || action.includes("Settings")) {
      return <Settings size={16} className="text-slate-500" />;
    }
    if (action.includes("Drawer") || action.includes("Refund")) {
      return <Banknote size={16} className="text-amber-500" />;
    }
    if (severity === "critical")
      return <ShieldAlert size={16} className="text-rose-500" />;
    return <Receipt size={16} className="text-indigo-500" />;
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "critical":
        return (
          <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-md text-[11px] font-bold border border-rose-100 flex items-center gap-1 w-max">
            <AlertTriangle size={12} /> Critical
          </span>
        );
      case "warning":
        return (
          <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md text-[11px] font-bold border border-amber-100 flex items-center gap-1 w-max">
            Warning
          </span>
        );
      default:
        return (
          <span className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md text-[11px] font-bold border border-slate-200 flex items-center gap-1 w-max">
            Info
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col bg-slate-50 font-sans">
      <div className="flex flex-1 min-w-0 flex-col">
        <main className="flex-1 px-6 py-6">
          <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-brand-dark">
                  Audit Logs
                </h2>
                <p className="mt-1 text-sm text-brand-muted">
                  Track and monitor all user activities across your POS network.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-brand-border bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-brand-light transition-colors">
                  <Download size={16} className="text-emerald-500" /> Export CSV
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="rounded-t-2xl border-b border-slate-200 bg-white/60 px-2 backdrop-blur">
              <nav className="-mb-px flex space-x-6 overflow-x-auto">
                {[
                  "All",
                  "Transaction",
                  "Authentication",
                  "Cash",
                  "Settings",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "border-b-2 px-2 py-4 text-sm font-bold whitespace-nowrap transition",
                      activeTab === tab
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800",
                    )}
                  >
                    {tab === "All" ? "All Logs" : tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-brand-border flex flex-col overflow-hidden">
              {/* Search & Filter Toolbar */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <div className="text-sm font-bold text-slate-700">
                  {filteredLogs.length} Records Found
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search
                      size={16}
                      className="absolute left-3 top-2.5 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white border border-brand-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 placeholder:text-slate-400 transition-all"
                    />
                  </div>
                  <button className="p-2 bg-white border border-brand-border rounded-lg text-slate-500 hover:bg-brand-light shadow-sm transition-colors">
                    <Filter size={18} />
                  </button>
                </div>
              </div>

              {/* Logs Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50/80 border-b border-slate-100">
                    <tr>
                      <th className="py-4 px-6 font-bold text-xs text-brand-muted uppercase tracking-wider">
                        Timestamp / ID
                      </th>
                      <th className="py-4 px-6 font-bold text-xs text-brand-muted uppercase tracking-wider">
                        User
                      </th>
                      <th className="py-4 px-6 font-bold text-xs text-brand-muted uppercase tracking-wider">
                        Action
                      </th>
                      <th className="py-4 px-6 font-bold text-xs text-brand-muted uppercase tracking-wider text-right">
                        Severity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="py-16 text-center">
                          <div className="flex justify-center min-h-[200px]">
                            <LottieLoader text="Loading audit logs..." />
                          </div>
                        </td>
                      </tr>
                    ) : filteredLogs.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-16 text-center text-slate-500 font-medium"
                        >
                          <ShieldAlert
                            size={48}
                            className="mx-auto text-slate-200 mb-4"
                          />
                          No logs match your current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-slate-50 hover:bg-brand-light transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <div className="font-bold text-brand-dark">
                              {new Date(log.created_at).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </div>
                            <div className="text-[11px] font-medium text-slate-400 mt-0.5 font-mono">
                              {log.id.substring(0, 8).toUpperCase()}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-brand-dark">
                              {log.actor_name || "System"}
                            </div>
                            <div className="text-xs font-medium text-slate-500 mt-0.5">
                              {log.actor_role || "System"}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                                  log.severity === "critical"
                                    ? "bg-rose-50"
                                    : log.severity === "warning"
                                      ? "bg-amber-50"
                                      : "bg-slate-100"
                                }`}
                              >
                                {getActionIcon(log.action, log.severity)}
                              </div>
                              <span className="font-bold text-brand-dark">
                                {log.action}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right flex justify-end">
                            {getSeverityBadge(log.severity)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
