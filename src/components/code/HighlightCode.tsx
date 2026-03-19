import { useEffect, useRef } from "react";

interface HighlightCodeProps {
  code: string;
  language?: string;
  className?: string;
}

export function HighlightCode({ code, language = "python", className = "" }: HighlightCodeProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current && typeof window !== "undefined" && window.hljs) {
      codeRef.current.removeAttribute("data-highlighted");
      window.hljs.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <div className={`relative rounded-xl overflow-hidden border border-border/50 bg-black/90 shadow-inner ${className}`}>
      <div className="flex items-center px-4 py-2 border-b border-white/10 bg-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="ml-4 text-xs font-mono text-muted-foreground">{language}</div>
      </div>
      <pre className="p-4 m-0 overflow-x-auto text-sm leading-relaxed">
        <code ref={codeRef} className={`language-${language} bg-transparent p-0 text-white/90`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
