import { ReactNode, useState } from 'react';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  [key: string]: any;
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
  success: (message: string) => {
    // Implement success toast
  },
  error: (message: string) => {
    // Implement error toast
  },
  // Add other toast methods as needed
};
