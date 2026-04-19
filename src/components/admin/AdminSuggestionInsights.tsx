import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Download, RefreshCw, TrendingUp, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClickRow {
  message: string;
  origin: string;
  created_at: string;
}

interface Aggregated {
  suggestion: string;
  count: number;
  lastClickedAt: string;
  surfaces: Record<string, number>;
}

type Timeframe = "7d" | "30d" | "all";

const TIMEFRAME_LABEL: Record<Timeframe, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "all": "All time",
};

function getSinceIso(timeframe: Timeframe): string | null {
  if (timeframe === "all") return null;
  const days = timeframe === "7d" ? 7 : 30;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function surfaceLabel(origin: string): string {
  if (origin === "ai_tutor") return "Tutor";
  if (origin.startsWith("ai_helper:")) return `Topic: ${origin.slice("ai_helper:".length)}`;
  return origin || "unknown";
}

export default function AdminSuggestionInsights() {
  const [rows, setRows] = useState<ClickRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<Timeframe>("30d");

  const fetchRows = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("app_logs")
      .select("message, origin, created_at")
      .eq("event_type", "ai_suggestion_click")
      .order("created_at", { ascending: false })
      .limit(2000);

    const since = getSinceIso(timeframe);
    if (since) query = query.gte("created_at", since);

    const { data, error } = await query;
    if (error) {
      toast.error("Failed to load suggestion insights");
      setRows([]);
    } else {
      setRows((data as ClickRow[]) || []);
    }
    setLoading(false);
  }, [timeframe]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const aggregated: Aggregated[] = useMemo(() => {
    const map = new Map<string, Aggregated>();
    for (const row of rows) {
      const key = row.message.trim();
      if (!key) continue;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        if (row.created_at > existing.lastClickedAt) existing.lastClickedAt = row.created_at;
        existing.surfaces[row.origin] = (existing.surfaces[row.origin] ?? 0) + 1;
      } else {
        map.set(key, {
          suggestion: key,
          count: 1,
          lastClickedAt: row.created_at,
          surfaces: { [row.origin]: 1 },
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 20);
  }, [rows]);

  const totalClicks = rows.length;
  const uniqueSuggestions = aggregated.length;

  // Top-surface breakdown: tutor vs each topic helper vs unknown
  const surfaceBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of rows) {
      const key = r.origin || "unknown";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const entries = Array.from(counts.entries())
      .map(([origin, count]) => ({ origin, count, label: surfaceLabel(origin) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
    const max = entries[0]?.count ?? 0;
    return { entries, max };
  }, [rows]);

  const exportCsv = () => {
    const header = ["rank", "suggestion", "count", "last_clicked_at", "surfaces"];
    const lines = [header.join(",")];
    aggregated.forEach((a, i) => {
      const surfaces = Object.entries(a.surfaces)
        .map(([s, n]) => `${s}:${n}`)
        .join("|");
      const escaped = `"${a.suggestion.replace(/"/g, '""')}"`;
      lines.push([i + 1, escaped, a.count, a.lastClickedAt, `"${surfaces}"`].join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pylearn-suggestion-insights-${timeframe}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Insights exported as CSV");
  };

  return (
    <Card className="rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-display font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              Suggestion Insights
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalClicks} click{totalClicks !== 1 && "s"} · {uniqueSuggestions} unique suggestion{uniqueSuggestions !== 1 && "s"} · {TIMEFRAME_LABEL[timeframe]}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchRows} disabled={loading} className="gap-1.5 rounded-xl text-xs">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv} disabled={aggregated.length === 0} className="gap-1.5 rounded-xl text-xs">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Timeframe toggle */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(["7d", "30d", "all"] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                timeframe === tf
                  ? "bg-secondary/15 text-secondary border-secondary/30"
                  : "bg-background border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {TIMEFRAME_LABEL[tf]}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : aggregated.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No suggestion clicks yet in this window.</p>
            <p className="text-xs mt-1 opacity-70">Click a follow-up chip in the AI Tutor or a topic page to see data here.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {aggregated.map((a, idx) => {
              const ts = new Date(a.lastClickedAt);
              return (
                <motion.div
                  key={a.suggestion}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="rounded-xl border border-border/40 bg-card p-3 flex items-start gap-3"
                >
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-secondary/10 text-secondary text-xs font-bold flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                      {a.suggestion}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary font-semibold">
                        <MessageSquare className="w-3 h-3" />
                        {a.count} click{a.count !== 1 && "s"}
                      </span>
                      <span>·</span>
                      <span>last {ts.toLocaleDateString()} {ts.toLocaleTimeString()}</span>
                      <span>·</span>
                      <span className="truncate">
                        {Object.entries(a.surfaces).map(([s, n], i, arr) => (
                          <span key={s}>
                            {surfaceLabel(s)} ({n}){i < arr.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
