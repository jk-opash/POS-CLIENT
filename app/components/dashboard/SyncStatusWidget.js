import Card from "../ui/Card";
import { ShieldCheck, Printer, Laptop } from "lucide-react";

export default function SyncStatusWidget() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="grid grid-cols-2 gap-6">
        <Card padding="p-4" className="flex flex-row items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-brand-light border border-brand-light flex items-center justify-center text-brand-success">
            <Printer size={22} strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-sm text-brand-dark font-bold">Pos Sync On</div>
            <div className="text-xs text-brand-muted font-medium mt-0.5">Today | 4:14 pm</div>
          </div>
        </Card>
        <Card padding="p-4" className="flex flex-row items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-brand-light border border-brand-light flex items-center justify-center text-brand-info">
            <Laptop size={22} strokeWidth={1.5} />
          </div>
          <div>
            <div className="text-sm text-brand-dark font-bold">Order Sync On</div>
            <div className="text-xs text-brand-muted font-medium mt-0.5">Today | 4:09 pm</div>
          </div>
        </Card>
      </div>
      
      <Card padding="p-5" className="flex flex-row items-center justify-between flex-1 bg-gradient-to-r from-brand-primaryLight/50 to-transparent border-brand-primary/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-primaryLight/50 flex items-center justify-center text-brand-primary">
            <ShieldCheck size={24} strokeWidth={2} />
          </div>
          <span className="text-sm text-brand-muted leading-snug font-medium">
            Protect your account with <br /><strong className="text-brand-dark font-bold">Two Step Authentication.</strong>
          </span>
        </div>
        <button className="text-xs px-4 py-2 bg-brand-primary text-white rounded-lg font-bold shadow-sm shadow-brand-primary/30 hover:bg-brand-primaryDark hover:shadow transition-all">
          Enable Now
        </button>
      </Card>
    </div>
  );
}
