"use client";

import { use, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicMenu, fetchTableActiveOrders } from "../../store/slices/publicMenuSlice";
import ItemConfigModal from "./components/ItemConfigModal";
import CategoryFAB from "./components/CategoryFAB";
import MenuTab from "./tabs/MenuTab";
import CartTab from "./tabs/CartTab";
import OrdersTab from "./tabs/OrdersTab";
import { UtensilsCrossed, Clock, CheckCircle, MapPin } from "lucide-react";
import LottieLoader from "../../components/common/LottieLoader";

export default function CustomerOrderPage({ params }) {
  const resolvedParams = use(params);
  const tableId = resolvedParams.tableId;

  const [activeTab, setActiveTab] = useState("menu"); // menu, orders, bill
  const [activeCategory, setActiveCategory] = useState("all");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Redux state
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.publicMenu);

  // Cart State
  const [cart, setCart] = useState([]);
  const [placedOrders, setPlacedOrders] = useState([]);

  // Load menu and active orders on mount
  useEffect(() => {
    dispatch(fetchPublicMenu(tableId));
    loadActiveOrders();
  }, [dispatch, tableId]);

  const loadActiveOrders = async () => {
    try {
      const response = await dispatch(fetchTableActiveOrders(tableId)).unwrap();
      
      // response is an array of orders.
      // Each order has a 'running_order' Json field containing the items.
      const allPlacedItems = [];
      response.forEach((order) => {
        if (order.running_order && Array.isArray(order.running_order)) {
          allPlacedItems.push(...order.running_order);
        }
      });
      setPlacedOrders(allPlacedItems);
    } catch (error) {
      console.error("Failed to load active orders:", error);
    }
  };

  // Modal State
  const [selectedItem, setSelectedItem] = useState(null);

  // Handle scroll effect for glassmorphic header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (data?.categories?.length > 0) {
      setActiveCategory(data.categories[0].id);
    }
  }, [data]);

  // Keep orders fresh when viewing the Orders tab
  useEffect(() => {
    if (activeTab === "orders" || activeTab === "bill") {
      loadActiveOrders();
      
      const interval = setInterval(() => {
        loadActiveOrders();
      }, 10000); // poll every 10 seconds

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleAddToCart = (cartItem) => {
    setCart((prev) => {
      // Find existing entry with same item, variant, addons, and spice
      const existingIdx = prev.findIndex(
        (c) =>
          c.item.id === cartItem.item.id &&
          c.variant?.name === cartItem.variant?.name &&
          c.spiceLevel === cartItem.spiceLevel &&
          JSON.stringify(c.addons.map((a) => a.name).sort()) ===
            JSON.stringify(cartItem.addons.map((a) => a.name).sort())
      );

      if (existingIdx !== -1) {
        // Increment quantity of the existing entry
        return prev.map((c, i) =>
          i === existingIdx
            ? {
                ...c,
                quantity: c.quantity + cartItem.quantity,
                totalPrice: c.unitPrice * (c.quantity + cartItem.quantity),
              }
            : c
        );
      }

      return [...prev, cartItem];
    });
    setSelectedItem(null);
  };

  const handleQuickAdd = (item) => {
    const hasVariants = item.variants && item.variants.length > 0;
    const hasAddons = item.addon_categories && item.addon_categories.length > 0;
    const hasSpice = item.spice_level_enabled;

    if (hasVariants || hasAddons || hasSpice) {
      setSelectedItem(item);
    } else {
      handleAddToCart({
        id: Math.random().toString(36).substr(2, 9),
        item,
        quantity: 1,
        variant: null,
        addons: [],
        spiceLevel: null,
        unitPrice: parseFloat(item.base_price),
        totalPrice: parseFloat(item.base_price),
      });
    }
  };

  const handleQuickRemove = (item) => {
    setCart((prev) => {
      // Find the last added item with this ID to remove
      // (This makes it more predictable if they added multiple variants)
      let targetIdx = -1;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].item.id === item.id) {
          targetIdx = i;
          break;
        }
      }

      if (targetIdx !== -1) {
        const c = prev[targetIdx];
        if (c.quantity > 1) {
          const newArr = [...prev];
          newArr[targetIdx] = {
            ...c,
            quantity: c.quantity - 1,
            totalPrice: c.unitPrice * (c.quantity - 1),
          };
          return newArr;
        } else {
          return prev.filter((_, i) => i !== targetIdx);
        }
      }
      return prev;
    });
  };

  if (loading) {
    return <LottieLoader fullScreen text="Loading Menu..." />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <UtensilsCrossed size={40} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
          Oops!
        </h1>
        <p className="text-slate-500 font-medium">
          {error || "Data unavailable"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { business, branch, table, categories, menuItems } = data;

  const displayItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category_id === activeCategory);

  const activeCategoryName =
    activeCategory === "all"
      ? "All Items"
      : categories?.find((c) => c.id === activeCategory)?.name || "Our Menu";

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Do not include cancelled items in the active orders badge count
  const activeOrdersCount = placedOrders.filter(
    (item) => item && item?.status?.toLowerCase() !== "cancelled"
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-24">
      {/* Dynamic Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 pt-3 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm pb-2"
            : "bg-transparent pb-3"
        }`}
      >
        <div className="px-4 flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight line-clamp-1">
              {activeCategoryName}
            </h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                <MapPin size={12} />
                {branch?.name}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                Table {table?.name || tableId}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-4 pt-2 space-y-3">
        {activeTab === "menu" && (
          <MenuTab
            displayItems={displayItems}
            categories={categories}
            cart={cart}
            branch={branch}
            handleQuickAdd={handleQuickAdd}
            handleQuickRemove={handleQuickRemove}
          />
        )}

        {activeTab === "orders" && (
          <OrdersTab 
            placedOrders={placedOrders} 
            onGoToMenu={() => setActiveTab("menu")}
          />
        )}

        {activeTab === "bill" && (
          <CartTab
            cart={cart}
            setCart={setCart}
            branch={branch}
            cartTotal={cartTotal}
            tableId={tableId}
            onOrderPlaced={loadActiveOrders}
          />
        )}
      </main>

      {/* Item Config Modal */}
      {selectedItem && (
        <ItemConfigModal
          item={selectedItem}
          currency={branch?.currency}
          onClose={() => setSelectedItem(null)}
          onAdd={handleAddToCart}
        />
      )}

      {/* Floating Island Bottom Navigation */}
      <div className="fixed gap-4 bottom-4 left-4 right-4 z-30 flex justify-center pb-safe pointer-events-none">
        <div className="bg-slate-900/95 backdrop-blur-md p-1.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-800 pointer-events-auto relative">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
              activeTab === "menu"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <UtensilsCrossed
              size={18}
              strokeWidth={activeTab === "menu" ? 2.5 : 2}
            />
            {activeTab === "menu" && (
              <span className="text-xs font-bold">Menu</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 relative ${
              activeTab === "orders"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock size={18} strokeWidth={activeTab === "orders" ? 2.5 : 2} />
            {activeTab === "orders" && (
              <span className="text-xs font-bold">Orders</span>
            )}
            {activeOrdersCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900">
                {activeOrdersCount}
              </div>
            )}
          </button>

          <button
            onClick={() => setActiveTab("bill")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 relative ${
              activeTab === "bill"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle
              size={18}
              strokeWidth={activeTab === "bill" ? 2.5 : 2}
            />
            {activeTab === "bill" && (
              <span className="text-xs font-bold">Cart</span>
            )}
            {cartItemCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900">
                {cartItemCount}
              </div>
            )}
          </button>
        </div>
        {activeTab === "menu" && (
          <div className="pointer-events-auto">
            <CategoryFAB
              categories={categories || []}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              showCategoryMenu={showCategoryMenu}
              setShowCategoryMenu={setShowCategoryMenu}
            />
          </div>
        )}
      </div>
    </div>
  );
}
