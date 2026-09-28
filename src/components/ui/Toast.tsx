import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  undoAction?: () => void;
  undoLabel?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeouts = useRef<Record<string, NodeJS.Timeout>>({});

  const dismissToast = useCallback((id: string) => {
    if (timeouts.current[id]) {
      clearTimeout(timeouts.current[id]);
      delete timeouts.current[id];
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = 't-' + Date.now() + Math.random().toString(36).substr(2, 4);
      const duration = toast.duration ?? (toast.undoAction ? 6000 : 4000);

      const newItem: ToastItem = { ...toast, id };
      setToasts((prev) => [...prev, newItem]);

      timeouts.current[id] = setTimeout(() => {
        dismissToast(id);
      }, duration);

      return id;
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-[#0E1726] text-white rounded-[6px] shadow-[0_8px_24px_rgba(14,23,38,0.2)] text-sm border border-[#334155] animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            <div className="flex items-center gap-2.5">
              {t.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-[#FDA29B] shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#ABEFC6] shrink-0" />
              )}
              <span className="leading-snug">{t.message}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {t.undoAction && (
                <button
                  type="button"
                  onClick={() => {
                    t.undoAction?.();
                    dismissToast(t.id);
                  }}
                  className="px-2 py-0.5 text-xs font-semibold text-[#D1E8E2] hover:text-white bg-[#0D5C4D] hover:bg-[#094539] rounded-[4px] cursor-pointer"
                >
                  {t.undoLabel || 'Undo'}
                </button>
              )}
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                className="text-[#94A3B8] hover:text-white p-0.5 cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
