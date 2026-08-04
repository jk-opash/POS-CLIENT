"use client";
import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} from "../../../store/slices/teamMemberSlice";
import { fetchBranches } from "../../../store/slices/branchSlice";
import Sidebar from "../../../components/Sidebar";
import Topbar from "../../../components/Topbar";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { cn } from "../../../lib/utils";
import {
  Phone,
  Mail,
  ChevronLeft,
  Settings,
  Clock,
  Edit,
  Shield,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Ban,
} from "lucide-react";
const ROLES = ["Owner", "Manager", "Cashier", "Waiter", "Kitchen", "Inventory"];
const PERMISSIONS = [
  "dashboard",
  "staff",
  "inventory",
  "reports",
  "billing",
  "orders",
  "customers",
  "tables",
  "kds",
];
const DEFAULT_PERMISSIONS = {
  Manager: ["dashboard", "staff", "inventory", "reports", "billing"],
  Cashier: ["billing", "orders", "customers"],
  Waiter: ["orders", "tables"],
  Kitchen: ["kds", "inventory"],
  Owner: [
    "dashboard",
    "staff",
    "inventory",
    "reports",
    "billing",
    "orders",
    "customers",
    "tables",
    "kds",
  ],
  Inventory: ["inventory", "reports"],
};
// Edit Modal Component
function EditStaffModal({ member, branches = [], onClose, onSave }) {
  const defaultRole = member?.role?.name || member?.role || "Waiter";
  const [form, setForm] = useState({
    first_name: member?.first_name || member?.name?.split(" ")[0] || "",
    last_name: member?.last_name || member?.name?.split(" ")[1] || "",
    role_name: defaultRole,
    permissions:
      member?.role?.permissions || DEFAULT_PERMISSIONS[defaultRole] || [],
    phone: member?.phone || "",
    email: member?.email || "",
    pin: member?.pin || "",
    salary: member?.salary || "",
    status: member?.status || "Active",
    branch_id: member?.branch_id || member?.branch?.id || "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setForm((f) => ({
      ...f,
      role_name: newRole,
      permissions: DEFAULT_PERMISSIONS[newRole] || [],
    }));
  };
  const togglePermission = (perm) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter((p) => p !== perm)
        : [...f.permissions, perm],
    }));
  };
  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Staff Profile">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            ...form,
            name: `${form.first_name} ${form.last_name}`.trim(),
            role: {
              name: form.role_name,
              permissions: form.permissions,
            },
          });
        }}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              First Name *
            </label>
            <input
              className="input"
              value={form.first_name}
              onChange={(e) => set("first_name", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Last Name
            </label>
            <input
              className="input"
              value={form.last_name}
              onChange={(e) => set("last_name", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Status</label>
            <select
              className="input select"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Role *</label>
            <select
              className="input select"
              value={form.role_name}
              onChange={handleRoleChange}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Email</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Branch</label>
            <select
              className="input select"
              value={form.branch_id}
              onChange={(e) => set("branch_id", e.target.value)}
            >
              <option value="">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-2">
            Permissions
          </label>
          <div className="flex flex-wrap gap-2">
            {PERMISSIONS.map((p) => (
              <label
                key={p}
                className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded cursor-pointer hover:bg-slate-100"
              >
                <input
                  type="checkbox"
                  checked={form.permissions.includes(p)}
                  onChange={() => togglePermission(p)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="capitalize">{p}</span>
              </label>
            ))}
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
export default function StaffDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = params;
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const { currentTeamMember, loading, error } = useSelector(
    (state) => state.teamMember,
  );
  const { branches } = useSelector((state) => state.branch);
  const { user } = useSelector((state) => state.auth);
  const handleToggle = useCallback(() => setCollapsed((c) => !c), []);
  useEffect(() => {
    if (id) {
      dispatch(fetchTeamMemberById(id));
    }
    const businessId = user?.businesses?.[0]?.id;
    if (businessId && branches.length === 0) {
      dispatch(fetchBranches(businessId));
    }
  }, [id, dispatch, user, branches.length]);
  const handleSaveStaff = async (data) => {
    try {
      await dispatch(updateTeamMember({ id, data })).unwrap();
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update team member", err);
    }
  };
  const handleDeleteStaff = async () => {
    if (
      confirm(
        "Are you sure you want to delete this staff member? This action cannot be undone.",
      )
    ) {
      try {
        await dispatch(deleteTeamMember(id)).unwrap();
        router.push("/outlet");
      } catch (err) {
        console.error("Failed to delete team member", err);
      }
    }
  };
  if (loading && !currentTeamMember) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center font-sans">
        <p className="text-slate-500 flex items-center gap-2">
          <Clock className="w-5 h-5 animate-spin" /> Loading staff details...
        </p>
      </div>
    );
  }
  if (error && !currentTeamMember) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Staff Not Found</h2>
          <p className="text-slate-500 text-sm max-w-sm">{error}</p>
          <Button variant="primary" onClick={() => router.push("/outlet")}>
            Back to Team Members
          </Button>
        </div>
      </div>
    );
  }
  const m = currentTeamMember;
  if (!m) return null;
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={handleToggle} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="space-y-6 pb-12">
            {/* Back Button */}
            <div>
              <button
                onClick={() => router.push("/outlet")}
                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Branches & Staff
              </button>
            </div>
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {m.first_name} {m.last_name || ""}
                  </h1>
                  <Badge
                    variant={
                      m.status === "Active" || m.status === "active"
                        ? "success"
                        : "warning"
                    }
                    dot
                  >
                    {m.status || "Active"}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500 capitalize">
                  <Shield className="h-4 w-4" />{" "}
                  {m.role?.name || m.role || "Staff"}
                  <span className="text-slate-300">|</span>
                  Joined{" "}
                  {m.join_date || m.created_at
                    ? new Date(m.join_date || m.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
                {m.status === "Inactive" ? (
                  <Button variant="primary">Restore Access</Button>
                ) : (
                  <Button
                    variant="danger"
                    onClick={handleDeleteStaff}
                    className="bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none"
                  >
                    Delete Member
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
                  { id: "permissions", label: "Permissions" },
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
                              {m.first_name?.charAt(0) || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {m.first_name} {m.last_name || ""}
                            </p>
                            <p className="text-xs text-slate-400 capitalize">
                              {m.role?.name || m.role || "Staff"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <Mail className="h-4 w-4 text-slate-300" />
                          {m.email || "Not Provided"}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <Phone className="h-4 w-4 text-slate-300" />
                          {m.phone || "Not Provided"}
                        </div>
                      </div>
                    </Card>
                    <Card>
                      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-slate-300" />
                        Role Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                          <span className="text-slate-500">Role</span>
                          <span className="font-medium capitalize">
                            {m.role?.name || m.role || "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                          <span className="text-slate-500">Branch</span>
                          <span className="font-medium">
                            {m.branch?.name ||
                              (m.branch_id
                                ? "Branch ID: " + m.branch_id
                                : "All Branches")}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                          <span className="text-slate-500">Salary</span>
                          <span className="font-medium">
                            {m.salary ? `$${m.salary}` : "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                          <span className="text-slate-500">PIN Code</span>
                          <span className="font-medium">
                            {m.pin ? "****" : "Not Set"}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="md:col-span-2 space-y-6">
                    <Card>
                      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-slate-300" /> Access &
                        Permissions
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {m.role?.permissions ? (
                          m.role.permissions.map((p) => (
                            <Badge
                              key={p}
                              variant="outline"
                              className="capitalize"
                            >
                              {p}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-slate-500 text-sm">
                            No specific permissions set.
                          </span>
                        )}
                      </div>
                    </Card>
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
              {activeTab === "permissions" && (
                <Card>
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-600" />
                    Role & Permissions
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                        Current Role
                      </h4>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="primary"
                          className="text-sm capitalize px-3 py-1 bg-indigo-100 text-indigo-700"
                        >
                          {m.role?.name || m.role || "Staff"}
                        </Badge>
                        <p className="text-sm text-slate-500">
                          This role determines the default permissions for the
                          team member.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-slate-700">
                          Assigned Permissions
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowEditModal(true)}
                        >
                          <Edit className="w-3.5 h-3.5 mr-1.5" />
                          Edit Permissions
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {PERMISSIONS.map((p) => {
                          const hasPermission =
                            m.role?.permissions?.includes(p) || false;
                          return (
                            <div
                              key={p}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border",
                                hasPermission
                                  ? "bg-indigo-50/50 border-indigo-100"
                                  : "bg-slate-50 border-slate-100 opacity-60",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                                  hasPermission
                                    ? "bg-indigo-500 text-white"
                                    : "bg-slate-200 text-slate-400",
                                )}
                              >
                                {hasPermission ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <Ban className="w-3.5 h-3.5" />
                                )}
                              </div>
                              <span
                                className={cn(
                                  "text-sm capitalize",
                                  hasPermission
                                    ? "font-medium text-slate-900"
                                    : "text-slate-500",
                                )}
                              >
                                {p}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              {activeTab === "settings" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <Card>
                      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-slate-400" />
                        Security & Authentication
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              POS PIN Code
                            </p>
                            <p className="text-xs text-slate-500">
                              Manage 4-digit PIN for POS system login
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Reset PIN
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              Password
                            </p>
                            <p className="text-xs text-slate-500">
                              Send a password reset link to their email
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Send Link
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="space-y-6">
                    <Card>
                      <h3 className="text-sm font-bold text-red-600 mb-4 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        Danger Zone
                      </h3>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-red-50/50 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
                          <div>
                            <p className="text-sm font-medium text-red-800">
                              Account Status
                            </p>
                            <p className="text-xs text-red-600/80">
                              {m.status === "Active" || m.status === "active"
                                ? "Deactivate to temporarily block access"
                                : "Activate to restore access to the system"}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "border-red-200 text-red-600 hover:bg-red-100",
                              !(
                                m.status === "Active" || m.status === "active"
                              ) &&
                                "border-emerald-200 text-emerald-600 hover:bg-emerald-50",
                            )}
                            onClick={() => {
                              const newStatus =
                                m.status === "Active" || m.status === "active"
                                  ? "Inactive"
                                  : "Active";
                              handleSaveStaff({ status: newStatus });
                            }}
                          >
                            {m.status === "Active" || m.status === "active"
                              ? "Deactivate Account"
                              : "Activate Account"}
                          </Button>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-red-800">
                              Delete Member
                            </p>
                            <p className="text-xs text-red-600/80">
                              Permanently remove this account and data
                            </p>
                          </div>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={handleDeleteStaff}
                          >
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {showEditModal && (
        <EditStaffModal
          member={m}
          branches={branches}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveStaff}
        />
      )}
    </div>
  );
}
