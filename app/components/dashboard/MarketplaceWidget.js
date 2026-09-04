import Card from "../ui/Card";
import { Settings, Users, LineChart, ChevronRight } from "lucide-react";

export default function MarketplaceWidget() {
  return (
    <Card padding="p-0">
      <div className="px-5 py-4 border-b border-brand-light flex justify-between items-center bg-white">
        <div className="text-brand-primary font-bold text-xs tracking-wider">MARKETPLACE</div>
      </div>
      <div className="p-6 bg-white">
        <p className="text-sm text-brand-muted mb-5 leading-relaxed font-medium">
          Equip your POS with 50+ specialised tools & integrations to improve operations & increase productivity.
        </p>
        <button className="text-xs px-4 py-2 bg-transparent text-brand-primary border border-brand-primary rounded-lg font-bold hover:bg-brand-primaryLight transition-colors">
          Explore Now &rarr;
        </button>
      </div>
      <div className="border-t border-brand-light bg-white">
        {[
          { icon: Settings, title: "Easy Operations", sub: "13 Services", color: "text-brand-success" },
          { icon: Users, title: "Customer Acquisition", sub: "2 Services", color: "text-brand-info" },
          { icon: LineChart, title: "Restaurant Marketing", sub: "2 Services", color: "text-brand-warning" },
        ].map((item, i) => (
          <div key={i} className={`px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-brand-light transition-colors ${i !== 2 ? 'border-b border-brand-light' : ''}`}>
            <div className={`w-10 h-10 rounded-xl bg-brand-light border border-brand-light flex items-center justify-center ${item.color}`}>
              <item.icon size={18} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div className="text-sm text-brand-dark font-bold mb-0.5">{item.title}</div>
              <div className="text-xs text-brand-muted font-medium">{item.sub}</div>
            </div>
            <ChevronRight size={16} className="text-brand-muted" />
          </div>
        ))}
      </div>
    </Card>
  );
}
