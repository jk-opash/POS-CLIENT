import { cn } from '../../lib/utils';

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, className, hover, padding = 'md' }) {
  return (
    <div
      className={cn(
        'bg-white border border-brand-border rounded-2xl shadow-sm',
        hover && 'transition-all duration-300 ease-spring hover:shadow-md hover:border-brand-borderHover hover:-translate-y-0.5',
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-sm font-bold text-brand-dark', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }) {
  return (
    <p className={cn('text-xs text-brand-muted mt-0.5', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={cn('w-full', className)}>
      {children}
    </div>
  );
}

// Make Card the default export as well for easier importing
export default Card;
