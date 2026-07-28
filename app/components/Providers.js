'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/* ── helpers ─────────────────────────────────── */
function load(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function save(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}
function uid() { return Math.random().toString(36).slice(2, 9); }

/* ═══════════════════════════════════════════════
   SEED DATA
═══════════════════════════════════════════════ */
const SEED_MENU_CATEGORIES = [
  { id: 'cat1', name: 'Starters', color: '#f59e0b', sortOrder: 1, image: null },
  { id: 'cat2', name: 'Main Course', color: '#10b981', sortOrder: 2, image: null },
  { id: 'cat3', name: 'Breads', color: '#f43f5e', sortOrder: 3, image: null },
  { id: 'cat4', name: 'Beverages', color: '#38bdf8', sortOrder: 4, image: null },
  { id: 'cat5', name: 'Desserts', color: '#8b5cf6', sortOrder: 5, image: null },
];

const SEED_ADDON_GROUPS = [
  { id: 'addon1', name: 'Choice of Crust', multiSelect: false, options: [{ name: 'Thin Crust', price: 0 }, { name: 'Cheese Burst', price: 100 }] },
  { id: 'addon2', name: 'Extra Toppings', multiSelect: true, options: [{ name: 'Extra Cheese', price: 40 }, { name: 'Olives', price: 30 }] }
];

const SEED_MENU_ITEMS = [
  { id: 'm1', name: 'Paneer Tikka', categoryId: 'cat1', price: 320, takeawayPrice: 300, tax: 5, available: true, vegetarian: true, spicy: 2, image: null, variants: [{ name: 'Half', price: 180 }, { name: 'Full', price: 320 }], addonGroups: ['addon2'], recipe: [{ inventoryId: 'inv1', qty: 0.2 }], timeAvailability: null },
  { id: 'm2', name: 'Veg Spring Roll', categoryId: 'cat1', price: 220, takeawayPrice: 200, tax: 5, available: true, vegetarian: true, spicy: 1, image: null, variants: [], addonGroups: [], recipe: [], timeAvailability: null },
  { id: 'm3', name: 'Chicken 65', categoryId: 'cat1', price: 380, takeawayPrice: 350, tax: 5, available: true, vegetarian: false, spicy: 3, image: null, variants: [], addonGroups: [], recipe: [{ inventoryId: 'inv4', qty: 0.3 }], timeAvailability: null },
  { id: 'm4', name: 'Dal Makhani', categoryId: 'cat2', price: 280, takeawayPrice: 260, tax: 5, available: true, vegetarian: true, spicy: 1, image: null, variants: [], addonGroups: [], recipe: [], timeAvailability: null },
  { id: 'm5', name: 'Butter Chicken', categoryId: 'cat2', price: 420, takeawayPrice: 400, tax: 5, available: true, vegetarian: false, spicy: 2, image: null, variants: [], addonGroups: [], recipe: [{ inventoryId: 'inv4', qty: 0.25 }], timeAvailability: null },
  { id: 'm6', name: 'Paneer Makhani', categoryId: 'cat2', price: 360, takeawayPrice: 340, tax: 5, available: true, vegetarian: true, spicy: 1, image: null, variants: [], addonGroups: [], recipe: [{ inventoryId: 'inv1', qty: 0.2 }], timeAvailability: null },
  { id: 'm7', name: 'Veg Biryani', categoryId: 'cat2', price: 320, takeawayPrice: 300, tax: 5, available: true, vegetarian: true, spicy: 2, image: null, variants: [], addonGroups: [], recipe: [{ inventoryId: 'inv5', qty: 0.15 }], timeAvailability: null },
  { id: 'm8', name: 'Butter Naan', categoryId: 'cat3', price: 60, takeawayPrice: 55, tax: 5, available: true, vegetarian: true, spicy: 0, image: null, variants: [], addonGroups: [], recipe: [{ inventoryId: 'inv6', qty: 0.05 }, { inventoryId: 'inv7', qty: 0.01 }], timeAvailability: null },
  { id: 'm9', name: 'Garlic Naan', categoryId: 'cat3', price: 70, takeawayPrice: 65, tax: 5, available: true, vegetarian: true, spicy: 0, image: null, variants: [], addonGroups: [], recipe: [], timeAvailability: null },
  { id: 'm10', name: 'Jeera Rice', categoryId: 'cat3', price: 160, takeawayPrice: 150, tax: 5, available: true, vegetarian: true, spicy: 0, image: null, variants: [], addonGroups: [], recipe: [{ inventoryId: 'inv5', qty: 0.1 }], timeAvailability: null },
  { id: 'm11', name: 'Mango Lassi', categoryId: 'cat4', price: 120, takeawayPrice: 110, tax: 12, available: true, vegetarian: true, spicy: 0, image: null, variants: [], addonGroups: [], recipe: [], timeAvailability: null },
  { id: 'm12', name: 'Masala Chai', categoryId: 'cat4', price: 60, takeawayPrice: 55, tax: 5, available: true, vegetarian: true, spicy: 0, image: null, variants: [], addonGroups: [], recipe: [], timeAvailability: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], hours: ['07:00', '11:00'] } },
  { id: 'm13', name: 'Gulab Jamun', categoryId: 'cat5', price: 120, takeawayPrice: 110, tax: 5, available: true, vegetarian: true, spicy: 0, image: null, variants: [], addonGroups: [], recipe: [], timeAvailability: null },
  { id: 'm14', name: 'Rasgulla', categoryId: 'cat5', price: 100, takeawayPrice: 90, tax: 5, available: true, vegetarian: true, spicy: 0, image: null, variants: [], addonGroups: [], recipe: [], timeAvailability: null },
];

