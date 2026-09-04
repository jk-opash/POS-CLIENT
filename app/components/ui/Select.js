'use client';

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(
  ({ className, label, error, options, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-brand-muted">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full appearance-none rounded-xl border border-brand-border bg-brand-light px-4 py-3 pr-10 text-sm text-brand-dark',
              'transition-all duration-300 ease-in-out shadow-inset-subtle',
              'hover:bg-white hover:border-brand-borderHover',
              'focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:shadow-none',
              'disabled:opacity-50 disabled:bg-brand-light disabled:cursor-not-allowed disabled:hover:border-brand-border',
              error && 'border-brand-danger focus:border-brand-danger focus:ring-brand-danger/20 bg-brand-dangerLight/30',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-brand-placeholder">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="text-xs font-medium text-brand-danger">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export default Select;
