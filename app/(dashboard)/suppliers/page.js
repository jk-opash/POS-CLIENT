"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

function SupplierModal({ supplier, onSave, onClose }) {
  const [form, setForm] = useState(
    supplier || { name: "", contact: "", phone: "", email: "", category: "" },
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={supplier ? "Edit Supplier" : "Add Supplier"}
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
            Company Name *
          </label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            placeholder="Fresh Farms Co."
          />
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
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
              Contact Person
            </label>
            <input
              className="input"
              value={form.contact}
              onChange={(e) => set("contact", e.target.value)}
              placeholder="Vikram Malhotra"
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
              Category
            </label>
            <input
              className="input"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="Vegetables, Dairy..."
            />
          </div>
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
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
              Phone
            </label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="9876001001"
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
              placeholder="contact@supplier.in"
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 8,
          }}
        >
          <Button type="button" variant="surface" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="accent">
            Save Supplier
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function SuppliersPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = suppliers.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = (data) => {
    if (editSupplier) updateSupplier(editSupplier.id, data);
    else addSupplier(data);
    setEditSupplier(null);
  };

  const totalOutstanding = suppliers.reduce(
    (s, sup) => s + (sup.outstanding || 0),
    0,
  );
  const totalPurchased = suppliers.reduce(
    (s, sup) => s + (sup.totalPurchased || 0),
    0,
  );

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
        <main style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {/* Summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <Card className="card-sm">
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {suppliers.length}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginTop: 3,
                }}
              >
                Total Suppliers
              </div>
            </Card>
            <Card className="card-sm">
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-amber)",
                }}
              >
                ₹{totalOutstanding.toLocaleString("en-IN")}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginTop: 3,
                }}
              >
                Outstanding Balance
              </div>
            </Card>
            <Card className="card-sm">
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-emerald)",
                }}
              >
                ₹{totalPurchased.toLocaleString("en-IN")}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                  marginTop: 3,
                }}
              >
                Total Purchased
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input
              className="input"
              placeholder="Search suppliers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 280 }}
            />
            <Button
              variant="accent"
              style={{ marginLeft: "auto" }}
              onClick={() => {
                setEditSupplier(null);
                setShowModal(true);
              }}
            >
              + Add Supplier
            </Button>
          </div>

          {/* Table */}
          <Card style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Contact</th>
                  <th>Category</th>
                  <th>Phone</th>
                  <th>Outstanding</th>
                  <th>Total Purchased</th>
                  <th>Last Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sup) => (
                  <tr key={sup.id}>
                    <td
                      style={{
                        fontWeight: 600,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {sup.name}
                    </td>
                    <td style={{ color: "var(--color-text-secondary)" }}>
                      {sup.contact}
                    </td>
                    <td>
                      <Badge variant="muted">{sup.category}</Badge>
                    </td>
                    <td
                      style={{
                        color: "var(--color-text-secondary)",
                        fontSize: 12,
                      }}
                    >
                      {sup.phone}
                    </td>
                    <td
                      style={{
                        fontWeight: 600,
                        color:
                          sup.outstanding > 0
                            ? "var(--color-amber)"
                            : "var(--color-emerald)",
                      }}
                    >
                      ₹{(sup.outstanding || 0).toLocaleString("en-IN")}
                    </td>
                    <td style={{ color: "var(--color-text-secondary)" }}>
                      ₹{(sup.totalPurchased || 0).toLocaleString("en-IN")}
                    </td>
                    <td
                      style={{ color: "var(--color-text-muted)", fontSize: 12 }}
                    >
                      {sup.lastOrder || "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Button
                          variant="surface"
                          size="sm"
                          onClick={() => {
                            setEditSupplier(sup);
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            if (confirm("Delete supplier?"))
                              deleteSupplier(sup.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "var(--color-text-muted)",
                }}
              >
                No suppliers found
              </div>
            )}
          </Card>
        </main>
      </div>

      {showModal && (
        <SupplierModal
          supplier={editSupplier}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditSupplier(null);
          }}
        />
      )}
    </div>
  );
}
