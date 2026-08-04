"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchBranches } from "../../store/slices/branchSlice";
import {
  fetchTeamMembers,
  deleteTeamMember,
  updateTeamMember,
  createTeamMember,
} from "../../store/slices/teamMemberSlice";
import Card, { CardHeader, CardTitle } from "../../components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Plus,
  Store,
  Users,
  Shield,
  Eye,
  Ban,
  Trash2,
  Edit2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import Modal from "../../components/ui/Modal";

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

function StaffModal({ member, onSave, onClose }) {
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
    active: member?.active ?? (member?.status === "Active" || true),
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
    <Modal
      isOpen={true}
      onClose={onClose}
      title={member ? "Edit Staff Member" : "Add Staff Member"}
    >
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
          onClose();
        }}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              First Name *
            </label>
            <input
              className="input"
              value={form.first_name}
              onChange={(e) => set("first_name", e.target.value)}
              required
              placeholder="Rajan"
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
              placeholder="Verma"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            <label className="text-xs text-slate-500 block mb-1">
              Monthly Salary (₹)
            </label>
            <input
              className="input"
              type="number"
              value={form.salary}
              onChange={(e) => set("salary", e.target.value)}
              placeholder="22000"
            />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Phone</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="9876543210"
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
        </div>

        <div>
          <label className="text-xs text-slate-500 block mb-1">
            4-Digit PIN
          </label>
          <input
            className="input"
            type="password"
            maxLength={4}
            value={form.pin}
            onChange={(e) => set("pin", e.target.value)}
            placeholder="••••"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => set("active", e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-slate-600">Active (can clock-in)</span>
        </label>

        <div className="flex gap-2 justify-end mt-4">
          <Button type="button" variant="surface" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="accent">
            Save Staff
          </Button>
        </div>
      </form>
    </Modal>
  );
}

