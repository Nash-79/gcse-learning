import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { TerminalSquare, Play, RotateCcw, Terminal, AlertTriangle, Maximize2, Minimize2, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useChallengeProgress } from "@/hooks/useChallengeProgress";
import { useRewards } from "@/hooks/useRewards";
import { readAndClearPlaygroundCode } from "@/lib/playgroundHandoff";

interface PlaygroundChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  starter: string;
  expectedOutput: string;
}

const challenges: PlaygroundChallenge[] = [
  { id: "playground-even-or-odd", title: "Even or Odd", description: "Check if a number is even or odd.", difficulty: "Easy", starter: `number = 7\n\nif number % 2 == 0:\n    print(str(number) + " is even")\nelse:\n    print(str(number) + " is odd")`, expectedOutput: "7 is odd" },
  { id: "playground-fizzbuzz", title: "FizzBuzz", description: "Print numbers 1-20 with FizzBuzz rules.", difficulty: "Medium", starter: `for i in range(1, 21):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)`, expectedOutput: "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz 16 17 Fizz 19 Buzz" },
  { id: "playground-reverse-string", title: "Reverse a String", description: "Reverse a string using slicing.", difficulty: "Easy", starter: `name = "Python"\nreversed_name = name[::-1]\nprint(name + " reversed is " + reversed_name)`, expectedOutput: "Python reversed is nohtyP" },
  { id: "playground-times-table", title: "Times Table", description: "Generate a times table using a loop.", difficulty: "Easy", starter: `number = 7\n\nfor i in range(1, 13):\n    print(str(number) + " x " + str(i) + " = " + str(number * i))`, expectedOutput: "7 x 1 = 7 7 x 2 = 14 7 x 3 = 21 7 x 4 = 28 7 x 5 = 35 7 x 6 = 42 7 x 7 = 49 7 x 8 = 56 7 x 9 = 63 7 x 10 = 70 7 x 11 = 77 7 x 12 = 84" },
  { id: "playground-password-checker", title: "Password Checker", description: "Check if a password meets requirements.", difficulty: "Medium", starter: `password = "hello123"\n\nif len(password) >= 8:\n    has_digit = False\n    for char in password:\n        if char.isdigit():\n            has_digit = True\n    if has_digit:\n        print("Strong password!")\n    else:\n        print("Add a number")\nelse:\n    print("Too short!")`, expectedOutput: "Strong password!" },
  { id: "playground-bubble-sort", title: "Bubble Sort", description: "Sort a list without built-in sort.", difficulty: "Hard", starter: `numbers = [64, 34, 25, 12, 22, 11, 90]\n\nfor i in range(len(numbers)):\n    for j in range(0, len(numbers) - i - 1):\n        if numbers[j] > numbers[j+1]:\n            numbers[j], numbers[j+1] = numbers[j+1], numbers[j]\n\nprint("Sorted: " + str(numbers))`, expectedOutput: "Sorted: [11, 12, 22, 25, 34, 64, 90]" },
  { id: "playground-linear-search", title: "Linear Search", description: "Search for a value in a list.", difficulty: "Medium", starter: `def linear_search(data, target):\n    for i in range(len(data)):\n        if data[i] == target:\n            return i\n    return -1\n\nnumbers = [4, 2, 7, 1, 9, 3]\ntarget = 7\nresult = linear_search(numbers, target)\n\nif result != -1:\n    print("Found " + str(target) + " at index " + str(result))\nelse:\n    print(str(target) + " not found")`, expectedOutput: "Found 7 at index 2" },
  { id: "playground-caesar-cipher", title: "Caesar Cipher", description: "Encrypt a message by shifting letters.", difficulty: "Hard", starter: `def caesar_cipher(text, shift):\n    result = ""\n    for char in text:\n        if char.isalpha():\n            base = ord('A') if char.isupper() else ord('a')\n            shifted = (ord(char) - base + shift) % 26 + base\n            result += chr(shifted)\n        else:\n            result += char\n    return result\n\nmessage = "Hello World"\nencrypted = caesar_cipher(message, 3)\nprint("Original: " + message)\nprint("Encrypted: " + encrypted)\nprint("Decrypted: " + caesar_cipher(encrypted, -3))`, expectedOutput: "Original: Hello World Encrypted: Khoor Zruog Decrypted: Hello World" },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-green-400 bg-green-500/10 border-green-500/20",
  Medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Hard: "text-red-400 bg-red-500/10 border-red-500/20",
};

