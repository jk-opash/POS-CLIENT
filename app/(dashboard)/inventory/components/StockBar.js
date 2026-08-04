import React from "react";

export default function StockBar({ current, reorder }) {
  const pct = Math.min(100, (current / Math.max(reorder * 3, 1)) * 100);
  const color =
    current <= 0
      ? "#f43f5e"
      : current <= reorder * 0.5
        ? "#f97316"
        : current <= reorder
          ? "#f59e0b"
          : "#10b981";
  return (
    <div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          style={{ width: `${pct}%`, background: color }}
          className="h-full rounded-full transition-all duration-500"
        />
      </div>
    </div>
  );
}
