import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Button from "./ui/Button";

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
    onSave({
      ...formData,
      capacity: formData.capacity ? parseInt(formData.capacity, 10) : 4,
    });
  };

  const zoneOptions = zones.map(zone => ({
    value: zone.id,
    label: zone.name
  }));

  const statusOptions = [
    { value: "Available", label: "Available" },
    { value: "Occupied", label: "Occupied" },
    { value: "Reserved", label: "Reserved" },
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={table ? "Edit Table" : "Add New Table"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Table Name / Number"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Table 12, Window Seat"
        />

        <div className="space-y-1.5">
          <Select
            label="Zone"
            required
            value={formData.zone_id}
            onChange={(e) => setFormData({ ...formData, zone_id: e.target.value })}
            options={[{ value: "", label: "Select Zone", disabled: true }, ...zoneOptions]}
          />
          {zones.length === 0 && (
            <p className="text-xs text-brand-danger mt-1">Please create a zone first.</p>
          )}
        </div>

        <Input
          label="Capacity"
          type="number"
          min="1"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          placeholder="Number of seats"
        />

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          options={statusOptions}
        />

        <div className="flex flex-col md:flex-row gap-3 justify-end pt-4 mt-6 border-t border-brand-border">
          <Button type="button" variant="surface" onClick={onClose} className="w-full md:w-auto">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!formData.zone_id}
            className="w-full md:w-auto"
          >
            {table ? "Save Changes" : "Add Table"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
