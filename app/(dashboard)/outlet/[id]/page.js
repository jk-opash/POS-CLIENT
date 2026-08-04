"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from '../../../components/Sidebar';
import Topbar from '../../../components/Topbar';
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranchById, updateBranch, deleteBranch } from '../../../store/slices/branchSlice';
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { cn } from '../../../lib/utils';
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
} from "lucide-react";

// Edit Modal Component
function EditBranchModal({ branch, onClose, onSave }) {
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
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Branch Profile">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
        className="flex flex-col gap-4"
      >
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
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Branch Code *
            </label>
            <input
              className="input"
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
              required
            />
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
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">State</label>
            <input
              className="input"
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
            />
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
    if (confirm("Are you sure you want to delete this branch? This action cannot be undone.")) {
      try {
        await dispatch(deleteBranch(id)).unwrap();
        router.push("/outlet");
      } catch (err) {
        console.error("Failed to delete branch", err);
      }
    }
  };

  if (loading && !currentBranch) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center font-sans">
        <p className="text-slate-500 flex items-center gap-2">
          <Clock className="w-5 h-5 animate-spin" /> Loading branch details...
        </p>
      </div>
    );
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
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
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

              {activeTab !== "overview" && (
                <Card>
                  <div className="text-center py-12">
                    <Settings className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-700 capitalize">
                      {activeTab} coming soon
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Configure advanced settings for this branch here.
                    </p>
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
