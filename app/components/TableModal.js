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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-brand-light">
          <h2 className="text-xl font-bold text-brand-dark">
            {table ? "Edit Table" : "Add New Table"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-brand-muted hover:text-brand-dark hover:bg-brand-light rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-brand-dark">
              Table Name / Number
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-brand-light border border-brand-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
              placeholder="e.g. Table 12, Window Seat"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-brand-dark">
              Zone
            </label>
            <select
              required
              value={formData.zone_id}
              onChange={(e) =>
                setFormData({ ...formData, zone_id: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-brand-light border border-brand-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all cursor-pointer"
            >
              <option value="" disabled>Select Zone</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
            {zones.length === 0 && (
              <p className="text-xs text-brand-danger mt-1">Please create a zone first.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-brand-dark">
              Capacity
            </label>
            <input
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-brand-light border border-brand-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
              placeholder="Number of seats"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-brand-dark">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-brand-light border border-brand-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all cursor-pointer"
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
              className="px-5 py-2.5 text-sm font-bold text-brand-dark hover:bg-brand-light rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.zone_id}
              className="px-5 py-2.5 text-sm font-bold text-white bg-brand-dark hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm active:scale-95"
            >
              {table ? "Save Changes" : "Add Table"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