const SEED_TABLES = [
  { id: 't1', label: 'T1', seats: 2, status: 'free', floor: 'Ground' },
  { id: 't2', label: 'T2', seats: 4, status: 'occupied', floor: 'Ground' },
  { id: 't3', label: 'T3', seats: 4, status: 'occupied', floor: 'Ground' },
  { id: 't4', label: 'T4', seats: 6, status: 'reserved', floor: 'Ground' },
  { id: 't5', label: 'T5', seats: 2, status: 'free', floor: 'Ground' },
  { id: 't6', label: 'T6', seats: 4, status: 'cleaning', floor: 'Ground' },
  { id: 't7', label: 'T7', seats: 8, status: 'occupied', floor: 'First' },
  { id: 't8', label: 'T8', seats: 4, status: 'free', floor: 'First' },
  { id: 't9', label: 'VIP-1', seats: 10, status: 'reserved', floor: 'First' },
];

const SEED_ORDERS = [
  { id: 'ORD-001', type: 'dine-in', tableId: 't2', tableName: 'T2', status: 'preparing', items: [{ menuId:'m1', name:'Paneer Tikka', qty:2, price:320 }, { menuId:'m8', name:'Butter Naan', qty:4, price:60 }], subtotal:880, tax:44, total:924, customerName:'Rahul Sharma', createdAt: new Date(Date.now()-15*60000).toISOString() },
  { id: 'ORD-002', type: 'dine-in', tableId: 't3', tableName: 'T3', status: 'ready', items: [{ menuId:'m5', name:'Butter Chicken', qty:1, price:420 }, { menuId:'m9', name:'Garlic Naan', qty:2, price:70 }], subtotal:560, tax:28, total:588, customerName:'Priya Patel', createdAt: new Date(Date.now()-30*60000).toISOString() },
  { id: 'ORD-003', type: 'takeaway', tableId: null, tableName: null, status: 'received', items: [{ menuId:'m7', name:'Veg Biryani', qty:2, price:320 }], subtotal:640, tax:32, total:672, customerName:'Amit Kumar', createdAt: new Date(Date.now()-5*60000).toISOString() },
  { id: 'ORD-004', type: 'delivery', tableId: null, tableName: null, status: 'preparing', items: [{ menuId:'m4', name:'Dal Makhani', qty:1, price:280 }, { menuId:'m8', name:'Butter Naan', qty:3, price:60 }], subtotal:460, tax:23, total:483, customerName:'Sneha Reddy', createdAt: new Date(Date.now()-20*60000).toISOString() },
];

