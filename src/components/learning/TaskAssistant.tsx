import { useEffect, useState } from "react";
import { Bot, ChevronDown, ChevronUp, Sparkles, ListOrdered, Lightbulb, Send, RefreshCw, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StructuredAiResponse } from "@/lib/structuredAiRenderer";
import { apiFetch } from "@/lib/apiFetch";
import { useAiSettings } from "@/lib/useAiSettings";
import { useOpenRouterModels } from "@/lib/useOpenRouterModels";
import { LOVABLE_AI_MODELS } from "@/lib/lovableModels";
import { appLog } from "@/lib/appLogger";
import { extractMeta } from "@/lib/aiResponseMeta";
import type { AiResponseMeta } from "@/lib/aiResponseMeta";
import { aiCache, djb2, migrateLegacyCaches } from "@/lib/aiResponseCache";

export interface TaskAssistantProps {
  taskId: string;
  taskInstruction: string;
  starterCode: string;
  currentCode: string;
  topicTitle: string;
  lastOutput?: string;
}

type PromptKind = "explain" | "plan" | "hint" | "freeform" | "explain_output";

const MODEL_KEY = "pylearn-task-assistant-model:v1";

export function TaskAssistant({ taskId, taskInstruction, starterCode, currentCode, topicTitle, lastOutput }: TaskAssistantProps) {
  const [expanded, setExpanded] = useState(false);
  const [response, setResponse] = useState("");
  const [responseMeta, setResponseMeta] = useState<AiResponseMeta | undefined>();
  const [activeKind, setActiveKind] = useState<PromptKind | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromCache, setFromCache] = useState(false);
  const [cachedAt, setCachedAt] = useState<number | undefined>(undefined);
  const [lastAsk, setLastAsk] = useState<{ kind: PromptKind; freeform?: string } | null>(null);
  const [freeformInput, setFreeformInput] = useState("");
  const { model: settingsModel, provider: settingsProvider } = useAiSettings();
  const { freeModels, status: modelsStatus, refreshing: modelsRefreshing, refreshModels } = useOpenRouterModels();

  // Initialise from persisted choice → fall back to global settings model.
  const [chatModel, setChatModel] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(MODEL_KEY);
      if (saved && saved.trim()) return saved;
    } catch { /* ignore */ }
    return settingsModel;
  });
  const [showModelPicker, setShowModelPicker] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(MODEL_KEY, chatModel); } catch { /* ignore */ }
  }, [chatModel]);

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
      case "explain_output":
        return `My code just produced this output:\n\`\`\`\n${lastOutput}\n\`\`\`\n\nIs this correct for the task? Explain in 2 short paragraphs what the output means and whether it solves the task. Do NOT give the full solution.`;
    }
  };

  const ask = async (kind: PromptKind, freeform?: string, opts: { bypass?: boolean } = {}) => {
    setActiveKind(kind);
    setLastAsk({ kind, freeform });
    setLoading(true);
    setError("");
    setFromCache(false);
    setCachedAt(undefined);
    setResponse("");
    setResponseMeta(undefined);

    const cacheKeyInput =
      kind === "freeform"
        ? `${taskId}::freeform::${djb2(freeform || "")}::${djb2(currentCode || "")}::${chatModel}`
        : kind === "hint"
          ? `${taskId}::hint::${djb2(currentCode || "")}::${chatModel}`
          : kind === "explain_output"
            ? `${taskId}::explain_output::${djb2(lastOutput || "")}::${chatModel}`
            : `${taskId}::${kind}::${chatModel}`;

    const cached = aiCache.get("task-assistant", cacheKeyInput, { bypass: opts.bypass });
    if (cached) {
      setResponse(cached.content);
      setResponseMeta(cached.meta);
      setFromCache(true);
      setCachedAt(cached.createdAt);
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "generate",
          topicTitle,
          model: chatModel,
          provider: settingsProvider,
          systemPromptOverride: buildSystemPrompt(),
          userPromptOverride: buildUserPrompt(kind, freeform),
        }),
      });
      const data = await res.json();
      if (!res.ok || data?.error) throw new Error(data?.error || "Request failed");
      const content = data?.content || "No response returned.";
      const meta = extractMeta(data);
      setResponse(content);
      setResponseMeta(meta);
      if (data?.content) {
        aiCache.set("task-assistant", cacheKeyInput, { content, meta, model: chatModel });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      void appLog({
        event_type: "api_error",
        origin: "TaskAssistant.ask",
        message: msg || "TaskAssistant request failed",
        details: { taskId, kind, model: chatModel },
        severity: "error",
      });
      setError(msg || "Couldn't reach AI tutor.");
    } finally {
      setLoading(false);
    }
  };

  // Migrate any legacy `pylearn-task-assistant:v1` cache once on mount.
  useEffect(() => { migrateLegacyCaches(); }, []);

  const bypassCacheAndRetry = () => {
    if (!lastAsk) return;
    void ask(lastAsk.kind, lastAsk.freeform, { bypass: true });
  };

  const submitFreeform = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = freeformInput.trim();
    if (!q || loading) return;
    // Hold Alt (⌥) while pressing Enter / clicking Send to bypass cache.
    const native = (e.nativeEvent as unknown) as { altKey?: boolean; submitter?: HTMLElement | null };
    const bypass = !!native?.altKey || (native?.submitter?.dataset?.bypass === "1");
    void ask("freeform", q, { bypass });
    setFreeformInput("");
  };

  const handleSuggestionClick = (prompt: string) => {
    void ask("freeform", prompt);
  };

  const modelLabel = chatModel.split("/").pop()?.replace(":free", "") || chatModel;

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
        <div className="flex items-center gap-2 min-w-0">
          <Bot className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-bold text-foreground">Task Assistant</span>
          {fromCache && (
            <Badge variant="outline" className="text-[10px] h-5 border-primary/30 text-primary">Cached</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowModelPicker((v) => !v)}
            className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            title="Choose AI model"
          >
            {modelLabel}
            <ChevronDown className={`w-3 h-3 transition-transform ${showModelPicker ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => setExpanded(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Collapse assistant"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showModelPicker && (
        <div className="px-4 py-2 border-b border-border/50 bg-muted/20 space-y-1.5">
          <div className="flex items-center gap-2">
            <select
              aria-label="AI model"
              title="AI model"
              value={chatModel}
              onChange={(e) => { setChatModel(e.target.value); setShowModelPicker(false); }}
              className="flex-1 text-xs bg-background border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value={settingsModel}>Settings Default ({settingsModel.split("/").pop()?.replace(":free", "")})</option>
              <optgroup label="Lovable AI">
                {LOVABLE_AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>✦ {m.name}</option>
                ))}
              </optgroup>
              <optgroup label="OpenRouter Free">
                {freeModels.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </optgroup>
            </select>
            <button
              type="button"
              onClick={() => { void refreshModels(); }}
              disabled={modelsRefreshing}
              aria-label="Refresh model list"
              title="Refresh model list"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${modelsRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
          {modelsStatus === "loading" && (
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading OpenRouter catalog…
            </p>
          )}
          {modelsStatus === "fallback" && (
            <p className="text-[10px] text-amber-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Using built-in defaults — live catalog unavailable.
            </p>
          )}
        </div>
      )}

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
        <Button
          variant={activeKind === "explain_output" ? "default" : "outline"}
          size="sm"
          className="justify-start gap-2 h-9"
          onClick={() => ask("explain_output")}
          disabled={loading || !lastOutput}
          title={!lastOutput ? "Run your code first" : undefined}
        >
          📤 Explain my output
        </Button>
      </div>

      <div className="flex-1 min-h-[200px] max-h-[640px] overflow-y-auto p-4">
        {loading && !response && (
          <div className="space-y-2 py-1">
            {(["w-4/5", "w-3/5", "w-2/5"] as const).map((wCls, i) => (
              <div
                key={i}
                className={`relative h-3 rounded bg-muted/40 overflow-hidden ${wCls}`}
              >
                <span className="block h-full w-1/3 -translate-x-full animate-[shimmer_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-secondary/15 to-transparent" />
              </div>
            ))}
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
        {response && (
          <StructuredAiResponse
            content={response}
            meta={responseMeta}
            onSuggestionClick={handleSuggestionClick}
            onRegenerate={lastAsk ? bypassCacheAndRetry : undefined}
            showHomeLink={false}
            isSuggestionsLoading={loading}
            suggestionOrigin={`task_assistant:${taskId}`}
            cachedAt={fromCache ? cachedAt : undefined}
            onBypassCache={fromCache && lastAsk ? bypassCacheAndRetry : undefined}
          />
        )}
      </div>

      <form onSubmit={submitFreeform} className="p-3 border-t border-border/50 bg-muted/20 flex gap-2">
        <input
          type="text"
          value={freeformInput}
          onChange={(e) => setFreeformInput(e.target.value)}
          placeholder="Ask anything about this task… (hold ⌥/Alt + Enter to skip cache)"
          className="flex-1 text-xs px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={loading}
        />
        <Button type="submit" size="sm" className="h-8 px-3" disabled={loading || !freeformInput.trim()} title="Send (hold Alt to bypass cache)">
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
}
