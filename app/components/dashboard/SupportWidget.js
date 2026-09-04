import Card, { CardHeader, CardTitle } from "../ui/Card";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardAnalytics } from "../../store/slices/analyticsSlice";
import { PhoneCall, FileText } from "lucide-react";

export default function SupportWidget() {
  const [timeRange, setTimeRange] = useState("");
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-6 h-full">
      <Card padding="p-6" className="text-center flex flex-col items-center justify-center bg-gradient-to-br from-white to-brand-light">
        <div className="text-base text-brand-dark font-bold mb-2">Need Quick Help 24/7?</div>
        <div className="text-xs text-brand-muted font-medium mb-5">Enter your mobile number and we can contact you soon!</div>
        <button className="text-sm px-6 py-2.5 bg-white text-brand-dark border border-brand-light rounded-xl font-bold mb-4 shadow-sm hover:bg-brand-light transition-colors">
          Request a Call Back
        </button>
        <div className="flex items-center gap-3 bg-white border border-brand-light px-4 py-2.5 rounded-xl shadow-sm w-full justify-center">
          <div className="bg-brand-primaryLight/50 p-2 rounded-full flex-shrink-0">
            <PhoneCall size={16} className="text-brand-primary" />
          </div>
          <div className="text-left text-[11px] text-brand-muted font-medium leading-relaxed">
            If you have any queries contact for Support<br />
            <strong className="text-brand-dark text-sm font-bold">07969 223344</strong>
          </div>
        </div>
      </Card>
      
      <Card padding="md">
        <CardHeader className="flex flex-row justify-between items-center mb-4">
          <CardTitle>Reconciliation</CardTitle>
          <select 
            value={timeRange}
            onChange={(e) => {
              const range = e.target.value;
              setTimeRange(range);
              dispatch(fetchDashboardAnalytics({ timeRange: range }));
            }}
            className="bg-brand-light text-xs px-2 h-7 border border-brand-light rounded-md text-brand-dark outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </CardHeader>
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <FileText size={48} className="text-brand-light mb-4" strokeWidth={1.5} />
          <div className="text-sm max-w-[200px] text-brand-muted font-medium leading-relaxed">
            You Have Not Integrated POS With Zomato And Swiggy.
          </div>
        </div>
      </Card>
    </div>
  );
}
