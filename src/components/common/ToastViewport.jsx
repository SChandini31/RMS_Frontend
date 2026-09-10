import { useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

function ToastItem({ toast, onDismiss }) {
  const Icon = ICONS[toast.type] || Info;

  useEffect(() => {
    if (toast.exiting || !toast.duration) return undefined;

    const timer = window.setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration);

    return () => window.clearTimeout(timer);
  }, [toast.id, toast.duration, toast.exiting, onDismiss]);

  return (
    <div
      className={`rms-toast rms-toast--${toast.type}${toast.exiting ? " rms-toast--exit" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="rms-toast-icon">
        <Icon size={18} />
      </div>

      <div className="rms-toast-body">
        <p className="rms-toast-title">{toast.title}</p>
        {toast.message ? (
          <p className="rms-toast-message">{toast.message}</p>
        ) : null}
      </div>

      <button
        type="button"
        className="rms-toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>

      <span
        className="rms-toast-progress"
        style={{ animationDuration: `${toast.duration}ms` }}
      />
    </div>
  );
}

export default function ToastViewport({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="rms-toast-viewport" aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
