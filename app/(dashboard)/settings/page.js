"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  User, Store, FileText, Building2, CreditCard,
  Phone, Mail, MapPin, Globe, Calendar, Users,
  GitBranch, ShieldCheck, Hash, Info,
} from "lucide-react";
import { cn } from "../../lib/utils";
import Badge from "../../components/ui/Badge";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

function formatPlanName(plan) {
  if (!plan) return "Free Trial";
  return plan.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function NavSectionTitle({ title }) {
  return <p className="px-3 mt-5 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>;
}

function SettingsNavLink({ label, icon, active, onClick, badge }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left group", active ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800")}>
      <div className={cn("p-1.5 rounded-lg transition-colors flex items-center justify-center shrink-0", active ? "bg-indigo-600 text-white shadow-sm shadow-indigo-300" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200")}>{icon}</div>
      <span className="flex-1">{label}</span>
      {badge && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md">{badge}</span>}
    </button>
  );
}

function Field({ label, value, icon, mono, full, badge }) {
  return (
    <div className={cn("flex flex-col gap-1.5", full && "col-span-2")}>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {icon && <span className="text-slate-300">{icon}</span>}{label}
      </label>
      {badge ? (
        <div className="flex items-center gap-2 min-h-[42px]">{badge}</div>
      ) : (
        <div className={cn("text-sm font-medium text-slate-800 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 min-h-[42px] flex items-center", mono && "font-mono tracking-wider text-slate-700")}>
          {value || <span className="text-slate-300 font-normal italic">Not provided</span>}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, description, icon }) {
  return (
    <div className="flex items-start gap-3 pb-5 border-b border-slate-100 mb-6">
      {icon && <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500 shrink-0 mt-0.5">{icon}</div>}
      <div>
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

function InfoBanner({ children }) {
  return (
    <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl px-4 py-3 text-xs font-medium">
      <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />{children}
    </div>
  );
}

function PlanCard({ plan }) {
  if (!plan) return null;
  const isActive = plan.status === "active" || plan.is_active;
  return (
    <div className="col-span-2 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Current Plan</span>
          </div>
          <h4 className="text-xl font-extrabold text-indigo-700 capitalize">{formatPlanName(plan.plan)}</h4>
          <p className="text-xs text-indigo-400 mt-0.5 capitalize">{plan.billing_cycle || "yearly"} billing &middot; {plan.amount > 0 ? `${plan.currency} ${plan.amount}` : "Free"}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isActive ? (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">Active</span>
          ) : (
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full uppercase tracking-wider">Inactive</span>
          )}
          {plan.cancel_at_period_end && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase">Cancels at period end</span>}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        {[
          { label: "Max Branches", value: plan.max_branches ?? "—" },
          { label: "Max Team Members", value: plan.max_team_members ?? "—" },
          { label: "Period Start", value: formatDate(plan.current_period_start) },
          { label: "Period End", value: formatDate(plan.current_period_end) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/70 rounded-xl px-3 py-2.5 border border-white/80">
            <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider mb-1">{label}</div>
            <div className="text-sm font-bold text-indigo-800">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BranchCard({ branch }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-sm font-bold text-slate-800">{branch.name}</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{branch.code}</p>
        </div>
        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0", branch.status === "Operational" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-200")}>{branch.status}</span>
      </div>
      <div className="space-y-1.5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-slate-300 shrink-0" />{branch.address}, {branch.city}, {branch.state}</div>
        <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-slate-300 shrink-0" />{branch.contact}</div>
        <div className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-slate-300 shrink-0" />{branch.email}</div>
        <div className="flex items-center gap-1.5"><FileText className="h-3 w-3 text-slate-300 shrink-0" />GST: {branch.tax_registration || "—"} ({branch.tax_percentage}%)</div>
        <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-slate-300 shrink-0" />Opened: {formatDate(branch.opening_date)}</div>
        {branch.branch_type && <div className="flex items-center gap-1.5"><Store className="h-3 w-3 text-slate-300 shrink-0" />{branch.branch_type}</div>}
        {branch.schedule && (
          <div className="mt-2 pt-2 border-t border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hours</p>
            <p>Weekday: {branch.schedule.weekday}</p>
            <p>Weekend: {branch.schedule.weekend}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamMemberRow({ member }) {
  const roleName = member?.role?.name || "Staff";
  const branchLabel = member.branch_id?.slice(-4).toUpperCase();
  const roleColor = { Manager: "purple", Cashier: "blue", Waiter: "green" }[roleName] || "default";
  return (
    <div className="flex items-center gap-3 py-3.5 px-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
        {member.first_name?.[0]}{member.last_name?.[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{member.first_name} {member.last_name}</p>
        <p className="text-xs text-slate-400 truncate">{member.email}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] text-slate-400 font-mono hidden sm:block">BR-{branchLabel}</span>
        <Badge variant={roleColor}>{roleName}</Badge>
        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", member.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>{member.status}</span>
      </div>
    </div>
  );
}

export default function Page() {
  const [tab, setTab] = useState("account");
  const { user } = useSelector((state) => state.auth);
  const business = user?.businesses?.[0] || {};
  const subscription = business?.subscription_plan || null;
  const branches = business?.branches || [];
  const teamMembers = business?.teamMembers || [];

  const renderContent = () => {
    switch (tab) {
      case "account":
        return (
          <div className="space-y-8">
            <div>
              <SectionHeader title="User Profile" description="Your personal account details" icon={<User className="h-4 w-4" />} />
              <div className="grid grid-cols-2 gap-5">
                <Field label="Full Name" value={user?.name} icon={<User className="h-3 w-3" />} />
                <Field label="Email Address" value={user?.email} icon={<Mail className="h-3 w-3" />} />
                <Field label="Phone Number" value={user?.phone} icon={<Phone className="h-3 w-3" />} />
                <Field label="Role" badge={<Badge variant="purple" className="uppercase">{user?.role || "admin"}</Badge>} />
                <Field label="Member Since" value={formatDate(user?.created_at)} icon={<Calendar className="h-3 w-3" />} />
                <Field label="Account Status" badge={user?.is_active ? <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">Active</span> : <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full uppercase">Suspended</span>} />
              </div>
            </div>
            <div>
              <SectionHeader title="Subscription Plan" description="Your current active plan and usage limits" icon={<CreditCard className="h-4 w-4" />} />
              <div className="grid grid-cols-2 gap-5">
                <PlanCard plan={subscription} />
                <Field label="Extra Branches Purchased" value={String(business?.extra_branches ?? 0)} icon={<GitBranch className="h-3 w-3" />} />
                <Field label="Extra Team Members Purchased" value={String(business?.extra_team_members ?? 0)} icon={<Users className="h-3 w-3" />} />
                <Field label="Total Branch Capacity" value={`${(subscription?.max_branches ?? 0) + (business?.extra_branches ?? 0)} branches`} />
                <Field label="Total Team Member Capacity" value={`${(subscription?.max_team_members ?? 0) + (business?.extra_team_members ?? 0)} members`} />
              </div>
            </div>
            <InfoBanner>To upgrade your plan or purchase additional branches and team members, please contact your account administrator.</InfoBanner>
          </div>
        );

      case "business":
        return (
          <div className="space-y-8">
            <div>
              <SectionHeader title="Business Details" description="Core information about your business" icon={<Store className="h-4 w-4" />} />
              <div className="grid grid-cols-2 gap-5">
                <Field label="Business Name" value={business?.name} icon={<Store className="h-3 w-3" />} />
                <Field label="Legal Name" value={business?.legal_name} />
                <Field label="Business Type" value={business?.business_type?.replace(/\b\w/g, (c) => c.toUpperCase())} />
                <Field label="Business Slug" value={business?.slug} mono />
                <Field label="Registration Number" value={business?.business_registration_number} mono icon={<Hash className="h-3 w-3" />} />
                <Field label="Account Status" badge={<span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full uppercase border", business?.status === "active" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-slate-500 bg-slate-100 border-slate-200")}>{business?.status || "—"}</span>} />
              </div>
            </div>
            <div>
              <SectionHeader title="Contact Information" description="How customers and partners reach you" icon={<Phone className="h-4 w-4" />} />
              <div className="grid grid-cols-2 gap-5">
                <Field label="Phone" value={business?.phone} icon={<Phone className="h-3 w-3" />} />
                <Field label="Email" value={business?.email} icon={<Mail className="h-3 w-3" />} />
                <Field label="Website" value={business?.website} icon={<Globe className="h-3 w-3" />} full />
              </div>
            </div>
            <div>
              <SectionHeader title="Registered Address" description="Legal address of your business" icon={<MapPin className="h-4 w-4" />} />
              <div className="grid grid-cols-2 gap-5">
                <Field label="Address Line 1" value={business?.address_line1} full />
                <Field label="Address Line 2" value={business?.address_line2} full />
                <Field label="City" value={business?.city} />
                <Field label="State" value={business?.state} />
                <Field label="Country" value={business?.country} />
                <Field label="Pincode" value={business?.pincode} mono />
              </div>
            </div>
            <div>
              <SectionHeader title="Owner / Proprietor Details" description="Personal information of the business owner" icon={<User className="h-4 w-4" />} />
              <div className="grid grid-cols-2 gap-5">
                <Field label="Date of Birth" value={formatDate(business?.date_of_birth)} icon={<Calendar className="h-3 w-3" />} />
                <Field label="Gender" value={business?.gender?.replace(/\b\w/g, (c) => c.toUpperCase())} />
              </div>
            </div>
          </div>
        );

      case "tax":
        return (
          <div className="space-y-8">
            <div>
              <SectionHeader title="Tax & GST Details" description="Your business tax registrations and identifiers" icon={<FileText className="h-4 w-4" />} />
              <div className="grid grid-cols-2 gap-5">
                <Field label="PAN Number" value={business?.pan} mono icon={<Hash className="h-3 w-3" />} />
                <Field label="GSTIN" value={business?.gstin} mono icon={<ShieldCheck className="h-3 w-3" />} />
                <Field label="Identity Verification" badge={<span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full uppercase border", business?.identity_verification === "verified" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : business?.identity_verification === "pending" ? "text-amber-600 bg-amber-50 border-amber-200" : "text-rose-600 bg-rose-50 border-rose-200")}>{business?.identity_verification || "Pending"}</span>} />
              </div>
            </div>
            <div>
              <SectionHeader title="Branch-wise Tax Configuration" description="GST rate and jurisdiction for each branch" icon={<GitBranch className="h-4 w-4" />} />
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>{["Branch","Code","Jurisdiction","Registration","Tax Rate"].map((h) => <th key={h} className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {branches.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-slate-400 text-sm">No branches found</td></tr>
                    ) : (
                      branches.map((b) => (
                        <tr key={b.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-700">{b.name}</td>
                          <td className="py-3 px-4 font-mono text-slate-500 text-xs">{b.code}</td>
                          <td className="py-3 px-4 text-slate-600">{b.tax_jurisdiction || "—"}</td>
                          <td className="py-3 px-4 font-mono text-slate-600 text-xs">{b.tax_registration || "—"}</td>
                          <td className="py-3 px-4"><span className="font-bold text-slate-700">{b.tax_percentage ?? 0}%</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <InfoBanner>Tax configuration per branch is managed by your account administrator. Contact support to update jurisdiction or registration details.</InfoBanner>
          </div>
        );

      case "branches":
        return (
          <div className="space-y-6">
            <SectionHeader title="Branch Locations" description={`${branches.length} branch${branches.length !== 1 ? "es" : ""} under your business`} icon={<Building2 className="h-4 w-4" />} />
            {branches.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">No branches configured</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{branches.map((b) => <BranchCard key={b.id} branch={b} />)}</div>
            )}
          </div>
        );

      case "team":
        return (
          <div className="space-y-6">
            <SectionHeader title="Team Members" description={`${teamMembers.length} member${teamMembers.length !== 1 ? "s" : ""} across all branches`} icon={<Users className="h-4 w-4" />} />
            {teamMembers.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">No team members found</div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">{teamMembers.map((m) => <TeamMemberRow key={m.id} member={m} />)}</div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-slate-50 font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-6 py-6">
          <div className="mx-auto">
            <div className="flex flex-col md:flex-row gap-8 pb-12 min-h-[calc(100vh-8rem)]">
              <div className="w-full md:w-60 shrink-0 flex flex-col gap-5">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-800">Settings</h2>
                  <p className="text-xs text-slate-400 mt-1">{business?.name || "My Business"}</p>
                </div>
                <nav className="flex flex-col gap-0.5">
                  <NavSectionTitle title="Account" />
                  <SettingsNavLink label="Account & Plan" icon={<User className="h-3.5 w-3.5" />} active={tab === "account"} onClick={() => setTab("account")} />
                  <NavSectionTitle title="Business" />
                  <SettingsNavLink label="Business Info" icon={<Store className="h-3.5 w-3.5" />} active={tab === "business"} onClick={() => setTab("business")} />
                  <SettingsNavLink label="Tax & GST" icon={<FileText className="h-3.5 w-3.5" />} active={tab === "tax"} onClick={() => setTab("tax")} />
                  <NavSectionTitle title="Operations" />
                  <SettingsNavLink label="Branch Locations" icon={<Building2 className="h-3.5 w-3.5" />} active={tab === "branches"} onClick={() => setTab("branches")} badge={branches.length > 0 ? String(branches.length) : null} />
                  <SettingsNavLink label="Team Members" icon={<Users className="h-3.5 w-3.5" />} active={tab === "team"} onClick={() => setTab("team")} badge={teamMembers.length > 0 ? String(teamMembers.length) : null} />
                </nav>
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 min-h-full">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
