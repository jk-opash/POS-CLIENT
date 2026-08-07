import Card from "../ui/Card";
import { RefreshCcw } from "lucide-react";

export default function RevenueLeakageWidget() {
  return (
    <Card
      title="Revenue Leakage"
      action={
        <div className="flex items-center gap-2">
          <select className="bg-slate-50 text-xs px-2 h-7 border border-slate-200 rounded-md text-slate-700 outline-none focus:ring-2 focus:ring-blue-100">
            <option>Today</option>
          </select>
          <button className="bg-slate-50 border border-slate-200 text-slate-500 rounded-md w-7 h-7 flex items-center justify-center hover:bg-slate-100 transition-colors">
            <RefreshCcw size={14} />
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-3 gap-y-8 gap-x-6 py-2">
        {[
          { val: "24", label: "Bills Modified" },
          { val: "8", label: "Bills Re-Printed" },
          { val: "₹ -450", label: "Waived Off", color: "text-rose-500" },
          { val: "12", label: "KOTs Cancelled" },
          { val: "4", label: "Modified KOTs" },
          { val: "3", label: "Not Used In Bills" },
        ].map((item, i) => (
          <div key={i} className="border-l-2 border-slate-100 pl-3">
            <div className={`text-[22px] font-bold tracking-tight mb-0.5 ${item.color || 'text-slate-800'}`}>{item.val}</div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-tight">{item.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
