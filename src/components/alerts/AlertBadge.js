'use client';
import { useEffect } from 'react';
import { useAlerts } from '@/components/providers/AlertProvider';

export default function AlertBadge() {
  const { alerts, removeAlert } = useAlerts();

  useEffect(() => {
    // Auto-remove alerts after 5 seconds
    const timer = setTimeout(() => {
      alerts.forEach((alert) => {
        if (!alert.persistent) {
          removeAlert(alert.id);
        }
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [alerts, removeAlert]);

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg shadow-lg max-w-md ${
            alert.type === 'warning'
              ? 'bg-yellow-100 text-yellow-800'
              : alert.type === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{alert.message}</p>
            <button
              onClick={() => removeAlert(alert.id)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}