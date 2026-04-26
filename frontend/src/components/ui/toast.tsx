'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type ToastVariant = 'info' | 'success' | 'error';

export interface ToastOptions {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

interface Toast extends Required<Omit<ToastOptions, 'id'>> { id: string }

interface ToastContextValue {
  toasts: Toast[];
  show: (opts: ToastOptions) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((opts: ToastOptions) => {
    const id = opts.id || Math.random().toString(36).slice(2);
    const toast: Toast = {
      id,
      title: opts.title || '',
      description: opts.description || '',
      variant: opts.variant || 'info',
      durationMs: opts.durationMs ?? 3500,
    };
    setToasts(prev => [...prev, toast]);
    // Auto dismiss
    if (toast.durationMs > 0) {
      setTimeout(() => dismiss(id), toast.durationMs);
    }
  }, [dismiss]);

  const clear = useCallback(() => setToasts([]), []);

  const value = useMemo(() => ({ toasts, show, dismiss, clear }), [toasts, show, dismiss, clear]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 w-[92vw] max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={[
              'rounded-md border p-3 shadow-md backdrop-blur bg-white/95',
              toast.variant === 'success' && 'border-emerald-200',
              toast.variant === 'error' && 'border-red-200',
              toast.variant === 'info' && 'border-blue-200',
            ].filter(Boolean).join(' ')}
          >
            {toast.title && (
              <div className="text-sm font-medium text-gray-900 mb-0.5">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-xs text-gray-700">{toast.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};


