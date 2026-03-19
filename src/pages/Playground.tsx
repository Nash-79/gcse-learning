import { useState, useRef, useCallback } from "react";
import { TerminalSquare, Play, RotateCcw, Terminal, AlertTriangle, Maximize2, Minimize2, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const challenges = [
  { title: "Even or Odd", description: "Check if a number is even or odd.", difficulty: "Easy", starter: `number = 7\n\nif number % 2 == 0:\n    print(f"{number} is even")\nelse:\n    print(f"{number} is odd")` },
  { title: "FizzBuzz", description: "Print numbers 1-20 with FizzBuzz rules.", difficulty: "Medium", starter: `for i in range(1, 21):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)` },
  { title: "Reverse a String", description: "Reverse a string using slicing.", difficulty: "Easy", starter: `name = "Python"\nreversed_name = name[::-1]\nprint(f"{name} reversed is {reversed_name}")` },
  { title: "Times Table", description: "Generate a times table using a loop.", difficulty: "Easy", starter: `number = 7\n\nfor i in range(1, 13):\n    print(f"{number} x {i} = {number * i}")` },
  { title: "Password Checker", description: "Check if a password meets requirements.", difficulty: "Medium", starter: `password = "hello123"\n\nif len(password) >= 8:\n    has_digit = False\n    for char in password:\n        if char.isdigit():\n            has_digit = True\n    if has_digit:\n        print("Strong password!")\n    else:\n        print("Add a number")\nelse:\n    print("Too short!")` },
  { title: "Bubble Sort", description: "Sort a list without built-in sort.", difficulty: "Hard", starter: `numbers = [64, 34, 25, 12, 22, 11, 90]\n\nfor i in range(len(numbers)):\n    for j in range(0, len(numbers) - i - 1):\n        if numbers[j] > numbers[j+1]:\n            numbers[j], numbers[j+1] = numbers[j+1], numbers[j]\n\nprint("Sorted:", numbers)` },
  { title: "Linear Search", description: "Search for a value in a list.", difficulty: "Medium", starter: `def linear_search(data, target):\n    for i in range(len(data)):\n        if data[i] == target:\n            return i\n    return -1\n\nnumbers = [4, 2, 7, 1, 9, 3]\ntarget = 7\nresult = linear_search(numbers, target)\n\nif result != -1:\n    print(f"Found {target} at index {result}")\nelse:\n    print(f"{target} not found")` },
  { title: "Caesar Cipher", description: "Encrypt a message by shifting letters.", difficulty: "Hard", starter: `def caesar_cipher(text, shift):\n    result = ""\n    for char in text:\n        if char.isalpha():\n            base = ord('A') if char.isupper() else ord('a')\n            shifted = (ord(char) - base + shift) % 26 + base\n            result += chr(shifted)\n        else:\n            result += char\n    return result\n\nmessage = "Hello World"\nencrypted = caesar_cipher(message, 3)\nprint(f"Original:  {message}")\nprint(f"Encrypted: {encrypted}")\nprint(f"Decrypted: {caesar_cipher(encrypted, -3)}")` },
];

const difficultyColors: Record<string, string> = {
  "Easy": "text-green-400 bg-green-500/10 border-green-500/20",
  "Medium": "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  "Hard": "text-red-400 bg-red-500/10 border-red-500/20",
};

const defaultCode = `# Python Playground — write anything you like!
# Press Run (or Ctrl+Enter) to execute your code

def greet(name):
    return f"Hello, {name}! Welcome to PyLearn."

print(greet("Student"))

# Try adding a loop:
for i in range(1, 6):
    print(f"  Loop #{i}")
`;

export default function Playground() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showChallenges, setShowChallenges] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runCode = useCallback(() => {
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
      Sk.importMainWithBody("<stdin>", false, code, true)
    );

    myPromise.then(
      () => setIsRunning(false),
      (err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
        setIsRunning(false);
      }
    );
  }, [code]);

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
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      runCode();
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''} mx-auto px-4 py-4`}>
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary neon-glow">
            <TerminalSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Python Playground</h1>
            <p className="text-xs text-muted-foreground">Write, run, experiment — Ctrl+Enter to execute</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} className="rounded-full hover:bg-primary/10">
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-card neon-border flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/30">
              <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  main.py
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={copyCode} className="h-7 text-xs text-muted-foreground gap-1 hover:text-foreground">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setCode(defaultCode); setOutput(""); setError(""); }} className="h-7 text-xs text-muted-foreground gap-1 hover:text-foreground">
                  <RotateCcw className="w-3 h-3" /> Reset
                </Button>
                <Button
                  size="sm"
                  onClick={runCode}
                  disabled={isRunning}
                  className="h-8 gap-1.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg font-semibold shadow-lg shadow-primary/25"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isRunning ? "Running..." : "Run"}
                </Button>
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              className="w-full h-[500px] p-4 font-mono text-sm text-blue-100 bg-[#1e1e1e] border-none resize-none focus:outline-none"
              placeholder="Type your Python code here..."
            />
          </div>

          {/* Output */}
          <div className="mt-4 rounded-2xl overflow-hidden border border-border/50 shadow-lg bg-card">
            <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center gap-2 text-sm font-semibold">
              <Terminal className="w-4 h-4 text-primary" />
              Console Output
            </div>
            <div className="p-4 bg-black/90 font-mono text-sm min-h-[120px] max-h-[300px] overflow-y-auto">
              {isRunning && !output && !error && <div className="text-muted-foreground animate-pulse">Running...</div>}
              {!isRunning && !output && !error && <div className="text-muted-foreground/50 italic">Output will appear here</div>}
              {output && <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>}
              {error && (
                <div className="flex items-start gap-2 text-red-400 mt-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <pre className="whitespace-pre-wrap text-xs">{error}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Challenges sidebar */}
        <div className="lg:w-80 shrink-0">
          <button
            onClick={() => setShowChallenges(!showChallenges)}
            className="flex items-center justify-between w-full text-left px-4 py-3 rounded-xl bg-muted/50 border border-border/50 mb-3 hover:bg-muted transition-colors"
          >
            <span className="font-semibold text-sm">Coding Challenges</span>
            {showChallenges ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showChallenges && (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {challenges.map((ch, i) => (
                <Card key={i} className="rounded-xl border-border/50 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => { setCode(ch.starter); setOutput(""); setError(""); }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm">{ch.title}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${difficultyColors[ch.difficulty]}`}>
                        {ch.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{ch.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
