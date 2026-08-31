"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPendingOrders,
  updateKDSItemStatus,
  updateKDSOrderStatus,
} from "../../../store/slices/orderSlice";
import { fetchBranches } from "../../../store/slices/branchSlice";
import {
  RefreshCcw,
  Clock,
  CheckCircle,
  Store,
  Building2,
  UtensilsCrossed,
} from "lucide-react";

import PosAdminBadge from "../../menu/components/PosAdminBadge";
import LottieLoader from "../../../components/common/LottieLoader";

export default function KOTPage() {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const { user } = useSelector((state) => state.auth);
  const { currentBranch, branches } = useSelector((state) => state.branch);
  const { pendingOrders: orders, loading } = useSelector(
    (state) => state.order,
  );

  // Determine active branch: User selection > global current > first available
  const activeBranch =
    branches?.find((b) => b.id === selectedBranchId) ||
    currentBranch ||
    (branches && branches.length > 0 ? branches[0] : null);

  useEffect(() => {
    if (user?.businesses?.[0]?.id && (!branches || branches.length === 0)) {
      dispatch(fetchBranches(user.businesses[0].id));
    }
  }, [user, branches, dispatch]);

  const fetchKOTs = () => {
    if (activeBranch?.id) {
      dispatch(fetchPendingOrders(activeBranch.id));
    }
  };

  useEffect(() => {
    fetchKOTs();
    // Auto refresh every 15 seconds
    const interval = setInterval(fetchKOTs, 15000);
    return () => clearInterval(interval);
  }, [activeBranch]);

  const markItemReady = async (orderId, kotNumber, itemId) => {
    await dispatch(
      updateKDSItemStatus({ orderId, kotNumber, itemId, status: "Ready" }),
    );
    fetchKOTs();
  };

  const markAllReady = (orderId, kotNumber, itemIds) => {
    dispatch(
      updateKDSOrderStatus({ orderId, kotNumber, itemIds, status: "Ready" }),
    )
      .unwrap()
      .then(() => fetchKOTs())
      .catch((err) => alert("Failed to mark ready: " + err));
  };

  return (
    <div className="flex flex-col bg-slate-50 font-sans">
      <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-5">
        {/* Header & Global Actions */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Kitchen Display (KDS)
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Real-time management of active Kitchen Order Tickets.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Branch Selector */}
            {branches && branches.length > 0 && (
              <div className="relative flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                <Building2 size={14} className="text-slate-500 shrink-0" />
                <select
                  value={activeBranch?.id || ""}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="text-sm font-semibold text-slate-700 outline-none bg-transparent cursor-pointer pr-2"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={fetchKOTs}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
            >
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
              Refresh KOTs
            </button>
          </div>
        </div>

        {/* KOT List / Table CONTENT */}
        {!activeBranch ? (
          <div className="flex flex-col items-center justify-center text-slate-500 min-h-[400px] mt-4">
            <Building2 size={64} className="mb-4 text-slate-200" />
            <h3 className="text-xl font-bold text-slate-700">
              No Branch Selected
            </h3>
            <p className="text-sm mt-2">
              Please select a branch from the dropdown above to view pending
              Kitchen Orders.
            </p>
          </div>
        ) : (orders?.length === 0 && loading) ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] mt-4">
            <LottieLoader text="Loading KOTs..." />
          </div>
        ) : orders.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center text-slate-400 min-h-[400px] mt-4">
            <CheckCircle
              size={64}
              className="mb-4 text-emerald-400 opacity-50"
            />
            <h3 className="text-xl font-bold text-slate-700">All caught up!</h3>
            <p className="text-sm mt-2">
              No pending orders in the kitchen queue right now.
            </p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-5 mt-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Order ID / Type</th>
                      <th className="py-3.5 px-4">KOT Number</th>
                      <th className="py-3.5 px-4">Items Summary</th>
                      <th className="py-3.5 px-4 text-center">Time Elapsed</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {orders.map((order) => {
                      let items = [];
                      try {
                        const raw = order.running_order || order.cart_items;
                        items = typeof raw === "string" ? JSON.parse(raw) : raw;
                        if (
                          items &&
                          !Array.isArray(items) &&
                          Array.isArray(items.items)
                        ) {
                          items = items.items;
                        }
                      } catch (e) {}

                      const pendingItems = Array.isArray(items)
                        ? items.filter((item) => {
                            const doneStatuses = [
                              "Ready",
                              "Served",
                              "Completed",
                              "Cancelled",
                            ];
                            return (
                              !doneStatuses.includes(item.status) &&
                              !doneStatuses.includes(item.kds_status)
                            );
                          })
                        : [];
                      if (pendingItems.length === 0) return null;

                      const orderTime = new Date(order.created_at);
                      const elapsedMinutes = Math.floor(
                        (new Date() - orderTime) / 60000,
                      );
                      const isDelayed = elapsedMinutes > 15;
                      const currentKot =
                        order.kot_numbers?.[order.kot_numbers.length - 1] ||
                        "KOT";

                      const isTable =
                        !!order.table_id || order.order_type === "dine-in";
                      const orderLabel =
                        order.table?.name ||
                        (order.table_id
                          ? `Table ${order.table_id}`
                          : order.order_type || "Takeaway");

                      return (
                        <tr
                          key={order.id}
                          className="hover:bg-slate-50/60 transition-colors duration-150"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isTable ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"}`}
                              >
                                {isTable ? (
                                  <UtensilsCrossed size={18} />
                                ) : (
                                  <Store size={18} />
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">
                                  {orderLabel}
                                </div>
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                  #{order.order_number}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 font-semibold text-slate-700">
                            <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg">
                              {currentKot}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            <div className="group relative flex items-center cursor-default">
                              <PosAdminBadge variant="purple">
                                {pendingItems.reduce(
                                  (acc, item) =>
                                    acc + (item.quantity || item.qty || 1),
                                  0,
                                )}{" "}
                                Items
                              </PosAdminBadge>

                              {/* Tooltip Matching MenuPage Style */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out">
                                <div className="bg-gradient-to-br from-violet-500 to-violet-600 text-white text-[11px] font-medium p-3 rounded-xl shadow-[0_10px_25px_-5px_rgba(139,92,246,0.5)] border border-violet-400/50 w-max max-w-[260px] whitespace-pre-wrap text-left leading-relaxed relative">
                                  {pendingItems
                                    .map((item) => {
                                      const qty =
                                        item.quantity || item.qty || 1;
                                      const name =
                                        item.product?.name ||
                                        item.name ||
                                        item.item_name ||
                                        "Unknown";
                                      let text = `${qty}x ${name}`;

                                      if (item.variant) {
                                        const vName =
                                          typeof item.variant === "string"
                                            ? item.variant
                                            : item.variant.name || "";
                                        if (vName) text += ` (${vName})`;
                                      } else if (
                                        item.variants &&
                                        Array.isArray(item.variants) &&
                                        item.variants.length > 0
                                      ) {
                                        text += ` (${item.variants.map((v) => v.name || v).join(", ")})`;
                                      }

                                      if (
                                        item.addons &&
                                        Array.isArray(item.addons) &&
                                        item.addons.length > 0
                                      ) {
                                        const addonText = item.addons
                                          .map((a) => a.name)
                                          .filter(Boolean)
                                          .join(", ");
                                        if (addonText)
                                          text += `\n  + ${addonText}`;
                                      }

                                      const note = item.note || item.notes;
                                      if (note) {
                                        text += `\n  * Note: ${note}`;
                                      }
                                      return text;
                                    })
                                    .join("\n")}
                                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-violet-600 border-b border-r border-violet-400/50 rotate-45"></div>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${isDelayed ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}
                            >
                              <Clock size={14} />
                              {elapsedMinutes}m
                            </div>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => {
                                const itemIds = pendingItems.map((i) => i.id);
                                markAllReady(order.id, currentKot, itemIds);
                              }}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 ml-auto text-xs"
                            >
                              <CheckCircle size={14} />
                              Mark Ready
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
