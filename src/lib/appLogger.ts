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
  | "progress_update"
  | "ai_suggestion_click";

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
    // Attach the current auth identity so the row passes the
    // "authenticated users can insert logs" RLS policy
    // (which requires auth.uid() = user_id).
    const { data: { user } } = await supabase.auth.getUser();

    const row: Record<string, unknown> = {
      event_type: entry.event_type,
      origin: entry.origin,
      message: entry.message,
      details: (entry.details ?? {}) as any,
      error_stack: entry.error_stack ?? undefined,
      severity: entry.severity ?? "info",
    };

    if (user) {
      row.user_id = user.id;
      row.user_email = user.email ?? null;
    }

    const { error } = await supabase.from("app_logs").insert([row as any]);
    if (error && import.meta.env.DEV) {
      // Surface in dev so we catch silent RLS rejections early
      // eslint-disable-next-line no-console
      console.warn("[appLog] insert failed:", error.message, entry);
    }
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
