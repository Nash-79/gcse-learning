import React from "react";
import { BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicNotesProps {
  paragraphs: string[];
  className?: string;
}

/**
 * Renders an array of plain-string paragraphs as a polished article:
 * - first paragraph = brighter lead
 * - subsequent paragraphs = numbered sections with index pills
 * - inline auto-formatting for `code`, parentheticals, em-dash clauses,
 *   and capitalised key terms (e.g. "Syntax errors (...)")
 */
export const TopicNotes: React.FC<TopicNotesProps> = ({ paragraphs, className }) => {
  if (!paragraphs || paragraphs.length === 0) return null;

  const [lead, ...rest] = paragraphs;
  const totalWords = paragraphs.reduce((sum, p) => sum + p.split(/\s+/).length, 0);
  const readMins = Math.max(1, Math.round(totalWords / 200));

  return (
    <section
      className={cn(
        "rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm",
        "px-6 py-7 md:px-9 md:py-9",
        className,
      )}
    >
      {/* Header chip */}
      <header className="flex items-center justify-between mb-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <BookOpen className="h-3.5 w-3.5" />
          Notes
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          ~{readMins} min read
        </div>
      </header>

      {/* Lead paragraph */}
      <p className="text-[1.075rem] md:text-[1.15rem] leading-[1.75] text-foreground font-medium max-w-[72ch]">
        {renderInline(lead)}
      </p>

      {/* Numbered sections */}
      {rest.length > 0 && (
        <div className="mt-8 space-y-7">
          {rest.map((paragraph, i) => (
            <article key={i} className="flex gap-4 md:gap-5">
              <div className="flex-shrink-0">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/40 text-[11px] font-mono font-semibold text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="flex-1 text-[1rem] leading-[1.8] text-foreground/85 max-w-[72ch]">
                {renderInline(paragraph)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

/**
 * Inline tokenizer that styles:
 *  - `backtick code`        -> styled <code> chip
 *  - "Term (definition)"    -> bold term + muted parenthetical
 *  - "clause — clause"      -> em-dash kept with softer following clause
 */
function renderInline(text: string): React.ReactNode {
  if (!text) return null;

  // First split on backticks to preserve inline code untouched
  const segments = text.split(/(`[^`]+`)/g);

  return segments.map((seg, i) => {
    if (seg.startsWith("`") && seg.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-md border border-border/60 bg-muted/60 px-1.5 py-0.5 text-[0.85em] font-mono text-foreground"
        >
          {seg.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{styleSegment(seg)}</React.Fragment>;
  });
}

function styleSegment(text: string): React.ReactNode {
  // Match: a Capitalised term (1-3 words) immediately followed by " ("
  // and treat the parenthetical as a muted definition.
  // Also softens em-dash clauses.
  const pattern = /([A-Z][A-Za-z]+(?:\s[A-Za-z]+){0,2})\s\(([^)]+)\)/g;

  const out: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    const [full, term, def] = match;
    const start = match.index;

    if (start > lastIndex) {
      out.push(<React.Fragment key={`t-${key++}`}>{styleEmDash(text.slice(lastIndex, start))}</React.Fragment>);
    }

    out.push(
      <span key={`term-${key++}`} className="font-semibold text-foreground">
        {term}
      </span>,
    );
    out.push(
      <span key={`def-${key++}`} className="text-muted-foreground">
        {" "}
        ({styleEmDash(def)})
      </span>,
    );

    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    out.push(<React.Fragment key={`tail-${key++}`}>{styleEmDash(text.slice(lastIndex))}</React.Fragment>);
  }

  return out.length > 0 ? out : styleEmDash(text);
}

function styleEmDash(text: string): React.ReactNode {
  if (!text.includes("—")) return text;
  const parts = text.split("—");
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {i > 0 && <span className="mx-1 text-muted-foreground">—</span>}
      {i > 0 ? <span className="text-foreground/75">{part}</span> : part}
    </React.Fragment>
  ));
}

export default TopicNotes;