const defaultCode = `# Python Playground - write anything you like!
# Press Run (or Ctrl+Enter) to execute your code

def greet(name):
    return f"Hello, {name}! Welcome to PyLearn."

print(greet("Student"))

# Try adding a loop:
for i in range(1, 6):
    print(f"  Loop #{i}")
`;

function normalizeOutput(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export default function Playground() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showChallenges, setShowChallenges] = useState(true);
  const [handedOff, setHandedOff] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { getStatus, setStatus } = useChallengeProgress();
  const rewards = useRewards();

  useEffect(() => {
    if (searchParams.get("fromChat") !== "1") return;
    const incoming = readAndClearPlaygroundCode();
    if (incoming) {
      setCode(incoming);
      setOutput("");
      setError("");
      setHandedOff(true);
      window.setTimeout(() => textareaRef.current?.focus(), 50);
      window.setTimeout(() => setHandedOff(false), 2500);
    }
    const next = new URLSearchParams(searchParams);
    next.delete("fromChat");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      () => {
        setIsRunning(false);
        rewards.recordTopicCodeRun("playground");

        if (!selectedChallengeId) return;
        const selectedChallenge = challenges.find((challenge) => challenge.id === selectedChallengeId);
        if (!selectedChallenge) return;

        if (normalizeOutput(accumulated) === normalizeOutput(selectedChallenge.expectedOutput)) {
          setStatus(selectedChallenge.id, "completed");
          rewards.completePracticeActivity("playground", selectedChallenge.id, "Playground challenge solved");
          return;
        }

        if (getStatus(selectedChallenge.id) === "not-started") {
          setStatus(selectedChallenge.id, "in-progress");
        }
      },
      (err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
        setIsRunning(false);
      }
    );
  }, [code, getStatus, rewards, selectedChallengeId, setStatus]);

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
    <div className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""} mx-auto px-4 py-4`}>
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary neon-glow">
            <TerminalSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Python Playground</h1>
            <p className="text-xs text-muted-foreground">Write, run, experiment - Ctrl+Enter to execute</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {handedOff && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary">
              <Check className="w-3 h-3" />
              Loaded from chat
            </span>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} className="rounded-full hover:bg-primary/10">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="neon-border flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl">
            <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2.5">
              <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="ml-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  main.py
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={copyCode} className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setCode(defaultCode); setOutput(""); setError(""); setSelectedChallengeId(null); }} className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <RotateCcw className="w-3 h-3" /> Reset
                </Button>
                <Button
                  size="sm"
                  onClick={runCode}
                  disabled={isRunning}
                  className="h-8 gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary/80 font-semibold text-primary-foreground shadow-lg shadow-primary/25"
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
              className="h-[500px] w-full resize-none border-none bg-[#1e1e1e] p-4 font-mono text-sm text-blue-100 focus:outline-none"
              placeholder="Type your Python code here..."
            />
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg">
            <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5 text-sm font-semibold">
              <Terminal className="w-4 h-4 text-primary" />
              Console Output
            </div>
            <div className="max-h-[300px] min-h-[120px] overflow-y-auto bg-black/90 p-4 font-mono text-sm">
              {isRunning && !output && !error && <div className="animate-pulse text-muted-foreground">Running...</div>}
              {!isRunning && !output && !error && <div className="italic text-muted-foreground/50">Output will appear here</div>}
              {output && <pre className="whitespace-pre-wrap text-green-400">{output}</pre>}
              {error && (
                <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-400">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <pre className="whitespace-pre-wrap text-xs">{error}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 lg:w-80">
          <button
            onClick={() => setShowChallenges(!showChallenges)}
            className="mb-3 flex w-full items-center justify-between rounded-xl border border-border/50 bg-muted/50 px-4 py-3 text-left hover:bg-muted transition-colors"
          >
            <span className="font-semibold text-sm">Coding Challenges</span>
            {showChallenges ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showChallenges && (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {challenges.map((challenge) => (
                <Card
                  key={challenge.id}
                  className="cursor-pointer rounded-xl border-border/50 transition-colors hover:border-primary/30"
                  onClick={() => {
                    setCode(challenge.starter);
                    setOutput("");
                    setError("");
                    setSelectedChallengeId(challenge.id);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <h4 className="text-sm font-semibold">{challenge.title}</h4>
                      <div className="flex items-center gap-2">
                        {getStatus(challenge.id) === "completed" && (
                          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-500">
                            Solved
                          </span>
                        )}
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${difficultyColors[challenge.difficulty]}`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{challenge.description}</p>
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