const SEED_STAFF = [
  { id: 's1', name: 'Rajan Verma', role: 'Manager', phone: '9876543210', pin: '1234', email: 'rajan@pos.in', active: true, salary: 35000, joinDate: '2023-01-15' },
  { id: 's2', name: 'Meena Joshi', role: 'Cashier', phone: '9876543211', pin: '2345', email: 'meena@pos.in', active: true, salary: 22000, joinDate: '2023-03-20' },
  { id: 's3', name: 'Sanjay Kumar', role: 'Waiter', phone: '9876543212', pin: '3456', email: 'sanjay@pos.in', active: true, salary: 18000, joinDate: '2023-06-01' },
  { id: 's4', name: 'Divya Singh', role: 'Waiter', phone: '9876543213', pin: '4567', email: 'divya@pos.in', active: false, salary: 18000, joinDate: '2023-08-10' },
  { id: 's5', name: 'Chef Ramu', role: 'Kitchen', phone: '9876543214', pin: '5678', email: 'ramu@pos.in', active: true, salary: 28000, joinDate: '2022-11-05' },
];

const SEED_CUSTOMERS = [
  { id: 'c1', name: 'Rahul Sharma', phone: '9999000001', email: 'rahul@example.com', loyaltyPoints: 450, totalSpend: 12400, visits: 14, lastVisit: '2026-07-25' },
  { id: 'c2', name: 'Priya Patel', phone: '9999000002', email: 'priya@example.com', loyaltyPoints: 1200, totalSpend: 34000, visits: 38, lastVisit: '2026-07-27' },
  { id: 'c3', name: 'Amit Kumar', phone: '9999000003', email: 'amit@example.com', loyaltyPoints: 80, totalSpend: 3200, visits: 4, lastVisit: '2026-07-20' },
  { id: 'c4', name: 'Sneha Reddy', phone: '9999000004', email: 'sneha@example.com', loyaltyPoints: 720, totalSpend: 21600, visits: 24, lastVisit: '2026-07-26' },
];

const SEED_INVENTORY = [
  { id: 'inv1', name: 'Paneer', sku: 'DAI-001', unit: 'kg', currentStock: 8.5, inStock: 8.5, minStock: 3, reorderLevel: 3, cost: 320, price: 320, category: 'Dairy', status: 'Normal', image: null, lastCounted: '2026-07-26', reserved: 0 },
  { id: 'inv2', name: 'Tomatoes', sku: 'VEG-001', unit: 'kg', currentStock: 12, inStock: 12, minStock: 5, reorderLevel: 5, cost: 40, price: 40, category: 'Vegetables', status: 'Normal', image: null, lastCounted: '2026-07-27', reserved: 0 },
  { id: 'inv3', name: 'Onions', sku: 'VEG-002', unit: 'kg', currentStock: 25, inStock: 25, minStock: 10, reorderLevel: 10, cost: 35, price: 35, category: 'Vegetables', status: 'Normal', image: null, lastCounted: '2026-07-27', reserved: 0 },
  { id: 'inv4', name: 'Chicken', sku: 'MEA-001', unit: 'kg', currentStock: 2.5, inStock: 2.5, minStock: 5, reorderLevel: 5, cost: 220, price: 220, category: 'Meat', status: 'Low', image: null, lastCounted: '2026-07-28', reserved: 0 },
  { id: 'inv5', name: 'Basmati Rice', sku: 'GRA-001', unit: 'kg', currentStock: 40, inStock: 40, minStock: 15, reorderLevel: 15, cost: 90, price: 90, category: 'Grains', status: 'Normal', image: null, lastCounted: '2026-07-25', reserved: 0 },
  { id: 'inv6', name: 'All-purpose Flour', sku: 'GRA-002', unit: 'kg', currentStock: 30, inStock: 30, minStock: 10, reorderLevel: 10, cost: 45, price: 45, category: 'Grains', status: 'Normal', image: null, lastCounted: '2026-07-25', reserved: 0 },
  { id: 'inv7', name: 'Ghee', sku: 'DAI-002', unit: 'L', currentStock: 3, inStock: 3, minStock: 2, reorderLevel: 2, cost: 580, price: 580, category: 'Dairy', status: 'Low', image: null, lastCounted: '2026-07-26', reserved: 0 },
  { id: 'inv8', name: 'Cooking Oil', sku: 'OIL-001', unit: 'L', currentStock: 18, inStock: 18, minStock: 8, reorderLevel: 8, cost: 140, price: 140, category: 'Oil', status: 'Normal', image: null, lastCounted: '2026-07-27', reserved: 0 },
  { id: 'inv9', name: 'Milk', sku: 'DAI-003', unit: 'L', currentStock: 0, inStock: 0, minStock: 5, reorderLevel: 5, cost: 65, price: 65, category: 'Dairy', status: 'Out of Stock', image: null, lastCounted: '2026-07-28', reserved: 0 },
  { id: 'inv10', name: 'Sugar', sku: 'DRY-001', unit: 'kg', currentStock: 20, inStock: 20, minStock: 8, reorderLevel: 8, cost: 55, price: 55, category: 'Dry Goods', status: 'Normal', image: null, lastCounted: '2026-07-26', reserved: 0 },
  { id: 'inv11', name: 'Butter', sku: 'DAI-004', unit: 'kg', currentStock: 1, inStock: 1, minStock: 3, reorderLevel: 3, cost: 480, price: 480, category: 'Dairy', status: 'Critical', image: null, lastCounted: '2026-07-28', reserved: 0 },
  { id: 'inv12', name: 'Cumin Seeds', sku: 'SPI-001', unit: 'kg', currentStock: 2, inStock: 2, minStock: 1, reorderLevel: 1, cost: 280, price: 280, category: 'Spices', status: 'Normal', image: null, lastCounted: '2026-07-24', reserved: 0 },
];

