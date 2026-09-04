import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(
  ({ className, label, error, icon, iconRight, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-brand-muted">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-placeholder">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full rounded-xl border border-brand-border bg-brand-light px-4 py-3 text-sm text-brand-dark',
              'placeholder:text-brand-placeholder',
              'transition-all duration-300 ease-in-out shadow-inset-subtle',
              'hover:bg-white hover:border-brand-borderHover',
              'focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:bg-white focus:shadow-none',
              'disabled:opacity-50 disabled:bg-brand-light disabled:cursor-not-allowed disabled:hover:border-brand-border',
              error && 'border-brand-danger focus:border-brand-danger focus:ring-brand-danger/20 bg-brand-dangerLight/30',
              icon && 'pl-9',
              iconRight && 'pr-9',
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-placeholder">
              {iconRight}
            </span>
          )}
        </div>
        {error && <p className="text-xs font-medium text-brand-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export default Input;
