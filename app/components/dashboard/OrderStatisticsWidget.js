import Card from "../ui/Card";
import { RefreshCcw } from "lucide-react";

export default function OrderStatisticsWidget() {
  return (
    <Card
      title="Order Statistics"
      action={
        <button className="bg-slate-50 border border-slate-200 text-slate-500 rounded-md w-7 h-7 flex items-center justify-center hover:bg-slate-100 transition-colors">
          <RefreshCcw size={14} />
        </button>
      }
    >
      <div className="grid grid-cols-2 gap-8 py-2">
        <div className="border-l-[3px] border-emerald-400 pl-4">
          <div className="text-[28px] text-slate-800 font-bold leading-tight tracking-tight mb-1">128</div>
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Success Order</div>
        </div>
        <div className="border-l-[3px] border-rose-400 pl-4">
          <div className="text-[28px] text-slate-800 font-bold leading-tight tracking-tight mb-1">12</div>
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Cancelled Order</div>
        </div>
        <div className="border-l-[3px] border-sky-400 pl-4">
          <div className="text-[28px] text-slate-800 font-bold leading-tight tracking-tight mb-1">2</div>
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Complimentary Order</div>
        </div>
        <div className="border-l-[3px] border-amber-400 pl-4">
          <div className="text-[28px] text-slate-800 font-bold leading-tight tracking-tight mb-1">18.5 <span className="text-base text-slate-400 font-medium">mins</span></div>
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Table Turn Around Time</div>
        </div>
      </div>
    </Card>
  );
}
