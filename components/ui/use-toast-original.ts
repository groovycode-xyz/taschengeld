import { ReactNode, useState } from 'react';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  // Use a more specific type instead of 'any'
  [key: string]: unknown;
}

export const useToastOriginal = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
  };
};

export const toast = {
  success: (title: string, description?: string) => {
    // Implement success toast
    console.log('Success toast:', title, description);
    // You would typically call addToast here with the appropriate styling
  },
  error: (title: string, description?: string) => {
    // Implement error toast
    console.log('Error toast:', title, description);
    // You would typically call addToast here with the appropriate styling
  },
  // Add other toast methods as needed
};

// These constants are defined but not used.
// If they're needed elsewhere, export them. Otherwise, consider removing them.
export const TOAST_LIMIT = 1;
export const TOAST_REMOVE_DELAY = 1000000;

export type ToastT = ToastProps;
