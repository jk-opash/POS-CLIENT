import { cn } from '../../lib/utils';

export function EmptyState({ icon, title, message, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 backdrop-blur-sm", className)}>
      {icon && (
        <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
          <div className="text-indigo-500 [&>svg]:h-6 [&>svg]:w-6">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {message && <p className="text-sm text-slate-500 mt-1 max-w-sm">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
