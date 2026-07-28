export default function StatCard({ label, value, subtext, delta, isUp, icon, isGrey }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-semibold text-slate-500">{label}</span>
        {icon && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isGrey ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-500'}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
      {subtext && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-auto">
          <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-slate-100 text-[9px] text-slate-500 font-bold">i</span>
          {subtext}
        </div>
      )}
    </div>
  );
}
