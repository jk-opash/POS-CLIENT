"use client";

import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../store/slices/supplierSlice";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LottieLoader from "../../components/common/LottieLoader";

// Extracted Components
import SupplierTabFilters from "./components/SupplierTabFilters";
import SupplierTabTable from "./components/SupplierTabTable";
import SupplierModal from "./components/SupplierModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

export default function SuppliersPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const businessId =
    user?.businesses?.[0]?.id || user?.businessId || user?.business_id;

  const { items: suppliers, loading } = useSelector((state) => state.supplier);

  // Fetch on mount
  useEffect(() => {
    if (businessId) {
      dispatch(fetchSuppliers({ businessId }));
    }
  }, [businessId, dispatch]);

  const [activeTab, setActiveTab] = useState("suppliers"); // 'suppliers'

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const [modalState, setModalState] = useState({
    visible: false,
    supplier: null,
  });
  const [deleteItem, setDeleteItem] = useState(null);

  const filteredItems = useMemo(() => {
    return suppliers.filter((item) => {
      const matchSearch =
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contact?.person
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [suppliers, searchQuery, statusFilter]);

  // Paginated Items
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleSaveSupplier = async (data) => {
    try {
      if (modalState.supplier) {
        // Edit
        await dispatch(
          updateSupplier({ id: modalState.supplier.id, data }),
        ).unwrap();
      } else {
        // Create
        await dispatch(
          createSupplier({ ...data, business_id: businessId }),
        ).unwrap();
      }
      setModalState({ visible: false, supplier: null });
    } catch (error) {
      console.error("Failed to save supplier:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await dispatch(deleteSupplier(deleteItem.id)).unwrap();
      setDeleteItem(null);
    } catch (e) {
      console.error("Failed to archive supplier:", e);
    }
  };

  const tabs = [{ id: "suppliers", label: "Suppliers List" }];

  return (
    <div className="flex flex-col bg-brand-bg font-sans h-full">
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-5">
          {/* Header & Global Actions */}
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-brand-dark">
                Suppliers Hub
              </h2>
              <p className="mt-1 text-sm text-brand-muted">
                Manage your vendors, contacts, and supply chain.
              </p>
            </div>

            {activeTab === "suppliers" && (
              <SupplierTabFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setModalState({ visible: true, supplier: null })}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-dark text-white hover:bg-brand-dark/90 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2"
              >
                <Plus size={16} /> Add Supplier
              </button>
            </div>
          </div>

          <div className="space-y-4 md:space-y-5">
            {loading ? (
              <div className="flex justify-center min-h-[200px] items-center">
                <LottieLoader text="Loading suppliers..." />
              </div>
            ) : activeTab === "suppliers" && (
              <SupplierTabTable
                paginatedItems={paginatedItems}
                filteredItems={filteredItems}
                onEdit={(supplier) =>
                  setModalState({ visible: true, supplier })
                }
                onDelete={setDeleteItem}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <SupplierModal
        visible={modalState.visible}
        supplier={modalState.supplier}
        onClose={() => setModalState({ visible: false, supplier: null })}
        onSave={handleSaveSupplier}
      />

      <DeleteConfirmModal
        item={deleteItem}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteItem(null)}
      />
    </div>
  );
}
