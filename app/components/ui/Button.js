'use client';

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary: 'bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-purple)] text-white hover:from-[var(--color-brand-primaryDark)] hover:to-violet-600 shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-hover)] border-transparent',
  secondary: 'bg-white text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-light)] border border-[var(--color-brand-border)] shadow-sm hover:shadow-[0_4px_14px_0_rgba(0,0,0,0.05)]',
  outline: 'bg-transparent text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/20 hover:bg-[var(--color-brand-primary)]/5 hover:border-[var(--color-brand-primary)]/40',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-[var(--color-brand-dark)] border border-transparent',
  danger: 'bg-gradient-to-r from-red-500 to-[var(--color-brand-danger)] text-white shadow-[var(--shadow-danger)] hover:shadow-[var(--shadow-danger-hover)] border-transparent',
  accent: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)]',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 flex items-center justify-center',
};

const Button = forwardRef(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-dark)]/50 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          variantStyles[variant] || variantStyles.primary,
          sizeStyles[size] || sizeStyles.md,
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
