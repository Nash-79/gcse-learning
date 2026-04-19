import { Bot, Copy, Check, RotateCcw, Info, Sparkles, Play } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { parseAssistantOutput, structuredJsonToMarkdown, structuredJsonToBlocks, structuredMarkdownToClean, type StructuredBlock } from "@/lib/parseAssistantOutput";
import type { AiResponseMeta } from "@/lib/aiResponseMeta";
import { FollowUpSuggestions } from "@/components/chat/FollowUpSuggestions";
import { TraceTable } from "@/components/chat/TraceTable";
import { stashPlaygroundCode } from "@/lib/playgroundHandoff";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  onRegenerate?: () => void;
  onCopyAll?: () => void;
  meta?: AiResponseMeta;
  /** When provided, follow-up suggestions are stripped from the rendered
   * markdown and shown below as clickable pill chips. */
  onSuggestionClick?: (prompt: string) => void;
  /** Whether to show the "Back to Home" pill alongside the suggestion chips. */
  showHomeLink?: boolean;
  /** When true, dim the suggestion chips and show a shimmer (next response loading). */
  isSuggestionsLoading?: boolean;
  /** Identifier for analytics, e.g. "ai_tutor" or "ai_helper:intro-to-python". */
  suggestionOrigin?: string;
}

/** Pull a trailing follow-up section out of any markdown content. Matches the
 *  `🔗 Follow-up` block emitted by `structuredJsonToMarkdown` AND legacy
 *  patterns (markdown bullets after a 🔗 / 💡 / "Suggestions" heading). */
function extractFollowUpsFromMarkdown(content: string): { cleanContent: string; suggestions: string[] } {
  const lines = content.split("\n");
  let followUpStart = -1;

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    // Markers we accept: 🔗 / 💡 prefix, or a markdown heading mentioning "follow-up" / "suggestions"
    if (
      /^\*?\*?(?:🔗|💡)/.test(line) ||
      /^#{1,4}\s+.*(?:follow.?up|suggestions?|continue learning)/i.test(line)
    ) {
      followUpStart = i;
      break;
    }
  }

  if (followUpStart === -1) {
    for (let i = lines.length - 1; i >= Math.max(0, lines.length - 14); i--) {
      if (lines[i].trim() === "---" && i < lines.length - 2) {
        const nextNonEmpty = lines.slice(i + 1).find(l => l.trim());
        if (nextNonEmpty && /(?:🔗|💡|follow.?up|suggestions?)/i.test(nextNonEmpty)) {
          followUpStart = i;
          break;
        }
      }
    }
  }

  if (followUpStart >= 0) {
    const suggestions: string[] = [];
    for (let i = followUpStart; i < lines.length; i++) {
      const match = lines[i].trim().match(/^[-•*]\s*"?(.+?)"?\s*$/);
      if (match) suggestions.push(match[1].replace(/^["“”]|["“”]$/g, ""));
    }
    // Trim a trailing horizontal rule that immediately precedes the block
    let endIdx = followUpStart;
    while (endIdx > 0 && lines[endIdx - 1].trim() === "") endIdx--;
    if (endIdx > 0 && lines[endIdx - 1].trim() === "---") endIdx--;
    return { cleanContent: lines.slice(0, endIdx).join("\n").trimEnd(), suggestions };
  }

  return { cleanContent: content, suggestions: [] };
}

