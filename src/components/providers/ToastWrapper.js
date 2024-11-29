'use client';

import { ToastProvider } from '@/contexts/ToastContext';
import ToastContainer from '@/components/common/ToastContainer';
import { useToast } from '@/contexts/ToastContext';

function ToastContainerWrapper() {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} removeToast={removeToast} />;
}

export default function ToastWrapper({ children }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainerWrapper />
    </ToastProvider>
  );
} 