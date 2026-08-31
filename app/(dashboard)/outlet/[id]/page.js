"use client";

import { useState, useCallback, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBranchById,
  updateBranch,
  deleteBranch,
} from "../../../store/slices/branchSlice";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import LottieLoader from "../../../components/common/LottieLoader";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/Table";
import { cn } from "../../../lib/utils";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  Store,
  Settings,
  Clock,
  Users,
  CheckCircle2,
  Edit,
  AlertCircle,
  FileText,
  CalendarDays,
  Globe,
  Landmark,
  FileCheck,
  Maximize,
  Plus,
} from "lucide-react";

// Edit Modal Component
function EditBranchModal({ branch, onClose, onSave }) {
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
    <Modal isOpen={true} onClose={onClose} title="Edit Branch Profile">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Branch Name *
            </label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.name}
              </span>
            )}
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Branch Code *
            </label>
            <input
              className="input"
              value={form.code}
              required
              onChange={(e) => set("code", e.target.value)}
            />
            {errors.code && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.code}
              </span>
            )}
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Status</label>
            <select
              className="input select"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="Operational">Operational</option>
              <option value="Closed">Closed</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Branch Type
            </label>
            <input
              className="input"
              value={form.branch_type}
              onChange={(e) => set("branch_type", e.target.value)}
              placeholder="Dine-in, Takeaway, etc."
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Contact Phone
            </label>
            <input
              className="input"
              value={form.contact}
              onChange={(e) => set("contact", e.target.value)}
            />
            {errors.contact && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.contact}
              </span>
            )}
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Email Address
            </label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.email}
              </span>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-slate-500 block mb-1">Address</label>
            <textarea
              className="input min-h-[80px]"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">City</label>
            <input
              className="input"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
            />
            {errors.city && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.city}
              </span>
            )}
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">State</label>
            <input
              className="input"
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
            />
            {errors.state && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.state}
              </span>
            )}
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Capacity (Persons)
            </label>
            <input
              className="input"
              type="number"
              value={form.capacity}
              onChange={(e) => set("capacity", parseInt(e.target.value) || "")}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Tables Count
            </label>
            <input
              className="input"
              type="number"
              value={form.tables_count}
              onChange={(e) =>
                set("tables_count", parseInt(e.target.value) || "")
              }
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Tax Jurisdiction
            </label>
            <input
              className="input"
              value={form.tax_jurisdiction}
              onChange={(e) => set("tax_jurisdiction", e.target.value)}
              placeholder="e.g. State / National"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Tax Registration No.
            </label>
            <input
              className="input"
              value={form.tax_registration}
              onChange={(e) => set("tax_registration", e.target.value)}
              placeholder="e.g. GSTIN/VAT"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Tax Rate (%)
            </label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={form.tax_percentage}
              onChange={(e) =>
                set("tax_percentage", parseFloat(e.target.value) || "")
              }
              placeholder="e.g. 5.00"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-slate-100">
          <Button type="button" variant="surface" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Info Item Component
function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 items-start p-4 rounded-lg bg-slate-50/50 border border-slate-100">
      <div className="p-2 bg-white rounded border border-slate-200 text-slate-400 mt-0.5">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-slate-800">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}

