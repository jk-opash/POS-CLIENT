"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Maximize,
  Plus,
  Edit2,
  Check,
  X,
  Trash2,
  Utensils,
  CreditCard,
  Printer,
  Ban,
  Clock,
  CalendarDays,
  GitMerge,
  RotateCw,
  CheckSquare,
  Square,
  Split,
  Minus,
  Search,
  ChevronDown,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── MOCK ZONE DATA ───────────────────────────────────────────────────────────
const ZONE_DATA = {
  "main-dining": {
    name: "Main Dining Room",
    floors: [
      { id: "f1", name: "Floor 1" },
      { id: "f2", name: "Floor 2" },
    ],
  },
  patio: {
    name: "Outdoor Patio",
    floors: [{ id: "f1", name: "Garden Level" }],
  },
  rooftop: {
    name: "Rooftop Lounge",
    floors: [
      { id: "f1", name: "Main" },
      { id: "f2", name: "Bar Corner" },
    ],
  },
  bar: { name: "Main Bar", floors: [{ id: "f1", name: "Bar Floor" }] },
};

const INITIAL_TABLES = [
  {
    id: "t1",
    name: "T1",
    floorId: "f1",
    x: 120,
    y: 100,
    capacity: 4,
    status: "Available",
    shape: "square",
    rotation: 0,
    order: null,
    originalTables: [],
  },
  {
    id: "t2",
    name: "T2",
    floorId: "f1",
    x: 280,
    y: 100,
    capacity: 4,
    status: "Occupied",
    shape: "square",
    rotation: 0,
    order: [
      {
        cartItemId: "c1",
        productId: "m1",
        quantity: 2,
        note: "extra cheese",
        addons: [],
      },
      { cartItemId: "c2", productId: "m3", quantity: 1, note: "", addons: [] },
    ],
    originalTables: [],
  },
  {
    id: "t3",
    name: "T3",
    floorId: "f1",
    x: 440,
    y: 100,
    capacity: 2,
    status: "Available",
    shape: "circle",
    rotation: 0,
    order: null,
    originalTables: [],
  },
  {
    id: "t4",
    name: "T4",
    floorId: "f1",
    x: 120,
    y: 280,
    capacity: 6,
    status: "Reserved",
    shape: "rectangle",
    rotation: 0,
    order: null,
    originalTables: [],
  },
  {
    id: "t5",
    name: "T5",
    floorId: "f1",
    x: 340,
    y: 280,
    capacity: 4,
    status: "Occupied",
    shape: "square",
    rotation: 0,
    order: [
      {
        cartItemId: "c3",
        productId: "m2",
        quantity: 1,
        note: "no onion",
        addons: ["Extra Sauce"],
      },
    ],
    originalTables: [],
  },
  {
    id: "t6",
    name: "T6",
    floorId: "f1",
    x: 560,
    y: 280,
    capacity: 2,
    status: "Available",
    shape: "circle",
    rotation: 0,
    order: null,
    originalTables: [],
  },
  {
    id: "t7",
    name: "T7",
    floorId: "f2",
    x: 150,
    y: 120,
    capacity: 8,
    status: "Available",
    shape: "rectangle",
    rotation: 0,
    order: null,
    originalTables: [],
  },
  {
    id: "t8",
    name: "T8",
    floorId: "f2",
    x: 400,
    y: 120,
    capacity: 4,
    status: "Occupied",
    shape: "square",
    rotation: 0,
    order: [
      { cartItemId: "c4", productId: "m4", quantity: 3, note: "", addons: [] },
    ],
    originalTables: [],
  },
];

// ─── MOCK MENU ────────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    id: "m1",
    name: "Margherita Pizza",
    category: "Food",
    price: 450,
    status: "Active",
    addons: ["Extra Cheese", "Thin Crust", "Thick Crust"],
  },
  {
    id: "m2",
    name: "Pasta Alfredo",
    category: "Food",
    price: 350,
    status: "Active",
    addons: ["Extra Sauce", "No Onion"],
  },
  {
    id: "m3",
    name: "Coke",
    category: "Beverage",
    price: 80,
    status: "Active",
    addons: [],
  },
  {
    id: "m4",
    name: "Cold Coffee",
    category: "Beverage",
    price: 150,
    status: "Active",
    addons: ["Extra Sugar", "No Ice"],
  },
  {
    id: "m5",
    name: "Paneer Tikka",
    category: "Starters",
    price: 320,
    status: "Active",
    addons: ["Extra Chutney"],
  },
  {
    id: "m6",
    name: "Dal Makhani",
    category: "Food",
    price: 280,
    status: "Active",
    addons: [],
  },
  {
    id: "m7",
    name: "Garlic Naan",
    category: "Breads",
    price: 60,
    status: "Active",
    addons: [],
  },
  {
    id: "m8",
    name: "Fresh Lime Soda",
    category: "Beverage",
    price: 90,
    status: "Active",
    addons: ["Sweet", "Salted"],
  },
];

