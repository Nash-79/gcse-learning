import { ArrowRight, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { appLog } from "@/lib/appLogger";

interface FollowUpSuggestionsProps {
  suggestions: string[];
  onSelect: (prompt: string) => void;
  isLoading?: boolean;
  showHomeLink?: boolean;
  /** Identifies the surface where this chip was clicked, e.g. "ai_tutor" or "ai_helper:intro-to-python". */
  origin?: string;
}

export function FollowUpSuggestions({
  suggestions,
  onSelect,
  isLoading,
  showHomeLink = false,
  origin,
}: FollowUpSuggestionsProps) {
  if (suggestions.length === 0) return null;

  const handleClick = (s: string) => {
    if (isLoading) return;
    void appLog({
      event_type: "ai_suggestion_click",
      origin: origin || "unknown",
      message: s,
      details: { surface: origin },
      severity: "info",
    });
    onSelect(s);
  };

  return (
    <div className="mt-5 ml-10 space-y-2.5 animate-in fade-in slide-in-from-bottom-1 duration-300">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border/40" />
        <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-[0.12em] flex items-center gap-1.5">
          <Sparkles className={`w-3 h-3 text-secondary/70 ${isLoading ? "animate-pulse" : ""}`} />
          {isLoading ? "Thinking…" : "Continue learning"}
        </p>
        <div className="h-px flex-1 bg-border/40" />
      </div>
      <div
        className={`relative flex flex-wrap gap-2 ${
          isLoading ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => handleClick(s)}
            disabled={isLoading}
            className="group inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full border border-border/60 bg-card/50 hover:border-secondary/60 hover:bg-secondary/5 hover:shadow-sm hover:shadow-secondary/10 hover:scale-[1.02] active:scale-[0.98] text-muted-foreground hover:text-foreground transition-all duration-200 disabled:hover:scale-100 disabled:cursor-wait"
          >
            <ArrowRight className="w-3 h-3 text-secondary/60 group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
            <span className="line-clamp-1 max-w-[420px]">{s}</span>
          </button>
        ))}
        {showHomeLink && !isLoading && (
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full border border-border/60 bg-card/50 hover:border-primary/60 hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98] text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <Home className="w-3 h-3 text-primary/60 group-hover:text-primary transition-colors" />
            <span>Back to Home</span>
          </Link>
        )}
        {isLoading && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden"
          >
            <span className="block h-full w-1/3 -translate-x-full animate-[shimmer_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-secondary/15 to-transparent" />
          </span>
        )}
      </div>
    </div>
  );
}
