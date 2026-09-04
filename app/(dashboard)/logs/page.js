"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuditLogs } from "../../store/slices/auditLogSlice";
import PosAdminPagination from "../menu/components/PosAdminPagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const dispatch = useDispatch();
  const { logs, loading } = useSelector((state) => state.auditLog);

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

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

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getActionIcon = (action, severity) => {
    if (action.includes("Void"))
      return <Trash2 size={16} className="text-brand-danger" />;
    if (action.includes("Discount"))
      return <Tag size={16} className="text-brand-warning" />;
    if (action.includes("Login")) {
      return (
        <LogIn
          size={16}
          className={
            severity === "critical" ? "text-brand-danger" : "text-brand-success"
          }
        />
      );
    }
    if (action.includes("Config") || action.includes("Settings")) {
      return <Settings size={16} className="text-brand-muted" />;
    }
    if (action.includes("Drawer") || action.includes("Refund")) {
      return <Banknote size={16} className="text-brand-warning" />;
    }
    if (severity === "critical")
      return <ShieldAlert size={16} className="text-brand-danger" />;
    return <Receipt size={16} className="text-brand-primary" />;
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "critical":
        return (
          <span className="bg-brand-dangerLight text-brand-danger px-2.5 py-1 rounded-md text-[11px] font-bold border border-brand-dangerLight flex items-center gap-1 w-max">
            <AlertTriangle size={12} /> Critical
          </span>
        );
      case "warning":
        return (
          <span className="bg-brand-warningLight text-brand-warning px-2.5 py-1 rounded-md text-[11px] font-bold border border-brand-warningLight flex items-center gap-1 w-max">
            Warning
          </span>
        );
      default:
        return (
          <span className="bg-brand-light text-brand-muted px-2.5 py-1 rounded-md text-[11px] font-bold border border-brand-border flex items-center gap-1 w-max">
            Info
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col bg-brand-bg font-sans">
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
                {/* Search */}
                <div className="relative flex-1 sm:flex-none sm:w-64">
                  <Search
                    size={16}
                    className="absolute left-3 top-2.5 text-brand-placeholder"
                  />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-brand-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 placeholder:text-brand-placeholder transition-all shadow-sm"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-white border border-brand-border rounded-lg text-sm font-medium text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer shadow-sm hover:border-brand-borderHover"
                  >
                    {[
                      "All",
                      "Transaction",
                      "Authentication",
                      "Cash",
                      "Settings",
                    ].map((tab) => (
                      <option key={tab} value={tab}>
                        {tab === "All" ? "All Categories" : tab}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-placeholder">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-brand-border flex flex-col overflow-hidden">
              <div className="p-4 border-b border-brand-borderHover bg-white rounded-t-2xl">
                <div className="text-sm font-bold text-brand-dark">
                  {filteredLogs.length} Records Found
                </div>
              </div>

              {/* Logs Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-brand-light border-b border-brand-borderHover">
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
                    ) : paginatedLogs.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-16 text-center text-brand-muted font-medium"
                        >
                          <ShieldAlert
                            size={48}
                            className="mx-auto text-brand-placeholder mb-4"
                          />
                          No logs match your current filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-brand-light hover:bg-brand-light transition-colors group"
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
                            <div className="text-[11px] font-medium text-brand-placeholder mt-0.5 font-mono">
                              {log.id.substring(0, 8).toUpperCase()}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-brand-dark">
                              {log.actor_name || "System"}
                            </div>
                            <div className="text-xs font-medium text-brand-muted mt-0.5">
                              {log.actor_role || "System"}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                                  log.severity === "critical"
                                    ? "bg-brand-dangerLight"
                                    : log.severity === "warning"
                                      ? "bg-brand-warningLight"
                                      : "bg-surface-2"
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

              {/* Pagination */}
              {totalItems > 0 && !loading && (
                <div className="border-t border-brand-borderHover px-6 py-4 bg-brand-light">
                  <PosAdminPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={(newPerPage) => {
                      setItemsPerPage(newPerPage);
                      setCurrentPage(1);
                    }}
                    totalItems={totalItems}
                    itemsPerPageOptions={[10, 20, 50, 100]}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
