import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import ToastViewport from "../components/common/ToastViewport";

const NotificationContext = createContext(null);

const DEFAULT_DURATION = 4500;
const MAX_TOASTS = 4;

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissNotification = useCallback((id) => {
    setToasts((current) =>
      current.map((toast) =>
        toast.id === id ? { ...toast, exiting: true } : toast
      )
    );

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 220);
  }, []);

  const showNotification = useCallback(
    (type, title, message, options = {}) => {
      const safeType = ["success", "error", "warning", "info"].includes(type)
        ? type
        : "info";
      const nextTitle = title || "Notification";
      const nextMessage = message || "";
      const id = options.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const duration = options.duration ?? DEFAULT_DURATION;

      setToasts((current) => {
        const duplicate = current.find(
          (toast) =>
            !toast.exiting &&
            toast.type === safeType &&
            toast.title === nextTitle &&
            toast.message === nextMessage
        );

        if (duplicate && !options.id) {
          return current;
        }

        const nextToast = {
          id,
          type: safeType,
          title: nextTitle,
          message: nextMessage,
          duration,
          exiting: false,
        };

        const withoutSameId = current.filter((toast) => toast.id !== id);
        return [...withoutSameId, nextToast].slice(-MAX_TOASTS);
      });

      return id;
    },
    []
  );

  const value = useMemo(
    () => ({ showNotification, dismissNotification }),
    [showNotification, dismissNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastViewport
        toasts={toasts}
        onDismiss={dismissNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }

  return context;
};
