'use client';

import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export function Modal({ isOpen, onClose, title, description, children, className, size = 'lg' }) {
  const overlayRef = useRef(null);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  }[size] || 'max-w-lg';

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div
        className={cn(
          `relative z-10 w-full ${sizeClasses} scale-100 transform rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-0 shadow-[var(--shadow-modal)] transition-all overflow-hidden flex flex-col`,
          className
        )}
      >
        <div className="flex items-start justify-between p-6 pb-4 border-b border-white/20 bg-white/40 backdrop-blur-md">
          <div>
            {title && <h2 className="text-xl font-bold text-brand-dark">{title}</h2>}
            {description && <p className="mt-1 text-sm text-brand-muted">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-brand-placeholder transition-colors hover:bg-white hover:text-brand-dark shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 pt-4">
          {children}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
}

export default Modal;
