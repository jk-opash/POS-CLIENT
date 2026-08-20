import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Upload,
  Trash2,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function MenuItemModal({ item, onClose, onSave }) {
  const { categories } = useSelector((state) => state.category);
  const [step, setStep] = useState(1);

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    subCategoryId: "",
    foodType: "Veg",
    image: null,
    price: "",
    variants: [],
    spiceLevelEnabled: false,
    addonCategories: [],
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        categoryId: item.categoryId || item.category_id || "",
        subCategoryId: item.subCategoryId || item.sub_category || "",
        foodType: item.food_type || (item.vegetarian ? "Veg" : "Non-Veg"),
        image: item.image_url || null,
        price: item.price || item.base_price || "",
        variants: item.variants || [],
        spiceLevelEnabled: item.spice_level_enabled || false,
        addonCategories: item.addon_categories || item.addonGroups || [],
      });
    } else if (categories && categories.length > 0) {
      setFormData((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [item, categories]);

  const handleNext = () => setStep((s) => Math.min(3, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = () => {
    onSave({
      name: formData.name,
      category_id: formData.categoryId,
      sub_category: formData.subCategoryId,
      food_type: formData.foodType,
      image_url: formData.image,
      base_price: Number(formData.price),
      variants: formData.variants,
      spice_level_enabled: formData.spiceLevelEnabled,
      addon_categories: formData.addonCategories,
      vegetarian: formData.foodType === "Veg" || formData.foodType === "Jain",
    });
  };

  const steps = [
    { num: 1, title: "Basic Info" },
    { num: 2, title: "Pricing & Variants" },
    { num: 3, title: "Add-ons & Options" },
  ];

  const foodTypes = [
    "Veg",
    "Non-Veg",
    "Egg",
    "Vegan",
    "Jain",
    "Dessert",
    "Beverage",
  ];

  const addVariant = () =>
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", price: "" }],
    }));
  const updateVariant = (index, field, value) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index][field] = value;
      return { ...prev, variants: newVariants };
    });
  };
  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const addAddonCategory = () => {
    setFormData((prev) => ({
      ...prev,
      addonCategories: [
        ...prev.addonCategories,
        { name: "", minSelection: 0, maxSelection: 1, options: [] },
      ],
    }));
  };
  const updateAddonCategory = (catIndex, field, value) => {
    setFormData((prev) => {
      const newCats = [...prev.addonCategories];
      newCats[catIndex][field] = value;
      return { ...prev, addonCategories: newCats };
    });
  };
  const removeAddonCategory = (catIndex) => {
    setFormData((prev) => ({
      ...prev,
      addonCategories: prev.addonCategories.filter((_, i) => i !== catIndex),
    }));
  };

  const addAddonOption = (catIndex) => {
    setFormData((prev) => {
      const newCats = [...prev.addonCategories];
      newCats[catIndex].options.push({ name: "", price: "" });
      return { ...prev, addonCategories: newCats };
    });
  };
  const updateAddonOption = (catIndex, optIndex, field, value) => {
    setFormData((prev) => {
      const newCats = [...prev.addonCategories];
      newCats[catIndex].options[optIndex][field] = value;
      return { ...prev, addonCategories: newCats };
    });
  };
  const removeAddonOption = (catIndex, optIndex) => {
    setFormData((prev) => {
      const newCats = [...prev.addonCategories];
      newCats[catIndex].options = newCats[catIndex].options.filter(
        (_, i) => i !== optIndex,
      );
      return { ...prev, addonCategories: newCats };
    });
  };

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);
  const subCategories = selectedCategory?.sub_categories || [];


  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Item name is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    
    const parsedPrice = parseFloat(formData.price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      newErrors.price = "Valid price is required";
    }

    // Check variant categories
    if (formData.variantCategories) {
      formData.variantCategories.forEach((cat, idx) => {
        if (!cat.name?.trim()) newErrors[`variant_${idx}_name`] = "Category name required";
        if (cat.minSelection > cat.maxSelection) newErrors[`variant_${idx}_min`] = "Min cannot be > Max";
        if (cat.minSelection < 0 || cat.maxSelection < 0) newErrors[`variant_${idx}_min`] = "Selection limits must be ≥ 0";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-start pt-[5vh] z-50 overflow-y-auto">
      <div className="bg-white w-[880px] max-w-[95vw] rounded-2xl shadow-2xl flex flex-col mb-[5vh] relative shrink-0">
        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-start border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {item ? "Edit Menu Item" : "Create New Menu Item"}
            </h2>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Step {step} of 3: {steps[step - 1].title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden border-b border-slate-100">
          {/* Side Stepper */}
          <div className="w-[240px] bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2 shrink-0">
            {steps.map((s, i) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;

            
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Item name is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    
    const parsedPrice = parseFloat(formData.price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      newErrors.price = "Valid price is required";
    }

    // Check variant categories
    if (formData.variantCategories) {
      formData.variantCategories.forEach((cat, idx) => {
        if (!cat.name?.trim()) newErrors[`variant_${idx}_name`] = "Category name required";
        if (cat.minSelection > cat.maxSelection) newErrors[`variant_${idx}_min`] = "Min cannot be > Max";
        if (cat.minSelection < 0 || cat.maxSelection < 0) newErrors[`variant_${idx}_min`] = "Selection limits must be ≥ 0";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
                <button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
                    isCurrent
                      ? "bg-white shadow-sm border border-slate-200/60"
                      : "hover:bg-slate-200/50 border border-transparent"
                  }`}
                >
                  <div
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors mt-0.5 ${
                      isCompleted || isCurrent
                        ? "bg-[#10B981] text-white shadow-sm"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : s.num}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-bold transition-colors ${
                        isCompleted || isCurrent
                          ? "text-slate-900"
                          : "text-slate-500"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                      {isCompleted
                        ? "Completed"
                        : isCurrent
                          ? "In Progress"
                          : "Pending"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto max-h-[60vh] p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Menu Item Name *
                    </label>
                    <input
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] text-slate-800 placeholder:text-slate-400 font-medium transition-colors bg-white"
                      placeholder="e.g. Masala Dosa"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                      {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Category
                      </label>
                      <select
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] text-slate-800 font-medium appearance-none bg-white transition-colors cursor-pointer"
                        value={formData.categoryId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoryId: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
            {errors.categoryId && <span className="text-red-500 text-xs mt-1 block">{errors.categoryId}</span>}
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Sub Category
                      </label>
                      <select
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] text-slate-800 font-medium appearance-none bg-white transition-colors cursor-pointer"
                        value={formData.subCategoryId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subCategoryId: e.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Select Sub Category
                        </option>
                        {[{ name: "NA" }, ...subCategories].map((sub, idx) => (
                          <option key={sub.id || idx} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Food Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {foodTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() =>
                            setFormData({ ...formData, foodType: type })
                          }
                          className={`px-5 py-2 rounded-xl text-sm font-bold transition-colors ${
                            formData.foodType === type
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-500"
                              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Item Image
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors bg-[#F8FAFC]">
                      <Upload size={24} className="mb-2 text-slate-600" />
                      <span className="text-sm font-bold text-slate-700">
                        Click to upload image
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">
                      Base Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] text-slate-800 placeholder:text-slate-400 font-medium transition-colors bg-white"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                      {errors.price && <span className="text-red-500 text-xs mt-1 block">{errors.price}</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-0.5">
                      Variants (Optional)
                    </label>
                    <p className="text-xs font-medium text-slate-500 mb-4">
                      E.g., Half/Full, Small/Large. Variant prices will override
                      the base price in the POS.
                    </p>

                    <div className="space-y-3">
                      {formData.variants.map((variant, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <input
                            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] text-slate-800 placeholder:text-slate-400 font-medium transition-colors bg-white"
                            placeholder="Variant Name"
                            value={variant.name}
                            onChange={(e) =>
                              updateVariant(index, "name", e.target.value)
                            }
                          />
                          <input
                            type="number"
                            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] text-slate-800 placeholder:text-slate-400 font-medium transition-colors bg-white"
                            placeholder="Price (₹)"
                            value={variant.price}
                            onChange={(e) =>
                              updateVariant(index, "price", e.target.value)
                            }
                          />
                          <button
                            onClick={() => removeVariant(index)}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                          >
                            <XIcon size={18} strokeWidth={2.5} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addVariant}
                      className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <Plus size={16} strokeWidth={3} /> Add Variant
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {/* Enable Spice Level Toggle */}
                  <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Enable Spice Level?
                      </h4>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        Allows the customer to choose spice level (Mild, Medium,
                        Spicy, etc.)
                      </p>
                    </div>
                    <button
                      className={`relative w-12 h-6 rounded-full transition-colors ${formData.spiceLevelEnabled ? "bg-[#10B981]" : "bg-slate-200"}`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          spiceLevelEnabled: !formData.spiceLevelEnabled,
                        })
                      }
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform shadow-sm ${formData.spiceLevelEnabled ? "translate-x-6" : "translate-x-0"}`}
                      />
                    </button>
                  </div>

                  {/* Custom Add-on Categories */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Custom Add-on Categories
                    </h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5 mb-4">
                      Build specific add-on groups for this item (e.g. "Choice
                      of Bread", "Extra Toppings").
                    </p>

                    <div className="space-y-4">
                      {formData.addonCategories.map((cat, catIdx) => (
                        <div
                          key={catIdx}
                          className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4"
                        >
                          {/* Category Header */}
                          <div className="flex items-center gap-3 mb-4">
                            <input
                              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] text-slate-800 placeholder:text-slate-400 font-medium transition-colors bg-white"
                              placeholder="Category Name (e.g. Extra Toppings)"
                              value={cat.name}
                              onChange={(e) =>
                                updateAddonCategory(
                                  catIdx,
                                  "name",
                                  e.target.value,
                                )
                              }
                            />
                            <button
                              onClick={() => removeAddonCategory(catIdx)}
                              className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shrink-0"
                            >
                              <Trash2 size={18} strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Min/Max Selection */}
                          <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                Min Selection
                              </label>
                              <input
                                type="number"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] text-slate-800 font-medium transition-colors bg-white"
                                value={cat.minSelection}
                                onChange={(e) =>
                                  updateAddonCategory(
                                    catIdx,
                                    "minSelection",
                                    Number(e.target.value),
                                  )
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                Max Selection
                              </label>
                              <input
                                type="number"
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] text-slate-800 font-medium transition-colors bg-white"
                                value={cat.maxSelection}
                                onChange={(e) =>
                                  updateAddonCategory(
                                    catIdx,
                                    "maxSelection",
                                    Number(e.target.value),
                                  )
                                }
                              />
                            </div>
                          </div>

                          {/* Options */}
                          <div className="space-y-3">
                            {cat.options.map((opt, optIdx) => (
                              <div
                                key={optIdx}
                                className="flex items-center gap-3"
                              >
                                <input
                                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] text-slate-800 placeholder:text-slate-400 font-medium transition-colors bg-white"
                                  placeholder="Add-on Name"
                                  value={opt.name}
                                  onChange={(e) =>
                                    updateAddonOption(
                                      catIdx,
                                      optIdx,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                />
                                <input
                                  type="number"
                                  className="w-1/3 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#10B981] text-slate-800 placeholder:text-slate-400 font-medium transition-colors bg-white"
                                  placeholder="Price (₹)"
                                  value={opt.price}
                                  onChange={(e) =>
                                    updateAddonOption(
                                      catIdx,
                                      optIdx,
                                      "price",
                                      e.target.value,
                                    )
                                  }
                                />
                                <button
                                  onClick={() =>
                                    removeAddonOption(catIdx, optIdx)
                                  }
                                  className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                                >
                                  <XIcon size={18} strokeWidth={2.5} />
                                </button>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => addAddonOption(catIdx)}
                            className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
                          >
                            <Plus size={16} strokeWidth={3} /> Add Option
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addAddonCategory}
                      className="mt-4 flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <Plus size={16} strokeWidth={3} /> Create Add-on Category
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className={`px-6 py-5 flex items-center ${step === 1 ? "justify-end" : "justify-between"} bg-white rounded-b-2xl`}
          >
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={16} strokeWidth={2.5} /> Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1e293b] text-white text-sm font-bold hover:bg-slate-800 shadow-sm transition-colors ml-auto"
              >
                Next Step <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            ) : (
              <button
                onClick={() => { if (validateForm()) handleSubmit(); }}
                className="px-6 py-3 rounded-xl bg-[#1e293b] text-white text-sm font-bold hover:bg-slate-800 shadow-sm transition-colors ml-auto"
              >
                Create Menu Item
              </button>
            )}
          </div>
      </div>
    </div>
  );
}