/* ───────── Code Block ───────── */
function CodeBlock({ className, children, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "";
  const code = String(children).replace(/\n$/, "");
  const isPython = lang === "python" || lang === "py";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunInPlayground = () => {
    stashPlaygroundCode(code);
    navigate("/playground?fromChat=1");
  };

  // Inline code
  if (!className) {
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-muted/60 text-secondary font-mono text-[13px] font-medium border border-border/30" {...props}>
        {children}
      </code>
    );
  }

  // Block code
  return (
    <div className="relative group my-5 rounded-xl overflow-hidden border border-border/30 bg-card/80 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/20 bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500/60" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <span className="w-2 h-2 rounded-full bg-green-500/60" />
          </div>
          {lang && (
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground/60">
              {lang}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isPython && (
            <button
              type="button"
              onClick={handleRunInPlayground}
              title="Open this snippet in the Python Playground"
              className="flex items-center gap-1 text-[10px] text-primary/80 hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-primary/10"
            >
              <Play className="w-3 h-3 fill-current" />
              Run in Playground
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-muted-foreground/70 hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-[1.75] font-mono">
        <code className="text-foreground/90">{children}</code>
      </pre>
    </div>
  );
}

/* ───────── Actions Bar ───────── */
function MessageActions({ content, onRegenerate }: { content: string; onRegenerate?: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/40"
        title="Copy message"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
      {onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/40"
          title="Regenerate response"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Regenerate</span>
        </button>
      )}
    </div>
  );
}

/* ───────── Markdown Renderer — clean, spacious, Claude-style ───────── */
function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="
      prose prose-sm dark:prose-invert max-w-none
      [&>*:first-child]:mt-0 [&>*:last-child]:mb-0

      /* Headings — strong, distinct hierarchy */
      prose-headings:font-display prose-headings:tracking-tight prose-headings:font-bold
      prose-h2:text-[17px] prose-h2:mt-8 prose-h2:mb-3.5 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/40 prose-h2:text-foreground prose-h2:flex prose-h2:items-center prose-h2:gap-2
      prose-h3:text-[12px] prose-h3:mt-6 prose-h3:mb-2 prose-h3:uppercase prose-h3:tracking-[0.08em] prose-h3:text-secondary/90 prose-h3:font-semibold

      /* Body text — generous line height, comfortable reading */
      prose-p:text-[14px] prose-p:leading-[1.85] prose-p:text-foreground/85 prose-p:mb-5
      prose-strong:text-foreground prose-strong:font-semibold

      /* Lists — clean spacing, subtle markers */
      prose-li:text-[14px] prose-li:leading-[1.8] prose-li:text-foreground/85 prose-li:mb-2
      prose-ul:my-5 prose-ul:space-y-1 prose-ol:my-5 prose-ol:space-y-1
      prose-li:marker:text-secondary/60

      /* Tables */
      prose-table:text-[12.5px] prose-table:border prose-table:border-border/40 prose-table:rounded-lg prose-table:overflow-hidden prose-table:my-6
      prose-th:bg-muted/50 prose-th:px-3 prose-th:py-2.5 prose-th:text-left prose-th:font-semibold prose-th:border-b prose-th:border-border/40 prose-th:text-foreground/90
      prose-td:px-3 prose-td:py-2 prose-td:border-b prose-td:border-border/20

      /* Code — handled by CodeBlock component */
      prose-code:before:content-none prose-code:after:content-none
      prose-pre:p-0 prose-pre:m-0 prose-pre:bg-transparent prose-pre:border-none

      /* Links */
      prose-a:text-secondary prose-a:no-underline hover:prose-a:underline prose-a:font-medium

      /* Blockquotes — summary callout, card-like */
      prose-blockquote:border-l-[3px] prose-blockquote:border-l-secondary
      prose-blockquote:bg-secondary/[0.06] prose-blockquote:rounded-r-xl
      prose-blockquote:py-4 prose-blockquote:px-5 prose-blockquote:my-5
      prose-blockquote:not-italic prose-blockquote:shadow-sm
      prose-blockquote:text-foreground/90 prose-blockquote:text-[14.5px]
      prose-blockquote:leading-[1.7] prose-blockquote:font-medium
      prose-blockquote:[&>p]:mb-0

      /* Horizontal rules — breathing room */
      prose-hr:my-7 prose-hr:border-border/30
    ">
      <ReactMarkdown
        components={{
          code: ({ className, children, ...props }: any) => {
            const isBlock = className || (typeof children === "string" && children.includes("\n"));
            if (isBlock && className) {
              return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
            }
            return (
              <code className="px-1.5 py-0.5 rounded-md bg-muted/60 text-secondary font-mono text-[13px] font-medium border border-border/30" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }: any) => <>{children}</>,
          // Promote inline "**Label:** value" patterns at the start of a paragraph
          // into a small definition-list style row so subtopics never get squashed.
          p: ({ children, ...props }: any) => {
            if (typeof children === "string") {
              const m = children.match(/^\*\*([^*]+):\*\*\s*(.+)$/s);
              if (m) {
                return (
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 my-3 pl-3 border-l-2 border-secondary/30">
                    <span className="font-semibold text-foreground text-[13.5px] sm:min-w-[110px]">{m[1]}</span>
                    <span className="text-foreground/85 text-[13.5px] leading-[1.8]">{m[2]}</span>
                  </div>
                );
              }
            }
            return <p {...props}>{children}</p>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/* ───────── Provenance Badge ───────── */
function ProvenanceLine({ meta }: { meta?: AiResponseMeta }) {
  const [showDetails, setShowDetails] = useState(false);
  if (!meta) return null;
  const label = meta.finalModelLabel || meta.finalModelId?.split("/").pop()?.replace(":free", "");
  if (!label) return null;

  const isLovable = label.includes("Lovable AI") || meta.finalModelId?.startsWith("google/gemini");
  const reason = meta.fallbackReason;
  const hasDetails = Boolean(reason || (meta.attempts && meta.attempts.length > 1));

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 flex-wrap">
        {isLovable ? (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/8 text-secondary/70 border border-secondary/15 inline-flex items-center gap-1 font-medium">
            <Sparkles className="w-2.5 h-2.5" /> {label}
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground/50 inline-flex items-center gap-1">
            <Bot className="w-2.5 h-2.5" /> {label}
          </span>
        )}
        {meta.usedFallback && (
          <button
            type="button"
            onClick={() => hasDetails && setShowDetails((v) => !v)}
            disabled={!hasDetails}
            title={reason ? `Fell back after ${reason.provider}/${reason.model.split("/").pop()?.replace(":free", "")} returned ${reason.status}` : undefined}
            className={`text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/8 text-amber-500/70 border border-amber-500/12 inline-flex items-center gap-0.5 ${hasDetails ? "hover:bg-amber-500/15 cursor-pointer" : ""}`}
          >
            <Info className="w-2.5 h-2.5" /> Fallback
          </button>
        )}
        {meta.degraded && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/8 text-amber-500/70 border border-amber-500/12">
            Degraded
          </span>
        )}
        {meta.attemptCount && meta.attemptCount > 1 && (
          <span className="text-[10px] text-muted-foreground/40">
            {meta.attemptCount} attempts
          </span>
        )}
        {meta.elapsedMs && (
          <span className="text-[10px] text-muted-foreground/35">
            {(meta.elapsedMs / 1000).toFixed(1)}s
          </span>
        )}
      </div>
      {showDetails && reason && (
        <div className="mt-1.5 p-2.5 rounded-lg border border-amber-500/20 bg-amber-500/[0.04] text-[11px] text-foreground/80 space-y-1">
          <div>
            <span className="text-amber-500/80 font-medium">Fallback reason:</span>{" "}
            <span className="font-mono">{reason.provider}/{reason.model.split("/").pop()?.replace(":free", "")}</span>{" "}
            returned <span className="font-mono">{reason.status}</span>.
          </div>
          {reason.message && (
            <div className="text-muted-foreground/70 font-mono break-all">
              {reason.message.length > 200 ? reason.message.slice(0, 200) + "…" : reason.message}
            </div>
          )}
          {meta.attempts && meta.attempts.length > 0 && (
            <ul className="space-y-0.5 mt-1 text-muted-foreground/60">
              {meta.attempts.map((a, i) => (
                <li key={i} className="font-mono text-[10px]">
                  <span className={a.status >= 200 && a.status < 300 ? "text-green-500/70" : "text-amber-500/70"}>
                    {a.status}
                  </span>{" "}
                  {a.provider}/{a.model.split("/").pop()?.replace(":free", "")}{" "}
                  <span className="text-muted-foreground/40">({a.ms}ms)</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ───────── Main ChatMessage ───────── */
export function ChatMessage({ role, content, onRegenerate, meta, onSuggestionClick, showHomeLink = false, isSuggestionsLoading = false, suggestionOrigin }: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  // Parse structured output
  const parsed = parseAssistantOutput(content);

  // Build render blocks for the JSON path (markdown + trace tables). For the
  // raw/fallback path we synthesise a single markdown block.
  const blocks: StructuredBlock[] = (() => {
    switch (parsed.type) {
      case "json": return structuredJsonToBlocks(parsed.data);
      case "markdown": return [{ kind: "markdown", text: structuredMarkdownToClean(parsed.data) }];
      default: return [{ kind: "markdown", text: parsed.data }];
    }
  })();

  // For follow-up chip extraction we still work off a flat markdown view so
  // the existing extractor keeps working regardless of block mix.
  const flatMarkdown = parsed.type === "json"
    ? structuredJsonToMarkdown(parsed.data)
    : parsed.type === "markdown"
    ? structuredMarkdownToClean(parsed.data)
    : parsed.data;

  const { suggestions } = onSuggestionClick
    ? extractFollowUpsFromMarkdown(flatMarkdown)
    : { suggestions: [] as string[] };

  // When chips are rendered, strip the trailing follow-up markdown block so it
  // doesn't duplicate above the chips.
  const renderBlocks = onSuggestionClick && suggestions.length > 0
    ? blocks.filter((b) => !(b.kind === "markdown" && /🔗 Follow-up questions/.test(b.text)))
    : blocks;

  return (
    <div className="flex justify-start gap-3 group">
      <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-secondary/10 mt-0.5 shrink-0">
        <Bot className="w-4 h-4 text-secondary" />
      </div>
      <div className="flex-1 min-w-0 max-w-[90%]">
        {renderBlocks.map((block, i) =>
          block.kind === "trace" ? (
            <TraceTable key={i} heading={block.heading} trace={block.trace} bullets={block.bullets} />
          ) : (
            <MarkdownRenderer key={i} content={block.text} />
          )
        )}
        <MessageActions content={content} onRegenerate={onRegenerate} />
        <ProvenanceLine meta={meta} />
        {onSuggestionClick && suggestions.length > 0 && (
          <FollowUpSuggestions
            suggestions={suggestions}
            onSelect={onSuggestionClick}
            showHomeLink={showHomeLink}
            isLoading={isSuggestionsLoading}
            origin={suggestionOrigin}
          />
        )}
      </div>
    </div>
  );
}
