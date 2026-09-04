import React from 'react';

export default function PosAdminBadge({ variant = "default", children, dot, ...props }) {
  const variantStyles = {
    default: "bg-brand-light/80 text-brand-primary border-brand-primary/20",
    success: "bg-brand-successLight/80 text-brand-success border-brand-success/20",
    warning: "bg-brand-warningLight/80 text-brand-warning border-brand-warning/20",
    danger: "bg-brand-dangerLight/80 text-brand-danger border-brand-danger/20",
    info: "bg-brand-info/10 text-brand-info border-brand-info/20",
    purple: "bg-brand-purple/10 text-brand-purple border-brand-purple/20",
    orange: "bg-orange-50/80 text-orange-700 border-orange-200",
    muted: "bg-brand-bg/80 text-brand-dark border-brand-border",
  };

  const dotColors = {
    default: "bg-brand-primary",
    success: "bg-brand-success",
    warning: "bg-brand-warning",
    danger: "bg-brand-danger",
    info: "bg-brand-info",
    purple: "bg-brand-purple",
    orange: "bg-orange-500",
    muted: "bg-brand-muted/70",
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
