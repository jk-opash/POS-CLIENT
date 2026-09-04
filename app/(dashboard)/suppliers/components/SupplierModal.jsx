import { useState, useEffect } from "react";
import { X, Save, Building2, User, Phone, Mail, FileText, Landmark, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SupplierModal({ visible, supplier, onClose, onSave }) {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    business_name: "",
    category: "",
    status: "Active",
    contact_person: "",
    contact_mobile: "",
    contact_email: "",
    contact_website: "",
    tax_gst: "",
    address_line1: "",
    address_city: "",
    address_state: "",
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || "",
        business_name: supplier.business_name || "",
        category: supplier.category || "",
        status: supplier.status || "Active",
        contact_person: supplier.contact?.person || "",
        contact_mobile: supplier.contact?.mobile || "",
        contact_email: supplier.contact?.email || "",
        contact_website: supplier.contact?.website || "",
        tax_gst: supplier.tax?.gst || "",
        address_line1: supplier.address?.line1 || "",
        address_city: supplier.address?.city || "",
        address_state: supplier.address?.state || "",
      });
    }
  }, [supplier]);


  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Supplier name is required";
    
    if (formData.contact_mobile && !/^\d{10}$/.test(formData.contact_mobile.replace(/\D/g, ''))) {
      newErrors.contact_mobile = "Must be a 10-digit number";
    }
    
    if (formData.contact_email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.contact_email)) {
      newErrors.contact_email = "Valid email is required";
    }
    
    if (formData.contact_website && !/^https?:\/\/.+/.test(formData.contact_website)) {
      newErrors.contact_website = "Must be a valid URL (http/https)";
    }
    
    if (formData.tax_gst && formData.tax_gst.length !== 15) {
      newErrors.tax_gst = "GST must be 15 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct the nested objects for the backend
    const payload = {
      name: formData.name,
      business_name: formData.business_name,
      category: formData.category,
      status: formData.status,
      contact: {
        person: formData.contact_person,
        mobile: formData.contact_mobile,
        email: formData.contact_email,
        website: formData.contact_website,
      },
      address: {
        line1: formData.address_line1,
        city: formData.address_city,
        state: formData.address_state,
      },
      tax: {
        gst: formData.tax_gst,
      },
    };

    onSave(payload);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center bg-brand-bg/50">
            <div>
              <h2 className="text-xl font-bold text-brand-dark">
                {supplier ? "Edit Supplier" : "Add Supplier"}
              </h2>
              <p className="text-sm text-brand-muted mt-1">
                {supplier ? "Update supplier details." : "Register a new vendor/supplier."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-brand-light rounded-full transition-colors text-brand-muted"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <form id="supplier-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-brand-dark flex items-center gap-2 border-b pb-2">
                  <Building2 size={16} className="text-brand-primary" />
                  Company Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value } )}
                      className="w-full px-3 py-2 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm transition-all"
                      placeholder="e.g. Fresh Farms Co."
                    />
          {errors.name && <span className="text-brand-danger text-xs mt-1 block">{errors.name}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Legal Business Name</label>
                    <input
                      type="text"
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm transition-all"
                      placeholder="e.g. Fresh Farms Pvt Ltd"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm transition-all"
                      placeholder="e.g. Dairy, Meat, Packaging"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm transition-all bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-brand-dark flex items-center gap-2 border-b pb-2">
                  <User size={16} className="text-brand-primary" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={formData.contact_person}
                      onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Mobile / Phone</label>
                    <input
                      type="text"
                      value={formData.contact_mobile}
                      onChange={(e) => setFormData({ ...formData, contact_mobile: e.target.value } )}
                      className="w-full px-3 py-2 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm transition-all"
                      placeholder="+91 9876543210"
                    />
          {errors.contact_mobile && <span className="text-brand-danger text-xs mt-1 block">{errors.contact_mobile}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value } )}
                      className="w-full px-3 py-2 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm transition-all"
                      placeholder="john@freshfarms.com"
                    />
          {errors.contact_email && <span className="text-brand-danger text-xs mt-1 block">{errors.contact_email}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Website</label>
                    <input
                      type="url"
                      value={formData.contact_website}
                      onChange={(e) => setFormData({ ...formData, contact_website: e.target.value } )}
                      className="w-full px-3 py-2 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm transition-all"
                      placeholder="https://freshfarms.com"
                    />
          {errors.contact_website && <span className="text-brand-danger text-xs mt-1 block">{errors.contact_website}</span>}
                  </div>
                </div>
              </div>

              {/* Tax & Address */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-brand-dark flex items-center gap-2 border-b pb-2">
                  <Landmark size={16} className="text-brand-primary" />
                  Tax & Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">GST Number</label>
                    <input
                      type="text"
                      value={formData.tax_gst}
                      onChange={(e) => setFormData({ ...formData, tax_gst: e.target.value } )}
                      className="w-full px-3 py-2 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm transition-all uppercase"
                      placeholder="22AAAAA0000A1Z5"
                    />
          {errors.tax_gst && <span className="text-brand-danger text-xs mt-1 block">{errors.tax_gst}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">City</label>
                    <input
                      type="text"
                      value={formData.address_city}
                      onChange={(e) => setFormData({ ...formData, address_city: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-border rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-sm transition-all"
                      placeholder="Mumbai"
                    />
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-brand-border bg-brand-bg flex justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-brand-dark bg-white border border-brand-border rounded-xl hover:bg-brand-light transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="supplier-form"
              className="px-5 py-2 text-sm font-medium text-white bg-brand-primary rounded-xl hover:bg-brand-primary/90 transition-colors shadow-sm flex items-center gap-2"
            >
              <Save size={16} />
              {supplier ? "Save Changes" : "Create Supplier"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
