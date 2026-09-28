import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './Button';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: '400px' | '480px' | '560px';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = '480px',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClass = {
    '400px': 'md:max-w-[400px]',
    '480px': 'md:max-w-[480px]',
    '560px': 'md:max-w-[560px]',
  }[width];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[1px] transition-opacity"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={drawerRef}
        className={`w-full ${widthClass} h-full bg-white flex flex-col justify-between shadow-[0_8px_24px_rgba(14,23,38,0.12)] border-l border-[#E4E7EC] transform transition-transform duration-150 ease-out`}
      >
        {/* Header */}
        <div className="h-14 px-5 border-b border-[#E4E7EC] flex items-center justify-between shrink-0 bg-white">
          <div>
            <h2 className="text-base font-semibold text-[#0E1726]">{title}</h2>
            {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
          </div>
          <IconButton aria-label="Close drawer" onClick={onClose} size="sm">
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 px-5 border-t border-[#E4E7EC] bg-[#F7F8FA] flex items-center justify-end gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
