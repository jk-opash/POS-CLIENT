"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

export default function EditBranchModal({ branch, onClose, onSave }) {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: branch?.name || "",
    code: branch?.code || "",
    branch_type: branch?.branch_type || "",
    contact: branch?.contact || "",
    email: branch?.email || "",
    address: branch?.address || "",
    city: branch?.city || "",
    state: branch?.state || "",
    status: branch?.status || "Operational",
    capacity: branch?.capacity || "",
    tables_count: branch?.tables_count || "",
    tax_jurisdiction: branch?.tax_jurisdiction || "",
    tax_registration: branch?.tax_registration || "",
    tax_percentage: branch?.tax_percentage || "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validateForm = () => {
    const newErrors = {};
    if (!form.name?.trim()) newErrors.name = "Branch Name is required";
    if (!form.code?.trim()) newErrors.code = "Branch Code is required";
    else if (form.code.length < 2)
      newErrors.code = "Must be at least 2 characters";

    if (!form.contact?.trim()) newErrors.contact = "Contact is required";
    else if (!/^\d{10}$/.test(form.contact.replace(/\D/g, "")))
      newErrors.contact = "Must be 10 digits";

    if (form.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.address?.trim()) newErrors.address = "Address is required";
    if (!form.city?.trim()) newErrors.city = "City is required";
    if (!form.state?.trim()) newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave(form);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Branch Profile" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Branch Name *"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            error={errors.name}
            required
          />
          <Input
            label="Branch Code *"
            value={form.code}
            onChange={(e) => set("code", e.target.value)}
            error={errors.code}
            required
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            options={[
              { value: "Operational", label: "Operational" },
              { value: "Closed", label: "Closed" },
              { value: "Maintenance", label: "Maintenance" },
            ]}
          />
          <Input
            label="Branch Type"
            value={form.branch_type}
            onChange={(e) => set("branch_type", e.target.value)}
            placeholder="Dine-in, Takeaway, etc."
          />
          <Input
            label="Contact Phone"
            value={form.contact}
            onChange={(e) => set("contact", e.target.value)}
            error={errors.contact}
          />
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            error={errors.email}
          />
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-brand-muted mb-1.5 block">
              Address
            </label>
            <textarea
              className="w-full rounded-xl border border-brand-border bg-surface-2 px-4 py-3 text-sm text-brand-dark font-medium placeholder:text-brand-placeholder transition-all duration-300 ease-in-out shadow-sm hover:bg-white hover:border-brand-borderHover focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:bg-white resize-none min-h-[80px]"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
            {errors.address && (
              <p className="text-xs font-medium text-brand-danger mt-1">{errors.address}</p>
            )}
          </div>
          <Input
            label="City"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            error={errors.city}
          />
          <Input
            label="State"
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            error={errors.state}
          />
          <Input
            label="Capacity (Persons)"
            type="number"
            value={form.capacity}
            onChange={(e) => set("capacity", parseInt(e.target.value) || "")}
          />
          <Input
            label="Tables Count"
            type="number"
            value={form.tables_count}
            onChange={(e) => set("tables_count", parseInt(e.target.value) || "")}
          />
          <Input
            label="Tax Jurisdiction"
            value={form.tax_jurisdiction}
            onChange={(e) => set("tax_jurisdiction", e.target.value)}
            placeholder="e.g. State / National"
          />
          <Input
            label="Tax Registration No."
            value={form.tax_registration}
            onChange={(e) => set("tax_registration", e.target.value)}
            placeholder="e.g. GSTIN/VAT"
          />
          <Input
            label="Tax Rate (%)"
            type="number"
            step="0.01"
            value={form.tax_percentage}
            onChange={(e) => set("tax_percentage", parseFloat(e.target.value) || "")}
            placeholder="e.g. 5.00"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-3 justify-end pt-6 border-t border-brand-border mt-2">
          <Button type="button" variant="surface" onClick={onClose} className="w-full md:w-auto">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="w-full md:w-auto">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