const CAPACITY_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const cap = (i + 1) * 2;
  return { value: cap, label: `${cap} Seats` };
});

// ─── TABLE ITEM (Web Port of TableItem.js) ────────────────────────────────────
function TableWidget({
  table,
  isEditMode,
  isMergeMode,
  isMergeSelected,
  onClick,
  onMouseDown,
}) {
  const hasOrder =
    table.order &&
    (Array.isArray(table.order)
      ? table.order.length > 0
      : Object.keys(table.order).length > 0);
  const isOccupied = table.status === "Occupied" || hasOrder;
  const isReserved = table.status === "Reserved" && !hasOrder;

  const colors = isOccupied
    ? { bg: "#EFF6FF", border: "#2563EB", text: "#1D4ED8" }
    : isReserved
      ? { bg: "#FFF1F2", border: "#E11D48", text: "#BE123C" }
      : { bg: "#FFFFFF", border: "#10B981", text: "#065F46" };

  const isCircle = table.shape === "circle" || table.shape === "oval";
  const isRect = table.shape === "rectangle";
  const w = isRect ? 128 : 80;
  const h = 80;

  return (
    <div
      onClick={onClick}
      onMouseDown={onMouseDown}
      className={`absolute flex flex-col items-center justify-center transition-transform select-none ${isEditMode && !isMergeMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
      style={{
        left: table.x,
        top: table.y,
        transform: `rotate(${table.rotation || 0}deg)`,
        zIndex: isEditMode ? 10 : 1,
      }}
    >
      {/* Top chairs (rect) */}
      {isRect && (
        <div className="flex gap-2 mb-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 22,
                height: 8,
                borderRadius: 4,
                background: colors.border,
              }}
            />
          ))}
        </div>
      )}

      {/* Table Body */}
      <div
        className={`flex flex-col items-center justify-center shadow-md border-2 ${isMergeSelected ? "ring-4 ring-blue-400 ring-offset-2 ring-offset-slate-50" : ""} ${isEditMode && !isMergeMode ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-50" : ""}`}
        style={{
          width: w,
          height: h,
          background: colors.bg,
          borderColor: colors.border,
          borderRadius: isCircle ? 9999 : 12,
        }}
      >
        <span className="font-black text-base" style={{ color: colors.text }}>
          {table.name}
        </span>
        <span
          className="text-[10px] font-semibold"
          style={{ color: colors.text }}
        >
          {table.capacity}P
        </span>
        {isOccupied && (
          <Eye size={12} style={{ color: colors.text, marginTop: 2 }} />
        )}
        {isMergeSelected && (
          <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
            <Check size={10} color="white" />
          </div>
        )}
      </div>

      {/* Bottom chairs (rect) */}
      {isRect && (
        <div className="flex gap-2 mt-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 22,
                height: 8,
                borderRadius: 4,
                background: colors.border,
              }}
            />
          ))}
        </div>
      )}

      {/* Side chairs (circle/square) */}
      {!isRect && (
        <>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2">
            {Array.from({ length: Math.ceil(table.capacity / 2) }).map(
              (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 16,
                    height: 8,
                    borderRadius: 4,
                    background: colors.border,
                  }}
                />
              ),
            )}
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {Array.from({ length: Math.floor(table.capacity / 2) }).map(
              (_, i) => (
                <div
                  key={i}
                  style={{
                    width: 16,
                    height: 8,
                    borderRadius: 4,
                    background: colors.border,
                  }}
                />
              ),
            )}
          </div>
        </>
      )}

      {/* Edit mode action buttons */}
      {isEditMode && !isMergeMode && (
        <>
          <div
            className="absolute -top-3 -right-3 bg-emerald-500 rounded-full w-7 h-7 flex items-center justify-center shadow-md cursor-pointer hover:bg-emerald-600 z-10"
            onClick={(e) => {
              e.stopPropagation();
              onClick("rotate");
            }}
          >
            <RotateCw size={13} color="white" />
          </div>
          <div
            className="absolute -top-3 -left-3 bg-blue-500 rounded-full w-7 h-7 flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-600 z-10"
            onClick={(e) => {
              e.stopPropagation();
              onClick("edit");
            }}
          >
            <Edit2 size={13} color="white" />
          </div>
        </>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ZoneCanvasPage() {
  const params = useParams();
  const router = useRouter();
  const zoneId = params.zoneId;
  const zoneInfo = ZONE_DATA[zoneId] || {
    name: zoneId,
    floors: [{ id: "f1", name: "Floor 1" }],
  };

  const [tables, setTables] = useState(INITIAL_TABLES);
  const [activeFloor, setActiveFloor] = useState(zoneInfo.floors[0]?.id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Modal visibility
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [isMergeMode, setIsMergeMode] = useState(false);

  const [activeTable, setActiveTable] = useState(null);
  const [mergeSelection, setMergeSelection] = useState([]);
  const [detailsModalMode, setDetailsModalMode] = useState("add");

  // Table Details form
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState(4);
  const [editShape, setEditShape] = useState("square");

  // Order Menu state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [orderItems, setOrderItems] = useState([]);

  const floorTables = tables.filter((t) => t.floorId === activeFloor);
  const availableCount = floorTables.filter(
    (t) => t.status === "Available" && !t.order?.length,
  ).length;
  const occupiedCount = floorTables.filter(
    (t) => t.status === "Occupied" || (t.order && t.order.length > 0),
  ).length;
  const reservedCount = floorTables.filter(
    (t) => t.status === "Reserved",
  ).length;

  // ─ Drag & Pan Logic ─────────────────────────────────────────────────────────
  const dragTable = useRef(null);
  const dragStart = useRef({ mx: 0, my: 0, tx: 0, ty: 0, px: 0, py: 0 });
  const isDraggingView = useRef(false);

  const onTableMouseDown = (e, table) => {
    if (!isEditMode || isMergeMode) return;
    dragTable.current = table.id;
    dragStart.current = {
      mx: e.clientX,
      my: e.clientY,
      tx: table.x,
      ty: table.y,
    };
    e.stopPropagation();
  };

  const onCanvasMouseDown = (e) => {
    isDraggingView.current = true;
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
  };

  const onMouseMove = (e) => {
    if (dragTable.current) {
      const dx = (e.clientX - dragStart.current.mx) / zoom;
      const dy = (e.clientY - dragStart.current.my) / zoom;
      const snappedX = Math.round((dragStart.current.tx + dx) / 25) * 25;
      const snappedY = Math.round((dragStart.current.ty + dy) / 25) * 25;
      setTables((prev) =>
        prev.map((t) =>
          t.id === dragTable.current ? { ...t, x: snappedX, y: snappedY } : t,
        ),
      );
    } else if (isDraggingView.current) {
      const dx = e.clientX - dragStart.current.mx;
      const dy = e.clientY - dragStart.current.my;
      setPan({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
    }
  };

  const onMouseUp = () => {
    dragTable.current = null;
    isDraggingView.current = false;
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.3));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // ─ Table Click Logic ───────────────────────────────────────────────────────
  const handleTableClick = (table, action) => {
    if (isMergeMode) {
      setMergeSelection((prev) =>
        prev.includes(table.id)
          ? prev.filter((id) => id !== table.id)
          : [...prev, table.id],
      );
      return;
    }
    if (isEditMode) {
      if (action === "rotate") {
        setTables((prev) =>
          prev.map((t) =>
            t.id === table.id
              ? { ...t, rotation: ((t.rotation || 0) + 90) % 360 }
              : t,
          ),
        );
      } else if (action === "edit" || !action) {
        setEditName(table.name);
        setEditCapacity(table.capacity);
        setEditShape(table.shape);
        setDetailsModalMode("edit");
        setActiveTable(table);
        setShowDetailsModal(true);
      }
    } else {
      setActiveTable(table);
      setShowActionModal(true);
    }
  };

  // ─ Add Table ───────────────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditName(`T${tables.length + 1}`);
    setEditCapacity(4);
    setEditShape("square");
    setDetailsModalMode("add");
    setActiveTable(null);
    setShowDetailsModal(true);
  };

  const saveTableDetails = () => {
    if (detailsModalMode === "add") {
      setTables((prev) => [
        ...prev,
        {
          id: `t${Date.now()}`,
          name: editName,
          floorId: activeFloor,
          x: 300,
          y: 300,
          capacity: editCapacity,
          status: "Available",
          shape: editShape,
          rotation: 0,
          order: null,
          originalTables: [],
        },
      ]);
    } else {
      setTables((prev) =>
        prev.map((t) =>
          t.id === activeTable.id
            ? { ...t, name: editName, capacity: editCapacity, shape: editShape }
            : t,
        ),
      );
    }
    setShowDetailsModal(false);
  };

  const deleteTable = () => {
    setTables((prev) => prev.filter((t) => t.id !== activeTable.id));
    setShowDetailsModal(false);
  };

  // ─ Table Action Logic ──────────────────────────────────────────────────────
  const updateStatus = (id, status) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    setShowActionModal(false);
  };

  const checkoutTable = (id) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "Available", order: null } : t,
      ),
    );
    setShowActionModal(false);
  };

  const cancelOrder = (id) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "Available", order: null } : t,
      ),
    );
    setShowActionModal(false);
  };

  const unmergeTable = (id) => {
    const tbl = tables.find((t) => t.id === id);
    if (!tbl?.originalTables?.length) return;
    setTables((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      return [...filtered, ...tbl.originalTables];
    });
    setShowActionModal(false);
  };

  // ─ Order Menu Logic ────────────────────────────────────────────────────────
  const openTakeOrder = (tbl) => {
    setActiveTable(tbl);
    const existing = Array.isArray(tbl.order) ? tbl.order : [];
    setOrderItems(existing);
    setSearchQuery("");
    setActiveCategory("All");
    setShowActionModal(false);
    setShowOrderModal(true);
  };

  const categories = useMemo(
    () => ["All", ...new Set(MENU_ITEMS.map((i) => i.category))],
    [],
  );
  const filteredMenu = useMemo(
    () =>
      MENU_ITEMS.filter(
        (item) =>
          (activeCategory === "All" || item.category === activeCategory) &&
          item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [activeCategory, searchQuery],
  );

  const cart = useMemo(
    () =>
      orderItems
        .filter((i) => i.quantity > 0)
        .map((i) => ({
          ...i,
          product: MENU_ITEMS.find((p) => p.id === i.productId),
        }))
        .filter((c) => c.product),
    [orderItems],
  );

  const addToCart = (product) => {
    setOrderItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.productId === product.id &&
          !i.note &&
          (i.addons || []).length === 0,
      );
      if (idx >= 0) {
        const n = [...prev];
        n[idx] = { ...n[idx], quantity: n[idx].quantity + 1 };
        return n;
      }
      return [
        ...prev,
        {
          cartItemId: Math.random().toString(),
          productId: product.id,
          quantity: 1,
          note: "",
          addons: [],
        },
      ];
    });
  };
  const updateQty = (cid, qty) =>
    setOrderItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.cartItemId !== cid)
        : prev.map((i) => (i.cartItemId === cid ? { ...i, quantity: qty } : i)),
    );
  const updateNote = (cid, note) =>
    setOrderItems((prev) =>
      prev.map((i) => (i.cartItemId === cid ? { ...i, note } : i)),
    );
  const toggleAddon = (cid, addon) =>
    setOrderItems((prev) =>
      prev.map((i) => {
        if (i.cartItemId !== cid) return i;
        const addons = (i.addons || []).includes(addon)
          ? i.addons.filter((a) => a !== addon)
          : [...(i.addons || []), addon];
        return { ...i, addons };
      }),
    );
  const clearCart = () => setOrderItems([]);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const tax = subtotal * 0.05;

  const placeOrder = () => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === activeTable.id
          ? { ...t, status: "Occupied", order: orderItems }
          : t,
      ),
    );
    setShowOrderModal(false);
  };

  // ─ Merge Logic ─────────────────────────────────────────────────────────────
  const executeMerge = () => {
    if (mergeSelection.length < 2) return;
    const selected = tables.filter((t) => mergeSelection.includes(t.id));
    const merged = {
      id: `merged-${Date.now()}`,
      name: selected.map((t) => t.name).join("+"),
      floorId: activeFloor,
      x: Math.min(...selected.map((t) => t.x)),
      y: Math.min(...selected.map((t) => t.y)),
      capacity: selected.reduce((s, t) => s + t.capacity, 0),
      status: "Available",
      shape: "rectangle",
      rotation: 0,
      order: null,
      originalTables: selected,
    };
    setTables((prev) => [
      ...prev.filter((t) => !mergeSelection.includes(t.id)),
      merged,
    ]);
    setMergeSelection([]);
    setIsMergeMode(false);
  };

  return (
    <div
      className="flex h-screen bg-slate-50 font-sans overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* ─ Header ─────────────────────────────────────────────────────────── */}
        <div className="absolute top-0 left-0 right-0 z-20 flex flex-col pointer-events-none">
          {/* Top Bar */}
          <div className="p-4 flex justify-between items-center pointer-events-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/zone")}
                className="w-10 h-10 bg-white/80 backdrop-blur border border-slate-200 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-lg"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="bg-white/80 backdrop-blur border border-slate-200 px-4 py-2 rounded-2xl shadow-lg">
                <h1 className="text-slate-800 font-black text-base">
                  {zoneInfo.name}
                </h1>
                <div className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  {isEditMode ? "✏️ Edit Mode" : "🟢 Live Mode"}
                </div>
              </div>
            </div>
            {/* Merge Tables btn visible when not in edit mode */}
            {!isEditMode && !isMergeMode && (
              <button
                onClick={() => {
                  setIsMergeMode(true);
                }}
                className="bg-emerald-600 border border-emerald-500 text-white font-bold text-sm px-4 py-2 rounded-full shadow hover:bg-emerald-700 flex items-center gap-2 pointer-events-auto"
              >
                <GitMerge size={16} /> Merge Tables
              </button>
            )}
          </div>
        </div>

        {/* ─ Canvas ─────────────────────────────────────────────────────────── */}
        <div
          className={`flex-1 overflow-hidden relative ${isDraggingView.current ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={onCanvasMouseDown}
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
            backgroundColor: "#f8fafc",
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        >
          <div
            className="absolute"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
              width: "100%",
              height: "100%",
            }}
          >
            {floorTables.map((table) => (
              <TableWidget
                key={table.id}
                table={table}
                isEditMode={isEditMode}
                isMergeMode={isMergeMode}
                isMergeSelected={mergeSelection.includes(table.id)}
                onClick={(action) => handleTableClick(table, action)}
                onMouseDown={(e) => onTableMouseDown(e, table)}
              />
            ))}
          </div>
        </div>

        {/* ─ Legend (bottom-left) ───────────────────────────────────────────── */}
        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur border border-slate-200 p-4 rounded-2xl shadow-2xl z-10 flex flex-col gap-2.5 min-w-[180px]">
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 pb-2 mb-1">
            Floor Status
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white border border-slate-300"></div>
              <span className="text-slate-600 text-xs font-semibold">
                Available
              </span>
            </div>
            <span className="text-slate-800 font-black text-sm">
              {availableCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-slate-600 text-xs font-semibold">
                Occupied
              </span>
            </div>
            <span className="text-slate-800 font-black text-sm">
              {occupiedCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <span className="text-slate-600 text-xs font-semibold">
                Reserved
              </span>
            </div>
            <span className="text-slate-800 font-black text-sm">
              {reservedCount}
            </span>
          </div>
        </div>

        {/* ─ Zoom Controls ─────────────────────────────────────────────────── */}
        <div className="absolute bottom-8 left-52 flex items-center bg-white/90 backdrop-blur border border-slate-200 rounded-full p-1 gap-1 shadow-2xl z-10">
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-3 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors text-xs font-bold"
          >
            <Maximize size={15} /> Reset
          </button>
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ZoomIn size={18} />
          </button>
        </div>

        {/* ─ FABs (bottom-right) ────────────────────────────────────────────── */}
        <div className="absolute bottom-8 right-8 flex items-center gap-3 z-10">
          {isMergeMode && (
            <>
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => {
                  setIsMergeMode(false);
                  setMergeSelection([]);
                }}
                className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-full text-slate-800 font-bold text-sm shadow-xl hover:bg-slate-50"
              >
                <X size={16} /> Cancel
              </motion.button>
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={executeMerge}
                disabled={mergeSelection.length < 2}
                className="flex items-center gap-2 px-5 py-3.5 bg-emerald-600 border border-emerald-500 rounded-full text-white font-bold text-sm shadow-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GitMerge size={16} /> Merge ({mergeSelection.length})
              </motion.button>
            </>
          )}

          {isEditMode && !isMergeMode && (
            <>
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => setIsMergeMode(true)}
                className="flex items-center gap-2 px-5 py-3.5 bg-purple-600 border border-purple-500 rounded-full text-white font-bold text-sm shadow-xl hover:bg-purple-700"
              >
                <GitMerge size={16} /> Merge
              </motion.button>
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={openAddModal}
                className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-full text-slate-800 font-bold text-sm shadow-xl hover:bg-slate-50"
              >
                <Plus size={18} /> Add Table
              </motion.button>
            </>
          )}

          {!isMergeMode && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-full text-white font-bold text-sm shadow-xl transition-colors ${isEditMode ? "bg-emerald-600 border border-emerald-500 hover:bg-emerald-700" : "bg-blue-600 border border-blue-500 hover:bg-blue-700"}`}
            >
              {isEditMode ? (
                <>
                  <Check size={18} strokeWidth={3} /> Done Editing
                </>
              ) : (
                <>
                  <Edit2 size={18} /> Edit Layout
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MODALS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {/* ─ Table Details Modal ───────────────────────────────────────────── */}
          {showDetailsModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-[420px] overflow-hidden"
              >
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-xl font-black text-slate-800">
                    {detailsModalMode === "edit"
                      ? "Edit Table"
                      : "Add New Table"}
                  </h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-slate-400 hover:bg-slate-100 p-2 rounded-xl"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 flex flex-col gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      Table Name / Label
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. A12"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                      Capacity
                    </label>
                    <select
                      value={editCapacity}
                      onChange={(e) => setEditCapacity(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {CAPACITY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
                      Shape
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["rectangle", "square", "circle", "oval"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setEditShape(s)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm capitalize transition-all ${editShape === s ? "bg-emerald-500 border-emerald-500 text-white" : "bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-300"}`}
                        >
                          {s === "circle" || s === "oval" ? (
                            <div className="w-4 h-4 rounded-full border-2 border-current" />
                          ) : (
                            <div className="w-4 h-4 rounded-sm border-2 border-current" />
                          )}
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
                  {detailsModalMode === "edit" ? (
                    <button
                      onClick={deleteTable}
                      className="flex items-center gap-2 px-4 py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-xl text-sm"
                    >
                      <Trash2 size={16} /> Delete Table
                    </button>
                  ) : (
                    <div />
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveTableDetails}
                      className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ─ Table Action Modal ────────────────────────────────────────────── */}
          {showActionModal &&
            activeTable &&
            (() => {
              const t = activeTable;
              const hasOrd =
                t.order &&
                (Array.isArray(t.order)
                  ? t.order.length > 0
                  : Object.keys(t.order).length > 0);
              const isAvail = t.status === "Available";
              const isOcc = t.status === "Occupied" || hasOrd;
              const isRes = t.status === "Reserved";

              const orderList =
                hasOrd && Array.isArray(t.order)
                  ? t.order
                      .map((i) => ({
                        ...i,
                        product: MENU_ITEMS.find((p) => p.id === i.productId),
                      }))
                      .filter((i) => i.product && i.quantity > 0)
                  : [];
              const orderTotal = orderList.reduce(
                (s, i) => s + i.product.price * i.quantity,
                0,
              );
              const statusColor = isOcc
                ? "#2563EB"
                : isRes
                  ? "#E11D48"
                  : "#10B981";

              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
                  onClick={() => setShowActionModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-[420px] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="p-5 border-b flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-2xl font-black text-slate-800">
                            {t.name}
                          </h2>
                          <span
                            className="text-xs font-black px-2.5 py-1 rounded-full"
                            style={{
                              background: statusColor + "20",
                              color: statusColor,
                            }}
                          >
                            {t.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 font-semibold">
                          Capacity: {t.capacity} Persons
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mr-2">
                        <div className="bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
                          <div className="bg-slate-800 text-white rounded-lg p-2 text-[8px] font-bold leading-tight text-center">
                            QR
                            <br />
                            TABLE
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowActionModal(false)}
                        className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-xl"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      {hasOrd ? (
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg mb-3">
                            Current Order
                          </h3>
                          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 mb-3">
                            {orderList.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center py-2 gap-2"
                              >
                                <span className="text-slate-500 font-bold w-8">
                                  {item.quantity}×
                                </span>
                                <span className="flex-1 text-slate-700 font-semibold text-sm">
                                  {item.product.name}
                                </span>
                                <span className="font-bold text-slate-800">
                                  ₹
                                  {(item.product.price * item.quantity).toFixed(
                                    2,
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between border-t-2 border-slate-200 pt-3 mb-4">
                            <span className="font-semibold text-slate-600">
                              Total Amount
                            </span>
                            <span className="font-black text-emerald-600 text-xl">
                              ₹{orderTotal.toFixed(2)}
                            </span>
                          </div>
                          <button
                            onClick={() => checkoutTable(t.id)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm mb-3"
                          >
                            <CreditCard size={20} /> Settle &amp; Clear Table
                          </button>
                          <div className="flex gap-2 mb-2">
                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded-xl text-sm">
                              <Printer size={16} /> Print Bill
                            </button>
                            <button
                              onClick={() => openTakeOrder(t)}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm"
                            >
                              <Edit2 size={16} /> Edit Items
                            </button>
                          </div>
                          <button
                            onClick={() => cancelOrder(t.id)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-rose-600 font-bold rounded-xl text-sm hover:bg-rose-50"
                          >
                            <Ban size={16} /> Cancel Order
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {isAvail && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => openTakeOrder(t)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm"
                              >
                                <Utensils size={20} /> Take Order
                              </button>
                              <button
                                onClick={() => updateStatus(t.id, "Occupied")}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded-xl text-sm"
                              >
                                <CalendarDays size={16} /> Mark Occupied
                              </button>
                            </div>
                          )}
                          {isRes && (
                            <>
                              <button
                                onClick={() => openTakeOrder(t)}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm"
                              >
                                <Utensils size={20} /> Guest Arrived - Take
                                Order
                              </button>
                              <button
                                onClick={() => updateStatus(t.id, "Occupied")}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded-xl text-sm"
                              >
                                <Clock size={16} /> Guest Arrived (No Order)
                              </button>
                              <button
                                onClick={() => updateStatus(t.id, "Available")}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl text-sm"
                              >
                                <Trash2 size={16} /> Cancel Reservation
                              </button>
                            </>
                          )}
                          {isOcc && !hasOrd && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => openTakeOrder(t)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm"
                              >
                                <Utensils size={20} /> Take Order
                              </button>
                              <button
                                onClick={() => updateStatus(t.id, "Available")}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl text-sm"
                              >
                                <Ban size={16} /> Clear Table
                              </button>
                            </div>
                          )}
                          {/* Reserve button available for all no-order states */}
                          {!isRes && (
                            <button
                              onClick={() => updateStatus(t.id, "Reserved")}
                              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl text-sm"
                            >
                              <CalendarDays size={16} /> Mark as Reserved
                            </button>
                          )}
                        </div>
                      )}
                      {/* Unmerge */}
                      {t.originalTables && t.originalTables.length > 0 && (
                        <button
                          onClick={() => unmergeTable(t.id)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xl text-sm mt-3"
                        >
                          <Split size={16} /> Unmerge Table
                        </button>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}

          {/* ─ Order Menu (full-height slide-in) ─────────────────────────────── */}
          {showOrderModal && activeTable && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="absolute right-0 top-0 bottom-0 w-[800px] bg-white z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-800 text-white shrink-0">
                <div>
                  <h2 className="text-xl font-black">
                    Order for {activeTable.name}
                  </h2>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">
                    Add items to table order
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-xl"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body: split panel */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left: Menu */}
                <div className="flex-[2] flex flex-col border-r border-slate-200">
                  {/* Toolbar */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-3">
                    <div className="flex-1 relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-2.5 text-slate-400"
                      />
                      <input
                        type="text"
                        placeholder="Search menu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    </div>
                    <select
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    >
                      {categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  {/* Product Grid */}
                  <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 gap-3 content-start">
                    {filteredMenu.map((item) => {
                      const qty = orderItems
                        .filter((i) => i.productId === item.id)
                        .reduce((s, i) => s + i.quantity, 0);
                      return (
                        <button
                          key={item.id}
                          onClick={() => addToCart(item)}
                          className={`relative flex flex-col p-4 rounded-2xl border-2 text-left transition-all ${qty > 0 ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm"}`}
                        >
                          <span className="font-bold text-slate-800 text-sm leading-tight mb-1">
                            {item.name}
                          </span>
                          <span className="text-slate-500 text-xs font-medium">
                            {item.category}
                          </span>
                          <span className="font-black text-emerald-600 text-sm mt-1.5">
                            ₹{item.price}
                          </span>
                          {qty > 0 && (
                            <div className="absolute top-2 right-2 bg-emerald-500 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow">
                              <span className="text-white text-xs font-black">
                                {qty}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Cart */}
                <div className="flex-1 flex flex-col bg-slate-50">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <span className="font-black text-slate-800">
                      Order Summary
                    </span>
                    <button
                      onClick={clearCart}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                    {cart.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 py-12">
                        <Utensils size={40} className="text-slate-200" />
                        <span className="text-sm font-medium">
                          Cart is empty
                        </span>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.cartItemId}
                          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-bold text-slate-800 text-sm">
                                {item.product.name}
                              </div>
                              <div className="text-slate-500 text-xs">
                                ₹{item.product.price} each
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                              <button
                                onClick={() =>
                                  updateQty(item.cartItemId, item.quantity - 1)
                                }
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-slate-50"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-black text-slate-800 w-5 text-center text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQty(item.cartItemId, item.quantity + 1)
                                }
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-slate-50"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-end mb-2">
                            <span className="font-black text-emerald-600 text-sm">
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <input
                            type="text"
                            placeholder="Add note (e.g. less spicy)..."
                            value={item.note || ""}
                            onChange={(e) =>
                              updateNote(item.cartItemId, e.target.value)
                            }
                            className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-300 bg-slate-50 mb-2"
                          />
                          {item.product.addons?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {item.product.addons.map((addon) => {
                                const sel = (item.addons || []).includes(addon);
                                return (
                                  <button
                                    key={addon}
                                    onClick={() =>
                                      toggleAddon(item.cartItemId, addon)
                                    }
                                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all ${sel ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300"}`}
                                  >
                                    {addon}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  {/* Cart Footer */}
                  <div className="p-4 border-t border-slate-200 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.04)]">
                    <div className="flex justify-between text-sm font-semibold text-slate-600 mb-1">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-slate-600 mb-3">
                      <span>Tax (5%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-black text-slate-800 text-xl mb-4 pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span className="text-emerald-600">
                        ₹{(subtotal + tax).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={placeOrder}
                      disabled={cart.length === 0}
                      className="w-full py-4 bg-emerald-500 disabled:bg-slate-300 text-white font-black text-base rounded-2xl shadow-lg hover:bg-emerald-600 transition-colors"
                    >
                      Send to Kitchen 🍳
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─ Merge Tables Modal ────────────────────────────────────────────── */}
          {showMergeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-[600px] overflow-hidden max-h-[80vh] flex flex-col"
              >
                <div className="p-6 border-b flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">
                      Merge Tables
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Select 2 or more tables to merge into one large table.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowMergeModal(false)}
                    className="bg-slate-100 rounded-full p-2 hover:bg-slate-200"
                  >
                    <X size={22} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid grid-cols-3 gap-3">
                    {floorTables.map((t) => {
                      const isSel = mergeSelection.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          onClick={() =>
                            setMergeSelection((prev) =>
                              prev.includes(t.id)
                                ? prev.filter((id) => id !== t.id)
                                : [...prev, t.id],
                            )
                          }
                          className={`p-4 rounded-2xl border-2 text-left transition-all ${isSel ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:border-emerald-300"}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-black text-slate-800">
                              {t.name}
                            </span>
                            {isSel ? (
                              <CheckSquare
                                size={18}
                                className="text-emerald-500"
                              />
                            ) : (
                              <Square size={18} className="text-slate-300" />
                            )}
                          </div>
                          <div className="text-xs font-medium text-slate-500">
                            Capacity: {t.capacity}
                          </div>
                          <div
                            className="text-xs font-bold mt-1"
                            style={{
                              color:
                                t.status === "Occupied"
                                  ? "#2563EB"
                                  : t.status === "Reserved"
                                    ? "#E11D48"
                                    : "#10B981",
                            }}
                          >
                            {t.status}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4 border-t bg-slate-50 flex gap-3">
                  <button
                    onClick={() => setShowMergeModal(false)}
                    className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeMerge}
                    disabled={mergeSelection.length < 2}
                    className="flex-[2] py-3 bg-slate-800 disabled:bg-slate-300 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 disabled:cursor-not-allowed"
                  >
                    <GitMerge size={18} /> Merge ({mergeSelection.length}{" "}
                    selected)
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
