import { MessageCircle, PhoneCall } from "lucide-react";
import Card from "../ui/Card";

export default function ContactAMWidget() {
  return (
    <Card padding="p-6" className="bg-gradient-to-r from-blue-50/50 to-white border border-blue-100 shadow-sm relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60 -mr-16 -mt-16 pointer-events-none"></div>
      
      <div className="flex gap-5 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center w-[88px] h-[88px] flex flex-col justify-center border border-blue-100 shadow-sm shrink-0">
          <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Outlet ID</div>
          <div className="text-base font-black text-slate-800 mt-1">112011</div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-2xl leading-none">🧑‍💼</span>
            <span className="text-[15px] text-slate-800 font-bold tracking-tight">Arpit Shah</span>
          </div>
          <div className="text-xs text-slate-500 mb-4 leading-relaxed font-medium pr-4">
            is your Account Manager (POC). Feel free to contact him between <strong className="text-slate-600">10 AM to 7 PM</strong>.
          </div>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 text-xs py-2 bg-white text-slate-700 border border-slate-200 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-colors">
              <MessageCircle size={14} className="text-[#25D366]" /> WhatsApp
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 text-xs py-2 bg-white text-slate-700 border border-slate-200 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-colors">
              <PhoneCall size={14} className="text-blue-500" /> Call
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
