export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function getBadgeStyle(status) {
  switch (status) {
    case "Normal":
      return "bg-brand-successLight text-brand-success border border-brand-success/20";
    case "Low":
      return "bg-brand-warningLight text-brand-warning border border-brand-warning/20";
    case "Critical":
      return "bg-orange-100 text-orange-700 border border-orange-200";
    case "Out of Stock":
      return "bg-brand-dangerLight text-brand-danger border border-brand-danger/20";
    default:
      return "bg-brand-light text-brand-dark border border-brand-border";
  }
}
