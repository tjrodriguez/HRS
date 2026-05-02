"use client";

import React, { useEffect, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "./notification-provider";

interface NotificationToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
  index: number;
}

const typeConfig: Record<NotificationType, { icon: React.ReactNode; className: string }> = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    className: "bg-secondary text-secondary-foreground border-secondary-light",
  },
  error: {
    icon: <AlertCircle className="w-5 h-5" />,
    className: "bg-destructive text-destructive-foreground border-destructive-light",
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    className: "bg-primary text-primary-foreground border-primary-light",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    className: "bg-accent text-accent-foreground border-accent-dark",
  },
};

export function NotificationToast({ 
  notification, 
  onRemove,
  index 
}: NotificationToastProps): React.ReactElement {
  const { id, message, type, duration = 5000 } = notification;
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const startTimeRef = React.useRef(Date.now());
  const remainingTimeRef = React.useRef(duration);
  const animationFrameRef = React.useRef<number | undefined>(undefined);

  const handleRemove = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onRemove(id), 300);
  }, [id, onRemove]);

  useEffect(() => {
    if (duration === 0) return;

    const updateProgress = () => {
      if (isPaused) {
        startTimeRef.current = Date.now();
        animationFrameRef.current = requestAnimationFrame(updateProgress);
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, remainingTimeRef.current - elapsed);
      const newProgress = (remaining / duration) * 100;

      setProgress(newProgress);

      if (remaining <= 0) {
        handleRemove();
        return;
      }

      remainingTimeRef.current = remaining;
      startTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [duration, isPaused, handleRemove]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now();
  };

  const config = typeConfig[type];

  return (
    <div
      role="alert"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "pointer-events-auto w-full max-w-sm rounded-lg border shadow-lg",
        "transform transition-all duration-300 ease-out",
        "flex items-start gap-3 p-4",
        config.className,
        isExiting ? "opacity-0 -translate-y-2 scale-95" : "opacity-100 translate-y-0 scale-100",
        "animate-in slide-in-from-top-2 fade-in duration-300"
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-5">{message}</p>
      </div>

      <button
        onClick={handleRemove}
        className={cn(
          "flex-shrink-0 -mr-1 -mt-1 p-1.5 rounded-md",
          "transition-colors duration-200",
          "hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-1",
          type === "error" ? "focus:ring-destructive-foreground" : "focus:ring-current"
        )}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden"
        >
          <div
            className={cn(
              "h-full transition-all duration-100 ease-linear",
              type === "success" && "bg-secondary-foreground/30",
              type === "error" && "bg-destructive-foreground/30",
              type === "info" && "bg-primary-foreground/30",
              type === "warning" && "bg-accent-foreground/30"
            )}
            style={{ 
              width: `${progress}%`,
              transition: isPaused ? "none" : "width 100ms linear"
            }}
          />
        </div>
      )}
    </div>
  );
}