const SEED_STOCK_ADJUSTMENTS = [
  { id: 'ADJ-001', timestamp: new Date(Date.now() - 2*3600000).toISOString(), itemId: 'inv4', itemName: 'Chicken', quantityChange: -2, reason: 'Damage/Spoilage', performedBy: 'Admin', notes: 'Found spoiled during morning check' },
  { id: 'ADJ-002', timestamp: new Date(Date.now() - 5*3600000).toISOString(), itemId: 'inv7', itemName: 'Ghee', quantityChange: 2, reason: 'Supplier Over-delivery', performedBy: 'Rajan Verma', notes: 'Extra 2L from Dairy Direct' },
  { id: 'ADJ-003', timestamp: new Date(Date.now() - 1*86400000).toISOString(), itemId: 'inv9', itemName: 'Milk', quantityChange: -5, reason: 'Stock Correction (Lost)', performedBy: 'Admin', notes: 'Physical count mismatch' },
  { id: 'ADJ-004', timestamp: new Date(Date.now() - 2*86400000).toISOString(), itemId: 'inv1', itemName: 'Paneer', quantityChange: 10, reason: 'Stock Correction (Found)', performedBy: 'Meena Joshi', notes: 'Received from PO-001' },
];

const SEED_STOCK_LEDGER = [
  { id: 'LOG-001', timestamp: new Date(Date.now() - 1*3600000).toISOString(), type: 'ADJUSTMENT', itemId: 'inv4', itemName: 'Chicken', quantityChange: -2, reason: 'Damage/Spoilage', performedBy: 'Admin' },
  { id: 'LOG-002', timestamp: new Date(Date.now() - 4*3600000).toISOString(), type: 'RECEIVED', itemId: 'inv7', itemName: 'Ghee', quantityChange: 2, reason: 'Purchase Order PO-001', performedBy: 'System' },
  { id: 'LOG-003', timestamp: new Date(Date.now() - 6*3600000).toISOString(), type: 'ITEM_CREATED', itemId: 'inv12', itemName: 'Cumin Seeds', quantityChange: 2, reason: 'Initial setup', performedBy: 'Admin' },
  { id: 'LOG-004', timestamp: new Date(Date.now() - 1*86400000).toISOString(), type: 'ADJUSTMENT', itemId: 'inv9', itemName: 'Milk', quantityChange: -5, reason: 'Physical count mismatch', performedBy: 'Admin' },
  { id: 'LOG-005', timestamp: new Date(Date.now() - 2*86400000).toISOString(), type: 'RECEIVED', itemId: 'inv1', itemName: 'Paneer', quantityChange: 10, reason: 'PO-001 received', performedBy: 'Rajan Verma' },
  { id: 'LOG-006', timestamp: new Date(Date.now() - 3*86400000).toISOString(), type: 'DELETION', itemId: 'inv-old', itemName: 'Old Spice Mix', quantityChange: -3, reason: 'Item deleted from inventory', performedBy: 'Admin' },
];

