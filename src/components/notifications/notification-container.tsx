"use client";

import React from "react";
import { NotificationToast } from "./notification-toast";
import type { Notification } from "./notification-provider";

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export function NotificationContainer({ 
  notifications, 
  onRemove 
}: NotificationContainerProps): React.ReactElement {
  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center gap-2 p-4 pointer-events-none"
    >
      {notifications.map((notification, index) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
          index={index}
        />
      ))}
    </div>
  );
}
