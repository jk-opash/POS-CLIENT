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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-brand-light">
          <h2 className="text-xl font-bold text-brand-dark">
            {zone ? "Edit Zone" : "Add New Zone"}
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
              Zone Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-brand-light border border-brand-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
              placeholder="e.g. Main Hall, Patio, 1st Floor"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-brand-dark">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 bg-brand-light border border-brand-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all resize-none"
              placeholder="Brief description of this area..."
            />
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
              className="px-5 py-2.5 text-sm font-bold text-white bg-brand-dark hover:bg-brand-dark rounded-xl transition-all shadow-sm active:scale-95"
            >
              {zone ? "Save Changes" : "Add Zone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
