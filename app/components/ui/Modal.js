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
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md flex justify-center items-end md:items-center z-50 p-0 md:p-6 animate-in fade-in duration-300">
      {/* Backdrop Catch */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div
        className={cn(
          `bg-white w-full ${sizeClasses} h-[95vh] md:h-auto md:max-h-[90vh] rounded-t-3xl md:rounded-[2rem] md:rounded-b-[2rem] shadow-2xl flex flex-col relative shrink-0 overflow-hidden ring-1 ring-brand-border animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 ease-out`,
          className
        )}
      >
        <div className="flex items-start justify-between px-6 md:px-8 py-5 md:py-6 border-b border-brand-border/60 bg-gradient-to-b from-brand-bg to-white relative overflow-hidden shrink-0">
          <div className="relative z-10 flex-1">
            {title && <h2 className="text-xl md:text-2xl font-extrabold text-brand-dark tracking-tight">{title}</h2>}
            {description && <p className="text-xs md:text-sm text-brand-muted font-medium mt-1.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="relative z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-surface-2 hover:bg-brand-border/70 flex items-center justify-center text-brand-muted hover:text-brand-dark transition-all shadow-sm hover:shadow"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
}

export default Modal;
