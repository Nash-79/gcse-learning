import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Copy, RefreshCw, Search, X, Filter,
  AlertCircle, AlertTriangle, Info, ShieldAlert, ChevronDown,
  Loader2, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LogRow {
  id: string;
  user_id: string | null;
  user_email: string | null;
  event_type: string;
  origin: string;
  message: string;
  details: Record<string, unknown>;
  error_stack: string | null;
  severity: string;
  created_at: string;
}

const severityConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  info: { icon: <Info className="w-3.5 h-3.5" />, color: "text-blue-400 bg-blue-500/10 border-blue-500/20", label: "Info" },
  warning: { icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "text-amber-400 bg-amber-500/10 border-amber-500/20", label: "Warning" },
  error: { icon: <AlertCircle className="w-3.5 h-3.5" />, color: "text-red-400 bg-red-500/10 border-red-500/20", label: "Error" },
  critical: { icon: <ShieldAlert className="w-3.5 h-3.5" />, color: "text-red-500 bg-red-600/15 border-red-500/30", label: "Critical" },
};

const eventTypeLabels: Record<string, string> = {
  login: "🔑 Login",
  logout: "🚪 Logout",
  signup: "✨ Signup",
  page_view: "👁 Page View",
  exam_completed: "📝 Exam Done",
  exam_started: "▶ Exam Start",
  quiz_completed: "✅ Quiz Done",
  client_error: "🐛 Client Error",
  api_error: "⚠ API Error",
  navigation: "🧭 Navigation",
  progress_update: "📊 Progress",
  ai_suggestion_click: "💬 Chip Click",
};

export default function AdminLogViewer() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<string | null>(null);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("app_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (severityFilter) query = query.eq("severity", severityFilter);
    if (eventFilter) query = query.eq("event_type", eventFilter);

    const { data, error } = await query;
    if (error) {
      toast.error("Failed to load logs");
    } else {
      setLogs((data as LogRow[]) || []);
    }
    setLoading(false);
  }, [severityFilter, eventFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filteredLogs = logs.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.message.toLowerCase().includes(q) ||
      l.origin.toLowerCase().includes(q) ||
      (l.user_email || "").toLowerCase().includes(q) ||
      l.event_type.toLowerCase().includes(q)
    );
  });

  const exportJson = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pylearn-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Logs downloaded as JSON");
  };

  const copyJson = () => {
    const jsonStr = JSON.stringify(filteredLogs, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    toast.success("Logs copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const uniqueEvents = [...new Set(logs.map((l) => l.event_type))];
  const errorCount = logs.filter((l) => l.severity === "error" || l.severity === "critical").length;

  return (
    <Card className="rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-display font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              Admin Log Viewer
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {logs.length} entries · {errorCount} error{errorCount !== 1 && "s"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading} className="gap-1.5 rounded-xl text-xs">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={copyJson} className="gap-1.5 rounded-xl text-xs">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy JSON"}
            </Button>
            <Button variant="outline" size="sm" onClick={exportJson} className="gap-1.5 rounded-xl text-xs">
              <Download className="w-3.5 h-3.5" />
              Download
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logs by message, origin, email..."
              className="w-full bg-background border border-border rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] text-muted-foreground font-medium self-center flex items-center gap-1">
              <Filter className="w-3 h-3" /> Severity:
            </span>
            {["info", "warning", "error", "critical"].map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(severityFilter === s ? null : s)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                  severityFilter === s
                    ? severityConfig[s].color + " border"
                    : "bg-background border-border/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {severityConfig[s].icon}
                {severityConfig[s].label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] text-muted-foreground font-medium self-center flex items-center gap-1">
              <Filter className="w-3 h-3" /> Event:
            </span>
            {uniqueEvents.map((evt) => (
              <button
                key={evt}
                onClick={() => setEventFilter(eventFilter === evt ? null : evt)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                  eventFilter === evt
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "bg-background border-border/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {eventTypeLabels[evt] || evt}
              </button>
            ))}
          </div>
        </div>

        {/* Log entries */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No logs found.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredLogs.map((log) => {
              const sev = severityConfig[log.severity] || severityConfig.info;
              const isExpanded = expandedLog === log.id;
              const ts = new Date(log.created_at);
              return (
                <div
                  key={log.id}
                  className={`rounded-xl border transition-all ${
                    log.severity === "error" || log.severity === "critical"
                      ? "border-red-500/20 bg-red-500/5"
                      : "border-border/40 bg-card"
                  }`}
                >
                  <button
                    onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                    className="w-full text-left p-3 flex items-start gap-3"
                  >
                    <span className={`mt-0.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium border shrink-0 ${sev.color}`}>
                      {sev.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-xs font-medium text-foreground truncate max-w-[300px]">
                          {log.message}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted/50 text-muted-foreground font-mono">
                          {eventTypeLabels[log.event_type] || log.event_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="font-mono truncate max-w-[200px]">{log.origin}</span>
                        <span>·</span>
                        <span>{log.user_email || "anonymous"}</span>
                        <span>·</span>
                        <span>{ts.toLocaleDateString()} {ts.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 border-t border-border/30 pt-3">
                          <pre className="text-xs font-mono bg-muted/30 rounded-lg p-3 overflow-x-auto border border-border/30 text-foreground whitespace-pre-wrap break-all">
                            {JSON.stringify(
                              {
                                id: log.id,
                                event_type: log.event_type,
                                severity: log.severity,
                                origin: log.origin,
                                message: log.message,
                                user_email: log.user_email,
                                user_id: log.user_id,
                                details: log.details,
                                error_stack: log.error_stack,
                                created_at: log.created_at,
                              },
                              null,
                              2
                            )}
                          </pre>
                          <div className="mt-2 flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[11px] gap-1 h-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(
                                  JSON.stringify(log, null, 2)
                                );
                                toast.success("Log entry copied");
                              }}
                            >
                              <Copy className="w-3 h-3" />
                              Copy Entry
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
