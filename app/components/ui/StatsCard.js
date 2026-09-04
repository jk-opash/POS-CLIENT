import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatsCard({
  title,
  value,
  change,
  changeLabel = 'From Last Month',
  trend,
  icon,
  className,
}) {
  const displayChange = change ?? trend?.value;
  const displayChangeLabel = trend?.label ?? changeLabel;
  const isPositive = trend !== undefined ? trend.positive : (displayChange !== undefined && displayChange >= 0);

  return (
    <div
      className={cn(
        'rounded-2xl border border-brand-border/80 bg-white/50 backdrop-blur-md p-5 flex flex-col',
        'transition-all duration-300 ease-in-out hover:shadow-glass-hover hover:-translate-y-1 hover:bg-white',
        'group cursor-default relative overflow-hidden',
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-primary/5 to-transparent rounded-bl-full -z-10 transition-transform duration-500 ease-in-out group-hover:scale-110" />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light">
            {icon}
          </div>
          <p className="text-sm font-bold text-brand-dark">{title}</p>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-brand-dark">{value}</p>

        {displayChange !== undefined && (
          <div className="flex flex-col items-end gap-1">
            <div
              className={cn(
                'px-2 py-0.5 rounded flex items-center gap-1',
                isPositive ? 'bg-brand-successLight' : 'bg-brand-dangerLight'
              )}
            >
              <span
                className={cn(
                  'text-[10px] font-bold',
                  isPositive ? 'text-brand-success' : 'text-brand-danger'
                )}
              >
                {displayChange}% {isPositive ? '↗' : '↘'}
              </span>
            </div>
            <span className="text-[9px] text-brand-placeholder">{displayChangeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
