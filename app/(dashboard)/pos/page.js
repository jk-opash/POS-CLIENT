"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllOrders } from "../../store/slices/orderSlice";
import { fetchBranches } from "../../store/slices/branchSlice";
import {
  RefreshCcw,
  CheckCircle,
  Building2,
  UtensilsCrossed,
  Store,
  List,
  ShoppingBag,
} from "lucide-react";
import Tabs from "../../components/ui/Tabs";
import PosAdminBadge from "../menu/components/PosAdminBadge";
import LottieLoader from "../../components/common/LottieLoader";

export default function POSPage() {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { user } = useSelector((state) => state.auth || {});
  const { currentBranch, branches } = useSelector(
    (state) => state.branch || {},
  );
  const { allOrders, loading } = useSelector((state) => state.order || {});

  const activeBranch =
    branches?.find((b) => b.id === selectedBranchId) ||
    currentBranch ||
    (branches && branches.length > 0 ? branches[0] : null);

  useEffect(() => {
    if (user?.businesses?.[0]?.id && (!branches || branches.length === 0)) {
      dispatch(fetchBranches(user.businesses[0].id));
    }
  }, [user, branches, dispatch]);

  const fetchOrders = () => {
    if (activeBranch?.id) {
      dispatch(fetchAllOrders(activeBranch.id));
    }
  };

  useEffect(() => {
    fetchOrders();
    // Refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [activeBranch]);

  // POS-NEW logic formatting and filtering
  const formattedOrders = (allOrders || []).map((o) => {
    const orderDate = new Date(o.created_at || new Date());

    let items = [];
    try {
      const raw = o.running_order || o.cart_items;
      items = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (items && !Array.isArray(items) && Array.isArray(items.items)) {
        items = items.items;
      }
    } catch (e) {}

    const mappedItems = Array.isArray(items) ? items : [];

    return {
      ...o,
      orderType:
        (o.order_type === "Dine-in" ? "Dine In" : o.order_type) || "Takeaway",
      tableLabel:
        o.table?.name ||
        (o.table_id ? `Table ${o.table_id}` : o.order_type || "Takeaway"),
      mappedItems,
    };
  });

  const filteredOrders = formattedOrders.filter((o) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Dine In" && o.orderType === "Dine In") return true;
    if (activeFilter === "Takeaway" && o.orderType === "Takeaway") return true;
    return false;
  });

  return (
    <div className="flex flex-col bg-brand-bg font-sans">
      <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-5">
        {/* Header & Global Actions */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">Branch Orders</h2>
            <p className="mt-1 text-sm text-brand-muted">
              View all historical and active orders for the branch.
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
              onClick={fetchOrders}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-dark text-white hover:bg-brand-dark/90 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
            >
              <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        <div className="flex w-full overflow-x-auto pb-1 border-b border-brand-border">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {[
              { key: "All", label: "All Orders", icon: List },
              { key: "Dine In", label: "Dine In", icon: UtensilsCrossed },
              { key: "Takeaway", label: "Takeaway", icon: ShoppingBag },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`whitespace-nowrap py-4 px-2 border-b-2 font-bold text-sm transition-all duration-300 ${
                  activeFilter === tab.key
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-brand-muted hover:text-brand-dark hover:border-brand-borderHover"
                }`}
              >
                <tab.icon size={16} className="inline mr-2 -mt-0.5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Orders Table CONTENT */}
        {!activeBranch ? (
          <div className="flex flex-col items-center justify-center text-brand-muted min-h-[400px] mt-4">
            <Building2 size={64} className="mb-4 text-brand-placeholder" />
            <h3 className="text-xl font-bold text-brand-dark">
              No Branch Selected
            </h3>
            <p className="text-sm mt-2">
              Please select a branch to view orders.
            </p>
          </div>
        ) : (allOrders?.length === 0 && loading) ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] mt-4">
            <LottieLoader text="Loading orders..." />
          </div>
        ) : filteredOrders.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center text-brand-placeholder min-h-[400px] mt-4">
            <CheckCircle
              size={64}
              className="mb-4 text-brand-success opacity-50"
            />
            <h3 className="text-xl font-bold text-brand-dark">
              No Orders Found
            </h3>
            <p className="text-sm mt-2">
              There are no orders matching this filter.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-light text-[11px] font-black text-brand-placeholder uppercase tracking-wider">
                    <th className="py-3.5 px-6">Order ID / Type</th>
                    <th className="py-3.5 px-4">Customer / Table</th>
                    <th className="py-3.5 px-4">Items Summary</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-light text-sm">
                  {filteredOrders.map((order) => {
                    const isTable =
                      !!order.table_id || order.orderType === "Dine In";

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-brand-light transition-colors duration-150"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isTable ? "bg-brand-primaryLight text-brand-primary" : "bg-brand-warningLight text-brand-warning"}`}
                            >
                              {isTable ? (
                                <UtensilsCrossed size={18} />
                              ) : (
                                <Store size={18} />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-brand-dark">
                                {order.orderType}
                              </div>
                              <div className="text-xs font-medium text-brand-muted uppercase tracking-wider">
                                #{order.order_number}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {isTable ? (
                            <div>
                              <div className="font-bold text-brand-dark">
                                {order.tableLabel}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-bold text-brand-dark">
                                {order.customer?.name ||
                                  order.customer_info?.name ||
                                  order.customer_name ||
                                  "Walk-in"}
                              </div>
                              <div className="text-xs text-brand-muted">
                                {order.customer?.phone ||
                                  order.customer_info?.phone ||
                                  order.customer_phone ||
                                  "-"}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="group relative flex items-center cursor-default">
                            <PosAdminBadge variant="purple">
                              {order.mappedItems.reduce(
                                (acc, item) =>
                                  acc + (item.quantity || item.qty || 1),
                                0,
                              )}{" "}
                              Items
                            </PosAdminBadge>

                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out">
                              <div className="bg-gradient-to-br from-brand-purple to-brand-purple text-white text-[11px] font-medium p-3 rounded-xl shadow-[0_10px_25px_-5px_rgba(139,92,246,0.5)] border border-brand-purple/50 w-max max-w-[260px] whitespace-pre-wrap text-left leading-relaxed relative">
                                {order.mappedItems.length > 0
                                  ? order.mappedItems
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
                                        if (note) text += `\n  * Note: ${note}`;
                                        return text;
                                      })
                                      .join("\n")
                                  : "No items recorded"}
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand-purple border-b border-r border-brand-purple/50 rotate-45"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-brand-dark">
                          ₹{order.total_amount || order.total || 0}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 text-[11px] font-bold rounded-lg border ${order.status === "Pending" ? "bg-brand-warningLight text-brand-warning border-brand-warningLight" : "bg-brand-successLight text-brand-success border-brand-successLight"}`}
                          >
                            {order.payment_status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