const SEED_SUPPLIERS = [
  { id: 'sup1', name: 'Fresh Farms Co.', contact: 'Vikram Malhotra', phone: '9876001001', email: 'vikram@freshfarms.in', category: 'Vegetables & Fruits', outstanding: 4800, totalPurchased: 52000, lastOrder: '2026-07-26' },
  { id: 'sup2', name: 'Prime Meats', contact: 'Arjun Sood', phone: '9876001002', email: 'arjun@primemeats.in', category: 'Meat & Poultry', outstanding: 0, totalPurchased: 28000, lastOrder: '2026-07-24' },
  { id: 'sup3', name: 'Dairy Direct', contact: 'Kavitha Nair', phone: '9876001003', email: 'kavitha@dairydirect.in', category: 'Dairy', outstanding: 12000, totalPurchased: 96000, lastOrder: '2026-07-27' },
];

const SEED_PURCHASE_ORDERS = [
  { id: 'PO-001', supplierId: 'sup3', supplierName: 'Dairy Direct', status: 'received', items: [{ inventoryId:'inv1', name:'Paneer', qty:10, unit:'kg', cost:320, total:3200 }], total:3200, createdAt: '2026-07-27T10:00:00Z', expectedAt: '2026-07-28' },
  { id: 'PO-002', supplierId: 'sup1', supplierName: 'Fresh Farms Co.', status: 'pending', items: [{ inventoryId:'inv2', name:'Tomatoes', qty:20, unit:'kg', cost:40, total:800 }, { inventoryId:'inv3', name:'Onions', qty:30, unit:'kg', cost:35, total:1050 }], total:1850, createdAt: '2026-07-28T08:00:00Z', expectedAt: '2026-07-29' },
];

const SEED_INVOICES = [
  { id: 'INV-0023', orderId: 'ORD-001', type: 'dine-in', customerName: 'Rahul Sharma', subtotal: 880, cgst: 22, sgst: 22, total: 924, paymentMethod: 'UPI', status: 'paid', createdAt: new Date(Date.now()-2*3600000).toISOString() },
  { id: 'INV-0022', orderId: 'ORD-X', type: 'takeaway', customerName: 'Walk-in', subtotal: 640, cgst: 16, sgst: 16, total: 672, paymentMethod: 'Cash', status: 'paid', createdAt: new Date(Date.now()-4*3600000).toISOString() },
  { id: 'INV-0021', orderId: 'ORD-X2', type: 'delivery', customerName: 'Priya Patel', subtotal: 560, cgst: 14, sgst: 14, total: 588, paymentMethod: 'Card', status: 'paid', createdAt: new Date(Date.now()-6*3600000).toISOString() },
];

/* ═══════════════════════════════════════════════
   CONTEXTS
═══════════════════════════════════════════════ */

/* ── Menu Context ─────────────────────────────── */
const MenuContext = createContext(null);
function MenuProvider({ children }) {
  const [categories, setCategories] = useState(() => load('pos_menu_categories_v2', SEED_MENU_CATEGORIES));
  const [items, setItems] = useState(() => load('pos_menu_items_v2', SEED_MENU_ITEMS));
  const [addonGroups, setAddonGroups] = useState(() => load('pos_addon_groups_v2', SEED_ADDON_GROUPS));

  useEffect(() => { save('pos_menu_categories_v2', categories); }, [categories]);
  useEffect(() => { save('pos_menu_items_v2', items); }, [items]);
  useEffect(() => { save('pos_addon_groups_v2', addonGroups); }, [addonGroups]);

  const addItem = (item) => setItems(p => [...p, { ...item, id: uid() }]);
  const updateItem = (id, patch) => setItems(p => p.map(i => i.id === id ? { ...i, ...patch } : i));
  const deleteItem = (id) => setItems(p => p.filter(i => i.id !== id));
  const toggleAvailable = (id) => updateItem(id, { available: !items.find(i => i.id === id)?.available });

  const addCategory = (cat) => setCategories(p => [...p, { ...cat, id: uid() }]);
  const updateCategory = (id, patch) => setCategories(p => p.map(c => c.id === id ? { ...c, ...patch } : c));
  const deleteCategory = (id) => setCategories(p => p.filter(c => c.id !== id));

  const addAddonGroup = (grp) => setAddonGroups(p => [...p, { ...grp, id: uid() }]);
  const updateAddonGroup = (id, patch) => setAddonGroups(p => p.map(g => g.id === id ? { ...g, ...patch } : g));

  return (
    <MenuContext.Provider value={{ categories, items, addonGroups, addItem, updateItem, deleteItem, toggleAvailable, addCategory, updateCategory, deleteCategory, addAddonGroup, updateAddonGroup }}>
      {children}
    </MenuContext.Provider>
  );
}
export const useMenu = () => useContext(MenuContext);