const CircularProgress = ({ value, max, colorClass, icon: Icon, label }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  const percent =
    max > 0 ? Math.min((value / max) * 100, 100) : value > 0 ? 100 : 0;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="relative flex items-center justify-center w-12 h-12">
        <svg className="transform -rotate-90 w-12 h-12 absolute inset-0">
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="3.5"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="3.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-in-out ${colorClass}`}
            strokeLinecap="round"
          />
        </svg>
        <div
          className={`relative flex flex-col items-center justify-center ${colorClass}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xl font-black text-slate-800 leading-none mt-0.5">
          {value}{" "}
          <span className="text-sm font-medium text-slate-400">
            / {max === 0 ? "∞" : max}
          </span>
        </p>
      </div>
    </div>
  );
};

export default function OutletPage() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("outlets");
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { branches: reduxBranches, loading: branchesLoading } = useSelector(
    (state) => state.branch,
  );
  const { teamMembers: reduxTeamMembers, loading: teamLoading } = useSelector(
    (state) => state.teamMember,
  );

  const businessId = user?.businesses?.[0]?.id;

  useEffect(() => {
    if (businessId) {
      dispatch(fetchBranches(businessId));
      dispatch(fetchTeamMembers(businessId));
    }
  }, [businessId, dispatch]);

  const handleSaveStaff = async (data) => {
    try {
      if (editMember) {
        await dispatch(updateTeamMember({ id: editMember.id, data })).unwrap();
      } else {
        await dispatch(createTeamMember(data)).unwrap();
      }
      setShowModal(false);
      setEditMember(null);
    } catch (err) {
      console.error("Failed to save team member:", err);
      alert("Failed to save team member: " + err);
    }
  };

  const branches =
    reduxBranches.length > 0
      ? reduxBranches
      : user?.businesses?.[0]?.branches || [];

  const business = user?.businesses?.[0];
  const apiStaff = business?.team_members || business?.teamMembers;
  const teamMembers =
    reduxTeamMembers.length > 0
      ? reduxTeamMembers
      : apiStaff && apiStaff.length > 0
        ? apiStaff
        : [];

  const handleDeleteStaff = (id) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      dispatch(deleteTeamMember(id));
    }
  };

  const handleToggleStatus = (member) => {
    const currentIsActive =
      member.status === "Active" || member.status === "active" || member.active;
    const newStatus = currentIsActive ? "Inactive" : "Active";
    dispatch(updateTeamMember({ id: member.id, data: { status: newStatus } }));
  };

  const subscription = business?.subscription_plan;
  const baseBranches = subscription?.max_branches || 0;
  const extraBranches = business?.extra_branches || 0;
  const maxBranches =
    baseBranches + extraBranches > 0 ? baseBranches + extraBranches : 0;

  const baseStaff = subscription?.max_team_members || 0;
  const extraStaff = business?.extra_team_members || 0;
  const maxStaff = baseStaff + extraStaff > 0 ? baseStaff + extraStaff : 0;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={() => setCollapsed((c) => !c)} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Outlet Configuration
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage all operational branches and their configurations.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <CircularProgress
                  value={branches.length}
                  max={maxBranches}
                  colorClass="text-indigo-500"
                  icon={Store}
                  label="Total Branches"
                />
                <CircularProgress
                  value={teamMembers.length}
                  max={maxStaff}
                  colorClass="text-emerald-500"
                  icon={Users}
                  label="Total Staff"
                />
              </div>
            </div>

            <div className="border-b border-slate-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("outlets")}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                    activeTab === "outlets"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700",
                  )}
                >
                  <Store className="h-4 w-4" />
                  Branches
                </button>
                <button
                  onClick={() => setActiveTab("staff")}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                    activeTab === "staff"
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700",
                  )}
                >
                  <Users className="h-4 w-4" />
                  Team Members
                </button>
              </nav>
            </div>

            {/* Branches Card */}
            {activeTab === "outlets" && (
              <Card padding="none">
                <CardHeader className="pt-5 px-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                    <CardTitle>Branches ({branches.length})</CardTitle>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => router.push("/outlet/new")}
                  >
                    <Plus className="h-4 w-4" />
                    Add Outlet
                  </Button>
                </CardHeader>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Branch Name & Code</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branches.length > 0 ? (
                      branches.map((b, index) => (
                        <TableRow
                          key={b.id || index}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell>
                            <div className="font-semibold text-slate-800">
                              {b.name}
                            </div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">
                              {b.code || "MAIN"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span>
                                {[b.city, b.state, b.country]
                                  .filter(Boolean)
                                  .join(", ") || "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {b.contact && (
                                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                                  <Phone className="h-3 w-3 text-slate-400" />
                                  {b.contact}
                                </div>
                              )}
                              {b.email && (
                                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                                  <Mail className="h-3 w-3 text-slate-400" />
                                  {b.email}
                                </div>
                              )}
                              {!b.contact && !b.email && (
                                <span className="text-xs text-slate-400">
                                  N/A
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                b.status === "Operational" ||
                                b.status === "active"
                                  ? "success"
                                  : "warning"
                              }
                              dot
                            >
                              {b.status || "Operational"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() =>
                                  router.push(`/outlet/${b.id}/zones`)
                                }
                              >
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                Zones
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => router.push(`/outlet/${b.id}`)}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-32 text-center text-slate-500"
                        >
                          No branches added to this business yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}

            {/* Staff Card */}
            {activeTab === "staff" && (
              <Card padding="none">
                <CardHeader className="pt-5 px-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <CardTitle>Team Members ({teamMembers.length})</CardTitle>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      setEditMember(null);
                      setShowModal(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Staff
                  </Button>
                </CardHeader>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.length > 0 ? (
                      teamMembers.map((member, idx) => (
                        <TableRow
                          key={member.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell>
                            <div className="font-semibold text-slate-800">
                              {member.first_name || member.name}{" "}
                              {member.last_name || ""}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {member.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                              <Shield className="h-3 w-3 text-indigo-500" />
                              {member.role?.name || member.role || "Staff"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-slate-600 font-medium">
                              {member.branch?.name || "All Branches"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                member.status === "Active" ||
                                member.status === "active" ||
                                member.active
                                  ? "success"
                                  : "muted"
                              }
                              dot
                            >
                              {member.status ||
                                (member.active ? "Active" : "Inactive")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() =>
                                  router.push(`/staff/${member.id}`)
                                }
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(member)}
                                className={
                                  member.status === "Active" ||
                                  member.status === "active" ||
                                  member.active
                                    ? "h-8 px-2 text-xs text-amber-600 border-amber-200 hover:bg-amber-50"
                                    : "h-8 px-2 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                }
                              >
                                <Ban className="h-3.5 w-3.5 mr-1" />
                                {member.status === "Active" ||
                                member.status === "active" ||
                                member.active
                                  ? "Deactivate"
                                  : "Activate"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteStaff(member.id)}
                                className="h-8 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-32 text-center text-slate-500"
                        >
                          No staff members added to this business yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <StaffModal
          member={editMember}
          onSave={handleSaveStaff}
          onClose={() => {
            setShowModal(false);
            setEditMember(null);
          }}
        />
      )}
    </div>
  );
}
