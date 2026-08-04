import { cn } from "../../lib/utils";

export default function StatCard({ label, value, subtext, icon, isGrey, className }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-brand-border/80 bg-white/50 backdrop-blur-md p-5 flex flex-col',
        'transition-all duration-300 ease-spring hover:shadow-glass-hover hover:-translate-y-1 hover:bg-white',
        'group cursor-default relative overflow-hidden',
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-primary/5 to-transparent rounded-bl-full -z-10 transition-transform duration-500 ease-bounce-in group-hover:scale-110" />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isGrey ? 'bg-slate-100 text-brand-muted' : 'bg-brand-light text-brand-primary'}`}>
              {icon}
            </div>
          )}
          <p className="text-sm font-bold text-brand-dark">{label}</p>
        </div>
      </div>

      <div className="flex items-end justify-between mt-auto">
        <p className="text-2xl font-bold text-brand-dark">{value}</p>
      </div>

      {subtext && (
        <div className="mt-2 flex items-center gap-1.5">
           <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-slate-100 text-[9px] text-brand-muted font-bold">i</span>
           <span className="text-xs font-semibold text-brand-muted">{subtext}</span>
        </div>
      )}
    </div>
  );
}
