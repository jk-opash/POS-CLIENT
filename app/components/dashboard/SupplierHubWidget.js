import Card from "../ui/Card";
import { Search, Plane, Package, Printer, GlassWater, CupSoda, Gift } from "lucide-react";

export default function SupplierHubWidget() {
  return (
    <Card padding="p-0">
      <div className="px-5 py-4 flex justify-between items-center border-b border-brand-light bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-primaryLight/50 text-brand-primary flex items-center justify-center font-black text-lg">
            H
          </div>
          <span className="font-bold text-brand-dark text-sm">
            Supplier Hub
          </span>
        </div>
        <div className="text-xs text-brand-muted flex items-center gap-1 font-medium">
          📍 Bengaluru, Karnataka
        </div>
      </div>

      <div className="p-5 bg-white">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-brand-muted" />
          <input
            className="w-full pl-9 pr-12 py-2 bg-brand-light border border-brand-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-shadow placeholder:text-brand-muted text-brand-dark"
            placeholder="Get the price for Grocery and Pantry"
          />
          <button className="absolute right-1 top-1 bottom-1 px-3 bg-brand-primaryLight/50 hover:bg-brand-primaryLight text-brand-primary rounded-md transition-colors flex items-center justify-center">
            <Plane size={16} />
          </button>
        </div>
        <div className="text-xs text-brand-muted mt-2 font-medium">
          Get business essentials at competitive prices.
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 px-5 pb-5 text-center bg-white">
        {[
          { icon: Package, label: "Container" },
          { icon: Printer, label: "Printing" },
          { icon: GlassWater, label: "Glasses" },
          { icon: CupSoda, label: "Drinks" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
            <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center text-brand-muted border border-brand-light group-hover:border-brand-primary/30 group-hover:bg-brand-primaryLight/50 group-hover:text-brand-primary transition-colors">
              <item.icon size={20} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] text-brand-dark font-semibold group-hover:text-brand-primary transition-colors">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 bg-brand-light border-t border-brand-light flex gap-3 overflow-x-auto">
        <div className="writing-vertical-rl rotate-180 text-brand-primary font-bold text-xs flex items-center tracking-wider">
          OFFERS
        </div>
        {["Pizza packing...", "Tofu", "Social Media..."].map((offer, i) => (
          <div key={i} className="bg-white border border-brand-light rounded-xl p-3 min-w-[120px] text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <Gift size={20} className="text-brand-primary mx-auto mb-2" />
            <div className="text-xs text-brand-dark font-semibold mb-2 truncate">
              {offer}
            </div>
            <div className="inline-block bg-brand-primaryLight/50 text-brand-primary text-[10px] font-bold px-2 py-1 rounded">
              20% Off
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
