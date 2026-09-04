import { cn } from '../../lib/utils';

const variantStyles = {
  default:  'bg-brand-primaryLight/80 text-brand-primary border-brand-primaryLight shadow-inset-white',
  success:  'bg-brand-successLight/80 text-brand-success border-brand-successLight shadow-inset-white',
  warning:  'bg-brand-warningLight/80 text-brand-warning border-brand-warningLight shadow-inset-white',
  danger:   'bg-brand-dangerLight/80 text-brand-danger border-brand-dangerLight shadow-inset-white',
  info:     'bg-brand-primaryLight/80 text-brand-primary border-brand-primaryLight shadow-inset-white',
  purple:   'bg-brand-purple/80 text-brand-purple border-brand-purple shadow-inset-white',
  muted:    'bg-brand-light/80 text-brand-dark border-brand-light shadow-inset-white',
};

const dotColors = {
  default: 'bg-brand-primaryDark',
  success: 'bg-brand-success',
  warning: 'bg-brand-warning',
  danger:  'bg-brand-danger',
  info:    'bg-brand-info',
  purple:  'bg-brand-purple',
  muted:   'bg-brand-placeholder',
};

export default function Badge({ variant = 'default', children, className, dot, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