/* ── Orders Context ───────────────────────────── */
const OrdersContext = createContext(null);
function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => load('pos_orders', SEED_ORDERS));

  useEffect(() => { save('pos_orders', orders); }, [orders]);

  const addOrder = (order) => setOrders(p => [{ ...order, id: `ORD-${String(p.length + 10).padStart(3,'0')}`, createdAt: new Date().toISOString() }, ...p]);
  const updateOrder = (id, patch) => setOrders(p => p.map(o => o.id === id ? { ...o, ...patch } : o));
  const advanceStatus = (id) => {
    const pipeline = ['received', 'preparing', 'ready', 'served'];
    setOrders(p => p.map(o => {
      if (o.id !== id) return o;
      const idx = pipeline.indexOf(o.status);
      return { ...o, status: pipeline[Math.min(idx + 1, pipeline.length - 1)] };
    }));
  };
  const cancelOrder = (id, reason) => updateOrder(id, { status: 'cancelled', cancelReason: reason });

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrder, advanceStatus, cancelOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}
export const useOrders = () => useContext(OrdersContext);

/* ── Tables Context ───────────────────────────── */
const TablesContext = createContext(null);
function TablesProvider({ children }) {
  const [tables, setTables] = useState(() => load('pos_tables', SEED_TABLES));
  useEffect(() => { save('pos_tables', tables); }, [tables]);

  const updateTable = (id, patch) => setTables(p => p.map(t => t.id === id ? { ...t, ...patch } : t));
  const addTable = (table) => setTables(p => [...p, { ...table, id: uid() }]);
  const deleteTable = (id) => setTables(p => p.filter(t => t.id !== id));

  return (
    <TablesContext.Provider value={{ tables, updateTable, addTable, deleteTable }}>
      {children}
    </TablesContext.Provider>
  );
}
export const useTables = () => useContext(TablesContext);

/* ── Staff Context ────────────────────────────── */
const StaffContext = createContext(null);
function StaffProvider({ children }) {
  const [staff, setStaff] = useState(() => load('pos_staff', SEED_STAFF));
  useEffect(() => { save('pos_staff', staff); }, [staff]);

  const addStaff = (s) => setStaff(p => [...p, { ...s, id: uid() }]);
  const updateStaff = (id, patch) => setStaff(p => p.map(s => s.id === id ? { ...s, ...patch } : s));
  const deleteStaff = (id) => setStaff(p => p.filter(s => s.id !== id));

  return (
    <StaffContext.Provider value={{ staff, addStaff, updateStaff, deleteStaff }}>
      {children}
    </StaffContext.Provider>
  );
}
export const useStaff = () => useContext(StaffContext);

/* ── Customers Context ────────────────────────── */
const CustomersContext = createContext(null);
function CustomersProvider({ children }) {
  const [customers, setCustomers] = useState(() => load('pos_customers', SEED_CUSTOMERS));
  useEffect(() => { save('pos_customers', customers); }, [customers]);

  const addCustomer = (c) => setCustomers(p => [...p, { ...c, id: uid(), loyaltyPoints: 0, totalSpend: 0, visits: 0, lastVisit: new Date().toISOString().split('T')[0] }]);
  const updateCustomer = (id, patch) => setCustomers(p => p.map(c => c.id === id ? { ...c, ...patch } : c));

  return (
    <CustomersContext.Provider value={{ customers, addCustomer, updateCustomer }}>
      {children}
    </CustomersContext.Provider>
  );
}
export const useCustomers = () => useContext(CustomersContext);

