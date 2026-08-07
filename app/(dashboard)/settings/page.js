"use client";

import { useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { useSelector } from "react-redux";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import {
  User,
  Store,
  FileText,
  Receipt,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

function NavSectionTitle({ title }) {
  return (
    <p className="px-3 mt-4 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      {title}
    </p>
  );
}

function SettingsNavLink({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left",
        active
          ? "bg-indigo-50 text-indigo-600"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
      )}
    >
      <div
        className={cn(
          "p-1.5 rounded-lg transition-colors flex items-center justify-center",
          active ? "bg-white shadow-sm" : "bg-transparent",
        )}
      >
        {icon}
      </div>
      {label}
    </button>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        padding: "14px 0",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div style={{ flex: "1 1 200px", minWidth: 0, paddingRight: 16 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--color-text-primary)",
            marginBottom: 3,
          }}
        >
          {label}
        </div>
        {description && (
          <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
            {description}
          </div>
        )}
      </div>
      <div style={{ flex: "0 0 auto", maxWidth: "100%" }}>{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 99,
        cursor: "pointer",
        transition: "background 0.2s",
        background: value ? "var(--color-accent)" : "var(--color-surface2)",
        position: "relative",
        border: `1px solid ${value ? "var(--color-accent)" : "var(--color-border)"}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: value ? 22 : 2,
          width: 18,
          height: 18,
          borderRadius: 99,
          background: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}

export default function SettingsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("account");
  const [saved, setSaved] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const business = user?.businesses?.[0] || {};

  const set = (k, v) => updateSettings({ [k]: v });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderContent = () => {
    switch (tab) {
      case "account":
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Account & Plan
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your user profile and active subscription details.
              </p>
            </div>

            <div className="p-0 sm:p-2 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                  User Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      Full Name
                    </label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                      {user?.name || "-"}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      Email Address
                    </label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                      {user?.email || "-"}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      Phone Number
                    </label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                      {user?.phone || "-"}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      Role
                    </label>
                    <div className="flex items-center h-[38px]">
                      <Badge variant="purple" className="uppercase">
                        {user?.role || "admin"}
                      </Badge>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      Member Since
                    </label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString(
                            "en-IN",
                            { year: "numeric", month: "long", day: "numeric" },
                          )
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                  Business Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      Legal Name
                    </label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                      {business?.legal_name || business?.name || "-"}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      PAN Number
                    </label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 uppercase tracking-wider">
                      {business?.pan || "Not provided"}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      GSTIN
                    </label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 uppercase tracking-wider">
                      {business?.gstin || "Not provided"}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      Registered Address
                    </label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 leading-relaxed min-h-[60px]">
                      {business?.address_line1 || "No address provided"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                  Subscription Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      Current Plan
                    </label>
                    <div className="flex items-center gap-3 h-[38px]">
                      <Badge
                        variant="blue"
                        className="uppercase text-xs font-bold"
                      >
                        {business?.subscription_plan?.plan?.replace("_", " ") ||
                          "Free Trial"}
                      </Badge>
                      {business?.subscription_plan?.status === "active" ||
                      business?.subscription_plan?.is_active ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 uppercase tracking-wider">
                          Active
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      Billing Cycle
                    </label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 capitalize">
                      {business?.subscription_plan?.billing_cycle || "Yearly"}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      Max Branches
                    </label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                      {business?.subscription_plan?.max_branches || 1}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      Extra Branches
                    </label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                      {business?.extra_branches || 0}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      Max Team Members
                    </label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                      {business?.subscription_plan?.max_team_members || 3}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 mb-1.5 block">
                      Extra Team Members
                    </label>
                    <div className="text-sm font-medium text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                      {business?.extra_team_members || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "business":
        return (
          <div className="animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Business Settings
              </h2>
              <p className="mt-1 text-sm text-slate-500 mb-6">
                Configure your restaurant details, currency, and localization.
              </p>
            </div>

            <SettingRow
              label="Restaurant Name"
              description="Shown on all bills and receipts"
            >
              <input
                className="input"
                value={settings.restaurantName}
                onChange={(e) => set("restaurantName", e.target.value)}
                style={{ width: "100%", minWidth: 240 }}
              />
            </SettingRow>
            <SettingRow label="Address" description="Full address for invoices">
              <textarea
                className="input"
                rows={2}
                value={settings.address}
                onChange={(e) => set("address", e.target.value)}
                style={{ width: "100%", minWidth: 240, resize: "none" }}
              />
            </SettingRow>
            <SettingRow label="Phone" description="Contact number on receipts">
              <input
                className="input"
                value={settings.phone}
                onChange={(e) => set("phone", e.target.value)}
                style={{ width: "100%", minWidth: 200 }}
              />
            </SettingRow>
            <SettingRow label="Currency Symbol" description="Used on all bills">
              <select
                className="input select"
                value={settings.currency}
                onChange={(e) => set("currency", e.target.value)}
                style={{ width: 100 }}
              >
                {["₹", "$", "€", "£"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </SettingRow>
            <SettingRow label="Timezone" description="For date/time on reports">
              <select
                className="input select"
                value={settings.timezone}
                onChange={(e) => set("timezone", e.target.value)}
                style={{ width: "100%", minWidth: 200 }}
              >
                <option>Asia/Kolkata</option>
                <option>Asia/Mumbai</option>
                <option>UTC</option>
              </select>
            </SettingRow>
          </div>
        );

      case "tax":
        return (
          <div className="animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Tax & GST</h2>
              <p className="mt-1 text-sm text-slate-500 mb-6">
                Manage your GST details, FSSAI numbers, and taxation settings.
              </p>
            </div>

            <SettingRow
              label="Enable GST"
              description="Apply CGST + SGST on bills"
            >
              <Toggle
                value={settings.gstEnabled}
                onChange={(v) => set("gstEnabled", v)}
              />
            </SettingRow>
            <SettingRow
              label="GSTIN"
              description="Your restaurant's GST Identification Number"
            >
              <input
                className="input"
                value={settings.gstin}
                onChange={(e) => set("gstin", e.target.value)}
                style={{ width: 220 }}
                placeholder="29AABCU9603R1ZV"
              />
            </SettingRow>
            <SettingRow
              label="FSSAI License No."
              description="Food Safety license number on receipts"
            >
              <input
                className="input"
                value={settings.fssai}
                onChange={(e) => set("fssai", e.target.value)}
                style={{ width: 200 }}
                placeholder="10020012000123"
              />
            </SettingRow>
            <SettingRow
              label="Default Tax Rate %"
              description="Applied to items without a specific rate"
            >
              <select
                className="input select"
                value={settings.taxRate}
                onChange={(e) => set("taxRate", Number(e.target.value))}
                style={{ width: 80 }}
              >
                {[0, 5, 12, 18].map((t) => (
                  <option key={t} value={t}>
                    {t}%
                  </option>
                ))}
              </select>
            </SettingRow>
            <SettingRow
              label="Service Charge"
              description="Optional % added to the bill total"
            >
              <Toggle
                value={settings.serviceChargeEnabled}
                onChange={(v) => set("serviceChargeEnabled", v)}
              />
            </SettingRow>
            {settings.serviceChargeEnabled && (
              <SettingRow label="Service Charge %" description="">
                <input
                  className="input"
                  type="number"
                  value={settings.serviceCharge}
                  onChange={(e) => set("serviceCharge", Number(e.target.value))}
                  style={{ width: 80 }}
                  min="0"
                  max="20"
                />
              </SettingRow>
            )}
            <div
              style={{
                marginTop: 16,
                padding: "12px 14px",
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 10,
                fontSize: 12,
                color: "#f59e0b",
              }}
            >
              💡 <strong>E-Invoice (IRN) hook</strong> is ready but dormant.
              Mandatory above ₹5 crore turnover. Enable in future without
              redeploy.
            </div>
          </div>
        );

      case "receipt":
        return (
          <div className="animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Receipt & Invoice
              </h2>
              <p className="mt-1 text-sm text-slate-500 mb-6">
                Customize what appears on printed receipts and invoices.
              </p>
            </div>

            <SettingRow
              label="Footer Message"
              description="Shown at the bottom of every receipt"
            >
              <input
                className="input"
                value={settings.receiptFooter}
                onChange={(e) => set("receiptFooter", e.target.value)}
                style={{ width: 280 }}
                placeholder="Thank you for dining!"
              />
            </SettingRow>
            <SettingRow label="Show GSTIN on receipt" description="">
              <Toggle
                value={settings.gstEnabled}
                onChange={(v) => set("gstEnabled", v)}
              />
            </SettingRow>
            <SettingRow label="Show FSSAI on receipt" description="">
              <Toggle value={true} onChange={() => {}} />
            </SettingRow>

            {/* Receipt preview */}
            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  fontWeight: 600,
                  color: "var(--color-text-secondary)",
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  fontSize: 11,
                }}
              >
                RECEIPT PREVIEW
              </div>
              <div
                style={{
                  background: "#fff",
                  color: "#111",
                  borderRadius: 8,
                  padding: "16px",
                  maxWidth: 300,
                  margin: "0 auto",
                  fontFamily: "monospace",
                  fontSize: 12,
                  lineHeight: 1.7,
                  boxShadow:
                    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                }}
              >
                <div
                  style={{ textAlign: "center", fontWeight: 700, fontSize: 14 }}
                >
                  {settings.restaurantName}
                </div>
                <div
                  style={{ textAlign: "center", fontSize: 10, color: "#555" }}
                >
                  {settings.address}
                </div>
                <div
                  style={{ textAlign: "center", fontSize: 10, color: "#555" }}
                >
                  Ph: {settings.phone}
                </div>
                <div
                  style={{ borderTop: "1px dashed #ccc", margin: "8px 0" }}
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Paneer Tikka ×2</span>
                  <span>₹640</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Butter Naan ×3</span>
                  <span>₹180</span>
                </div>
                <div
                  style={{ borderTop: "1px dashed #ccc", margin: "6px 0" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                    color: "#555",
                  }}
                >
                  <span>CGST 2.5%</span>
                  <span>₹21</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                    color: "#555",
                  }}
                >
                  <span>SGST 2.5%</span>
                  <span>₹21</span>
                </div>
                <div style={{ borderTop: "1px solid #ccc", margin: "6px 0" }} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                  }}
                >
                  <span>TOTAL</span>
                  <span>₹862</span>
                </div>
                <div
                  style={{ borderTop: "1px dashed #ccc", margin: "8px 0" }}
                />
                {settings.gstEnabled && (
                  <div style={{ fontSize: 9, color: "#777" }}>
                    GSTIN: {settings.gstin}
                  </div>
                )}
                <div style={{ fontSize: 9, color: "#777" }}>
                  FSSAI: {settings.fssai}
                </div>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 8,
                    fontSize: 10,
                    color: "#555",
                  }}
                >
                  {settings.receiptFooter}
                </div>
              </div>
            </div>
          </div>
        );

      case "features":
        return (
          <div className="animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Feature Toggles
              </h2>
              <p className="mt-1 text-sm text-slate-500 mb-6">
                Enable or disable modules for your operation.
              </p>
            </div>

            <SettingRow
              label="Dine-In Orders"
              description="Table-based ordering"
            >
              <Toggle
                value={settings.tableService}
                onChange={(v) => set("tableService", v)}
              />
            </SettingRow>
            <SettingRow
              label="Takeaway Orders"
              description="Walk-in pickup orders"
            >
              <Toggle
                value={settings.takeaway}
                onChange={(v) => set("takeaway", v)}
              />
            </SettingRow>
            <SettingRow
              label="Delivery Orders"
              description="In-house delivery management"
            >
              <Toggle
                value={settings.delivery}
                onChange={(v) => set("delivery", v)}
              />
            </SettingRow>
            <SettingRow
              label="GST Billing"
              description="Apply taxes on all bills"
            >
              <Toggle
                value={settings.gstEnabled}
                onChange={(v) => set("gstEnabled", v)}
              />
            </SettingRow>
            <SettingRow
              label="Service Charge"
              description="Add service charge to bills"
            >
              <Toggle
                value={settings.serviceChargeEnabled}
                onChange={(v) => set("serviceChargeEnabled", v)}
              />
            </SettingRow>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={() => setCollapsed((c) => !c)} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto">
            <div className="flex flex-col md:flex-row gap-8 pb-12 min-h-[calc(100vh-8rem)]">
              {/* Sidebar Navigation */}
              <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Settings
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage your POS configuration
                  </p>
                </div>

                <nav className="flex flex-col gap-1 pr-4 md:pr-0 border-r border-slate-200 md:border-transparent h-full">
                  <NavSectionTitle title="Account" />
                  <SettingsNavLink
                    label="Account & Plan"
                    icon={<User className="h-4 w-4" />}
                    active={tab === "account"}
                    onClick={() => setTab("account")}
                  />

                  <NavSectionTitle title="Configuration" />
                  <SettingsNavLink
                    label="Business Info"
                    icon={<Store className="h-4 w-4" />}
                    active={tab === "business"}
                    onClick={() => setTab("business")}
                  />
                  <SettingsNavLink
                    label="Tax & GST"
                    icon={<FileText className="h-4 w-4" />}
                    active={tab === "tax"}
                    onClick={() => setTab("tax")}
                  />
                  <SettingsNavLink
                    label="Receipt Customization"
                    icon={<Receipt className="h-4 w-4" />}
                    active={tab === "receipt"}
                    onClick={() => setTab("receipt")}
                  />

                  <NavSectionTitle title="System" />
                  <SettingsNavLink
                    label="Feature Toggles"
                    icon={<SettingsIcon className="h-4 w-4" />}
                    active={tab === "features"}
                    onClick={() => setTab("features")}
                  />
                </nav>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 min-w-0">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 min-h-full flex flex-col">
                  {/* Dynamic Tab Content */}
                  <div className="flex-1">{renderContent()}</div>

                  {/* Save Settings Footer - Only show if not on purely read-only account tab */}
                  {tab !== "account" && (
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                      <Button
                        variant="accent"
                        size="lg"
                        onClick={handleSave}
                        className="min-w-[140px] shadow-md hover:shadow-lg transition-all"
                      >
                        {saved ? "✅ Saved!" : "💾 Save Settings"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
