import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Toast.css";

export default function Toast({ open, message, variant = "info", durationMs = 4000, onClose }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), durationMs);
    return () => clearTimeout(t);
  }, [open, durationMs, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="toast_host" aria-live="polite" aria-atomic="true">
      <div
        className={`toast toast--${variant}`}
        role="status"
        style={{ animationDuration: `${durationMs}ms` }}
      >
        {message}
      </div>
    </div>,
    document.body
  );
}

