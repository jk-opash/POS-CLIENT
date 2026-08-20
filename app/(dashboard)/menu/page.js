"use client";

import { useState, useMemo, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../../store/slices/menuItemSlice";
import {
  fetchCategories,
  createCategory,
} from "../../store/slices/categorySlice";
import { fetchBranches } from "../../store/slices/branchSlice";
import MenuItemModal from "../../components/MenuItemModal";
import DeleteConfirmModal from "../inventory/components/DeleteConfirmModal";
import { Plus, Building2 } from "lucide-react";

import ItemsTabFilters from "./components/ItemsTabFilters";
import ItemsTabTable from "./components/ItemsTabTable";
import CategoriesTab from "./tabs/CategoriesTab";

export default function MenuPage() {
  const [collapsed, setCollapsed] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const businessId = user?.businesses?.[0]?.id;

  const { items } = useSelector((state) => state.menuItem);
  const { categories } = useSelector((state) => state.category);
  const { branches } = useSelector((state) => state.branch);

  const [branchFilter, setBranchFilter] = useState("");

  // Fetch branches once
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

  // Fetch menu items & categories when branch changes
  useEffect(() => {
    if (branchFilter) {
      dispatch(fetchMenuItems(branchFilter));
      dispatch(fetchCategories(branchFilter));
    }
  }, [branchFilter, dispatch]);

  const [activeTab, setActiveTab] = useState("items"); // 'items', 'categories', 'combos'

  // Filters for Items Tab
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [foodTypeFilter, setFoodTypeFilter] = useState("all");

  // Pagination state for Items Tab
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategoryFilter, foodTypeFilter]);

  // Modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleSaveItem = (item) => {
    if (editItem) {
      dispatch(updateMenuItem({ id: editItem.id, data: item })).then(() =>
        dispatch(fetchMenuItems(branchFilter)),
      );
    } else {
      dispatch(createMenuItem({ ...item, branch_id: branchFilter })).then(() =>
        dispatch(fetchMenuItems(branchFilter)),
      );
    }
    setShowItemModal(false);
  };

  const openEditItem = (item) => {
    setEditItem(item);
    setShowItemModal(true);
  };
  const openAddItem = () => {
    setEditItem(null);
    setShowItemModal(true);
  };

  const toggleAvailable = (id) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      const newStatus = item.status === "Active" ? "Inactive" : "Active";
      dispatch(
        updateMenuItem({
          id,
          data: { status: newStatus },
        }),
      ).then(() => dispatch(fetchMenuItems(branchFilter)));
    }
  };

  const handleDeleteItem = (item) => {
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch(deleteMenuItem(itemToDelete.id));
      setItemToDelete(null);
    }
  };

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.sub_category &&
          item.sub_category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategoryFilter === "all" ||
        item.categoryId === selectedCategoryFilter ||
        item.category_id === selectedCategoryFilter;
      const matchesFoodType =
        foodTypeFilter === "all" ||
        (item.food_type &&
          item.food_type.toLowerCase() === foodTypeFilter.toLowerCase()) ||
        (foodTypeFilter === "veg" && item.vegetarian);

      return matchesSearch && matchesCategory && matchesFoodType;
    });
  }, [items, searchQuery, selectedCategoryFilter, foodTypeFilter]);

  // Paginated Items
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const tabs = [
    { id: "items", label: "Menu Items" },
    { id: "categories", label: "Categories & Subcategories" },
  ];

  return (
    <div className="flex flex-col bg-slate-50 font-sans">
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-5">
          {/* Header & Global Actions */}
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Menu & Catalog
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Real-time management of categories, pricing, variants, and item
                availability.
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
                onClick={openAddItem}
                disabled={!branchFilter}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50"
              >
                <Plus size={16} /> Add Menu Item
              </button>
            </div>
          </div>

          {/* Pos-admin Tabs */}
          <div className="border-b border-slate-200 bg-white/50 flex flex-row gap-2 backdrop-blur-md rounded-t-2xl px-2">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-2 border-b-2 font-bold text-sm transition-all duration-300 ease-spring ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Search & Filter Bar */}
            {activeTab === "items" && (
              <ItemsTabFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategoryFilter={selectedCategoryFilter}
                setSelectedCategoryFilter={setSelectedCategoryFilter}
                foodTypeFilter={foodTypeFilter}
                setFoodTypeFilter={setFoodTypeFilter}
                categories={categories}
              />
            )}
          </div>

          {/* ITEMS TAB CONTENT */}
          {activeTab === "items" && (
            <div className="space-y-4 md:space-y-5">
              <ItemsTabTable
                paginatedItems={paginatedItems}
                filteredItems={filteredItems}
                categories={categories}
                toggleAvailable={toggleAvailable}
                openEditItem={openEditItem}
                deleteItem={handleDeleteItem}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
              />
            </div>
          )}

          {/* CATEGORIES TAB CONTENT */}
          {activeTab === "categories" && (
            <CategoriesTab categories={categories} branchId={branchFilter} />
          )}
        </main>
      </div>

      {showItemModal && (
        <MenuItemModal
          item={editItem}
          onSave={handleSaveItem}
          onClose={() => setShowItemModal(false)}
        />
      )}

      <DeleteConfirmModal
        item={itemToDelete}
        onConfirm={confirmDelete}
        onClose={() => setItemToDelete(null)}
      />
    </div>
  );
}
