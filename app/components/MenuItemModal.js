import { useState, useEffect } from "react";
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
        if (!cat.name?.trim())
          newErrors[`variant_${idx}_name`] = "Category name required";
        if (cat.minSelection > cat.maxSelection)
          newErrors[`variant_${idx}_min`] = "Min cannot be > Max";
        if (cat.minSelection < 0 || cat.maxSelection < 0)
          newErrors[`variant_${idx}_min`] = "Selection limits must be ≥ 0";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper styles
  const inputBaseStyle =
    "w-full bg-surface-2 border border-brand-border rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 text-brand-dark placeholder:text-brand-placeholder font-medium transition-all shadow-sm";

  return (
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md flex justify-center items-end md:items-center z-50 p-0 md:p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full md:w-[920px] max-w-full h-[95vh] md:h-auto md:max-h-[90vh] rounded-t-3xl md:rounded-[2rem] md:rounded-b-[2rem] shadow-2xl flex flex-col relative shrink-0 overflow-hidden ring-1 ring-brand-border animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 ease-out">
        {/* Header */}
        <div className="px-6 md:px-8 py-5 md:py-6 flex justify-between items-start border-b border-brand-border/60 bg-gradient-to-b from-brand-bg to-white relative overflow-hidden shrink-0">
          {/* Decorative subtle blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 flex-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-dark tracking-tight">
              {item ? "Edit Menu Item" : "Create Menu Item"}
            </h2>
            <p className="text-xs md:text-sm text-brand-muted font-medium mt-1.5 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] md:text-xs font-bold border border-brand-primary/20">
                {step}
              </span>
              Step {step} of 3: {steps[step - 1].title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-surface-2 hover:bg-brand-border/70 flex items-center justify-center text-brand-muted hover:text-brand-dark transition-all shadow-sm hover:shadow"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile Horizontal Stepper */}
        <div className="flex md:hidden items-center justify-center px-6 py-4 border-b border-brand-border/50 bg-brand-bg shrink-0">
          {steps.map((s, i) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm ${
                    isCompleted
                      ? "bg-brand-success text-white ring-2 ring-brand-success/20"
                      : isCurrent
                        ? "bg-brand-primary text-white ring-4 ring-brand-primary/20"
                        : "bg-surface-2 text-brand-muted border border-brand-border"
                  }`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : s.num}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-full mx-2 rounded-full transition-colors ${
                      step > s.num ? "bg-brand-success" : "bg-brand-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* Side Stepper */}
          <div className="w-[260px] bg-brand-bg border-r border-brand-border/60 p-6 flex flex-col gap-3 shrink-0 hidden md:flex overflow-y-auto">
            {steps.map((s, i) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;

              return (
                <button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className={`w-full text-left flex items-start gap-3.5 p-4 rounded-2xl transition-all duration-300 ${
                    isCurrent
                      ? "bg-white shadow-md shadow-brand-dark/5 border border-brand-border/80 scale-[1.02]"
                      : "hover:bg-brand-light border border-transparent"
                  }`}
                >
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300 shadow-sm ${
                      isCompleted
                        ? "bg-brand-success text-white ring-2 ring-brand-success/20"
                        : isCurrent
                          ? "bg-brand-primary text-white ring-4 ring-brand-primary/20"
                          : "bg-surface-2 text-brand-muted border border-brand-border"
                    }`}
                  >
                    {isCompleted ? <Check size={16} strokeWidth={3} /> : s.num}
                  </div>
                  <div className="flex flex-col mt-0.5">
                    <span
                      className={`text-sm font-bold transition-colors ${
                        isCompleted || isCurrent
                          ? "text-brand-dark"
                          : "text-brand-muted"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      className={`text-[11px] font-semibold mt-1 ${
                        isCompleted
                          ? "text-brand-success"
                          : isCurrent
                            ? "text-brand-primary"
                            : "text-brand-placeholder"
                      }`}
                    >
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
          <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
            {step === 1 && (
              <div className="space-y-6 md:space-y-7 animate-in slide-in-from-right-4 duration-300 ease-out">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Menu Item Name <span className="text-brand-danger">*</span>
                  </label>
                  <input
                    className={inputBaseStyle}
                    placeholder="e.g. Masala Dosa"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <span className="text-brand-danger text-xs font-semibold mt-1.5 block">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-brand-dark mb-2">
                      Category <span className="text-brand-danger">*</span>
                    </label>
                    <select
                      className={`${inputBaseStyle} appearance-none cursor-pointer`}
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
                    {errors.categoryId && (
                      <span className="text-brand-danger text-xs font-semibold mt-1.5 block">
                        {errors.categoryId}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-brand-dark mb-2">
                      Sub Category
                    </label>
                    <select
                      className={`${inputBaseStyle} appearance-none cursor-pointer`}
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
                  <label className="block text-sm font-bold text-brand-dark mb-3">
                    Dietary Classification
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {foodTypes.map((type) => {
                      const isSelected = formData.foodType === type;
                      return (
                        <button
                          key={type}
                          onClick={() =>
                            setFormData({ ...formData, foodType: type })
                          }
                          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                            isSelected
                              ? "bg-brand-success text-white ring-2 ring-brand-success/30 shadow-brand-success/20"
                              : "bg-surface-2 text-brand-muted border border-brand-border hover:bg-brand-light hover:text-brand-dark"
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Item Image
                  </label>
                  <div className="border-2 border-dashed border-brand-borderHover rounded-2xl p-10 flex flex-col items-center justify-center text-brand-muted cursor-pointer hover:bg-brand-primary/5 hover:border-brand-primary/40 transition-all bg-surface-2 group">
                    <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-brand-light flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={24} className="text-brand-primary" />
                    </div>
                    <span className="text-sm font-bold text-brand-dark">
                      Click to upload or drag & drop
                    </span>
                    <span className="text-xs font-medium text-brand-placeholder mt-1">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 md:space-y-7 animate-in slide-in-from-right-4 duration-300 ease-out">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2">
                    Base Selling Price (₹) <span className="text-brand-danger">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      className={`${inputBaseStyle} pl-9`}
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>
                  {errors.price && (
                    <span className="text-brand-danger text-xs font-semibold mt-1.5 block">
                      {errors.price}
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-brand-dark">
                      Variants (Optional)
                    </h3>
                    <p className="text-xs font-medium text-brand-placeholder mt-1">
                      E.g., Half/Full, Small/Large. Variant prices override the
                      base price.
                    </p>
                  </div>

                  {formData.variants.length > 0 && (
                    <div className="space-y-3 mb-4 bg-brand-bg p-3 md:p-4 rounded-2xl border border-brand-border/60">
                      {formData.variants.map((variant, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl border border-brand-border sm:border-transparent">
                          <input
                            className={inputBaseStyle}
                            placeholder="Variant Name"
                            value={variant.name}
                            onChange={(e) =>
                              updateVariant(index, "name", e.target.value)
                            }
                          />
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted font-bold text-sm">
                                ₹
                              </span>
                              <input
                                type="number"
                                className={`${inputBaseStyle} pl-8`}
                                placeholder="Price"
                                value={variant.price}
                                onChange={(e) =>
                                  updateVariant(index, "price", e.target.value)
                                }
                              />
                            </div>
                            <button
                              onClick={() => removeVariant(index)}
                              className="p-3 text-brand-danger hover:bg-brand-dangerLight bg-surface-2 sm:bg-transparent rounded-xl transition-all shrink-0 hover:shadow-sm flex items-center justify-center"
                            >
                              <XIcon size={18} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={addVariant}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-brand-border rounded-xl text-sm font-bold text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5 transition-all shadow-sm"
                  >
                    <Plus size={16} strokeWidth={3} /> Add Variant
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 md:space-y-7 animate-in slide-in-from-right-4 duration-300 ease-out">
                {/* Enable Spice Level Toggle */}
                <div className="bg-white border border-brand-border rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-sm hover:border-brand-primary/30 transition-colors">
                  <div>
                    <h4 className="text-base font-bold text-brand-dark">
                      Enable Spice Level Options?
                    </h4>
                    <p className="text-xs font-medium text-brand-muted mt-1">
                      Prompts the customer to choose spice level (Mild, Medium, Spicy)
                    </p>
                  </div>
                  <button
                    className={`relative w-14 h-7 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-brand-success/20 ${
                      formData.spiceLevelEnabled
                        ? "bg-brand-success"
                        : "bg-surface-3"
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        spiceLevelEnabled: !formData.spiceLevelEnabled,
                      })
                    }
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition-transform shadow-md ${
                        formData.spiceLevelEnabled
                          ? "translate-x-7"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Custom Add-on Categories */}
                <div className="pt-2">
                  <div className="mb-5">
                    <h4 className="text-base font-bold text-brand-dark">
                      Custom Add-on Categories
                    </h4>
                    <p className="text-xs font-medium text-brand-placeholder mt-1">
                      Build specific add-on groups (e.g. "Choice of Bread", "Extra Toppings").
                    </p>
                  </div>

                  <div className="space-y-5">
                    {formData.addonCategories.map((cat, catIdx) => (
                      <div
                        key={catIdx}
                        className="bg-brand-bg border border-brand-border/80 rounded-2xl p-5 relative group"
                      >
                        <button
                          onClick={() => removeAddonCategory(catIdx)}
                          className="absolute -top-3 -right-3 p-2 bg-brand-danger text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                        >
                          <XIcon size={14} strokeWidth={3} />
                        </button>

                        {/* Category Header */}
                        <div className="mb-5">
                          <label className="block text-xs font-bold text-brand-dark mb-1.5 uppercase tracking-wider">
                            Category Name
                          </label>
                          <input
                            className={inputBaseStyle}
                            placeholder="e.g. Extra Toppings"
                            value={cat.name}
                            onChange={(e) =>
                              updateAddonCategory(
                                catIdx,
                                "name",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        {/* Min/Max Selection */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-brand-muted mb-1.5">
                              Min Selection
                            </label>
                            <input
                              type="number"
                              className={inputBaseStyle}
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
                            <label className="block text-xs font-bold text-brand-muted mb-1.5">
                              Max Selection
                            </label>
                            <input
                              type="number"
                              className={inputBaseStyle}
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
                        <div className="bg-white p-3 md:p-4 rounded-xl border border-brand-border/60">
                          <label className="block text-xs font-bold text-brand-dark mb-3 uppercase tracking-wider">
                            Options
                          </label>
                          <div className="space-y-3">
                            {cat.options.map((opt, optIdx) => (
                              <div
                                key={optIdx}
                                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-surface-2 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-brand-border sm:border-transparent"
                              >
                                <input
                                  className={inputBaseStyle}
                                  placeholder="Option Name"
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
                                <div className="flex gap-2">
                                  <div className="relative flex-1 sm:w-1/3">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted font-bold text-sm">
                                      ₹
                                    </span>
                                    <input
                                      type="number"
                                      className={`${inputBaseStyle} pl-7`}
                                      placeholder="Price"
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
                                  </div>
                                  <button
                                    onClick={() =>
                                      removeAddonOption(catIdx, optIdx)
                                    }
                                    className="p-2.5 text-brand-placeholder hover:text-brand-danger hover:bg-brand-dangerLight bg-white sm:bg-transparent rounded-xl border border-brand-border sm:border-transparent transition-all shrink-0 flex items-center justify-center"
                                  >
                                    <Trash2 size={18} strokeWidth={2.5} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => addAddonOption(catIdx)}
                            className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-brand-light border border-transparent rounded-lg text-sm font-bold text-brand-primary hover:bg-brand-primary/10 transition-all"
                          >
                            <Plus size={16} strokeWidth={3} /> Add Option
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addAddonCategory}
                    className="mt-5 w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-white border-2 border-dashed border-brand-borderHover rounded-2xl text-sm font-bold text-brand-dark hover:border-brand-primary hover:bg-brand-primary/5 hover:text-brand-primary transition-all group"
                  >
                    <Plus size={18} strokeWidth={3} className="text-brand-muted group-hover:text-brand-primary transition-colors" /> Create Add-on Category
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-6 md:px-8 py-4 md:py-5 flex items-center border-t border-brand-border/60 bg-brand-bg/50 shrink-0 ${
            step === 1 ? "justify-end" : "justify-between"
          }`}
        >
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 rounded-xl border border-brand-border bg-white text-xs md:text-sm font-bold text-brand-dark hover:bg-surface-2 hover:border-brand-borderHover transition-all shadow-sm"
            >
              <ChevronLeft size={16} strokeWidth={3} /> Back
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 md:gap-2 px-6 md:px-8 py-3 rounded-xl bg-brand-primary text-white text-xs md:text-sm font-bold shadow-lg shadow-brand-primary/30 hover:bg-brand-primaryDark hover:shadow-xl hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all ml-auto"
            >
              Next <span className="hidden md:inline">Step</span> <ChevronRight size={18} strokeWidth={3} />
            </button>
          ) : (
            <button
              onClick={() => {
                if (validateForm()) handleSubmit();
              }}
              className="px-6 md:px-8 py-3 rounded-xl bg-brand-success text-white text-xs md:text-sm font-bold shadow-lg shadow-brand-success/30 hover:bg-[#047857] hover:shadow-xl hover:shadow-brand-success/40 hover:-translate-y-0.5 transition-all ml-auto"
            >
              {item ? "Save" : "Create Item"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
