import { supabase } from "@/integrations/supabase/client";

export type LogSeverity = "info" | "warning" | "error" | "critical";
export type LogEventType =
  | "login"
  | "logout"
  | "signup"
  | "page_view"
  | "exam_completed"
  | "exam_started"
  | "quiz_completed"
  | "client_error"
  | "api_error"
  | "navigation"
  | "progress_update";

interface LogEntry {
  event_type: LogEventType;
  origin: string;
  message: string;
  details?: Record<string, unknown>;
  error_stack?: string;
  severity?: LogSeverity;
}

export async function appLog(entry: LogEntry) {
  try {
    await supabase.from("app_logs").insert([{
      event_type: entry.event_type,
      origin: entry.origin,
      message: entry.message,
      details: (entry.details ?? {}) as any,
      error_stack: entry.error_stack ?? undefined,
      severity: entry.severity ?? "info",
    }]);
  } catch {
    // Silently fail — logging should never break the app
  }
}

// Global error handler
export function initGlobalErrorLogger() {
  window.addEventListener("error", (event) => {
    appLog({
      event_type: "client_error",
      origin: `${event.filename}:${event.lineno}:${event.colno}`,
      message: event.message,
      error_stack: event.error?.stack,
      severity: "error",
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    appLog({
      event_type: "client_error",
      origin: "unhandledrejection",
      message: reason?.message || String(reason),
      error_stack: reason?.stack,
      severity: "error",
    });
  });
}
