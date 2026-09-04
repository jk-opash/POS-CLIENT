"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import api from "../../../lib/api";
import {
  updateInventoryItem,
  deleteInventoryItem,
} from "../../../store/slices/inventorySlice";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { cn } from "../../../lib/utils";
import {
  ChevronLeft,
  Edit,
  AlertCircle,
  Package,
  Barcode,
  Tag,
  Scale,
  IndianRupee,
  BellRing,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import LottieLoader from "../../../components/common/LottieLoader";

// Edit Item Modal
function EditItemModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({
    name: item?.name || "",
    sku: item?.sku || "",
    category: item?.category || "",
    unit: item?.unit || "pcs",
    price: item?.price || "",
    reorderLevel: item?.reorderLevel || item?.reorder_level || "",
    status: item?.status || "Normal",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Item Details">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-brand-muted block mb-1">
              Item Name *
            </label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-brand-muted block mb-1">SKU *</label>
            <input
              className="input"
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-brand-muted block mb-1">
              Category
            </label>
            <input
              className="input"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-brand-muted block mb-1">Unit</label>
            <select
              className="input select"
              value={form.unit}
              onChange={(e) => set("unit", e.target.value)}
            >
              <option value="pcs">Pieces (pcs)</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="g">Grams (g)</option>
              <option value="l">Liters (L)</option>
              <option value="ml">Milliliters (ml)</option>
              <option value="box">Boxes</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-brand-muted block mb-1">
              Price (₹)
            </label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-brand-muted block mb-1">
              Reorder Level
            </label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.reorderLevel}
              onChange={(e) => set("reorderLevel", e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-brand-border">
          <Button type="button" variant="surface" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Info Item Component
function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 items-start p-4 rounded-lg bg-brand-bg/50 border border-brand-border">
      <div className="p-2 bg-white rounded border border-brand-border text-brand-muted/70 mt-0.5">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs font-medium text-brand-muted mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-brand-dark">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}

export default function ItemDetailsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ledger, setLedger] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/inventory/items/${id}`);
        if (res.data.success) {
          setItem(res.data.data);
        } else {
          setError("Item not found");
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch item details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id]);

  useEffect(() => {
    if (activeTab === "ledger") {
      const fetchLedger = async () => {
        try {
          setLoadingLedger(true);
          const res = await api.get(`/inventory/ledger/item/${id}`);
          if (res.data.success) {
            setLedger(res.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch ledger", err);
        } finally {
          setLoadingLedger(false);
        }
      };
      fetchLedger();
    }
  }, [activeTab, id]);

  const handleSaveItem = async (data) => {
    try {
      const payload = {
        name: data.name,
        sku: data.sku,
        category: data.category,
        unit: data.unit,
        price: parseFloat(data.price) || 0,
        reorder_level: parseFloat(data.reorderLevel) || 0,
      };
      const res = await dispatch(
        updateInventoryItem({ id, data: payload }),
      ).unwrap();

      // Update local state to reflect changes immediately
      setItem({
        ...item,
        name: res.name,
        sku: res.sku,
        category: res.category,
        unit: res.unit,
        price: res.cost, // slice maps to cost
        reorder_level: res.reorderLevel,
      });
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update item", err);
    }
  };

  const handleDeleteItem = async () => {
    if (
      confirm(
        "Are you sure you want to delete this inventory item? This action cannot be undone.",
      )
    ) {
      try {
        await dispatch(deleteInventoryItem(id)).unwrap();
        router.push("/inventory");
      } catch (err) {
        console.error("Failed to delete item", err);
      }
    }
  };

  if (loading && !item) {
    return <LottieLoader fullScreen text="Loading item details..." />;
  }

  if (error && !item) {
    return (
      <div className="flex h-screen bg-brand-bg items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-brand-danger mx-auto" />
          <h2 className="text-lg font-bold text-brand-dark">Item Not Found</h2>
          <p className="text-brand-muted text-sm max-w-sm">{error}</p>
          <Button variant="primary" onClick={() => router.push("/inventory")}>
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="flex flex-col bg-brand-bg font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-6 py-6">
          <div className="space-y-6 pb-12">
            {/* Back Button */}
            <div>
              <button
                onClick={() => router.push("/inventory")}
                className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Inventory
              </button>
            </div>

            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-brand-dark">
                    {item.name}
                  </h1>
                  <Badge
                    variant={
                      item.status === "Normal"
                        ? "success"
                        : item.status === "Low" || item.status === "Critical"
                          ? "warning"
                          : "danger"
                    }
                    dot={
                      item.status === "Normal" || item.status === "Out of Stock"
                    }
                  >
                    {item.status || "Normal"}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-2 text-sm text-brand-muted capitalize">
                  <Package className="h-4 w-4" />{" "}
                  {item.category || "Uncategorized"}
                  <span className="text-brand-muted/70">|</span>
                  Created{" "}
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
                <Button
                  variant="danger"
                  onClick={handleDeleteItem}
                  className="bg-brand-dangerLight text-brand-danger hover:bg-brand-danger/20 border-none shadow-none"
                >
                  Delete Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" /> Edit
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-brand-border">
              <nav
                className="-mb-px flex space-x-6 overflow-x-auto"
                aria-label="Tabs"
              >
                {[
                  { id: "overview", label: "Overview" },
                  { id: "ledger", label: "Stock Ledger" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                      activeTab === tab.id
                        ? "border-brand-dark text-brand-dark"
                        : "border-transparent text-brand-muted hover:border-brand-border hover:text-brand-dark",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
                  <div className="space-y-6">
                    <Card>
                      <h3 className="text-sm font-bold text-brand-dark mb-4">
                        Master Information
                      </h3>
                      <div className="space-y-3">
                        <InfoItem
                          icon={Barcode}
                          label="SKU Code"
                          value={item.sku}
                        />
                        <InfoItem
                          icon={Tag}
                          label="Category"
                          value={item.category}
                        />
                        <InfoItem
                          icon={Scale}
                          label="Unit of Measurement"
                          value={item.unit}
                        />
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <h3 className="text-sm font-bold text-brand-dark mb-4">
                        Pricing & Inventory Levels
                      </h3>
                      <div className="space-y-3">
                        <InfoItem
                          icon={IndianRupee}
                          label="Unit Price"
                          value={`₹${item.price || item.cost || 0}`}
                        />
                        <InfoItem
                          icon={BellRing}
                          label="Reorder Level"
                          value={`${item.reorder_level || item.reorderLevel || 0} ${item.unit || "pcs"}`}
                        />

                        <div className="flex gap-3 items-start p-4 rounded-lg bg-brand-primaryLight border border-brand-primary/20 mt-4">
                          <div className="p-2 bg-white rounded border border-brand-primary/30 text-brand-primary mt-0.5">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-brand-primary mb-0.5 uppercase tracking-wider">
                              Current Stock
                            </p>
                            <p className="text-2xl font-black text-brand-dark">
                              {item.in_stock || item.currentStock || 0}{" "}
                              <span className="text-sm font-semibold text-brand-muted">
                                {item.unit || "pcs"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "ledger" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
                  <Card padding="none">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-brand-border bg-brand-bg/50 text-xs font-bold text-brand-muted uppercase tracking-wider">
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-right">Qty Change</th>
                            <th className="px-6 py-4">Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border">
                          {loadingLedger ? (
                            <tr>
                              <td
                                colSpan={4}
                                className="px-6 py-12 text-center"
                              >
                                <div className="flex justify-center">
                                  <LottieLoader text="Loading ledger..." />
                                </div>
                              </td>
                            </tr>
                          ) : ledger.length === 0 ? (
                            <tr>
                              <td
                                colSpan={4}
                                className="px-6 py-12 text-center text-brand-muted"
                              >
                                No stock movements recorded yet.
                              </td>
                            </tr>
                          ) : (
                            ledger.map((entry) => {
                              const isPositive =
                                Number(entry.quantity_change) > 0;
                              return (
                                <tr
                                  key={entry.id}
                                  className="hover:bg-brand-bg/50 transition-colors"
                                >
                                  <td className="px-6 py-4">
                                    <div className="font-medium text-brand-dark">
                                      {new Date(
                                        entry.created_at,
                                      ).toLocaleDateString()}
                                    </div>
                                    <div className="text-xs text-brand-muted">
                                      {new Date(
                                        entry.created_at,
                                      ).toLocaleTimeString()}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <Badge
                                      variant={
                                        entry.movement_type === "ADJUSTMENT"
                                          ? "muted"
                                          : entry.movement_type === "SALE"
                                            ? "danger"
                                            : "success"
                                      }
                                    >
                                      {entry.movement_type}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <div
                                      className={cn(
                                        "inline-flex items-center gap-1 font-bold",
                                        isPositive
                                          ? "text-brand-success"
                                          : "text-brand-danger",
                                      )}
                                    >
                                      {isPositive ? (
                                        <ArrowUpRight className="w-4 h-4" />
                                      ) : (
                                        <ArrowDownRight className="w-4 h-4" />
                                      )}
                                      {Math.abs(entry.quantity_change)}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-brand-dark">
                                    {entry.reason || "-"}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {showEditModal && (
        <EditItemModal
          item={item}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
}
