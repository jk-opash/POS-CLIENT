"use client";

import { useState, useMemo, useEffect } from "react";
import InventoryTabFilters from "./components/InventoryTabFilters";
import InventoryTabTable from "./components/InventoryTabTable";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventoryItems,
  createInventoryItem,
  deleteInventoryItem,
  adjustInventoryStock,
} from "../../store/slices/inventorySlice";
import { fetchBranches } from "../../store/slices/branchSlice";
import {
  Package,
  Search,
  Settings2,
  Trash2,
  Plus,
  X,
  Save,
  AlertCircle,
  Upload,
  Clock,
  LayoutGrid,
  List,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  ClipboardList,
  TrendingUp,
  RotateCcw,
  ShieldAlert,
  ChevronDown,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

// Extracted Components
import AdjustmentsTab from "./components/AdjustmentsTab";
import AuditLogTab from "./components/AuditLogTab";
import AddItemModal from "./components/AddItemModal";
import ActionModal from "./components/ActionModal";
import ItemDetailModal from "./components/ItemDetailModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

// ═══════════════════════════════════════════════════════════════════════
// ── Main Page ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
export default function InventoryPage() {
  const [collapsed, setCollapsed] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const businessId =
    user?.businesses?.[0]?.id || user?.businessId || user?.business_id;
  const dispatch = useDispatch();

  const { branches } = useSelector((state) => state.branch);
  const {
    items: inventory,
    loading,
    error,
  } = useSelector((state) => state.inventory);

  const [branchFilter, setBranchFilter] = useState("");

  // Fetch branches on mount (handles direct page load / hard refresh)
  useEffect(() => {
    if (businessId) {
      dispatch(fetchBranches(businessId));
    }
  }, [businessId, dispatch]);

  // Auto-select first branch when branches load
  useEffect(() => {
    if (!branchFilter && branches && branches.length > 0) {
      setBranchFilter(branches[0].id);
    }
  }, [branches, branchFilter]);

  useEffect(() => {
    if (branchFilter) {
      dispatch(fetchInventoryItems({ branchId: branchFilter }));
    }
  }, [branchFilter, dispatch]);

  const [activeTab, setActiveTab] = useState("stock");
  const [showAdd, setShowAdd] = useState(false);
  const [actionModal, setActionModal] = useState({
    visible: false,
    type: "adjustments",
    item: null,
  });

  const [deleteItem, setDeleteItem] = useState(null);

  const TABS = [
    { key: "stock", label: "Stock List", icon: Package },
    { key: "adjustments", label: "Adjustments", icon: RotateCcw },
    { key: "audit", label: "Audit Log", icon: ClipboardList },
  ];

  const FAB_ACTIONS = [
    {
      key: "adjustments",
      label: "Adjustment",
      icon: RotateCcw,
      color: "bg-blue-500",
    },
    {
      key: "quarantine",
      label: "Quarantine",
      icon: ShieldAlert,
      color: "bg-orange-500",
    },
    {
      key: "transfers",
      label: "Transfer",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      key: "replenish",
      label: "Replenish",
      icon: ArrowUpCircle,
      color: "bg-emerald-500",
    },
  ];
  const [showFabMenu, setShowFabMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const categories = useMemo(
    () => ["all", ...new Set(inventory.map((i) => i.category))],
    [inventory],
  );
  const statuses = ["all", "Normal", "Low", "Critical", "Out of Stock"];

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.sku || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchCat = catFilter === "all" || item.category === catFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [inventory, searchQuery, statusFilter, catFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await dispatch(deleteInventoryItem(deleteItem.id)).unwrap();
      setDeleteItem(null);
    } catch (e) {
      console.error("Failed to delete item", e);
    }
  };

  const handleActionSubmit = async (product, delta, reason, notes) => {
    try {
      await dispatch(
        adjustInventoryStock({
          item_id: product.id,
          quantity_change: delta,
          reason: reason,
        }),
      ).unwrap();
    } catch (e) {
      console.error("Failed to adjust stock", e);
    }
  };

  const now = new Date();
  const dateString = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={() => setCollapsed((c) => !c)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-5">
          {/* Header & Global Actions */}
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Inventory</h2>
              <p className="mt-1 text-sm text-slate-500">
                Real-time management of stock, adjustments, and inventory
                tracking.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Branch Selector */}
              <div className="relative flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                <Building2 size={14} className="text-slate-500 shrink-0" />
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="text-sm font-semibold text-slate-700 outline-none bg-transparent cursor-pointer pr-2"
                >
                  {branches?.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowAdd(true)}
                disabled={!branchFilter}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>
          </div>

          {/* Pos-admin Tabs */}
          <div className="border-b border-slate-200 bg-white/50 flex flex-row gap-2 backdrop-blur-md rounded-t-2xl px-2">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap py-4 px-2 border-b-2 font-bold text-sm transition-all duration-300 ease-spring ${
                    activeTab === tab.key
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <tab.icon size={16} className="inline mr-2 -mt-0.5" />
                  {tab.label}
                </button>
              ))}
            </nav>
            {/* Search & Filter Bar */}
            {activeTab === "stock" && (
              <InventoryTabFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                catFilter={catFilter}
                setCatFilter={setCatFilter}
                branchFilter={branchFilter}
                setBranchFilter={setBranchFilter}
                categories={categories}
                statuses={statuses}
                branches={branches}
              />
            )}
          </div>

          <div className="space-y-4 md:space-y-5">
            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "stock" && (
                  <InventoryTabTable
                    paginatedItems={paginatedItems}
                    filteredItems={filteredItems}
                    onAdjust={(item) =>
                      setActionModal({
                        visible: true,
                        type: "adjustments",
                        item,
                      })
                    }
                    onDelete={setDeleteItem}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                  />
                )}
                {activeTab === "adjustments" && (
                  <AdjustmentsTab branchId={branchFilter} />
                )}
                {activeTab === "audit" && (
                  <AuditLogTab branchId={branchFilter} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showAdd && (
        <AddItemModal
          branchId={branchFilter}
          onClose={() => setShowAdd(false)}
        />
      )}
      {actionModal.visible && (
        <ActionModal
          visible={actionModal.visible}
          type={actionModal.type}
          initialItem={actionModal.item}
          inventory={inventory}
          onSubmit={handleActionSubmit}
          onClose={() =>
            setActionModal({ visible: false, type: "adjustments", item: null })
          }
        />
      )}
      {deleteItem && (
        <DeleteConfirmModal
          item={deleteItem}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteItem(null)}
        />
      )}
    </div>
  );
}
