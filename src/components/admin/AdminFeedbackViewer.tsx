import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, Filter, Info, Loader2, MessageSquare, RefreshCw, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackRow {
  id: string;
  user_id: string | null;
  user_email: string | null;
  page_path: string;
  section_key: string;
  feedback_type: string;
  status: string;
  payload: unknown;
  created_at: string;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function getStringField(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  return typeof v === "string" && v.trim().length > 0 ? v : null;
}

export default function AdminFeedbackViewer() {
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("user_feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (typeFilter) query = query.eq("feedback_type", typeFilter);
    const { data, error } = await query;
    if (error) {
      toast.error("Failed to load feedback");
      setRows([]);
    } else {
      setRows(((data as FeedbackRow[]) || []).map((r) => ({ ...r, payload: r.payload ?? {} })));
    }
    setLoading(false);
  }, [typeFilter]);

  useEffect(() => { void fetchFeedback(); }, [fetchFeedback]);

  const types = useMemo(() => [...new Set(rows.map((r) => r.feedback_type))].filter(Boolean), [rows]);

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) => {
      const payloadStr = JSON.stringify(r.payload || {}).toLowerCase();
      return (
        (r.user_email || "").toLowerCase().includes(q) ||
        r.page_path.toLowerCase().includes(q) ||
        r.section_key.toLowerCase().includes(q) ||
        r.feedback_type.toLowerCase().includes(q) ||
        payloadStr.includes(q)
      );
    });
  }, [rows, search]);

  const exportJson = () => {
    const jsonStr = JSON.stringify(filtered, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pylearn-feedback-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Feedback downloaded as JSON");
  };

  const copyJson = async () => {
    const jsonStr = JSON.stringify(filtered, null, 2);
    await navigator.clipboard.writeText(jsonStr);
    toast.success("Feedback copied to clipboard");
  };

  return (
    <Card className="rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-display font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Feedback
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{rows.length} entries</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void fetchFeedback()} disabled={loading} className="gap-1.5 rounded-xl text-xs">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportJson} className="gap-1.5 rounded-xl text-xs">
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => void copyJson()} className="gap-1.5 rounded-xl text-xs">
              <Copy className="w-3.5 h-3.5" />
              Copy JSON
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search page, section, email, payload..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border/50 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] text-muted-foreground font-medium self-center flex items-center gap-1">
              <Filter className="w-3 h-3" /> Type:
            </span>
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(typeFilter === t ? null : t)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                  typeFilter === t
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "bg-background border-border/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No feedback found.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((r) => {
              const isExpanded = expandedId === r.id;
              const ts = new Date(r.created_at);
              const payload = asRecord(r.payload);
              const summary = getStringField(payload, "summary") || r.feedback_type;
              return (
                <div key={r.id} className="rounded-xl border border-border/40 bg-card">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : r.id)}
                    className="w-full text-left p-3 flex items-start gap-3"
                  >
                    <span className="mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border bg-primary/10 text-primary border-primary/20 shrink-0">
                      {r.feedback_type}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-xs font-medium text-foreground truncate max-w-[520px]">
                          {summary}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted/50 text-muted-foreground font-mono">
                          {r.page_path} · {r.section_key}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{r.user_email || "anonymous"}</span>
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
                            {JSON.stringify(r, null, 2)}
                          </pre>
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
