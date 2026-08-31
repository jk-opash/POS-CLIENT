import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Clock,
  RotateCcw,
  ArrowUpCircle,
  Trash2,
  Plus,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import api from "../../../lib/api";
import LottieLoader from "../../../components/common/LottieLoader";

export default function AuditLogTab({ branchId }) {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLedger = async () => {
      if (!branchId) return;
      try {
        setLoading(true);
        setError(null);
        // Fetch full ledger for branch
        const res = await api.get(`/inventory/ledger/branch/${branchId}`);
        if (res.data.success) {
          setLedger(res.data.data);
        } else {
          setError("Failed to fetch stock movements");
        }
      } catch (err) {
        console.error("Error fetching ledger:", err);
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [branchId]);

  const typeIcon = (type) => {
    switch (type) {
      case "ADJUSTMENT":
        return <RotateCcw size={14} className="text-amber-500" />;
      case "RECEIVED":
        return <ArrowUpCircle size={14} className="text-emerald-500" />;
      case "SALE":
        return <ShoppingCart size={14} className="text-blue-500" />;
      case "DELETION":
        return <Trash2 size={14} className="text-red-500" />;
      case "ITEM_CREATED":
        return <Plus size={14} className="text-purple-500" />;
      default:
        return <ClipboardList size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className="w-full text-left border-collapse"
          style={{ minWidth: 900 }}
        >
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Log ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                User / System
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Action
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <LottieLoader text="Loading audit log..." />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-red-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <div>{error}</div>
                </td>
              </tr>
            ) : ledger.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-slate-400">
                  <ClipboardList
                    size={40}
                    className="mx-auto mb-3 opacity-30"
                  />
                  <div>No stock movements recorded yet.</div>
                </td>
              </tr>
            ) : (
              ledger.map((item, i) => {
                const qtyChange = Number(item.quantity_change);
                return (
                  <tr
                    key={item.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}
                  >
                    <td
                      className="px-4 py-3 text-slate-400 font-mono text-xs truncate max-w-[100px]"
                      title={item.id}
                    >
                      {item.id.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <Clock size={12} />
                        {new Date(item.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                        {item.performed_by || "System"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {typeIcon(item.movement_type)}
                        <span className="font-bold text-slate-700 text-xs">
                          {item.movement_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      <span className="font-bold text-slate-700">
                        {item.item?.name || "Unknown Item"}
                      </span>{" "}
                      (
                      <span
                        className={
                          qtyChange > 0
                            ? "text-emerald-600 font-bold"
                            : qtyChange < 0
                              ? "text-red-500 font-bold"
                              : "text-slate-500 font-bold"
                        }
                      >
                        {qtyChange > 0 ? "+" : ""}
                        {qtyChange}
                      </span>
                      ){" – "}
                      {item.reason || "No reason provided"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
