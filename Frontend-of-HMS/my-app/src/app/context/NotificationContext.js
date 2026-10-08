"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
} from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((current) =>
      current.filter(
        (notification) =>
          notification.id !== id
      )
    );
  }, []);

  const showNotification = useCallback(
    ({
      message,
      type = "success",
      duration = 4000,
    }) => {
      const id =
        Date.now() +
        Math.random();

      setNotifications((current) => [
        ...current,
        {
          id,
          message,
          type,
        },
      ]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [removeNotification]
  );

  const success = (message) => {
    showNotification({
      message,
      type: "success",
    });
  };

  const error = (message) => {
    showNotification({
      message,
      type: "error",
    });
  };

  const warning = (message) => {
    showNotification({
      message,
      type: "warning",
    });
  };

  const info = (message) => {
    showNotification({
      message,
      type: "info",
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        removeNotification,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}


export function useNotification() {
  const context = useContext(
    NotificationContext
  );

  if (!context) {
    throw new Error(
      "useNotification must be used inside NotificationProvider"
    );
  }

  return context;
}