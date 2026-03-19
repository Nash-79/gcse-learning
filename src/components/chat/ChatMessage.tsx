import { Bot, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

function CodeBlock({ className, children, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!className) {
    // Inline code
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-secondary/15 text-secondary font-mono text-[13px] font-medium" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-4 rounded-xl overflow-hidden border border-border/40 bg-[hsl(var(--card))]/80 shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          {lang && (
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground/70">
              {lang}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/60"
        >
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {/* Code content */}
      <pre className="p-4 overflow-x-auto text-[13px] leading-[1.7] font-mono">
        <code className="text-foreground/90">{children}</code>
      </pre>
    </div>
  );
}

function OutputBlock({ children }: { children: string }) {
  return (
    <div className="my-3 rounded-xl border border-green-500/20 bg-green-500/5 overflow-hidden">
      <div className="px-4 py-1.5 border-b border-green-500/15 bg-green-500/10">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-green-500/80">
          ▶ Output
        </span>
      </div>
      <pre className="p-4 text-[13px] leading-[1.7] font-mono text-foreground/80 overflow-x-auto">
        {children}
      </pre>
    </div>
  );
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-br-md">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 mt-1 shrink-0">
        <Bot className="w-4 h-4 text-secondary" />
      </div>
      <div className="flex-1 min-w-0 max-w-[90%]">
        <div className="prose prose-sm dark:prose-invert max-w-none
          prose-headings:font-display prose-headings:tracking-tight prose-headings:font-bold
          prose-h2:text-base prose-h2:mt-6 prose-h2:mb-2 prose-h2:flex prose-h2:items-center prose-h2:gap-2
          prose-h3:text-sm prose-h3:mt-4 prose-h3:mb-1.5
          prose-p:text-[13.5px] prose-p:leading-[1.75] prose-p:text-foreground/85
          prose-strong:text-foreground prose-strong:font-semibold
          prose-li:text-[13.5px] prose-li:leading-[1.7] prose-li:text-foreground/85
          prose-ul:my-2 prose-ol:my-2
          prose-table:text-[12px] prose-table:border prose-table:border-border/40 prose-table:rounded-lg prose-table:overflow-hidden
          prose-th:bg-muted/50 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:border-b prose-th:border-border/40
          prose-td:px-3 prose-td:py-2 prose-td:border-b prose-td:border-border/20
          prose-code:before:content-none prose-code:after:content-none
          prose-pre:p-0 prose-pre:m-0 prose-pre:bg-transparent prose-pre:border-none
          prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-secondary/40 prose-blockquote:bg-secondary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic
        ">
          <ReactMarkdown
            components={{
              code: ({ className, children, ...props }: any) => {
                // Check if it's a block code (has className with language-)
                const isBlock = className || (typeof children === "string" && children.includes("\n"));
                if (isBlock && className) {
                  return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
                }
                // Inline code
                return (
                  <code className="px-1.5 py-0.5 rounded-md bg-secondary/15 text-secondary font-mono text-[13px] font-medium" {...props}>
                    {children}
                  </code>
                );
              },
              pre: ({ children }: any) => <>{children}</>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
