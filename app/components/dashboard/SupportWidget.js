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
      <Card padding="p-6" className="text-center flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-50">
        <div className="text-base text-slate-800 font-bold mb-2">Need Quick Help 24/7?</div>
        <div className="text-xs text-slate-500 font-medium mb-5">Enter your mobile number and we can contact you soon!</div>
        <button className="text-sm px-6 py-2.5 bg-white text-slate-800 border border-slate-200 rounded-xl font-bold mb-4 shadow-sm hover:bg-slate-50 transition-colors">
          Request a Call Back
        </button>
        <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2.5 rounded-xl shadow-sm w-full justify-center">
          <div className="bg-blue-50/50 p-2 rounded-full flex-shrink-0">
            <PhoneCall size={16} className="text-blue-500" />
          </div>
          <div className="text-left text-[11px] text-slate-500 font-medium leading-relaxed">
            If you have any queries contact for Support<br />
            <strong className="text-slate-800 text-sm font-bold">07969 223344</strong>
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
            className="bg-slate-50 text-xs px-2 h-7 border border-slate-200 rounded-md text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </CardHeader>
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <FileText size={48} className="text-slate-200 mb-4" strokeWidth={1.5} />
          <div className="text-sm max-w-[200px] text-slate-500 font-medium leading-relaxed">
            You Have Not Integrated POS With Zomato And Swiggy.
          </div>
        </div>
      </Card>
    </div>
  );
}
