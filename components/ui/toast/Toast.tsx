"use client";

import type { ToastItem, ToastTone } from "./types";

const ICONS: Record<ToastTone, string> = {
  success: "✓",
  error: "!",
  info: "i",
};

type ToastProps = {
  item: ToastItem;
  leaving?: boolean;
  onDismiss: (id: number) => void;
};

export default function Toast({ item, leaving = false, onDismiss }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={["llm-toast", leaving ? "is-leaving" : ""].filter(Boolean).join(" ")}
    >
      <div className={`llm-toast-bar is-${item.tone}`} />
      <div className="llm-toast-body">
        <span className={`llm-toast-icon is-${item.tone}`} aria-hidden="true">
          {ICONS[item.tone]}
        </span>
        <div className="llm-toast-copy">
          <p className="llm-toast-title">{item.title}</p>
          {item.description ? (
            <p className="llm-toast-description">{item.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="llm-toast-close"
          aria-label="Dismiss notification"
          onClick={() => onDismiss(item.id)}
        >
          ×
        </button>
      </div>
    </div>
  );
}
