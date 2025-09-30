"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ToastMessage {
  id: string;
  title?: string;
  description?: string;
  type?: 'default' | 'success' | 'error' | 'warning';
}

// Simple toast context
const ToastContext = React.createContext<{
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const toast = (message: Omit<ToastMessage, 'id'>) => {
  // This will be handled by the context
  console.log('Toast:', message);
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {toast.title && (
                  <h4 className="font-semibold text-gray-900">{toast.title}</h4>
                )}
                {toast.description && (
                  <p className="text-sm text-gray-600 mt-1">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
