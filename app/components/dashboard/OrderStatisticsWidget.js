import Card, { CardHeader, CardTitle } from "../ui/Card";
import { useSelector } from "react-redux";
import { CheckCircle2, XCircle, Gift, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

export default function OrderStatisticsWidget() {
  const { stats } = useSelector((state) => state.analytics);
  const successOrders = stats?.successOrders || 0;
  const cancelledOrders = stats?.cancelledOrders || 0;
  const complimentaryOrders = stats?.complimentaryOrders || 0;
  const averageTableTime = stats?.averageTableTime || 0;

  const data = [
    {
      label: "Success Orders",
      value: successOrders,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      shadowColor: "hover:shadow-emerald-100/50",
    },
    {
      label: "Cancelled Orders",
      value: cancelledOrders,
      icon: XCircle,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
      shadowColor: "hover:shadow-rose-100/50",
    },
    {
      label: "Complimentary Orders",
      value: complimentaryOrders,
      icon: Gift,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
      shadowColor: "hover:shadow-indigo-100/50",
    },
    {
      label: "Table Turn Around",
      value: averageTableTime,
      suffix: "mins",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      shadowColor: "hover:shadow-amber-100/50",
    },
  ];

  return (
    <Card padding="md" className="h-full flex flex-col bg-white">
      <CardHeader className="flex flex-row justify-between items-center mb-6">
        <CardTitle>Order Statistics</CardTitle>
      </CardHeader>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        {data.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={cn(
                "relative group flex flex-col justify-between p-4 rounded-2xl border transition-all duration-300 cursor-default",
                item.bgColor,
                item.borderColor,
                "hover:-translate-y-1 hover:shadow-xl",
                item.shadowColor
              )}
            >
              {/* Decorative background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-2xl pointer-events-none" />
              
              <div className="relative flex items-start justify-between mb-6">
                <div className={cn("p-2.5 rounded-xl bg-white shadow-sm ring-1 ring-black/5", item.color)}>
                  <Icon size={22} strokeWidth={2.5} />
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-baseline gap-1.5 mb-1.5">
                  <span className="text-3xl font-black text-slate-800 tracking-tight">
                    {item.value}
                  </span>
                  {item.suffix && (
                    <span className="text-sm font-bold text-slate-500">
                      {item.suffix}
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