export default function BranchDetailsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = params;

  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);

  const { currentBranch, loading, error } = useSelector(
    (state) => state.branch,
  );

  const handleToggle = useCallback(() => setCollapsed((c) => !c), []);

  useEffect(() => {
    if (id) {
      dispatch(fetchBranchById(id));
    }
  }, [id, dispatch]);

  const handleSaveBranch = async (data) => {
    try {
      await dispatch(updateBranch({ id, data })).unwrap();
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update branch", err);
    }
  };

  const handleDeleteBranch = async () => {
    if (
      confirm(
        "Are you sure you want to delete this branch? This action cannot be undone.",
      )
    ) {
      try {
        await dispatch(deleteBranch(id)).unwrap();
        router.push("/outlet");
      } catch (err) {
        console.error("Failed to delete branch", err);
      }
    }
  };

  if (loading && !currentBranch) {
    return <LottieLoader fullScreen text="Loading branch details..." />;
  }

  if (error && !currentBranch) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Branch Not Found</h2>
          <p className="text-slate-500 text-sm max-w-sm">{error}</p>
          <Button variant="primary" onClick={() => router.push("/outlet")}>
            Back to Branches
          </Button>
        </div>
      </div>
    );
  }

  const b = currentBranch;
  if (!b) return null;

  return (
    <div className="flex flex-col bg-slate-50 font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-6 py-6">
          <div className="space-y-6 pb-12">
            {/* Back Button */}

            <div>
              <button
                onClick={() => router.push("/outlet")}
                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Branches
              </button>
            </div>

            {/* Header section matching Pos-admin businesses profile */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {b.name}
                  </h1>
                  <Badge
                    variant={
                      b.status === "Operational" || b.status === "active"
                        ? "success"
                        : "warning"
                    }
                    dot
                  >
                    {b.status || "Operational"}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 capitalize">
                  <Building2 className="h-4 w-4" /> {b.branch_type || "Branch"}
                  <span className="text-slate-300">|</span>
                  Joined{" "}
                  {b.created_at
                    ? new Date(b.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
                {b.status === "Closed" || b.status === "Maintenance" ? (
                  <Button variant="primary">Restore Access</Button>
                ) : (
                  <Button
                    variant="danger"
                    onClick={handleDeleteBranch}
                    className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
                  >
                    Delete Branch
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" /> Edit
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <nav
                className="-mb-px flex space-x-6 overflow-x-auto"
                aria-label="Tabs"
              >
                {[
                  { id: "overview", label: "Overview" },
                  { id: "staff", label: "Staff & Permissions" },
                  { id: "settings", label: "Settings" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                      activeTab === tab.id
                        ? "border-slate-900 text-slate-900"
                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring">
                  <div className="md:col-span-1 space-y-6">
                    <Card>
                      <h3 className="text-sm font-bold text-slate-900 mb-4">
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <span className="font-bold">
                              {b.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {b.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              Primary Outlet
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <Mail className="h-4 w-4 text-slate-300" />
                          {b.email || "Not Provided"}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <Phone className="h-4 w-4 text-slate-300" />
                          {b.contact || "Not Provided"}
                        </div>
                      </div>
                    </Card>

                    <Card>
                      <h3 className="text-sm font-bold text-slate-900 mb-4">
                        Location Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 text-sm text-slate-500">
                          <MapPin className="h-4 w-4 text-slate-300 mt-0.5 shrink-0" />
                          <span>
                            {b.address || "No Address"}
                            <br />
                            {b.city}, {b.state}
                            <br />
                            {b.country}
                          </span>
                        </div>
                        <div className="pt-3 mt-3 border-t border-slate-200 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">
                              Tax Jurisdiction
                            </span>
                            <span className="font-medium text-slate-900">
                              {b.tax_jurisdiction || "Not Provided"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">
                              Tax Registration
                            </span>
                            <span className="font-medium text-slate-900">
                              {b.tax_registration || "Not Provided"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card>
                      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-slate-300" />{" "}
                        Operational Info
                      </h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                          <span className="text-slate-500">Store Size</span>
                          <span className="font-medium">
                            {b.store_size || "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                          <span className="text-slate-500">Capacity</span>
                          <span className="font-medium">
                            {b.capacity ? `${b.capacity} Persons` : "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                          <span className="text-slate-500">Tables Count</span>
                          <span className="font-medium">
                            {b.tables_count || "N/A"}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <Card className="h-full">
                      <h3 className="text-sm font-bold text-slate-900 mb-4">
                        Activity Overview
                      </h3>
                      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50">
                        <p className="text-sm text-slate-400">
                          Activity charts will be implemented here
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "staff" && (
                <Card padding="none">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-indigo-600" />
                      <h3 className="text-lg font-bold text-slate-900">
                        Staff & Permissions
                      </h3>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => router.push("/staff")}
                    >
                      Manage Staff
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const staffList = b.team_members || b.teamMembers || [];
                        return staffList.length > 0 ? (
                          staffList.map((staff, i) => (
                            <TableRow
                              key={staff.id || i}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <TableCell className="font-medium text-slate-800">
                                {staff.name ||
                                  (staff.first_name
                                    ? `${staff.first_name} ${staff.last_name || ""}`
                                    : "Unnamed Staff")}
                              </TableCell>
                              <TableCell>
                                <div className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                  {staff.role?.name || staff.role || "Staff"}
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-500">
                                {staff.email || "N/A"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    staff.status === "active" ||
                                    staff.status === "Operational"
                                      ? "success"
                                      : "secondary"
                                  }
                                >
                                  {staff.status || "Active"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center text-slate-500">
                                <Users className="h-8 w-8 text-slate-300 mb-2" />
                                <p>No staff members assigned to this branch</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })()}
                    </TableBody>
                  </Table>
                </Card>
              )}

              {activeTab === "settings" && (
                <Card>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-indigo-600" />
                    Branch Settings
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 mb-3">
                        General Settings
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                          <div>
                            <p className="font-medium text-slate-800">
                              Accept Online Orders
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Allow customers to place orders online for this
                              branch
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={b.settings?.acceptOnlineOrders ?? true}
                              onChange={(e) =>
                                handleSaveBranch({
                                  settings: {
                                    ...(b.settings || {}),
                                    acceptOnlineOrders: e.target.checked,
                                  },
                                })
                              }
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                          <div>
                            <p className="font-medium text-slate-800">
                              Enable Table Booking
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Allow customers to reserve tables in advance
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={b.settings?.enableTableBooking ?? false}
                              onChange={(e) =>
                                handleSaveBranch({
                                  settings: {
                                    ...(b.settings || {}),
                                    enableTableBooking: e.target.checked,
                                  },
                                })
                              }
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 mb-3">
                        Notification Preferences
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                          <div>
                            <p className="font-medium text-slate-800">
                              Daily Sales Summary
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Receive daily email summaries for this branch
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={b.settings?.dailySalesSummary ?? true}
                              onChange={(e) =>
                                handleSaveBranch({
                                  settings: {
                                    ...(b.settings || {}),
                                    dailySalesSummary: e.target.checked,
                                  },
                                })
                              }
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      {showEditModal && (
        <EditBranchModal
          branch={currentBranch}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveBranch}
        />
      )}
    </div>
  );
}
