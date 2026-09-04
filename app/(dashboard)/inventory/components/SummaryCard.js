import React from "react";

export default function SummaryCard({ title, value, sub, icon, iconBg, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-brand-border/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-bold uppercase tracking-wider text-brand-muted/70 mb-1">
          {title}
        </div>
        <div className={`text-2xl font-black ${color}`}>{value}</div>
        {sub && <div className="text-xs text-brand-muted/70 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}
