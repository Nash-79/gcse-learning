import { ChatMessage } from "@/components/chat/ChatMessage";
import type { AiResponseMeta } from "@/lib/aiResponseMeta";
import { formatCachedAgo } from "@/lib/aiResponseCache";
import { RefreshCw, Database } from "lucide-react";

interface StructuredAiResponseProps {
  /** Raw `content` string from the /api/ai-chat response. May be JSON,
   *  markdown, or plain text — the underlying renderer handles all paths. */
  content: string;
  meta?: AiResponseMeta;
  onRegenerate?: () => void;
  onSuggestionClick?: (prompt: string) => void;
  showHomeLink?: boolean;
  isSuggestionsLoading?: boolean;
  suggestionOrigin?: string;
  /** When set, render a "Served from cache · 2m ago" pill above the message. */
  cachedAt?: number;
  /** Click handler for the pill's "Regenerate" link → bypass cache. */
  onBypassCache?: () => void;
}

/**
 * Single source of truth for rendering AI assistant responses across the app.
 *
 * Every chat surface — TaskAssistant, AiHelper, AI Tutor — pipes its raw
 * model output through this component to guarantee identical Claude/OpenAI/
 * Gemini-style structured rendering: emoji headings, summary callouts,
 * traffic-light code blocks, trace tables, and clickable follow-up chips.
 *
 * Internally it delegates to <ChatMessage role="assistant" />, which already
 * runs the parse → blocks → markdown/trace pipeline.
 */
export function StructuredAiResponse({ cachedAt, onBypassCache, ...props }: StructuredAiResponseProps) {
  return (
    <div className="space-y-1.5">
      {cachedAt != null && (
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/40 border border-border/40">
            <Database className="w-2.5 h-2.5" />
            Served from cache · {formatCachedAgo(cachedAt)}
          </span>
          {onBypassCache && (
            <button
              type="button"
              onClick={onBypassCache}
              title="Regenerate (skip cache)"
              className="inline-flex items-center gap-1 text-secondary/80 hover:text-secondary transition-colors"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              Regenerate
            </button>
          )}
        </div>
      )}
      <ChatMessage role="assistant" {...props} />
    </div>
  );
}
