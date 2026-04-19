import { ChatMessage } from "@/components/chat/ChatMessage";
import type { AiResponseMeta } from "@/lib/aiResponseMeta";

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
export function StructuredAiResponse(props: StructuredAiResponseProps) {
  return <ChatMessage role="assistant" {...props} />;
}
