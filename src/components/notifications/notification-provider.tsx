"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { NotificationContainer } from "./notification-container";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
  createdAt: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType, duration?: number) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const MAX_VISIBLE_NOTIFICATIONS = 3;

export function NotificationProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const queueRef = useRef<Notification[]>([]);
  const idCounterRef = useRef(0);

  const processQueue = useCallback(() => {
    setNotifications((prev) => {
      if (prev.length >= MAX_VISIBLE_NOTIFICATIONS) return prev;
      
      const availableSlots = MAX_VISIBLE_NOTIFICATIONS - prev.length;
      const queuedNotifications = queueRef.current.slice(0, availableSlots);
      queueRef.current = queueRef.current.slice(availableSlots);
      
      if (queuedNotifications.length === 0) return prev;
      
      return [...prev, ...queuedNotifications];
    });
  }, []);

  const addNotification = useCallback(
    (message: string, type: NotificationType, duration = 5000): string => {
      const id = `notification-${++idCounterRef.current}-${Date.now()}`;
      const notification: Notification = {
        id,
        message,
        type,
        duration,
        createdAt: Date.now(),
      };

      setNotifications((prev) => {
        if (prev.length < MAX_VISIBLE_NOTIFICATIONS) {
          return [...prev, notification];
        }
        queueRef.current.push(notification);
        return prev;
      });

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const filtered = prev.filter((n) => n.id !== id);
      return filtered;
    });

    // Use timeout to allow state update to complete before processing queue
    setTimeout(() => processQueue(), 0);
  }, [processQueue]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    queueRef.current = [];
  }, []);

  const value = React.useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      clearAll,
    }),
    [notifications, addNotification, removeNotification, clearAll]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