/* ── Inventory Context ────────────────────────── */
const InventoryContext = createContext(null);
function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState(() => load('pos_inventory', SEED_INVENTORY));
  const [stockAdjustments, setStockAdjustments] = useState(() => load('pos_stock_adjustments', SEED_STOCK_ADJUSTMENTS));
  const [stockLedger, setStockLedger] = useState(() => load('pos_stock_ledger', SEED_STOCK_LEDGER));

  useEffect(() => { save('pos_inventory', inventory); }, [inventory]);
  useEffect(() => { save('pos_stock_adjustments', stockAdjustments); }, [stockAdjustments]);
  useEffect(() => { save('pos_stock_ledger', stockLedger); }, [stockLedger]);

  function computeStatus(inStock, reorderLevel) {
    if (inStock <= 0) return 'Out of Stock';
    if (inStock <= reorderLevel * 0.5) return 'Critical';
    if (inStock <= reorderLevel) return 'Low';
    return 'Normal';
  }

  const addItem = (item) => setInventory(p => [...p, { ...item, id: uid() }]);
  const addInventoryItem = (item) => setInventory(p => [...p, { ...item, id: uid() }]);
  const updateItem = (id, patch) => setInventory(p => p.map(i => i.id === id ? { ...i, ...patch } : i));
  const deleteInventoryItem = (id) => setInventory(p => p.filter(i => i.id !== id));

  const adjustStock = (id, name, delta, reason, performedBy = 'Admin') => {
    setInventory(p => p.map(i => {
      if (i.id !== id) return i;
      const newStock = Math.max(0, i.currentStock + delta);
      return { ...i, currentStock: newStock, inStock: newStock, status: computeStatus(newStock, i.reorderLevel) };
    }));
    const adjId = `ADJ-${Date.now().toString().slice(-4)}`;
    const entry = { id: adjId, timestamp: new Date().toISOString(), itemId: id, itemName: name, quantityChange: delta, reason, performedBy, notes: '' };
    setStockAdjustments(p => [entry, ...p]);
    logStockMovement({ type: 'ADJUSTMENT', itemId: id, itemName: name, quantityChange: delta, reason, performedBy });
  };

  const logStockMovement = ({ type = 'ADJUSTMENT', itemId, itemName, quantityChange, reason, performedBy = 'System', notes = '' }) => {
    const logId = `LOG-${Date.now().toString().slice(-5)}`;
    const entry = { id: logId, timestamp: new Date().toISOString(), type, itemId, itemName, quantityChange, reason, performedBy, notes };
    setStockLedger(p => [entry, ...p]);
  };

  const metrics = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((s, i) => s + (i.currentStock * i.cost), 0),
    lowStockCount: inventory.filter(i => i.currentStock <= i.reorderLevel && i.currentStock > 0).length,
    outOfStockCount: inventory.filter(i => i.currentStock <= 0).length,
    quarantineCount: 0,
  };

  return (
    <InventoryContext.Provider value={{ inventory, stockAdjustments, stockLedger, metrics, addItem, addInventoryItem, updateItem, deleteInventoryItem, adjustStock, logStockMovement }}>
      {children}
    </InventoryContext.Provider>
  );
}
export const useInventory = () => useContext(InventoryContext);

/* ── Suppliers Context ────────────────────────── */
const SuppliersContext = createContext(null);
function SuppliersProvider({ children }) {
  const [suppliers, setSuppliers] = useState(() => load('pos_suppliers', SEED_SUPPLIERS));
  useEffect(() => { save('pos_suppliers', suppliers); }, [suppliers]);

  const addSupplier = (s) => setSuppliers(p => [...p, { ...s, id: uid(), outstanding: 0, totalPurchased: 0, lastOrder: null }]);
  const updateSupplier = (id, patch) => setSuppliers(p => p.map(s => s.id === id ? { ...s, ...patch } : s));
  const deleteSupplier = (id) => setSuppliers(p => p.filter(s => s.id !== id));

  return (
    <SuppliersContext.Provider value={{ suppliers, addSupplier, updateSupplier, deleteSupplier }}>
      {children}
    </SuppliersContext.Provider>
  );
}
export const useSuppliers = () => useContext(SuppliersContext);

