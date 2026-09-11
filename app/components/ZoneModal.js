import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Button from "./ui/Button";

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
    <Modal
      isOpen={true}
      onClose={onClose}
      title={zone ? "Edit Zone" : "Add New Zone"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Zone Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Main Hall, Patio, 1st Floor"
        />

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-muted mb-1.5 block">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-brand-border bg-surface-2 px-4 py-3 text-sm text-brand-dark font-medium placeholder:text-brand-placeholder transition-all duration-300 ease-in-out shadow-sm hover:bg-white hover:border-brand-borderHover focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:bg-white resize-none"
            placeholder="Brief description of this area..."
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 justify-end pt-4 mt-6 border-t border-brand-border">
          <Button type="button" variant="surface" onClick={onClose} className="w-full md:w-auto">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="w-full md:w-auto">
            {zone ? "Save Changes" : "Add Zone"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
