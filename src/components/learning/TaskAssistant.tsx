import { useState } from "react";
import { Bot, ChevronDown, ChevronUp, Loader2, Sparkles, ListOrdered, Lightbulb, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { apiFetch } from "@/lib/apiFetch";
import { useAiSettings } from "@/lib/useAiSettings";
import { appLog } from "@/lib/appLogger";

export interface TaskAssistantProps {
  taskId: string;
  taskInstruction: string;
  starterCode: string;
  currentCode: string;
  topicTitle: string;
}

type PromptKind = "explain" | "plan" | "hint" | "freeform";

const CACHE_KEY = "pylearn-task-assistant:v1";
const CACHE_LIMIT = 200;

const djb2 = (str: string): string => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & 0xffffffff;
  }
  return (hash >>> 0).toString(36);
};

const readCache = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeCache = (key: string, value: string) => {
  try {
    const cache = readCache();
    const keys = Object.keys(cache);
    if (keys.length >= CACHE_LIMIT && !(key in cache)) {
      const toDrop = keys.slice(0, keys.length - CACHE_LIMIT + 1);
      toDrop.forEach(k => delete cache[k]);
    }
    cache[key] = value;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore */
  }
};

export function TaskAssistant({ taskId, taskInstruction, starterCode, currentCode, topicTitle }: TaskAssistantProps) {
  const [expanded, setExpanded] = useState(false);
  const [response, setResponse] = useState("");
  const [activeKind, setActiveKind] = useState<PromptKind | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromCache, setFromCache] = useState(false);
  const [freeformInput, setFreeformInput] = useState("");
  const { model: aiModel, provider: aiProvider } = useAiSettings();

  // Task-locked system prompt — every call (preset OR free-form) carries
  // the full task context so the AI never drifts off the current exercise.
  const buildSystemPrompt = (): string =>
    "You are a patient OCR GCSE Computer Science (J277) Python tutor helping a student with a SPECIFIC coding task. " +
    "Use ONLY strict GCSE-level Python: no f-strings (use + for concatenation), no try/except, no classes, no list comprehensions, no walrus operator. " +
    "Use input(), print(), int(), str(), basic if/else, while/for loops. Keep explanations short, kind, and concrete.\n\n" +
    `TOPIC: ${topicTitle}\n\n` +
    `THE TASK THE STUDENT IS WORKING ON:\n${taskInstruction}\n\n` +
    `STARTER CODE:\n\`\`\`python\n${starterCode}\n\`\`\`\n\n` +
    `STUDENT'S CURRENT CODE:\n\`\`\`python\n${currentCode || "(empty)"}\n\`\`\`\n\n` +
    "Stay strictly focused on THIS task. Do not give the full solution unless the student explicitly asks for it.";

  const buildUserPrompt = (kind: PromptKind, freeform?: string): string => {
    switch (kind) {
      case "explain":
        return "Explain THIS task in 2-3 short sentences using plain English. What is the student being asked to do, and what concepts will they use? Do NOT give a solution.";
      case "plan":
        return "Give a numbered step-by-step plan (3-6 steps) the student can follow for THIS task. Use plain English or pseudocode. Do NOT write the full Python solution.";
      case "hint":
        return "Look at the student's current code above. Give ONE specific, encouraging hint about the very next thing they should fix or add. Do NOT rewrite the whole program. If their code is empty, suggest the first single line.";
      case "freeform":
        return `My question about this task: ${freeform}\n\nAnswer briefly and helpfully, in the context of the task above. Do NOT give the full solution unless I explicitly ask.`;
    }
  };

  const ask = async (kind: PromptKind, freeform?: string) => {
    setActiveKind(kind);
    setLoading(true);
    setError("");
    setFromCache(false);
    setResponse("");

    const cacheKeyInput =
      kind === "freeform"
        ? `${taskId}::freeform::${djb2(freeform || "")}::${djb2(currentCode || "")}`
        : kind === "hint"
          ? `${taskId}::hint::${djb2(currentCode || "")}`
          : `${taskId}::${kind}`;

    const cache = readCache();
    if (cache[cacheKeyInput]) {
      setResponse(cache[cacheKeyInput]);
      setFromCache(true);
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          topicTitle,
          model: aiModel,
          provider: aiProvider,
          messages: [
            { role: "system", content: buildSystemPrompt() },
            { role: "user", content: buildUserPrompt(kind, freeform) },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.error) throw new Error(data?.error || "Request failed");
      const content = data?.content || "No response returned.";
      setResponse(content);
      if (data?.content) writeCache(cacheKeyInput, content);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      void appLog({
        event_type: "api_error",
        origin: "TaskAssistant.ask",
        message: msg || "TaskAssistant request failed",
        details: { taskId, kind },
        severity: "error",
      });
      setError(msg || "Couldn't reach AI tutor.");
    } finally {
      setLoading(false);
    }
  };

  const submitFreeform = (e: React.FormEvent) => {
    e.preventDefault();
    const q = freeformInput.trim();
    if (!q || loading) return;
    void ask("freeform", q);
    setFreeformInput("");
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all p-4 text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">Need help with this task?</p>
            <p className="text-xs text-muted-foreground">Ask the AI tutor — it already knows what you're working on.</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>
      </button>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-card shadow-lg overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border/50 bg-primary/5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Task Assistant</span>
          {fromCache && (
            <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">Cached</Badge>
          )}
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Collapse assistant"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 grid grid-cols-1 sm:grid-cols-3 2xl:grid-cols-1 gap-2 border-b border-border/50">
        <Button
          variant={activeKind === "explain" ? "default" : "outline"}
          size="sm"
          className="justify-start gap-2 h-9"
          onClick={() => ask("explain")}
          disabled={loading}
        >
          <Sparkles className="w-3.5 h-3.5" /> Explain the task
        </Button>
        <Button
          variant={activeKind === "plan" ? "default" : "outline"}
          size="sm"
          className="justify-start gap-2 h-9"
          onClick={() => ask("plan")}
          disabled={loading}
        >
          <ListOrdered className="w-3.5 h-3.5" /> Step-by-step plan
        </Button>
        <Button
          variant={activeKind === "hint" ? "default" : "outline"}
          size="sm"
          className="justify-start gap-2 h-9"
          onClick={() => ask("hint")}
          disabled={loading}
        >
          <Lightbulb className="w-3.5 h-3.5" /> Hint on my code
        </Button>
      </div>

      <div className="flex-1 min-h-[200px] max-h-[560px] overflow-y-auto p-4 text-sm">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
          </div>
        )}
        {!loading && error && (
          <div className="text-destructive text-xs bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            {error}
          </div>
        )}
        {!loading && !error && !response && (
          <p className="text-muted-foreground/60 text-xs italic">
            Pick an option above, or ask your own question below — the assistant already knows about this task.
          </p>
        )}
        {!loading && response && (
          <ChatMessage role="assistant" content={response} />
        )}
      </div>

      <form onSubmit={submitFreeform} className="p-3 border-t border-border/50 bg-muted/20 flex gap-2">
        <input
          type="text"
          value={freeformInput}
          onChange={(e) => setFreeformInput(e.target.value)}
          placeholder="Ask anything about this task..."
          className="flex-1 text-xs px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={loading}
        />
        <Button type="submit" size="sm" className="h-8 px-3" disabled={loading || !freeformInput.trim()}>
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
}
