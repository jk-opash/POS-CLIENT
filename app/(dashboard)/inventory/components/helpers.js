export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function getBadgeStyle(status) {
  switch (status) {
    case "Normal":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "Low":
      return "bg-amber-100 text-amber-700 border border-amber-200";
    case "Critical":
      return "bg-orange-100 text-orange-700 border border-orange-200";
    case "Out of Stock":
      return "bg-red-100 text-red-700 border border-red-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
}
