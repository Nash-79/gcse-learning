import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Database, Trash2, RefreshCw } from "lucide-react";
import { aiCache, isCachingDisabled, setCachingDisabled, type CacheNamespace } from "@/lib/aiResponseCache";
import { toast } from "sonner";

const NAMESPACE_LABELS: Record<CacheNamespace, string> = {
  "task-assistant": "Task Assistant",
  "topic-explainer": "AI Helper (topic chat)",
  "ai-tutor": "AI Tutor",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function CachedResponsesCard() {
  const [stats, setStats] = useState(() => aiCache.allStats());
  const [disabled, setDisabled] = useState(() => isCachingDisabled());

  const refresh = () => setStats(aiCache.allStats());

  useEffect(() => {
    // Refresh on visibility regain so stats stay current after using the app.
    const onVis = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const totalCount = Object.values(stats).reduce((s, v) => s + v.count, 0);
  const totalBytes = Object.values(stats).reduce((s, v) => s + v.bytes, 0);

  const clearOne = (ns: CacheNamespace) => {
    const n = aiCache.clearNamespace(ns);
    refresh();
    toast.success(n > 0 ? `Cleared ${n} cached response${n === 1 ? "" : "s"} from ${NAMESPACE_LABELS[ns]}.` : "Already empty.");
  };

  const clearAll = () => {
    const n = aiCache.clearAll();
    refresh();
    toast.success(n > 0 ? `Cleared ${n} cached response${n === 1 ? "" : "s"}.` : "Cache was already empty.");
  };

  const onToggle = (next: boolean) => {
    setCachingDisabled(next);
    setDisabled(next);
    toast.success(next ? "AI response caching disabled — every request will hit the model." : "AI response caching re-enabled.");
  };

  return (
    <Card className="rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Cached AI responses
            </h3>
            <p className="text-sm text-muted-foreground">
              Identical questions are served instantly from your browser cache (7-day TTL). Hold ⌥/Alt while pressing Send, click the “Regenerate” link on any cached message, or disable caching here to always get a fresh answer.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={refresh} title="Refresh stats" className="rounded-xl shrink-0">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/50 bg-muted/20 mb-4">
          <div>
            <p className="text-sm font-semibold">Disable caching</p>
            <p className="text-xs text-muted-foreground">When on, every AI request hits the model directly.</p>
          </div>
          <Switch checked={disabled} onCheckedChange={onToggle} aria-label="Disable AI response caching" />
        </div>

        <div className="space-y-2 mb-4">
          {(Object.keys(NAMESPACE_LABELS) as CacheNamespace[]).map((ns) => {
            const s = stats[ns];
            return (
              <div key={ns} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/40">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{NAMESPACE_LABELS[ns]}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.count} {s.count === 1 ? "entry" : "entries"} · {formatBytes(s.bytes)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearOne(ns)}
                  disabled={s.count === 0}
                  className="rounded-lg gap-1.5 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </Button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            Total: <span className="font-mono text-foreground/80">{totalCount}</span> entries · <span className="font-mono text-foreground/80">{formatBytes(totalBytes)}</span>
          </p>
          <Button variant="destructive" size="sm" onClick={clearAll} disabled={totalCount === 0} className="gap-1.5 rounded-lg">
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
