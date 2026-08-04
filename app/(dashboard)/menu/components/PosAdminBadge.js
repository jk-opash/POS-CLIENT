import React from 'react';

export default function PosAdminBadge({ variant = "default", children, dot, ...props }) {
  const variantStyles = {
    default: "bg-indigo-50/80 text-indigo-700 border-indigo-200",
    success: "bg-emerald-50/80 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50/80 text-amber-700 border-amber-200",
    danger: "bg-red-50/80 text-red-700 border-red-200",
    info: "bg-blue-50/80 text-blue-700 border-blue-200",
    purple: "bg-violet-50/80 text-violet-700 border-violet-200",
    muted: "bg-slate-50/80 text-slate-700 border-slate-200",
  };

  const dotColors = {
    default: "bg-indigo-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
    purple: "bg-violet-500",
    muted: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${variantStyles[variant] || variantStyles.default}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColors[variant] || dotColors.default}`}
        />
      )}
      {children}
    </span>
  );
}
