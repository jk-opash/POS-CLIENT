"use client";

import { use, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchPublicMenu,
  fetchTableActiveOrders,
} from "../../store/slices/publicMenuSlice";
import ItemConfigModal from "./components/ItemConfigModal";
import CategoryFAB from "./components/CategoryFAB";
import MenuTab from "./tabs/MenuTab";
import CartTab from "./tabs/CartTab";
import OrdersTab from "./tabs/OrdersTab";
import {
  UtensilsCrossed,
  Clock,
  CheckCircle,
  MapPin,
  Menu,
  ChevronDown,
} from "lucide-react";
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
  const [activeOrders, setActiveOrders] = useState([]);

  // Load menu and active orders on mount
  useEffect(() => {
    dispatch(fetchPublicMenu(tableId));
    loadActiveOrders();
  }, [dispatch, tableId]);

  const loadActiveOrders = async () => {
    try {
      const response = await dispatch(fetchTableActiveOrders(tableId)).unwrap();
      setActiveOrders(response);

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
            JSON.stringify(cartItem.addons.map((a) => a.name).sort()),
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
            : c,
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
      <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-brand-dangerLight rounded-full flex items-center justify-center mb-6 shadow-sm">
          <UtensilsCrossed size={40} className="text-brand-danger" />
        </div>
        <h1 className="text-2xl font-black text-brand-dark mb-2 tracking-tight">
          Oops!
        </h1>
        <p className="text-brand-muted font-medium">
          {error || "Data unavailable"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-3 bg-brand-dark text-white font-bold rounded-2xl hover:bg-brand-dark transition-all active:scale-95 shadow-lg shadow-brand-dark/20"
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
    (item) => item && item?.status?.toLowerCase() !== "cancelled",
  ).length;

  return (
    <div className="min-h-screen bg-brand-light font-sans text-brand-dark pb-24">
      {/* Dynamic Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-gradient-to-r from-brand-primary via-purple-300 to-orange-300 backdrop-blur-xl shadow-md ${
          activeTab === "menu" ? "pt-3" : "py-3"
        }`}
      >
        {/* Brand & Table */}
        <div className="px-4 flex items-center justify-between ">
          <div className="flex flex-col">
            <h1
              className="text-3xl font-black text-brand-dark tracking-tight drop-shadow-sm"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              {business?.name}
            </h1>
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-dark">
              A TASTE OF HOME
            </div>
          </div>
          <span className="inline-flex self-start gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-dark bg-orange-50 px-2 py-1 rounded-md">
            <UtensilsCrossed size={14} />
            Table {table?.name || tableId}
          </span>
        </div>

        {/* Categories Bar */}
        {activeTab === "menu" && (
          <div className="px-4 py-2 overflow-x-auto hide-scrollbar flex items-center gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
                activeCategory === "all"
                  ? "bg-white text-brand-primary font-bold"
                  : "bg-white/40 text-brand-dark font-medium hover:bg-white/60"
              }`}
            >
              All
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
                  activeCategory === cat.id
                    ? "bg-white text-brand-primary font-bold"
                    : "bg-white/40 text-brand-dark font-medium hover:bg-white/60"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="px-4 pt-2 space-y-3">
        {activeTab === "menu" && (
          <>
            {/* <div className="flex items-center justify-between pt-1 pb-1">
              <h2 className="text-2xl font-black text-brand-dark tracking-tight">
                {activeCategoryName}
              </h2>
            </div> */}
            <MenuTab
              displayItems={displayItems}
              categories={categories}
              cart={cart}
              branch={branch}
              handleQuickAdd={handleQuickAdd}
              handleQuickRemove={handleQuickRemove}
            />
          </>
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
            activeOrders={activeOrders}
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
        <motion.div
          layout
          className="bg-brand-dark/95 backdrop-blur-md p-1.5 rounded-full shadow-2xl flex items-center gap-2 border border-brand-dark pointer-events-auto relative"
        >
          <motion.button
            layout
            onClick={() => setActiveTab("menu")}
            className={`flex items-center px-4 py-2.5 rounded-full transition-colors duration-300 ${
              activeTab === "menu"
                ? "bg-white text-brand-dark shadow-sm"
                : "text-brand-muted hover:text-brand-light"
            }`}
          >
            <motion.div layout>
              <UtensilsCrossed
                size={18}
                strokeWidth={activeTab === "menu" ? 2.5 : 2}
              />
            </motion.div>
            <AnimatePresence initial={false}>
              {activeTab === "menu" && (
                <motion.span
                  layout
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="text-xs font-bold whitespace-nowrap overflow-hidden"
                >
                  Menu
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            layout
            onClick={() => setActiveTab("orders")}
            className={`flex items-center px-4 py-2.5 rounded-full transition-colors duration-300 relative ${
              activeTab === "orders"
                ? "bg-white text-brand-dark shadow-sm"
                : "text-brand-muted hover:text-brand-light"
            }`}
          >
            <motion.div layout>
              <Clock size={18} strokeWidth={activeTab === "orders" ? 2.5 : 2} />
            </motion.div>
            <AnimatePresence initial={false}>
              {activeTab === "orders" && (
                <motion.span
                  layout
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="text-xs font-bold whitespace-nowrap overflow-hidden"
                >
                  Orders
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {activeOrdersCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-dark"
                >
                  {activeOrdersCount}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            layout
            onClick={() => setActiveTab("bill")}
            className={`flex items-center px-4 py-2.5 rounded-full transition-colors duration-300 relative ${
              activeTab === "bill"
                ? "bg-white text-brand-dark shadow-sm"
                : "text-brand-muted hover:text-brand-light"
            }`}
          >
            <motion.div layout>
              <CheckCircle
                size={18}
                strokeWidth={activeTab === "bill" ? 2.5 : 2}
              />
            </motion.div>
            <AnimatePresence initial={false}>
              {activeTab === "bill" && (
                <motion.span
                  layout
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="text-xs font-bold whitespace-nowrap overflow-hidden"
                >
                  Cart
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {cartItemCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-brand-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-dark"
                >
                  {cartItemCount}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
