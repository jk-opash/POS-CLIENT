"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useOrders } from "../components/Providers";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const STATION_COLORS = {
  "dine-in": "#38bdf8",
  takeaway: "#f59e0b",
  delivery: "#8b5cf6",
};

function KDSTicket({ order, onAdvance }) {
  const elapsed = Math.round((Date.now() - new Date(order.createdAt)) / 60000);
  const isUrgent = elapsed > 15;
  const isLate = elapsed > 25;

  const nextLabel = {
    received: "Start Preparing",
    preparing: "Mark Ready",
    ready: "Mark Served",
  };

  return (
    <Card
      style={{
        border: `2px solid ${isLate ? "var(--color-rose)" : isUrgent ? "var(--color-amber)" : "var(--color-border)"}`,
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* KOT Header */}
      <div
        style={{
          background: isLate
            ? "rgba(244,63,94,0.15)"
            : isUrgent
              ? "rgba(245,158,11,0.12)"
              : "var(--color-surface2)",
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, color: "var(--color-text-primary)", fontSize: 14 }}>
            {order.id}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>
            {order.tableName
              ? `🪑 ${order.tableName}`
              : order.type === "takeaway"
                ? "📦 Takeaway"
                : "🛵 Delivery"}
            {" · "}
            {order.customerName}
          </div>
        </div>
        <div
          style={{
            background: isLate
              ? "rgba(244,63,94,0.2)"
              : isUrgent
                ? "rgba(245,158,11,0.2)"
                : "var(--color-border)",
            color: isLate ? "var(--color-rose)" : isUrgent ? "var(--color-amber)" : "var(--color-text-secondary)",
            borderRadius: 99,
            padding: "4px 10px",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {elapsed}m
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: "12px 14px", flex: 1 }}>
        {order.items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              padding: "7px 0",
              borderBottom:
                i < order.items.length - 1
                  ? "1px dashed var(--color-border)"
                  : "none",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: "var(--color-surface2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: "var(--color-accent)",
                flexShrink: 0,
              }}
            >
              {item.qty}
            </div>
            <span style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 500 }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Action */}
      {order.status !== "served" && order.status !== "cancelled" && (
        <div
          style={{
            padding: "10px 14px",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <Button
            variant="accent"
            style={{ width: "100%" }}
            onClick={() => onAdvance(order.id)}
          >
            {nextLabel[order.status] || "Done"}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function KDSPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { orders, advanceStatus } = useOrders();

  const kitchenOrders = orders.filter((o) =>
    ["received", "preparing", "ready"].includes(o.status),
  );

  const columns = [
    { key: "received", label: "🔔 New Orders", color: "#f59e0b" },
    { key: "preparing", label: "🍳 Preparing", color: "#38bdf8" },
    { key: "ready", label: "✅ Ready", color: "#10b981" },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--color-bg)",
        overflow: "hidden",
      }}
    >
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Topbar onMenuClick={() => setCollapsed((c) => !c)} />
        <main style={{ flex: 1, overflow: "hidden", padding: "16px 20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              height: "100%",
            }}
          >
            {columns.map((col) => {
              const colOrders = kitchenOrders.filter(
                (o) => o.status === col.key,
              );
              return (
                <div
                  key={col.key}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  {/* Column header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "12px 12px 0 0",
                      background: col.color + "18",
                      border: `1px solid ${col.color}33`,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: col.color,
                        fontSize: 14,
                      }}
                    >
                      {col.label}
                    </span>
                    <span
                      style={{
                        background: col.color + "28",
                        color: col.color,
                        borderRadius: 99,
                        padding: "2px 10px",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {colOrders.length}
                    </span>
                  </div>

                  {/* Tickets */}
                  <div
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {colOrders.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px 20px",
                          color: "var(--color-text-muted)",
                          fontSize: 13,
                        }}
                      >
                        No {col.key} orders
                      </div>
                    ) : (
                      colOrders.map((order) => (
                        <KDSTicket
                          key={order.id}
                          order={order}
                          onAdvance={advanceStatus}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
