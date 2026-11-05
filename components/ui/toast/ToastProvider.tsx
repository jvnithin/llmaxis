"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Toast from "./Toast";
import type { ToastApi, ToastInput, ToastItem, ToastTone } from "./types";
import "./toast.css";

const DEFAULT_DURATION_MS = 4200;
const EXIT_MS = 220;

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [leavingIds, setLeavingIds] = useState<number[]>([]);
  const timers = useRef<Map<number, number>>(new Map());
  const exitTimers = useRef<Map<number, number>>(new Map());
  const seq = useRef(0);

  const clearTimer = (id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  };

  const clearExitTimer = (id: number) => {
    const timer = exitTimers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      exitTimers.current.delete(id);
    }
  };

  const removeToast = useCallback((id: number) => {
    clearTimer(id);
    clearExitTimer(id);
    setLeavingIds((current) => current.filter((value) => value !== id));
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const dismissToast = useCallback(
    (id: number) => {
      clearTimer(id);
      setLeavingIds((current) => (current.includes(id) ? current : [...current, id]));
      clearExitTimer(id);
      const timer = window.setTimeout(() => removeToast(id), EXIT_MS);
      exitTimers.current.set(id, timer);
    },
    [removeToast],
  );

  const pushToast = useCallback(
    (input: ToastInput) => {
      const id = ++seq.current;
      const item: ToastItem = {
        id,
        tone: input.tone ?? "info",
        title: input.title,
        description: input.description,
        durationMs: input.durationMs ?? DEFAULT_DURATION_MS,
      };

      setItems((current) => [...current.slice(-2), item]);

      if (item.durationMs > 0) {
        const timer = window.setTimeout(() => dismissToast(id), item.durationMs);
        timers.current.set(id, timer);
      }

      return id;
    },
    [dismissToast],
  );

  const toast = useMemo<ToastApi>(() => {
    const api = ((input: ToastInput) => pushToast(input)) as ToastApi;

    api.success = (title, description, durationMs) =>
      pushToast({ tone: "success", title, description, durationMs });
    api.error = (title, description, durationMs) =>
      pushToast({ tone: "error", title, description, durationMs });
    api.info = (title, description, durationMs) =>
      pushToast({ tone: "info", title, description, durationMs });
    api.dismiss = (id) => {
      if (typeof id === "number") {
        dismissToast(id);
        return;
      }
      setItems((current) => {
        current.forEach((item) => dismissToast(item.id));
        return current;
      });
    };

    return api;
  }, [dismissToast, pushToast]);

  useEffect(() => {
    const activeTimers = timers.current;
    const activeExitTimers = exitTimers.current;
    return () => {
      activeTimers.forEach((timer) => window.clearTimeout(timer));
      activeExitTimers.forEach((timer) => window.clearTimeout(timer));
      activeTimers.clear();
      activeExitTimers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="llm-toast-viewport" aria-live="polite" aria-relevant="additions text">
        {items.map((item) => (
          <Toast
            key={item.id}
            item={item}
            leaving={leavingIds.includes(item.id)}
            onDismiss={dismissToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export type { ToastApi, ToastInput, ToastItem, ToastTone };
