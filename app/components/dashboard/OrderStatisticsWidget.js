import Card, { CardHeader, CardTitle } from "../ui/Card";
import { RefreshCcw } from "lucide-react";
import { useSelector } from "react-redux";

export default function OrderStatisticsWidget() {
  const { stats } = useSelector((state) => state.analytics);
  const successOrders = stats?.successOrders || 0;
  const cancelledOrders = stats?.cancelledOrders || 0;
  const complimentaryOrders = stats?.complimentaryOrders || 0;
  const averageTableTime = stats?.averageTableTime || 0;

  return (
    <Card padding="md">
      <CardHeader className="flex flex-row justify-between items-center mb-6">
        <CardTitle>Order Statistics</CardTitle>
        <button className="bg-white border border-brand-border text-brand-muted rounded-lg w-8 h-8 flex items-center justify-center hover:bg-brand-light hover:text-brand-dark transition-colors shadow-sm">
          <RefreshCcw size={14} />
        </button>
      </CardHeader>
      <div className="grid grid-cols-2 gap-8 py-2">
        <div className="border-l-[3px] border-brand-success pl-4">
          <div className="text-[28px] text-brand-dark font-black leading-tight tracking-tight mb-1">{successOrders}</div>
          <div className="text-[11px] text-brand-muted font-bold uppercase tracking-wider">Success Order</div>
        </div>
        <div className="border-l-[3px] border-brand-danger pl-4">
          <div className="text-[28px] text-brand-dark font-black leading-tight tracking-tight mb-1">{cancelledOrders}</div>
          <div className="text-[11px] text-brand-muted font-bold uppercase tracking-wider">Cancelled Order</div>
        </div>
        <div className="border-l-[3px] border-brand-primary pl-4">
          <div className="text-[28px] text-brand-dark font-black leading-tight tracking-tight mb-1">{complimentaryOrders}</div>
          <div className="text-[11px] text-brand-muted font-bold uppercase tracking-wider">Complimentary Order</div>
        </div>
        <div className="border-l-[3px] border-brand-warning pl-4">
          <div className="text-[28px] text-brand-dark font-black leading-tight tracking-tight mb-1">{averageTableTime} <span className="text-base text-brand-placeholder font-medium">mins</span></div>
          <div className="text-[11px] text-brand-muted font-bold uppercase tracking-wider">Table Turn Around Time</div>
        </div>
      </div>
    </Card>
  );
}
