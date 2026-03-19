import { ArrowRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface FollowUpSuggestionsProps {
  suggestions: string[];
  onSelect: (prompt: string) => void;
  isLoading?: boolean;
  showHomeLink?: boolean;
}

export function FollowUpSuggestions({ suggestions, onSelect, isLoading, showHomeLink = true }: FollowUpSuggestionsProps) {
  if (isLoading || suggestions.length === 0) return null;

  return (
    <div className="mt-4 ml-10 space-y-2">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Continue learning</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-border/50 hover:border-secondary/50 hover:bg-secondary/5 text-muted-foreground hover:text-foreground transition-all group"
          >
            <ArrowRight className="w-3 h-3 text-secondary/60 group-hover:text-secondary transition-colors" />
            <span className="line-clamp-1">{s}</span>
          </button>
        ))}
        {showHomeLink && (
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all group"
          >
            <Home className="w-3 h-3 text-primary/60 group-hover:text-primary transition-colors" />
            <span>Back to Home</span>
          </Link>
        )}
      </div>
    </div>
  );
}
