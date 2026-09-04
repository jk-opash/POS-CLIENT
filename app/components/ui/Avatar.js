import { getInitials } from '../../lib/utils';
import { cn } from '../../lib/utils';
import Image from 'next/image';

const sizeStyles = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function Avatar({ src, alt, name, size = 'md', className }) {
  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-light font-bold text-brand-muted',
        sizeStyles[size],
        className
      )}
    >
      {src ? (
        <Image src={src} alt={alt || name || 'Avatar'} fill className="object-cover" />
      ) : (
        <span>{name ? getInitials(name) : '?'}</span>
      )}
    </div>
  );
}
