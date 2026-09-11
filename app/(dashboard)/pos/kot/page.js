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

import PosAdminBadge from "../../../components/ui/PosAdminBadge";
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
    if (activeBranch?.id) {
      dispatch({ type: "socket/reconnect", payload: activeBranch.id });
    }
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

  const updateOrderStatus = (orderId, kotNumber, itemIds, status) => {
    dispatch(updateKDSOrderStatus({ orderId, kotNumber, itemIds, status }))
      .unwrap()
      .then(() => fetchKOTs())
      .catch((err) => alert("Failed to update status: " + err));
  };

  return (
    <div className="flex flex-col bg-brand-bg font-sans">
      <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-5">
        {/* Header & Global Actions */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">
              Kitchen Display (KDS)
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Real-time management of active Kitchen Order Tickets.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Branch Selector */}
            {branches && branches.length > 0 && (
              <div className="relative flex items-center gap-2 bg-white border border-brand-border rounded-xl px-3 py-2 shadow-sm">
                <Building2 size={14} className="text-brand-muted shrink-0" />
                <select
                  value={activeBranch?.id || ""}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="text-sm font-semibold text-brand-dark outline-none bg-transparent cursor-pointer pr-2"
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
              className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-dark text-white hover:bg-brand-dark/90 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
            >
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
              Refresh KOTs
            </button>
          </div>
        </div>

        {/* KOT List / Table CONTENT */}
        {!activeBranch ? (
          <div className="flex flex-col items-center justify-center text-brand-muted min-h-[400px] mt-4">
            <Building2 size={64} className="mb-4 text-brand-placeholder" />
            <h3 className="text-xl font-bold text-brand-dark">
              No Branch Selected
            </h3>
            <p className="text-sm mt-2">
              Please select a branch from the dropdown above to view pending
              Kitchen Orders.
            </p>
          </div>
        ) : orders?.length === 0 && loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] mt-4">
            <LottieLoader text="Loading KOTs..." />
          </div>
        ) : orders.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center text-brand-muted/70 min-h-[400px] mt-4">
            <CheckCircle
              size={64}
              className="mb-4 text-brand-success opacity-50"
            />
            <h3 className="text-xl font-bold text-brand-dark">
              All caught up!
            </h3>
            <p className="text-sm mt-2">
              No pending orders in the kitchen queue right now.
            </p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-5 mt-4">
            <div className="rounded-2xl border border-brand-border bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border bg-brand-light text-[11px] font-black text-brand-muted/70 uppercase tracking-wider">
                      <th className="py-3.5 px-6 w-1/4">Order ID / Type</th>
                      <th className="py-3.5 px-4 w-1/4">Order Items</th>
                      <th className="py-3.5 px-4 w-1/6">Status</th>
                      <th className="py-3.5 px-4 text-center">Time Elapsed</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-sm">
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
                          className="hover:bg-brand-bg/60 transition-colors duration-150"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isTable ? "bg-brand-light text-brand-primary" : "bg-brand-warning/10 text-brand-warning"}`}
                              >
                                {isTable ? (
                                  <UtensilsCrossed size={18} />
                                ) : (
                                  <Store size={18} />
                                )}
                              </div>
                              <div>
                                <div className="text-lg font-bold text-brand-dark">
                                  {orderLabel}
                                </div>
                                <div className="text-xs font-medium text-brand-muted uppercase tracking-wider">
                                  #{order.order_number}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 align-top">
                            <div className="flex flex-col gap-3">
                              {pendingItems.map((item, idx) => {
                                const qty = item.quantity || item.qty || 1;
                                const name =
                                  item.product?.name ||
                                  item.name ||
                                  item.item_name ||
                                  "Unknown";
                                let variantText = "";

                                if (item.variant) {
                                  const vName =
                                    typeof item.variant === "string"
                                      ? item.variant
                                      : item.variant.name || "";
                                  if (vName) variantText = `(${vName})`;
                                } else if (
                                  item.variants &&
                                  Array.isArray(item.variants) &&
                                  item.variants.length > 0
                                ) {
                                  variantText = `(${item.variants.map((v) => v.name || v).join(", ")})`;
                                }

                                const addons =
                                  item.addons &&
                                  Array.isArray(item.addons) &&
                                  item.addons.length > 0
                                    ? item.addons
                                        .map((a) => a.name)
                                        .filter(Boolean)
                                        .join(", ")
                                    : null;

                                const note = item.note || item.notes;

                                return (
                                  <div
                                    key={idx}
                                    className="flex flex-col gap-0.5"
                                  >
                                    <div className="text-sm font-semibold text-brand-dark flex items-start gap-2 leading-tight">
                                      <span className="bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded text-[11px] mt-0.5 shrink-0">
                                        {qty}x
                                      </span>
                                      <span>
                                        {name}{" "}
                                        {variantText && (
                                          <span className="text-brand-muted font-normal">
                                            {variantText}
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                    {addons && (
                                      <div className="text-xs text-brand-muted pl-8">
                                        + {addons}
                                      </div>
                                    )}
                                    {note && (
                                      <div className="text-xs text-brand-warning pl-8">
                                        * Note: {note}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </td>

                          <td className="py-4 px-4 align-middle">
                            <span className="px-2.5 py-1 bg-brand-warning/10 border border-brand-warning/20 text-brand-warning text-xs font-bold rounded-lg capitalize inline-block mt-1">
                              {order.order_status || order.status || "Pending"}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${isDelayed ? "bg-brand-danger/10 text-brand-danger" : "bg-brand-light text-brand-dark"}`}
                            >
                              <Clock size={14} />
                              {elapsedMinutes}m
                            </div>
                          </td>

                          <td className="py-4 px-6 text-right">
                            {pendingItems.some(i => i.status === "Preparing" || i.kds_status === "Preparing") ||
                            order.order_status === "Preparing" ||
                            order.status === "Preparing" ||
                            order.kds_status === "Preparing" ? (
                              <button
                                onClick={() => {
                                  const itemIds = pendingItems.map((i) => i.id);
                                  updateOrderStatus(
                                    order.id,
                                    currentKot,
                                    itemIds,
                                    "Ready",
                                  );
                                }}
                                className="px-4 py-2 bg-brand-success hover:bg-brand-success/90 text-white font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 ml-auto text-xs"
                              >
                                <CheckCircle size={14} />
                                Mark Ready
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const itemIds = pendingItems.map((i) => i.id);
                                  updateOrderStatus(
                                    order.id,
                                    currentKot,
                                    itemIds,
                                    "Preparing",
                                  );
                                }}
                                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 ml-auto text-xs"
                              >
                                <UtensilsCrossed size={14} />
                                Start Prep
                              </button>
                            )}
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
