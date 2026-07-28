"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DataTable from "../components/DataTable";
import { useCustomers } from "../components/Providers";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

function CustomerModal({ customer, onSave, onClose }) {
  const [form, setForm] = useState(
    customer || { name: "", phone: "", email: "" },
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={customer ? "Edit Customer" : "Add Customer"}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
          onClose();
        }}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <div>
          <label
            style={{
              fontSize: 12,
              color: "var(--color-text-secondary)",
              display: "block",
              marginBottom: 5,
            }}
          >
            Full Name *
          </label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            placeholder="Rahul Sharma"
          />
        </div>
        <div>
          <label
            style={{
              fontSize: 12,
              color: "var(--color-text-secondary)",
              display: "block",
              marginBottom: 5,
            }}
          >
            Phone *
          </label>
          <input
            className="input"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            required
            placeholder="9999000001"
          />
        </div>
        <div>
          <label
            style={{
              fontSize: 12,
              color: "var(--color-text-secondary)",
              display: "block",
              marginBottom: 5,
            }}
          >
            Email
          </label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="rahul@example.com"
          />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button type="button" variant="surface" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="accent">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function CustomerDetailModal({ customer, onClose }) {
  const tier =
    customer.loyaltyPoints >= 1000
      ? "Gold"
      : customer.loyaltyPoints >= 500
        ? "Silver"
        : "Bronze";
  const tierColors = { Gold: "#f59e0b", Silver: "#64748b", Bronze: "#b45309" };

  return (
    <Modal isOpen={true} onClose={onClose} title="Customer Profile">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 99,
            background: "linear-gradient(135deg, #ff6b35, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          {customer.name[0]}
        </div>
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "var(--color-text-primary)",
            }}
          >
            {customer.name}
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            📱 {customer.phone}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              marginTop: 6,
              padding: "3px 10px",
              background: tierColors[tier] + "20",
              borderRadius: 99,
            }}
          >
            <span style={{ fontSize: 12 }}>⭐</span>
            <span
              style={{ fontSize: 11, fontWeight: 700, color: tierColors[tier] }}
            >
              {tier} Member
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {[
          {
            label: "Total Spend",
            value: `₹${customer.totalSpend?.toLocaleString("en-IN") || 0}`,
            color: "#ff6b35",
          },
          { label: "Visits", value: customer.visits || 0, color: "#38bdf8" },
          {
            label: "Loyalty Points",
            value: customer.loyaltyPoints || 0,
            color: "#f59e0b",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--color-surface2)",
              borderRadius: 10,
              padding: "12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>
              {s.value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--color-text-muted)",
                marginTop: 3,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "var(--color-surface2)",
          borderRadius: 10,
          padding: "12px 14px",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "var(--color-text-muted)",
            marginBottom: 8,
          }}
        >
          LOYALTY STATUS
        </div>
        <div style={{ marginBottom: 6 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
              fontSize: 12,
            }}
          >
            <span style={{ color: "var(--color-text-secondary)" }}>
              Points to{" "}
              {tier === "Bronze"
                ? "Silver"
                : tier === "Silver"
                  ? "Gold"
                  : "Max"}
            </span>
            <span style={{ color: "#f59e0b" }}>
              {customer.loyaltyPoints} / {tier === "Bronze" ? 500 : 1000}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, (customer.loyaltyPoints / (tier === "Gold" ? 1000 : tier === "Silver" ? 1000 : 500)) * 100)}%`,
                background: tierColors[tier],
              }}
            />
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
          Last visit: {customer.lastVisit}
        </div>
      </div>
      {/* </div> */}
    </Modal>
  );
}

export default function CRMPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { customers, addCustomer, updateCustomer } = useCustomers();
  const [showAdd, setShowAdd] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [tierFilter, setTierFilter] = useState("all");

  const getTier = (pts) =>
    pts >= 1000 ? "Gold" : pts >= 500 ? "Silver" : "Bronze";

  const filtered = customers.filter((c) => {
    if (tierFilter !== "all" && getTier(c.loyaltyPoints) !== tierFilter)
      return false;
    return true;
  });

  const handleSave = (data) => {
    if (editCustomer) updateCustomer(editCustomer.id, data);
    else addCustomer(data);
    setEditCustomer(null);
  };

  const totalRevenue = customers.reduce((s, c) => s + (c.totalSpend || 0), 0);
  const avgSpend = customers.length
    ? Math.round(totalRevenue / customers.length)
    : 0;

  const columns = [
    {
      key: "name",
      label: "Customer",
      render: (_, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 99,
              flexShrink: 0,
              background: `linear-gradient(135deg, #ff6b35, #8b5cf6)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {row.name ? row.name[0] : 'U'}
          </div>
          <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>
            {row.name || 'Unknown'}
          </span>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (_, row) => (
        <span style={{ color: "var(--color-text-secondary)" }}>
          {row.phone}
        </span>
      ),
    },
    {
      key: "visits",
      label: "Visits",
      render: (_, row) => <span style={{ fontWeight: 600 }}>{row.visits}</span>,
    },
    {
      key: "totalSpend",
      label: "Total Spend",
      render: (_, row) => (
        <span style={{ fontWeight: 700, color: "#10b981" }}>
          ₹{row.totalSpend?.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "loyaltyPoints",
      label: "Loyalty Points",
      render: (_, row) => (
        <span style={{ fontWeight: 600, color: "#f59e0b" }}>
          {row.loyaltyPoints || 0} pts
        </span>
      ),
    },
    {
      key: "tier",
      label: "Tier",
      sortable: false,
      render: (_, row) => {
        const tier = getTier(row.loyaltyPoints || 0);
        const tierColors = {
          Gold: "#f59e0b",
          Silver: "#64748b",
          Bronze: "#b45309",
        };
        return (
          <span
            style={{
              background: tierColors[tier] + "20",
              color: tierColors[tier],
              padding: "4px 10px",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            ⭐ {tier}
          </span>
        );
      },
    },
    {
      key: "lastVisit",
      label: "Last Visit",
      render: (_, row) => (
        <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>
          {row.lastVisit}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      sortable: false,
      render: (_, row) => (
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewCustomer(row)}
          >
            View
          </Button>
          <Button
            variant="surface"
            size="sm"
            onClick={() => {
              setEditCustomer(row);
              setShowAdd(true);
            }}
          >
            Edit
          </Button>
        </div>
      ),
    },
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
        <main
          style={{
            flex: 1,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 12,
              marginBottom: 20,
              flexShrink: 0,
            }}
          >
            <div className="card-sm">
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--color-sky)",
                }}
              >
                {customers.length}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginTop: 3,
                }}
              >
                Total Customers
              </div>
            </div>
            <div className="card-sm">
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--color-amber)",
                }}
              >
                {customers.filter((c) => c.loyaltyPoints >= 1000).length}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginTop: 3,
                }}
              >
                ⭐ Gold Members
              </div>
            </div>
            <div className="card-sm">
              <div style={{ fontSize: 18, fontWeight: 700, color: "#ff6b35" }}>
                ₹{totalRevenue.toLocaleString("en-IN")}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginTop: 3,
                }}
              >
                Total Revenue
              </div>
            </div>
            <div className="card-sm">
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-emerald)",
                }}
              >
                ₹{avgSpend.toLocaleString("en-IN")}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginTop: 3,
                }}
              >
                Avg Spend / Customer
              </div>
            </div>
          </div>

          <DataTable
            data={filtered}
            columns={columns}
            searchPlaceholder="Search name or phone..."
            onAdd={() => {
              setEditCustomer(null);
              setShowAdd(true);
            }}
            addLabel="Add Customer"
            emptyIcon="👥"
            emptyMessage="No customers found"
            CustomFilters={() => (
              <Tabs
                tabs={[
                  { id: "all", label: "All" },
                  { id: "Gold", label: "⭐ Gold" },
                  { id: "Silver", label: "⭐ Silver" },
                  { id: "Bronze", label: "⭐ Bronze" },
                ]}
                activeTab={tierFilter}
                onChange={setTierFilter}
              />
            )}
          />
        </main>
      </div>

      {showAdd && (
        <CustomerModal
          customer={editCustomer}
          onSave={handleSave}
          onClose={() => {
            setShowAdd(false);
            setEditCustomer(null);
          }}
        />
      )}
      {viewCustomer && (
        <CustomerDetailModal
          customer={viewCustomer}
          onClose={() => setViewCustomer(null)}
        />
      )}
    </div>
  );
}
