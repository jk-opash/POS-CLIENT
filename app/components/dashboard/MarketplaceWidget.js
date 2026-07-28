import Card from "../ui/Card";
import { Settings, Users, LineChart, ChevronRight } from "lucide-react";

export default function MarketplaceWidget() {
  return (
    <Card padding="p-0">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
        <div className="text-blue-600 font-bold text-xs tracking-wider">MARKETPLACE</div>
      </div>
      <div className="p-6 bg-white">
        <p className="text-sm text-slate-500 mb-5 leading-relaxed font-medium">
          Equip your POS with 50+ specialised tools & integrations to improve operations & increase productivity.
        </p>
        <button className="text-xs px-4 py-2 bg-transparent text-blue-600 border border-blue-500 rounded-lg font-bold hover:bg-blue-50 transition-colors">
          Explore Now &rarr;
        </button>
      </div>
      <div className="border-t border-slate-100 bg-white">
        {[
          { icon: Settings, title: "Easy Operations", sub: "13 Services", color: "text-emerald-500" },
          { icon: Users, title: "Customer Acquisition", sub: "2 Services", color: "text-sky-500" },
          { icon: LineChart, title: "Restaurant Marketing", sub: "2 Services", color: "text-amber-500" },
        ].map((item, i) => (
          <div key={i} className={`px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${i !== 2 ? 'border-b border-slate-50' : ''}`}>
            <div className={`w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center ${item.color}`}>
              <item.icon size={18} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div className="text-sm text-slate-800 font-bold mb-0.5">{item.title}</div>
              <div className="text-xs text-slate-500 font-medium">{item.sub}</div>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </div>
        ))}
      </div>
    </Card>
  );
}
