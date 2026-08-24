import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ZoneModal({ zone, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name || "",
        description: zone.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [zone]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {zone ? "Edit Zone" : "Add New Zone"}
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
              Zone Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="e.g. Main Hall, Patio, 1st Floor"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              placeholder="Brief description of this area..."
            />
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
              className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm active:scale-95"
            >
              {zone ? "Save Changes" : "Add Zone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
