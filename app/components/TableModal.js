import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function TableModal({ table, zones, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    zone_id: "",
    status: "Available",
  });

  useEffect(() => {
    if (table) {
      setFormData({
        name: table.name || "",
        capacity: table.capacity || "",
        zone_id: table.zone_id || "",
        status: table.status || "Available",
      });
    } else {
      setFormData({
        name: "",
        capacity: "",
        zone_id: zones?.length > 0 ? zones[0].id : "",
        status: "Available",
      });
    }
  }, [table, zones]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {table ? "Edit Table" : "Add New Table"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Table Name / Number
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="e.g. Table 12, Window Seat"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Zone
            </label>
            <select
              required
              value={formData.zone_id}
              onChange={(e) =>
                setFormData({ ...formData, zone_id: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="" disabled>Select Zone</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
            {zones.length === 0 && (
              <p className="text-xs text-rose-500 mt-1">Please create a zone first.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Capacity
            </label>
            <input
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Number of seats"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.zone_id}
              className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm active:scale-95"
            >
              {table ? "Save Changes" : "Add Table"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
