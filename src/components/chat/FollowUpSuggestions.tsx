import { ArrowRight, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface FollowUpSuggestionsProps {
  suggestions: string[];
  onSelect: (prompt: string) => void;
  isLoading?: boolean;
  showHomeLink?: boolean;
}

export function FollowUpSuggestions({ suggestions, onSelect, isLoading, showHomeLink = false }: FollowUpSuggestionsProps) {
  if (isLoading || suggestions.length === 0) return null;

  return (
    <div className="mt-5 ml-10 space-y-2.5 animate-in fade-in slide-in-from-bottom-1 duration-300">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border/40" />
        <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-[0.12em] flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-secondary/70" />
          Continue learning
        </p>
        <div className="h-px flex-1 bg-border/40" />
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="group inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full border border-border/60 bg-card/50 hover:border-secondary/60 hover:bg-secondary/5 hover:shadow-sm hover:shadow-secondary/10 hover:scale-[1.02] active:scale-[0.98] text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <ArrowRight className="w-3 h-3 text-secondary/60 group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
            <span className="line-clamp-1 max-w-[420px]">{s}</span>
          </button>
        ))}
        {showHomeLink && (
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full border border-border/60 bg-card/50 hover:border-primary/60 hover:bg-primary/5 hover:scale-[1.02] active:scale-[0.98] text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <Home className="w-3 h-3 text-primary/60 group-hover:text-primary transition-colors" />
            <span>Back to Home</span>
          </Link>
        )}
      </div>
    </div>
  );
}
