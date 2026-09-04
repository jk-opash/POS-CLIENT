"use client";
import { BookOpenText, X, CheckCircle } from "lucide-react";

export default function CategoryFAB({
  categories,
  activeCategory,
  setActiveCategory,
  showCategoryMenu,
  setShowCategoryMenu,
}) {
  const handleClose = () => setShowCategoryMenu(false);

  return (
    <>
      {/* FAB Button */}
      <div className="z-40">
        <button
          onClick={() => setShowCategoryMenu(true)}
          className="w-14 h-14 bg-brand-dark text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] active:scale-95 transition-all"
        >
          <BookOpenText size={24} />
        </button>
      </div>

      {/* Bottom Sheet — always in DOM, CSS drives open/close */}
      <div
        className="fixed inset-0 z-50 flex flex-col justify-end"
        style={{ pointerEvents: showCategoryMenu ? "auto" : "none" }}
      >
        {/* Backdrop */}
        <div
          onClick={handleClose}
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(15,23,42,0.5)",
            backdropFilter: "blur(4px)",
            opacity: showCategoryMenu ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
        />

        {/* Sheet */}
        <div
          className="bg-white w-full max-h-[70vh] rounded-t-[2rem] shadow-2xl relative z-10 flex flex-col pb-safe"
          style={{
            transform: showCategoryMenu ? "translateY(0)" : "translateY(100%)",
            transition: "transform 380ms cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        >
          {/* Header */}
          <div className="p-5 border-b border-brand-light flex items-center justify-between">
            <h2 className="text-xl font-black text-brand-dark">Categories</h2>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center text-brand-muted hover:bg-brand-light transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Category List */}
          <div className="overflow-y-auto p-3 flex flex-col gap-1.5">
            <button
              onClick={() => {
                setActiveCategory("all");
                handleClose();
              }}
              className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                activeCategory === "all"
                  ? "bg-brand-dark text-white font-bold"
                  : "bg-brand-light text-brand-dark font-medium hover:bg-brand-light"
              }`}
            >
              <span>All Items</span>
              {activeCategory === "all" && <CheckCircle size={18} />}
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  handleClose();
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                  activeCategory === category.id
                    ? "bg-brand-dark text-white font-bold"
                    : "bg-brand-light text-brand-dark font-medium hover:bg-brand-light"
                }`}
              >
                <span>{category.name}</span>
                {activeCategory === category.id && <CheckCircle size={18} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
