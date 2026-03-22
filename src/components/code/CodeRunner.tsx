import { useState, useRef } from "react";
import { Play, RotateCcw, AlertTriangle, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CodeRunnerProps {
  initialCode?: string;
  height?: string;
  onOutput?: (output: string) => void;
}

export function CodeRunner({ initialCode = 'print("Hello, World!")', height = "h-[300px]", onOutput }: CodeRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runCode = () => {
    setIsRunning(true);
    setOutput("");
    setError("");

    if (typeof window === "undefined" || !window.Sk) {
      setError("Python runner (Skulpt) not loaded. Please wait or refresh the page.");
      setIsRunning(false);
      return;
    }

    const Sk = window.Sk;
    Sk.pre = "output";
    Sk.configure({
      output: (text: string) => {
        setOutput(prev => prev + text);
      },
      read: (x: string) => {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[x] === undefined) {
          throw new Error(`File not found: '${x}'`);
        }
        return Sk.builtinFiles.files[x];
      },
    });

    const myPromise = Sk.misceval.asyncToPromise(() =>
      Sk.importMainWithBody("<stdin>", false, code, true)
    );

    myPromise.then(
      () => setIsRunning(false),
      (err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
        setIsRunning(false);
      }
    );
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput("");
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      setCode(code.substring(0, start) + "    " + code.substring(end));
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden border border-border/50 shadow-lg bg-card">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Terminal className="w-4 h-4 text-primary" />
            main.py
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={resetCode} className="h-8 text-muted-foreground hover:text-foreground">
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              className="h-8 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 shadow-none transition-all"
            >
              <Play className="w-3.5 h-3.5 mr-1 fill-current" />
              Run Code
            </Button>
          </div>
        </div>
        <div className="relative flex-1 bg-[#1e1e1e]">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            className={`w-full ${height} p-4 font-mono text-sm text-blue-100 bg-transparent border-none resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground/30`}
            placeholder="Type your Python code here..."
          />
        </div>
      </div>

      <div className="w-full md:w-1/3 flex flex-col rounded-2xl overflow-hidden border border-border/50 shadow-lg bg-card min-h-[200px]">
        <div className="px-4 py-3 border-b bg-muted/30 flex items-center gap-2 text-sm font-semibold text-foreground">
          Console Output
        </div>
        <div className="flex-1 p-4 bg-black/90 font-mono text-sm overflow-y-auto">
          {isRunning && !output && !error && (
            <div className="text-muted-foreground animate-pulse">Running...</div>
          )}
          {!isRunning && !output && !error && (
            <div className="text-muted-foreground/50 italic">Output will appear here</div>
          )}
          {output && (
            <pre className="text-green-400 whitespace-pre-wrap font-mono">{output}</pre>
          )}
          {error && (
            <div className="flex items-start gap-2 text-destructive mt-2 bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <pre className="whitespace-pre-wrap font-mono text-xs">{error}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
