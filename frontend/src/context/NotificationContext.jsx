import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Elevated Anomaly Detected",
      message: "Surface crack pattern localized with 94.7% confidence in corridor TRK-014.",
      type: "warning",
      timestamp: "10 mins ago",
      link: "/anomalies/1",
      read: false
    },
    {
      id: 2,
      title: "Engineer Review Pending",
      message: "Inspection INS-2026-0104 is awaiting certified engineering review.",
      type: "info",
      timestamp: "25 mins ago",
      link: "/reviews",
      read: false
    },
    {
      id: 3,
      title: "Sensor Baseline Spike",
      message: "Sensor Agent flagged +18.4% vibration variance at KP 14.2 gantry.",
      type: "alert",
      timestamp: "1 hour ago",
      link: "/sensors",
      read: true
    },
    {
      id: 4,
      title: "Inspection Dossier Ready",
      message: "Certified report REP-2026-0104 has been generated and signed.",
      type: "success",
      timestamp: "2 hours ago",
      link: "/reports",
      read: true
    }
  ]);

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      toasts,
      addToast,
      markAllAsRead,
      markAsRead
    }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border text-sm font-medium transition-all transform duration-300 translate-y-0 ${
              toast.type === 'success'
                ? 'bg-emerald-900/95 border-emerald-500 text-emerald-100'
                : toast.type === 'error'
                ? 'bg-rose-900/95 border-rose-500 text-rose-100'
                : toast.type === 'warning'
                ? 'bg-amber-900/95 border-amber-500 text-amber-100'
                : 'bg-slate-900/95 border-slate-700 text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
