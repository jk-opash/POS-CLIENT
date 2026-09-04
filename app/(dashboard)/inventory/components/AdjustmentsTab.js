import React, { useState, useEffect } from "react";
import { ClipboardList, Clock, AlertCircle } from "lucide-react";
import api from "../../../lib/api";
import LottieLoader from "../../../components/common/LottieLoader";

export default function AdjustmentsTab({ branchId }) {
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdjustments = async () => {
      if (!branchId) return;
      try {
        setLoading(true);
        setError(null);
        // Fetch ledger for branch
        const res = await api.get(`/inventory/ledger/branch/${branchId}`);
        if (res.data.success) {
          // Filter for ADJUSMENTS
          const filtered = res.data.data.filter(
            (item) => item.movement_type === "ADJUSTMENT"
          );
          setAdjustments(filtered);
        } else {
          setError("Failed to fetch stock adjustments");
        }
      } catch (err) {
        console.error("Error fetching adjustments:", err);
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchAdjustments();
  }, [branchId]);

  return (
    <div className="rounded-2xl border border-brand-border/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className="w-full text-left border-collapse"
          style={{ minWidth: 800 }}
        >
          <thead>
            <tr className="border-b border-brand-border bg-brand-bg/80 text-[11px] font-black text-brand-muted/70 uppercase tracking-wider">
              <th className="px-4 py-3 text-left text-xs font-bold text-brand-muted/70 uppercase tracking-wider">
                Reference
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-brand-muted/70 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-brand-muted/70 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-brand-muted/70 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-brand-muted/70 uppercase tracking-wider">
                Qty Adjusted
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold text-brand-muted/70 uppercase tracking-wider">
                Performed By
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <LottieLoader text="Loading adjustments..." />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-brand-danger">
                  <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <div>{error}</div>
                </td>
              </tr>
            ) : adjustments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-brand-muted/70">
                  <ClipboardList
                    size={40}
                    className="mx-auto mb-3 opacity-30"
                  />
                  <div>No stock adjustments recorded yet.</div>
                </td>
              </tr>
            ) : (
              adjustments.map((entry, i) => {
                const qtyChange = Number(entry.quantity_change);
                return (
                  <tr
                    key={entry.id}
                    className={`border-b border-brand-border hover:bg-brand-bg transition-colors ${i % 2 === 1 ? "bg-brand-bg/50" : ""}`}
                  >
                    <td className="px-4 py-3 text-brand-primary font-mono text-xs font-bold truncate max-w-[120px]">
                      {entry.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-brand-muted text-xs">
                        <Clock size={12} />
                        {new Date(entry.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-brand-dark">
                      {entry.item?.name || "Unknown Item"}
                      <div className="text-xs text-brand-muted/70 font-medium">
                        {entry.item?.sku}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-muted text-xs">
                      {entry.reason || "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-black text-base ${qtyChange > 0 ? "text-brand-success" : "text-brand-danger"}`}
                      >
                        {qtyChange > 0 ? "+" : ""}
                        {qtyChange} <span className="text-xs font-medium text-brand-muted ml-1">{entry.item?.unit || "pcs"}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-semibold bg-brand-light text-brand-dark px-2 py-1 rounded-md border border-brand-border">
                        {entry.performed_by || "System"}
                      </span>
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
