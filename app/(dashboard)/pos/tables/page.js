"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchZones,
  fetchTablesByBranch,
  createZone,
  updateZone,
  deleteZone,
  createTable,
  updateTable,
  deleteTable,
} from "../../../store/slices/zoneSlice";
import { fetchBranches } from "../../../store/slices/branchSlice";

import { Plus, Building2 } from "lucide-react";
import ZoneModal from "../../../components/ZoneModal";
import TableModal from "../../../components/TableModal";
import DeleteConfirmModal from "../../inventory/components/DeleteConfirmModal";

import TablesTab from "./tabs/TablesTab";
import ZonesTab from "./tabs/ZonesTab";

export default function TablesPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const businessId = user?.businesses?.[0]?.id;

  const { zones, tables } = useSelector((state) => state.zone);
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

  // Fetch zones and tables when branch changes
  useEffect(() => {
    if (branchFilter) {
      dispatch(fetchZones(branchFilter));
      dispatch(fetchTablesByBranch(branchFilter));
    }
  }, [branchFilter, dispatch]);

  const [activeTab, setActiveTab] = useState("tables"); // 'tables', 'zones'

  // Modals
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editZone, setEditZone] = useState(null);

  const [showTableModal, setShowTableModal] = useState(false);
  const [editTable, setEditTable] = useState(null);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null); // 'zone' or 'table'

  // Handlers for Zone
  const handleSaveZone = (zone) => {
    if (editZone) {
      dispatch(updateZone({ id: editZone.id, data: zone })).then(() =>
        dispatch(fetchZones(branchFilter)),
      );
    } else {
      dispatch(createZone({ ...zone, branch_id: branchFilter })).then(() =>
        dispatch(fetchZones(branchFilter)),
      );
    }
    setShowZoneModal(false);
  };

  const openEditZone = (zone) => {
    setEditZone(zone);
    setShowZoneModal(true);
  };
  const openAddZone = () => {
    setEditZone(null);
    setShowZoneModal(true);
  };

  // Handlers for Table
  const handleSaveTable = (table) => {
    if (editTable) {
      dispatch(updateTable({ id: editTable.id, data: table })).then(() =>
        dispatch(fetchTablesByBranch(branchFilter)),
      );
    } else {
      dispatch(createTable({ ...table, branch_id: branchFilter })).then(() =>
        dispatch(fetchTablesByBranch(branchFilter)),
      );
    }
    setShowTableModal(false);
  };

  const openEditTable = (table) => {
    setEditTable(table);
    setShowTableModal(true);
  };
  const openAddTable = () => {
    setEditTable(null);
    setShowTableModal(true);
  };

  const handleDelete = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (deleteType === "zone") {
        dispatch(deleteZone(itemToDelete.id)).then(() =>
          dispatch(fetchZones(branchFilter)),
        );
      } else if (deleteType === "table") {
        dispatch(deleteTable(itemToDelete.id)).then(() =>
          dispatch(fetchTablesByBranch(branchFilter)),
        );
      }
      setItemToDelete(null);
      setDeleteType(null);
    }
  };

  const tabs = [
    { id: "tables", label: "Tables" },
    { id: "zones", label: "Zones" },
  ];

  return (
    <div className="flex flex-col bg-brand-bg font-sans h-full">
      <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-5">
          {/* Header & Global Actions */}
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-brand-dark">
                Tables & QR Management
              </h2>
              <p className="mt-1 text-sm text-brand-muted">
                Manage your restaurant zones, tables, and QR codes.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Branch Selector */}
              <div className="relative flex items-center gap-2 bg-white border border-brand-border rounded-xl px-3 py-2 shadow-sm">
                <Building2 size={14} className="text-brand-muted shrink-0" />
                <select
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="text-sm font-semibold text-brand-dark outline-none bg-transparent cursor-pointer pr-2"
                >
                  {branches?.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {activeTab === "tables" ? (
                <button
                  onClick={openAddTable}
                  disabled={!branchFilter}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-dark text-white hover:bg-brand-dark/90 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus size={16} /> Add Table
                </button>
              ) : (
                <button
                  onClick={openAddZone}
                  disabled={!branchFilter}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-dark text-white hover:bg-brand-dark/90 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus size={16} /> Add Zone
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-brand-border bg-white/50 flex flex-row gap-2 backdrop-blur-md rounded-t-2xl px-2">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-2 border-b-2 font-bold text-sm transition-all duration-300 ease-spring ${
                    activeTab === tab.id
                      ? "border-brand-primary text-brand-primary"
                      : "border-transparent text-brand-muted hover:text-brand-dark hover:border-brand-border"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "tables" && (
            <TablesTab
              tables={tables}
              zones={zones}
              openEditTable={openEditTable}
              deleteTable={(t) => handleDelete(t, "table")}
            />
          )}

          {activeTab === "zones" && (
            <ZonesTab
              zones={zones}
              openEditZone={openEditZone}
              deleteZone={(z) => handleDelete(z, "zone")}
            />
          )}
        </main>
      </div>

      {showZoneModal && (
        <ZoneModal
          zone={editZone}
          onSave={handleSaveZone}
          onClose={() => setShowZoneModal(false)}
        />
      )}

      {showTableModal && (
        <TableModal
          table={editTable}
          zones={zones}
          onSave={handleSaveTable}
          onClose={() => setShowTableModal(false)}
        />
      )}

      <DeleteConfirmModal
        item={itemToDelete}
        onConfirm={confirmDelete}
        onClose={() => {
          setItemToDelete(null);
          setDeleteType(null);
        }}
      />
    </div>
  );
}
