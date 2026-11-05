export type ToastTone = "success" | "error" | "info";

export type ToastInput = {
  tone?: ToastTone;
  title: string;
  description?: string;
  durationMs?: number;
};

export type ToastItem = {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
  durationMs: number;
};

export type ToastApi = {
  (input: ToastInput): number;
  success: (title: string, description?: string, durationMs?: number) => number;
  error: (title: string, description?: string, durationMs?: number) => number;
  info: (title: string, description?: string, durationMs?: number) => number;
  dismiss: (id?: number) => void;
};
