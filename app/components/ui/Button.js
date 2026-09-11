'use client';

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const variantStyles = {
  primary: 'bg-brand-primary text-white hover:bg-brand-primaryDark shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/40 hover:-translate-y-0.5 border-transparent active:translate-y-0',
  secondary: 'bg-white text-brand-dark hover:bg-surface-2 border border-brand-border shadow-sm hover:shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] active:translate-y-0 hover:-translate-y-0.5',
  surface: 'bg-surface-2 text-brand-dark hover:bg-brand-light border border-transparent shadow-sm active:translate-y-0 hover:-translate-y-0.5',
  outline: 'bg-transparent text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/5 hover:border-brand-primary/40',
  ghost: 'bg-transparent text-brand-muted hover:bg-surface-2 hover:text-brand-dark border border-transparent',
  danger: 'bg-brand-danger text-white hover:bg-red-600 shadow-danger hover:shadow-danger-hover border-transparent',
  accent: 'bg-accent text-white hover:bg-accent-light',
};

const sizeStyles = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-8 text-base',
  icon: 'h-11 w-11 flex items-center justify-center',
};

const Button = forwardRef(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 disabled:hover:translate-y-0 cursor-pointer',
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