/* ── Purchase Orders Context ──────────────────── */
const PurchaseOrdersContext = createContext(null);
function PurchaseOrdersProvider({ children }) {
  const [pos, setPOs] = useState(() => load('pos_purchase_orders', SEED_PURCHASE_ORDERS));
  useEffect(() => { save('pos_purchase_orders', pos); }, [pos]);

  const addPO = (po) => setPOs(p => [{ ...po, id: `PO-${String(p.length + 3).padStart(3,'0')}`, createdAt: new Date().toISOString(), status: 'pending' }, ...p]);
  const updatePO = (id, patch) => setPOs(p => p.map(o => o.id === id ? { ...o, ...patch } : o));

  return (
    <PurchaseOrdersContext.Provider value={{ purchaseOrders: pos, addPO, updatePO }}>
      {children}
    </PurchaseOrdersContext.Provider>
  );
}
export const usePurchaseOrders = () => useContext(PurchaseOrdersContext);

/* ── Invoices Context ─────────────────────────── */
const InvoicesContext = createContext(null);
function InvoicesProvider({ children }) {
  const [invoices, setInvoices] = useState(() => load('pos_invoices', SEED_INVOICES));
  useEffect(() => { save('pos_invoices', invoices); }, [invoices]);

  const addInvoice = (inv) => setInvoices(p => [{ ...inv, id: `INV-${String(p.length + 24).padStart(4,'0')}`, createdAt: new Date().toISOString() }, ...p]);

  return (
    <InvoicesContext.Provider value={{ invoices, addInvoice }}>
      {children}
    </InvoicesContext.Provider>
  );
}
export const useInvoices = () => useContext(InvoicesContext);

/* ── Outlet Context ────────────────────────────── */
const OutletContext = createContext(null);
function OutletProvider({ children }) {
  const [selectedOutlet, setSelectedOutlet] = useState('ALL');
  return (
    <OutletContext.Provider value={{ selectedOutlet, setSelectedOutlet }}>
      {children}
    </OutletContext.Provider>
  );
}
export const useOutlet = () => useContext(OutletContext);

/* ── Settings Context ─────────────────────────── */
const SettingsContext = createContext(null);
const DEFAULT_SETTINGS = {
  restaurantName: 'Spice Garden',
  address: '12, MG Road, Bengaluru, Karnataka 560001',
  phone: '080-12345678',
  gstin: '29AABCU9603R1ZV',
  fssai: '10020012000123',
  currency: '₹',
  taxRate: 5,
  serviceCharge: 0,
  timezone: 'Asia/Kolkata',
  receiptFooter: 'Thank you for dining with us!',
  gstEnabled: true,
  serviceChargeEnabled: false,
  tableService: true,
  takeaway: true,
  delivery: true,
};
function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => load('pos_settings', DEFAULT_SETTINGS));
  useEffect(() => { save('pos_settings', settings); }, [settings]);

  const updateSettings = (patch) => setSettings(p => ({ ...p, ...patch }));

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
export const useSettings = () => useContext(SettingsContext);

/* ── Root Provider ────────────────────────────── */
export default function Providers({ children }) {
  return (
    <OutletProvider>
      <SettingsProvider>
        <MenuProvider>
          <OrdersProvider>
            <TablesProvider>
              <StaffProvider>
                <CustomersProvider>
                  <InventoryProvider>
                    <SuppliersProvider>
                      <PurchaseOrdersProvider>
                        <InvoicesProvider>
                          {children}
                        </InvoicesProvider>
                      </PurchaseOrdersProvider>
                    </SuppliersProvider>
                  </InventoryProvider>
                </CustomersProvider>
              </StaffProvider>
            </TablesProvider>
          </OrdersProvider>
        </MenuProvider>
      </SettingsProvider>
    </OutletProvider>
  );
}
