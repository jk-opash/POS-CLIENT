import React, { useState } from 'react';
import { Tag, Edit2, Trash2, Layers, Loader2, Plus, X } from "lucide-react";
import PosAdminBadge from "../components/PosAdminBadge";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../../store/slices/categorySlice";
import DeleteConfirmModal from "../../inventory/components/DeleteConfirmModal";

export default function CategoriesTab({ branchId }) {
  const dispatch = useDispatch();

  const { categories, loading, error } = useSelector((state) => state.category);
  const [selectedCategoryTabId, setSelectedCategoryTabId] = useState(null);

  // Category UI States
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // Subcategory UI States
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [editingSubcategoryIndex, setEditingSubcategoryIndex] = useState(null);
  const [editSubcategoryName, setEditSubcategoryName] = useState("");

  const [itemToDelete, setItemToDelete] = useState(null);

  // CATEGORY HANDLERS
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    dispatch(createCategory({ branchId, name: newCategoryName.trim() }));
    setNewCategoryName("");
    setShowAddCategory(false);
  };

  const handleUpdateCategory = (id) => {
    if (!editCategoryName.trim()) return;
    dispatch(updateCategory({ id, data: { name: editCategoryName.trim() } }));
    setEditingCategoryId(null);
    setEditCategoryName("");
  };

  const handleDeleteCategory = (e, cat) => {
    e.stopPropagation();
    setItemToDelete({ type: 'category', id: cat.id, name: cat.name });
  };

  // SUBCATEGORY HANDLERS
  const handleAddSubcategory = (category) => {
    if (!newSubcategoryName.trim()) return;
    const newSubcategories = [...(category.sub_categories || []), { name: newSubcategoryName.trim() }];
    dispatch(updateCategory({ id: category.id, data: { sub_categories: newSubcategories } }));
    setNewSubcategoryName("");
    setShowAddSubcategory(false);
  };

  const handleUpdateSubcategory = (category, subIndex) => {
    if (!editSubcategoryName.trim()) return;
    const newSubcategories = [...category.sub_categories];
    newSubcategories[subIndex] = { ...newSubcategories[subIndex], name: editSubcategoryName.trim() };
    dispatch(updateCategory({ id: category.id, data: { sub_categories: newSubcategories } }));
    setEditingSubcategoryIndex(null);
    setEditSubcategoryName("");
  };

  const handleDeleteSubcategory = (category, subIndex) => {
    setItemToDelete({ 
      type: 'subcategory', 
      category, 
      subIndex, 
      name: category.sub_categories[subIndex].name 
    });
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'category') {
      dispatch(deleteCategory(itemToDelete.id)).then((res) => {
        if (res.meta.requestStatus === 'fulfilled' && selectedCategoryTabId === itemToDelete.id) {
          setSelectedCategoryTabId(null);
        }
      });
    } else if (itemToDelete.type === 'subcategory') {
      const { category, subIndex } = itemToDelete;
      const newSubcategories = category.sub_categories.filter((_, idx) => idx !== subIndex);
      dispatch(updateCategory({ id: category.id, data: { sub_categories: newSubcategories } }));
    }

    setItemToDelete(null);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* Left Pane: Categories */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            Categories
            {loading && <Loader2 size={16} className="animate-spin text-slate-400" />}
          </h3>
          <button 
            onClick={() => setShowAddCategory(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
          >
            <Plus size={14} /> New Category
          </button>
        </div>
        
        {error && (
          <div className="text-red-500 text-xs px-2">{error}</div>
        )}

        <div className="space-y-3">
          {showAddCategory && (
            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
              <input
                autoFocus
                type="text"
                placeholder="Category name (e.g. Beverages)"
                className="w-full text-sm font-medium border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-lg p-2.5 mb-2.5 transition-all"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors"
                  onClick={() => setShowAddCategory(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                  onClick={handleCreateCategory}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {categories.length === 0 && !loading && !showAddCategory && (
            <div className="text-center py-10 bg-white/50 border border-slate-200/60 rounded-2xl">
              <p className="text-sm text-slate-500 font-medium">No categories found.</p>
            </div>
          )}
          {categories.map((cat, idx) => {
            const isSelected = selectedCategoryTabId
              ? selectedCategoryTabId === cat.id
              : idx === 0;
            
            return editingCategoryId === cat.id ? (
              <div key={cat.id} className="p-3 bg-white border border-indigo-200 rounded-xl shadow-sm ring-1 ring-indigo-500/20">
                <input
                  autoFocus
                  type="text"
                  className="w-full text-sm font-medium border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-lg p-2.5 mb-2.5 transition-all"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdateCategory(cat.id)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors"
                    onClick={() => setEditingCategoryId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    onClick={() => handleUpdateCategory(cat.id)}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={cat.id}
                onClick={() => setSelectedCategoryTabId(cat.id)}
                className={`group p-4 rounded-2xl cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500 text-indigo-700"
                    : "bg-white/50 border-slate-200/60 hover:bg-white hover:shadow-sm hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-bold text-sm ${isSelected ? "text-indigo-700" : "text-slate-700"}`}>
                    {cat.name}
                  </h4>
                  <div className="flex items-center gap-1">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center mr-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategoryId(cat.id);
                          setEditCategoryName(cat.name);
                        }}
                        className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteCategory(e, cat)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <PosAdminBadge variant="success" dot>ACTIVE</PosAdminBadge>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  {cat.sub_categories?.length || 0} Subcategories
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Subcategories */}
      <div className="w-full md:w-2/3 flex flex-col gap-4 bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-8 min-h-[500px]">
        {(() => {
          const activeCat = selectedCategoryTabId
            ? categories.find((c) => c.id === selectedCategoryTabId)
            : categories[0];

          if (!activeCat) {
            return (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
                <Layers size={48} className="mb-4 text-slate-200" />
                <p className="font-medium">No categories available.</p>
              </div>
            );
          }

          return (
            <>
              <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-2">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    {activeCat.name} <span className="text-slate-400 font-normal">Subcategories</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Manage subcategories under this category
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddSubcategory(true)}
                  className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Subcategory
                </button>
              </div>

              {showAddSubcategory && (
                <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl mb-2 animate-in fade-in slide-in-from-top-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Subcategory name (e.g. Hot Drinks)"
                    className="w-full text-sm font-medium border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none rounded-xl p-3 mb-3 transition-all"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSubcategory(activeCat)}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition-colors"
                      onClick={() => setShowAddSubcategory(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-sm"
                      onClick={() => handleAddSubcategory(activeCat)}
                    >
                      Save Subcategory
                    </button>
                  </div>
                </div>
              )}

              {(!activeCat.sub_categories || activeCat.sub_categories.length === 0) && !showAddSubcategory ? (
                <div className="flex flex-1 flex-col items-center justify-center py-16 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <Tag size={24} className="mb-3 text-slate-300" />
                  <p className="font-medium">No subcategories yet.</p>
                  <button 
                    onClick={() => setShowAddSubcategory(true)}
                    className="mt-3 text-indigo-600 font-bold hover:underline"
                  >
                    Create one now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeCat.sub_categories?.map((sub, idx) => {
                    if (editingSubcategoryIndex === idx) {
                      return (
                        <div key={idx} className="p-4 bg-white border border-slate-300 rounded-2xl shadow-sm ring-1 ring-slate-200 col-span-1 sm:col-span-2 md:col-span-1">
                          <input
                            autoFocus
                            type="text"
                            className="w-full text-sm font-medium border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none rounded-xl p-2.5 mb-3 transition-all"
                            value={editSubcategoryName}
                            onChange={(e) => setEditSubcategoryName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleUpdateSubcategory(activeCat, idx)}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 font-bold rounded-lg transition-colors"
                              onClick={() => setEditingSubcategoryIndex(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="px-3 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors shadow-sm"
                              onClick={() => handleUpdateSubcategory(activeCat, idx)}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all flex justify-between items-center group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Tag size={14} />
                          </div>
                          <span className="font-bold text-slate-700 text-sm">
                            {sub.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingSubcategoryIndex(idx);
                              setEditSubcategoryName(sub.name);
                            }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                          >
                            <Edit2 size={14} strokeWidth={2.5} />
                          </button>
                          <button 
                            onClick={() => handleDeleteSubcategory(activeCat, idx)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          );
        })()}
      </div>

      <DeleteConfirmModal
        item={itemToDelete}
        onConfirm={confirmDelete}
        onClose={() => setItemToDelete(null)}
      />
    </div>
  );
}
