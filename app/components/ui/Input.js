import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(
  ({ className, label, error, icon, iconRight, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-[var(--color-brand-muted)]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-brand-placeholder)]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full rounded-xl border border-[var(--color-brand-border)] bg-[var(--color-brand-light)] px-4 py-3 text-sm text-[var(--color-brand-dark)]',
              'placeholder:text-[var(--color-brand-placeholder)]',
              'transition-all duration-300 ease-in-out shadow-[var(--shadow-inset-subtle)]',
              'hover:bg-white hover:border-[var(--color-brand-borderHover)]',
              'focus:outline-none focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary)]/10 focus:bg-white focus:shadow-none',
              'disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:hover:border-[var(--color-brand-border)]',
              error && 'border-[var(--color-brand-danger)] focus:border-[var(--color-brand-danger)] focus:ring-[var(--color-brand-danger)]/20 bg-red-50/30',
              icon && 'pl-9',
              iconRight && 'pr-9',
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-brand-placeholder)]">
              {iconRight}
            </span>
          )}
        </div>
        {error && <p className="text-xs font-medium text-[var(--color-brand-danger)]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export default Input;
