"use client";

import { Mail, Phone, Receipt, Tag, ShieldCheck } from "lucide-react";

export default function OverviewTab({ branch: b }) {
  if (!b) return null;

  // Derived Insights
  const daysOperational = b.opening_date
    ? Math.floor(
        (new Date() - new Date(b.opening_date)) / (1000 * 60 * 60 * 24),
      )
    : 0;

  const uniqueRoles = b.teamMembers
    ? new Set(b.teamMembers.map((m) => m.role?.name)).size
    : 0;

  const totalPermissions = b.teamMembers
    ? b.teamMembers.reduce(
        (acc, m) => acc + (m.role?.permissions?.length || 0),
        0,
      )
    : 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 ease-spring space-y-5 py-2">
      {/* Profile Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start p-8 rounded-3xl bg-white border border-brand-border/50 shadow-sm hover:shadow-md transition-shadow group">
        {/* Avatar & Basic Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight">
              {b.name}
            </h2>
            {b.code && (
              <span className="text-sm font-bold text-brand-muted bg-brand-light px-2.5 py-0.5 rounded-md border border-brand-border">
                {b.code}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-success/15 text-brand-success border border-brand-success/20">
              {b.status || "Operational"}
            </span>
            {b.branch_type && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-brand-info bg-brand-info/10 border border-brand-info/20">
                <Tag className="h-3.5 w-3.5" />
                {b.branch_type}
              </span>
            )}
            {b.tax_registration && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-brand-muted bg-brand-light border border-brand-border/60">
                <Receipt className="h-3.5 w-3.5" />
                Tax ID: {b.tax_registration}
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 text-sm text-brand-muted font-medium">
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-brand-primary/70" />
              {b.email || "No Email Provided"}
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-brand-border"></div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-brand-info/70" />
              {b.contact || "No Phone Provided"}
            </div>
          </div>
        </div>

        {/* Location Details (Middle) */}
        <div className="md:border-l border-brand-border/60 md:pl-8 md:py-2 w-full md:w-auto">
          <div>
            <p className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1.5">
              Location
            </p>
            <p className="text-sm font-semibold text-brand-dark leading-relaxed">
              {b.address || "No Address Provided"}
              <br />
              {b.city && b.state
                ? `${b.city}, ${b.state}`
                : b.city || b.state || ""}
              <br />
              <span className="text-brand-muted mt-1 inline-block">
                {b.country || "India"}
              </span>
            </p>

            {b.region && (
              <p className="text-xs font-medium text-brand-muted mt-3 pt-3 border-t border-brand-border/60">
                <span className="font-semibold text-brand-dark">Region:</span>{" "}
                {b.region}
              </p>
            )}
          </div>
        </div>

        {/* Tax Info (Right Side) */}
        <div className="md:border-l border-brand-border/60 md:pl-8 md:py-2 w-full md:w-auto">
          <div>
            <p className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Receipt className="h-4 w-4 text-brand-placeholder" />
              Tax Info
            </p>
            <p className="text-sm font-semibold text-brand-dark leading-relaxed">
              {b.tax_jurisdiction || "N/A"}
              <br />
              <span className="text-brand-muted mt-1 inline-block">
                Rate: {b.tax_percentage ? `${b.tax_percentage}%` : "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Key Personnel */}
      {b.teamMembers && b.teamMembers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {b.teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex flex-col p-5 rounded-2xl bg-white border border-brand-border/50 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-info/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-lg shrink-0 group-hover:scale-105 transition-transform">
                  {member.first_name?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-brand-dark truncate">
                    {member.first_name} {member.last_name}
                  </h4>
                  <p className="text-xs text-brand-muted truncate">
                    {member.email}
                  </p>
                </div>
              </div>

              {/* Granular Permissions Display */}
              {member.role?.permissions &&
                member.role.permissions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-2">
                      Access Rights ({member.role.permissions.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-[88px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
                      {member.role.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="text-[9px] font-semibold text-brand-dark bg-brand-light border border-brand-border/60 px-1.5 py-0.5 rounded-sm"
                        >
                          {perm.replace("-", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border/40">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-md">
                  {member.role?.name || "Staff"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-brand-muted flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    {member.role?.permissions?.length || 0} perms
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-success"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-success">
                    {member.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
