"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  fetchZones,
  createZone,
  updateZone,
  deleteZone,
  fetchTables,
  createTable,
  updateTable,
  deleteTable as deleteTableAPI,
  clearZoneState,
} from "../../../../store/slices/zoneSlice";
import { fetchBranches } from "../../../../store/slices/branchSlice";
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
  CalendarDays,
  GitMerge,
  RotateCw,
  MapPin,
  AlertCircle,
  Eye,
  LayoutGrid,
} from "lucide-react";
import LottieLoader from "../../../../components/common/LottieLoader";
import { motion, AnimatePresence } from "framer-motion";

const CAPACITY_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const cap = (i + 1) * 2;
  return { value: cap, label: `${cap} Seats` };
});

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
  const isAvailable =
    (!table.status || table.status === "Available") && !hasOrder;

  const isCircle = table.shape === "circle" || table.shape === "round";
  const isSquare = table.shape === "square";
  const isOval = table.shape === "oval";

  let containerWidth = 80;
  let bodyHeight = 60;
  let borderRadius = 12;

  // Derive span dynamically from capacity if not explicitly provided
  const span =
    table.span || (table.capacity >= 12 ? 3 : table.capacity >= 6 ? 2 : 1);
  // Use the table's span to scale up the UI dynamically
  const spanScale = Math.max(0, span - 1);

  if (isSquare || isCircle) {
    // Square/circle grows symmetrically
    containerWidth = 80 + spanScale * 40;
    bodyHeight = containerWidth;
  } else {
    // Rectangle/oval grows mainly in width
    containerWidth = 80 + spanScale * 100;
    bodyHeight = 60;
  }

  if (isCircle || isOval) {
    borderRadius = 1000;
  }

  // Determine text and background colors based on status
  let textColor = "#1e293b"; // textPrimary
  let bgColor = "#ffffff";
  let borderColor = "#e2e8f0"; // border
  let chairColor = "#ffffff";
  let chairBorderColor = "#e2e8f0";

  if (isOccupied) {
    textColor = "#3b82f6";
    bgColor = "#eff6ff";
    borderColor = "#3b82f6";
    chairColor = "#3b82f6";
    chairBorderColor = "#3b82f6";
  } else if (isReserved) {
    textColor = "#ef4444";
    bgColor = "#fef2f2";
    borderColor = "#ef4444";
    chairColor = "#ef4444";
    chairBorderColor = "#ef4444";
  }

  const chairsPerRow = Math.ceil(table.capacity / 2);
  const chairArray = Array.from({ length: chairsPerRow });

  const renderChairs = () => (
    <div className="flex gap-3 my-1">
      {chairArray.map((_, i) => (
        <div
          key={i}
          style={{
            width: 24,
            height: 8,
            backgroundColor: chairColor,
            borderColor: chairBorderColor,
            borderWidth: 1,
            borderRadius: 4,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        />
      ))}
    </div>
  );

  const renderRadialChairs = () => {
    const chairCount = table.capacity;
    const tableRadius = containerWidth / 2;
    const radius = tableRadius + 14;

    return (
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
        {Array.from({ length: chairCount }).map((_, i) => {
          const angle = (i * 2 * Math.PI) / chairCount - Math.PI / 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const rotation = (angle * 180) / Math.PI + 90;

          return (
            <div
              key={i}
              className="absolute"
              style={{
                width: 24,
                height: 8,
                backgroundColor: chairColor,
                borderColor: chairBorderColor,
                borderWidth: 1,
                borderRadius: 4,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
              }}
            />
          );
        })}
      </div>
    );
  };

  const renderSquareChairs = () => {
    const count = table.capacity;
    const topCount = Math.ceil(count / 4);
    const rightCount = Math.ceil((count - topCount) / 3);
    const bottomCount = Math.ceil((count - topCount - rightCount) / 2);
    const leftCount = count - topCount - rightCount - bottomCount;

    const halfWidth = containerWidth / 2;
    const offset = halfWidth + 14;

    const renderSide = (sideCount, side) => {
      if (sideCount === 0) return null;

      return Array.from({ length: sideCount }).map((_, i) => {
        const fraction = sideCount === 1 ? 0.5 : i / (sideCount - 1);
        const sideLength = Math.max(0, containerWidth - 36);
        const pos = (fraction - 0.5) * sideLength;

        let x = 0,
          y = 0,
          rotation = 0;

        switch (side) {
          case "top":
            x = pos;
            y = -offset;
            rotation = 0;
            break;
          case "right":
            x = offset;
            y = pos;
            rotation = 90;
            break;
          case "bottom":
            x = -pos;
            y = offset;
            rotation = 180;
            break;
          case "left":
            x = -offset;
            y = -pos;
            rotation = 270;
            break;
        }

        return (
          <div
            key={`${side}-${i}`}
            className="absolute"
            style={{
              width: 24,
              height: 8,
              backgroundColor: chairColor,
              borderColor: chairBorderColor,
              borderWidth: 1,
              borderRadius: 4,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
            }}
          />
        );
      });
    };

    return (
      <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
        {renderSide(topCount, "top")}
        {renderSide(rightCount, "right")}
        {renderSide(bottomCount, "bottom")}
        {renderSide(leftCount, "left")}
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      onMouseDown={onMouseDown}
      className={`absolute flex flex-col items-center justify-center transition-transform select-none ${isEditMode && !isMergeMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
      style={{
        left: table.position_x || 0,
        top: table.position_y || 0,
        transform: `rotate(${table.rotation || 0}deg)`,
        zIndex: isEditMode ? 10 : 1,
        width: containerWidth,
        height: isCircle || isSquare ? containerWidth : undefined,
      }}
    >
      {/* Top Chairs (Rect/Oval only) */}
      {!(isCircle || isSquare) && renderChairs()}

      {/* Table Body */}
      <div
        className={`flex items-center justify-center shadow-md border-[1.5px] ${isMergeSelected ? "ring-4 ring-brand-primary ring-offset-2 ring-offset-brand-bg" : ""} ${isEditMode && !isMergeMode ? "ring-2 ring-brand-success ring-offset-2 ring-offset-brand-bg" : ""}`}
        style={{
          width: "100%",
          height: bodyHeight,
          background: bgColor,
          borderColor: borderColor,
          borderRadius: borderRadius,
          flexDirection: isOccupied ? "row" : "column",
          gap: isOccupied ? 6 : 0,
        }}
      >
        <span className="font-bold text-[16px]" style={{ color: textColor }}>
          {table.name}
        </span>
        {isOccupied && <Eye size={18} color={textColor} />}
      </div>

      {/* Bottom Chairs (Rect/Oval only) */}
      {!(isCircle || isSquare) && renderChairs()}

      {/* Radial Chairs (Circle only) */}
      {isCircle && renderRadialChairs()}

      {/* Square Chairs (Square only) */}
      {isSquare && renderSquareChairs()}

      {isMergeSelected && (
        <div className="absolute -top-1 -right-1 bg-brand-primary rounded-full w-5 h-5 flex items-center justify-center shadow-lg z-20">
          <Check size={10} color="white" />
        </div>
      )}

      {isEditMode && !isMergeMode && (
        <>
          <div
            className="absolute -top-3 -right-3 bg-brand-success rounded-full w-7 h-7 flex items-center justify-center shadow-md cursor-pointer hover:bg-brand-success z-20"
            onClick={(e) => {
              e.stopPropagation();
              onClick("rotate");
            }}
          >
            <RotateCw size={13} color="white" />
          </div>
          <div
            className="absolute -top-3 -left-3 bg-brand-primary rounded-full w-7 h-7 flex items-center justify-center shadow-md cursor-pointer hover:bg-brand-primary z-20"
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

export default function ZonesPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { id: branchId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { zones, tables, loading } = useSelector((state) => state.zone);
  const { branches } = useSelector((state) => state.branch);

  const [activeZone, setActiveZone] = useState(null);
  const [showAddZone, setShowAddZone] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [editZoneName, setEditZoneName] = useState("");

  const currentBranch = branches.find((b) => b.id === branchId);

  useEffect(() => {
    return () => {
      dispatch(clearZoneState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!branches.length) dispatch(fetchBranches());
  }, [dispatch, branches.length]);

  useEffect(() => {
    if (branchId) dispatch(fetchZones(branchId));
  }, [dispatch, branchId]);

  useEffect(() => {
    // Automatically select the first zone if none is selected
    if (zones.length > 0 && !activeZone) setActiveZone(zones[0]);
  }, [zones, activeZone]);

  useEffect(() => {
    // Fetch tables for the selected zone
    if (activeZone) dispatch(fetchTables(activeZone.id));
  }, [dispatch, activeZone]);

  const handleAddZone = async () => {
    if (!newZoneName.trim()) return;
    await dispatch(createZone({ name: newZoneName, branch_id: branchId }));
    setNewZoneName("");
    setShowAddZone(false);
    dispatch(fetchZones(branchId));
  };

  const handleUpdateZone = async (id) => {
    if (!editZoneName.trim()) return;
    await dispatch(updateZone({ id, data: { name: editZoneName } }));
    setEditingZoneId(null);
    setEditZoneName("");
  };

  const handleDeleteZone = async (id) => {
    if (
      confirm(
        "Are you sure you want to delete this zone? All tables inside will be lost.",
      )
    ) {
      await dispatch(deleteZone(id));
      if (activeZone?.id === id) setActiveZone(zones[0] || null);
    }
  };

  const availableCount = tables.filter((t) => t.status === "Available").length;
  const occupiedCount = tables.filter((t) => t.status === "Occupied").length;
  const reservedCount = tables.filter((t) => t.status === "Reserved").length;

  const [isEditMode, setIsEditMode] = useState(false);
  const [zoom, setZoom] = useState(1);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [isMergeMode, setIsMergeMode] = useState(false);
  const [activeTable, setActiveTable] = useState(null);
  const [mergeSelection, setMergeSelection] = useState([]);
  const [detailsModalMode, setDetailsModalMode] = useState("add");

  const [tableErrors, setTableErrors] = useState({});
  const [editName, setEditName] = useState("");
  const [editCapacity, setEditCapacity] = useState(4);
  const [editShape, setEditShape] = useState("square");

  // Drag Logic
  const dragTable = useRef(null);
  const dragStart = useRef({ mx: 0, my: 0, tx: 0, ty: 0 });

  const [localTables, setLocalTables] = useState([]);
  useEffect(() => {
    setLocalTables(tables);
  }, [tables]);

  const onTableMouseDown = (e, table) => {
    if (!isEditMode || isMergeMode) return;
    dragTable.current = table.id;
    dragStart.current = {
      mx: e.clientX,
      my: e.clientY,
      tx: table.position_x || 0,
      ty: table.position_y || 0,
    };
    e.stopPropagation();
  };

  const onMouseMove = (e) => {
    if (dragTable.current) {
      const dx = (e.clientX - dragStart.current.mx) / zoom;
      const dy = (e.clientY - dragStart.current.my) / zoom;
      let snappedX = Math.round((dragStart.current.tx + dx) / 25) * 25;
      let snappedY = Math.round((dragStart.current.ty + dy) / 25) * 25;

      // Restrict dragging within 1000x1000 area
      snappedX = Math.max(0, Math.min(snappedX, 1000));
      snappedY = Math.max(0, Math.min(snappedY, 1000));

      setLocalTables((prev) =>
        prev.map((t) =>
          t.id === dragTable.current
            ? { ...t, position_x: snappedX, position_y: snappedY }
            : t,
        ),
      );
    }
  };

  const onMouseUp = async () => {
    if (dragTable.current) {
      const tb = localTables.find((t) => t.id === dragTable.current);
      if (tb) {
        await dispatch(
          updateTable({
            id: tb.id,
            data: { position_x: tb.position_x, position_y: tb.position_y },
          }),
        );
      }
    }
    dragTable.current = null;
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.3));
  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleTableClick = async (table, action) => {
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
        const newRotation = ((table.rotation || 0) + 90) % 360;
        setLocalTables((prev) =>
          prev.map((t) =>
            t.id === table.id ? { ...t, rotation: newRotation } : t,
          ),
        );
        await dispatch(
          updateTable({ id: table.id, data: { rotation: newRotation } }),
        );
      } else if (action === "edit" || !action) {
        setEditName(table.name);
        setEditCapacity(table.capacity);
        setEditShape(table.shape || "square");
        setTableErrors({});
        setDetailsModalMode("edit");
        setActiveTable(table);
        setShowDetailsModal(true);
      }
    } else {
      setActiveTable(table);
      setShowActionModal(true);
    }
  };

  const openAddModal = () => {
    setTableErrors({});
    setEditName(`T${tables.length + 1}`);
    setEditCapacity(4);
    setEditShape("square");
    setDetailsModalMode("add");
    setActiveTable(null);
    setShowDetailsModal(true);
  };

  const saveTableDetails = async () => {
    const errors = {};
    if (!editName.trim()) errors.name = "Table name is required";
    if (!editCapacity || editCapacity < 1)
      errors.capacity = "Capacity must be at least 1";

    if (Object.keys(errors).length > 0) {
      setTableErrors(errors);
      return;
    }

    if (detailsModalMode === "add") {
      await dispatch(
        createTable({
          name: editName,
          capacity: editCapacity,
          shape: editShape,
          zone_id: activeZone.id,
          branch_id: branchId,
          position_x: 300,
          position_y: 300,
          rotation: 0,
          status: "Available",
        }),
      );
    } else {
      await dispatch(
        updateTable({
          id: activeTable.id,
          data: { name: editName, capacity: editCapacity, shape: editShape },
        }),
      );
    }
    setShowDetailsModal(false);
  };

  const deleteTable = async () => {
    await dispatch(deleteTableAPI(activeTable.id));
    setShowDetailsModal(false);
  };

  const updateStatus = async (id, status) => {
    await dispatch(updateTable({ id, data: { status } }));
    setShowActionModal(false);
  };

  const unmergeTable = async (id) => {
    const tbl = tables.find((t) => t.id === id);
    if (!tbl?.merged_tables?.length) return;

    // Recreate originals
    for (const ot of tbl.merged_tables) {
      await dispatch(
        createTable({
          name: ot.name,
          capacity: ot.capacity,
          shape: ot.shape || "rectangle",
          position_x: ot.position_x || ot.x || 0,
          position_y: ot.position_y || ot.y || 0,
          status: "Available",
          rotation: ot.rotation || 0,
          is_active: ot.is_active !== undefined ? ot.is_active : true,
          zone_id: activeZone.id,
          branch_id: branchId,
        }),
      );
    }
    // Delete merged
    await dispatch(deleteTableAPI(id));
    setShowActionModal(false);
  };

  const executeMerge = async () => {
    if (mergeSelection.length < 2) return;
    const selected = tables.filter((t) => mergeSelection.includes(t.id));

    await dispatch(
      createTable({
        name: selected.map((t) => t.name).join("+"),
        zone_id: activeZone.id,
        branch_id: branchId,
        position_x: Math.min(...selected.map((t) => t.position_x)),
        position_y: Math.min(...selected.map((t) => t.position_y)),
        capacity: selected.reduce((s, t) => s + t.capacity, 0),
        status: "Available",
        shape: "rectangle",
        rotation: 0,
        merged_tables: selected,
      }),
    );

    for (const t of selected) {
      await dispatch(deleteTableAPI(t.id));
    }

    setMergeSelection([]);
    setIsMergeMode(false);
  };

  return (
    <div
      className="flex h-[calc(100vh-73px)] bg-brand-bg/50 font-sans overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* ─ Left Sidebar (Zones List) ───────────────────────────────────────── */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-4 p-4 border-r border-brand-border bg-white shadow-sm z-20 relative">
        <button
          onClick={() => router.push(`/outlet/${id}`)}
          className="flex items-center gap-2 mb-2 group w-fit"
        >
          <ArrowLeft className="h-5 w-5 text-brand-muted" />
          <h2 className="text-lg font-bold text-brand-dark">Back</h2>
        </button>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">
            Dining Zones
          </h2>
          <button
            className="p-1 hover:bg-brand-light rounded text-brand-muted"
            onClick={() => setShowAddZone(true)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {showAddZone && (
          <div className="p-3 border border-brand-border rounded-lg shadow-sm">
            <input
              autoFocus
              type="text"
              placeholder="Zone name (e.g. Patio)"
              className="w-full text-sm border border-brand-border rounded-md p-2 mb-2"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddZone()}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-2 py-1 text-xs text-brand-muted font-medium"
                onClick={() => setShowAddZone(false)}
              >
                Cancel
              </button>
              <button
                className="px-2 py-1 text-xs bg-brand-primary text-white font-medium rounded"
                onClick={handleAddZone}
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2 overflow-y-auto pb-4">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`w-full flex flex-col px-3 py-2 rounded-lg border transition-all ${activeZone?.id === zone.id ? "bg-brand-primary/10 border-brand-primary/20 text-brand-primary shadow-sm font-bold" : "bg-white border-brand-border text-brand-dark hover:border-brand-border/80 hover:bg-brand-light font-medium"}`}
            >
              {editingZoneId === zone.id ? (
                <div className="flex flex-col gap-2">
                  <input
                    autoFocus
                    type="text"
                    className="w-full text-sm border border-brand-border rounded-md p-1.5"
                    value={editZoneName}
                    onChange={(e) => setEditZoneName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleUpdateZone(zone.id)
                    }
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-2 py-1 text-xs text-brand-muted hover:bg-brand-light rounded"
                      onClick={() => setEditingZoneId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-2 py-1 text-xs bg-brand-primary text-white font-medium rounded"
                      onClick={() => handleUpdateZone(zone.id)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() => setActiveZone(zone)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">{zone.name}</span>
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingZoneId(zone.id);
                        setEditZoneName(zone.name);
                      }}
                      className="p-1.5 text-brand-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteZone(zone.id);
                      }}
                      className="p-1.5 text-brand-muted hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {zones.length === 0 && !loading && !showAddZone && (
            <div className="text-center p-4 text-sm text-brand-muted border border-dashed border-brand-border rounded-lg">
              No zones yet.
            </div>
          )}
          {loading && (
            <div className="flex justify-center min-h-[200px]">
              <LottieLoader text="Loading zones..." />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header inside Canvas */}
        <div className="absolute top-0 left-0 right-0 z-20 flex flex-col pointer-events-none">
          <div className="p-4 flex justify-between items-center pointer-events-auto">
            <div className="flex items-center gap-3"></div>
            {!isEditMode && !isMergeMode && activeZone && (
              <button
                onClick={() => setIsMergeMode(true)}
                className="bg-brand-success border border-brand-success text-white font-bold text-sm px-4 py-2 rounded-full shadow hover:bg-brand-success flex items-center gap-2 pointer-events-auto"
              >
                <GitMerge size={16} /> Merge Tables
              </button>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-[#f8fafc] relative">
          {activeZone ? (
            <div
              style={{
                width: 1000 * zoom,
                height: 1000 * zoom,
                backgroundImage:
                  "radial-gradient(#cbd5e1 1px, transparent 1px)",
                backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
                position: "relative",
              }}
            >
              <div
                className="absolute top-0 left-0"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "0 0",
                  width: 1000,
                  height: 1000,
                }}
              >
                {/* Floor boundary to show 1000x1000 area limit */}
                <div
                  className="absolute border-2 border-dashed border-brand-border bg-white/40 pointer-events-none"
                  style={{ width: 1000, height: 1000, top: 0, left: 0 }}
                />
                {localTables.map((table) => (
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
          ) : (
            <div className="flex h-full items-center justify-center">
              <AlertCircle className="h-12 w-12 text-brand-muted/30 mr-3" />
              <h2 className="text-xl font-bold text-brand-muted">
                Please select or create a zone
              </h2>
            </div>
          )}
        </div>

        {/* Legend */}
        {activeZone && (
          <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur border border-brand-border p-4 rounded-2xl shadow-2xl z-10 flex flex-col gap-2.5 min-w-[180px]">
            <h3 className="text-brand-muted text-[10px] font-black uppercase tracking-widest border-b border-brand-border pb-2 mb-1">
              Table Status
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white border border-brand-muted"></div>
                <span className="text-brand-dark text-xs font-semibold">
                  Available
                </span>
              </div>
              <span className="text-brand-dark font-black text-sm">
                {availableCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                <span className="text-brand-dark text-xs font-semibold">
                  Occupied
                </span>
              </div>
              <span className="text-brand-dark font-black text-sm">
                {occupiedCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.5)]"></div>
                <span className="text-brand-dark text-xs font-semibold">
                  Reserved
                </span>
              </div>
              <span className="text-brand-dark font-black text-sm">
                {reservedCount}
              </span>
            </div>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-8 left-64 ml-4 flex items-center bg-white/90 backdrop-blur border border-brand-border rounded-full p-1 gap-1 shadow-2xl z-10">
          <button
            onClick={() => handleZoom(-0.1)}
            className="w-9 h-9 flex items-center justify-center text-brand-dark hover:text-brand-dark hover:bg-brand-light rounded-full transition-colors"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-3 h-9 flex items-center justify-center text-brand-dark hover:text-brand-dark hover:bg-brand-light rounded-full transition-colors text-xs font-bold"
          >
            Reset
          </button>
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 flex items-center justify-center text-brand-dark hover:text-brand-dark hover:bg-brand-light rounded-full transition-colors"
          >
            <ZoomIn size={18} />
          </button>
        </div>

        {/* FABs */}
        {activeZone && (
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
                  className="flex items-center gap-2 px-5 py-3.5 bg-white border border-brand-border rounded-full text-brand-dark font-bold text-sm shadow-xl hover:bg-brand-bg"
                >
                  <X size={16} /> Cancel
                </motion.button>
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={executeMerge}
                  disabled={mergeSelection.length < 2}
                  className="flex items-center gap-2 px-5 py-3.5 bg-brand-success border border-brand-success rounded-full text-white font-bold text-sm shadow-xl hover:bg-brand-success disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="flex items-center gap-2 px-5 py-3.5 bg-brand-purple border border-brand-purple rounded-full text-white font-bold text-sm shadow-xl hover:bg-brand-purple"
                >
                  <GitMerge size={16} /> Merge
                </motion.button>
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={openAddModal}
                  className="flex items-center gap-2 px-5 py-3.5 bg-white border border-brand-border rounded-full text-brand-dark font-bold text-sm shadow-xl hover:bg-brand-bg"
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
                className={`flex items-center gap-2 px-5 py-3.5 rounded-full text-white font-bold text-sm shadow-xl transition-colors ${isEditMode ? "bg-brand-success border border-brand-success hover:bg-brand-success" : "bg-brand-primary border border-brand-primary hover:bg-brand-primary"}`}
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
        )}

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
                  <h2 className="text-xl font-black text-brand-dark">
                    {detailsModalMode === "edit"
                      ? "Edit Table"
                      : "Add New Table"}
                  </h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-brand-muted hover:bg-brand-light p-2 rounded-xl"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 flex flex-col gap-5">
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Table Name / Label
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. A12"
                      className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary bg-brand-bg"
                    />
                    {tableErrors.name && (
                      <span className="text-brand-danger text-xs mt-1 block">
                        {tableErrors.name}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">
                      Capacity
                    </label>
                    <select
                      value={editCapacity}
                      onChange={(e) => setEditCapacity(Number(e.target.value))}
                      className="w-full border border-brand-border rounded-xl px-4 py-3 text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
                    >
                      {CAPACITY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-3 block">
                      Shape
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["rectangle", "square", "circle", "oval"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setEditShape(s)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm capitalize transition-all ${editShape === s ? "bg-brand-success border-brand-success text-white" : "bg-brand-bg border-brand-border text-brand-dark hover:border-brand-success"}`}
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
                <div className="p-4 bg-brand-bg border-t flex justify-between items-center">
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
                      className="px-4 py-2 text-brand-dark font-bold hover:bg-brand-border rounded-xl text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveTableDetails}
                      className="px-6 py-2 bg-brand-success hover:bg-brand-success text-white font-bold rounded-xl text-sm shadow-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ─ Table Action Modal (Simplified without orders) ───────────────── */}
          {showActionModal &&
            activeTable &&
            (() => {
              const t = activeTable;
              const isAvail = t.status === "Available";
              const isOcc = t.status === "Occupied";
              const isRes = t.status === "Reserved";

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
                    <div className="p-5 border-b flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-2xl font-black text-brand-dark">
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
                        <p className="text-sm text-brand-muted font-semibold">
                          Capacity: {t.capacity} Persons
                        </p>
                      </div>
                      <button
                        onClick={() => setShowActionModal(false)}
                        className="text-brand-muted hover:bg-brand-light p-1.5 rounded-xl"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="p-5">
                      <div className="flex flex-col gap-3">
                        {isAvail && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => updateStatus(t.id, "Occupied")}
                              className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-primaryLight border border-brand-primaryLight text-brand-primary font-bold rounded-xl text-sm"
                            >
                              <CalendarDays size={16} /> Mark Occupied
                            </button>
                          </div>
                        )}
                        {isRes && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => updateStatus(t.id, "Occupied")}
                              className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-success hover:bg-brand-success text-white font-bold rounded-xl shadow-sm text-sm"
                            >
                              Arrived (Occupy)
                            </button>
                            <button
                              onClick={() => updateStatus(t.id, "Available")}
                              className="flex-1 flex items-center justify-center gap-2 py-3 border border-brand-border text-brand-dark font-bold rounded-xl text-sm hover:bg-brand-bg"
                            >
                              Cancel Reservation
                            </button>
                          </div>
                        )}
                        {isOcc && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => updateStatus(t.id, "Available")}
                              className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-success hover:bg-brand-success text-white font-bold rounded-xl shadow-sm text-sm"
                            >
                              Checkout Table
                            </button>
                          </div>
                        )}

                        {(isAvail || isOcc) && (
                          <button
                            onClick={() => updateStatus(t.id, "Reserved")}
                            className="w-full py-2.5 mt-2 text-sm font-bold text-brand-muted hover:text-brand-dark hover:bg-brand-light rounded-xl transition-colors"
                          >
                            Mark as Reserved
                          </button>
                        )}
                        {t.merged_tables && t.merged_tables.length > 0 && (
                          <button
                            onClick={() => unmergeTable(t.id)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 border border-orange-200 text-orange-600 font-bold rounded-xl text-sm hover:bg-orange-50"
                          >
                            Unmerge Table
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
        </AnimatePresence>
      </div>
    </div>
  );
}
