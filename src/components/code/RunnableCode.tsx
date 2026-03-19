import { useState, useRef } from "react";
import { Play, Copy, Check, ChevronDown, ChevronUp, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HighlightCode } from "./HighlightCode";

interface RunnableCodeProps {
  code: string;
  title?: string;
  description?: string;
}

export function RunnableCode({ code, title, description }: RunnableCodeProps) {
  const [showRunner, setShowRunner] = useState(false);
  const [editableCode, setEditableCode] = useState(code);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runCode = () => {
    setIsRunning(true);
    setOutput("");
    setError("");

    if (typeof window === "undefined" || !window.Sk) {
      setError("Python runner (Skulpt) not loaded. Please refresh the page.");
      setIsRunning(false);
      return;
    }

    const Sk = window.Sk;
    let accumulated = "";
    Sk.pre = "output";
    Sk.configure({
      output: (text: string) => {
        accumulated += text;
        setOutput(accumulated);
      },
      read: (x: string) => {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[x] === undefined) {
          throw new Error(`File not found: '${x}'`);
        }
        return Sk.builtinFiles.files[x];
      },
    });

    const myPromise = Sk.misceval.asyncToPromise(() =>
      Sk.importMainWithBody("<stdin>", false, showRunner ? editableCode : code, true)
    );

    myPromise.then(
      () => setIsRunning(false),
      (err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
        setIsRunning(false);
      }
    );
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      setEditableCode(editableCode.substring(0, start) + "    " + editableCode.substring(end));
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="space-y-3">
      {title && <h3 className="text-xl font-bold font-display">{title}</h3>}
      {description && <p className="text-muted-foreground">{description}</p>}
      
      <div className="relative group">
        <HighlightCode code={code} />
        
        <div className="absolute top-12 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            onClick={copyCode}
            className="h-7 px-2 text-xs bg-white/10 hover:bg-white/20 border-white/10 text-white shadow-lg backdrop-blur-sm"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (!showRunner) {
                setEditableCode(code);
                setOutput("");
                setError("");
              }
              setShowRunner(!showRunner);
            }}
            className="h-7 px-3 text-xs bg-primary/90 hover:bg-primary text-white shadow-lg backdrop-blur-sm gap-1"
          >
            {showRunner ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showRunner ? "Close" : "Try It"}
          </Button>
        </div>
      </div>

      {showRunner && (
        <div className="rounded-2xl overflow-hidden border border-border/50 bg-card shadow-lg">
          <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/30">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Terminal className="w-4 h-4 text-primary" /> Interactive Editor
            </div>
            <Button
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              className="h-7 px-3 text-xs bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 shadow-none gap-1"
            >
              <Play className="w-3 h-3 fill-current" />
              {isRunning ? "Running..." : "Run"}
            </Button>
          </div>
          <textarea
            ref={textareaRef}
            value={editableCode}
            onChange={(e) => setEditableCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            className="w-full h-[200px] p-4 font-mono text-sm text-blue-100 bg-[#1e1e1e] border-none resize-none focus:outline-none"
          />
          {(output || error) && (
            <div className="border-t bg-black/90 p-4 font-mono text-sm max-h-[200px] overflow-y-auto">
              {output && <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>}
              {error && <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
