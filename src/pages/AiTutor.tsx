import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, Loader2, Trash2, Sparkles, Code2, GraduationCap, Lightbulb, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { StructuredAiResponse } from "@/lib/structuredAiRenderer";
import { useAiSettings } from "@/lib/useAiSettings";
import { apiFetch } from "@/lib/apiFetch";
import { useOpenRouterModels } from "@/lib/useOpenRouterModels";
import { appLog } from "@/lib/appLogger";
import type { AiResponseMeta } from "@/lib/aiResponseMeta";
import { LOVABLE_AI_MODELS } from "@/lib/lovableModels";
import { aiCache, buildKey, djb2 } from "@/lib/aiResponseCache";

interface Message {
  role: "user" | "assistant";
  content: string;
  meta?: AiResponseMeta;
  cachedAt?: number;
}

const CHAT_URL = `/api/gcse-chat`;

const suggestedPrompts = [
  { icon: Code2, label: "Debug my code", prompt: "I have a Python error I need help with. Can you help me debug it?" },
  { icon: GraduationCap, label: "Exam technique", prompt: "What are the key exam techniques for a 6-mark Python programming question on the OCR J277 paper?" },
  { icon: Lightbulb, label: "Explain a concept", prompt: "Explain how for loops work in Python with a commented example and expected output." },
  { icon: BookOpen, label: "Practice question", prompt: "Give me an OCR exam-style Python question about lists and arrays, then walk me through the answer with comments." },
];

async function streamChat({
  messages,
  model,
  provider,
  onDelta,
  onDone,
  onError,
  onMeta,
}: {
  messages: Message[];
  model?: string;
  provider?: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
  onMeta?: (meta: AiResponseMeta) => void;
}) {
  const resp = await apiFetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, model, provider }),
  });

  if (!resp.ok) {
    let errorMsg = "Something went wrong. Please try again.";
    try {
      const err = await resp.json();
      if (err.error) errorMsg = err.error;
    } catch { /* ignore */ }
    onError(errorMsg);
    return;
  }

  if (!resp.body) {
    onError("No response received.");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed?.error) {
          onError(String(parsed.error));
          return;
        }
        // Check for meta event from reliability layer
        if (parsed?.meta && !parsed?.choices && onMeta) {
          onMeta(parsed.meta as AiResponseMeta);
          continue;
        }
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed?.error) {
          onError(String(parsed.error));
          return;
        }
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

export default function AiTutor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { model: settingsModel, provider: settingsProvider } = useAiSettings();
  const { freeModels } = useOpenRouterModels();
  const [chatModel, setChatModel] = useState(settingsModel);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);



  const send = useCallback(async (text: string, opts: { bypass?: boolean } = {}) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    // Cache key: scoped to model + full conversation hash so context-dependent
    // answers auto-miss when prior turns change.
    const convoHash = djb2(allMessages.map((m) => `${m.role}:${m.content}`).join("\n"));
    const cacheKey = buildKey(["ai-tutor", chatModel, convoHash]);
    const cached = aiCache.get("ai-tutor", cacheKey, { bypass: opts.bypass });
    if (cached) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: cached.content,
        meta: cached.meta,
        cachedAt: cached.createdAt,
      }]);
      setIsLoading(false);
      return;
    }

    let assistantSoFar = "";
    let streamMeta: AiResponseMeta | undefined;

    const upsertAssistant = (nextChunk: string, meta?: AiResponseMeta) => {
      assistantSoFar += nextChunk;
      const m = meta || streamMeta;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((msg, i) => (i === prev.length - 1 ? { ...msg, content: assistantSoFar, meta: m } : msg));
        }
        return [...prev, { role: "assistant", content: assistantSoFar, meta: m }];
      });
    };

    try {
      await streamChat({
        messages: allMessages,
        model: chatModel,
        provider: settingsProvider,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => {
          // Apply final meta + cache the full assembled response.
          if (streamMeta) {
            setMessages(prev => prev.map((msg, i) =>
              i === prev.length - 1 && msg.role === "assistant" ? { ...msg, meta: streamMeta } : msg
            ));
          }
          if (assistantSoFar.trim()) {
            aiCache.set("ai-tutor", cacheKey, { content: assistantSoFar, meta: streamMeta, model: chatModel });
          }
          setIsLoading(false);
        },
        onMeta: (meta) => { streamMeta = meta; },
        onError: (msg) => {
          void appLog({
            event_type: "api_error",
            origin: "AiTutor.streamChat.onError",
            message: msg || "AI tutor stream error",
            details: { model: chatModel, provider: settingsProvider },
            severity: "error",
          });
          setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${msg}` }]);
          setIsLoading(false);
        },
      });
    } catch (err: any) {
      void appLog({
        event_type: "api_error",
        origin: "AiTutor.send.catch",
        message: err?.message || "AI tutor connection error",
        details: { model: chatModel, provider: settingsProvider },
        error_stack: err?.stack,
        severity: "error",
      });
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
      setIsLoading(false);
    }
  }, [messages, isLoading, chatModel, settingsProvider]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input, { bypass: e.altKey });
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 pb-24 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-primary shadow-lg shadow-secondary/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-extrabold tracking-tight text-foreground">PyLearn AI Tutor</h1>
            <p className="text-sm text-muted-foreground">Your GCSE Computer Science study buddy — ask anything about Python!</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold flex items-center gap-1">
            <GraduationCap className="w-3 h-3" /> OCR J277
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-semibold flex items-center gap-1">
            <GraduationCap className="w-3 h-3" /> AQA 8525
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Streaming AI
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={chatModel}
              onChange={(e) => setChatModel(e.target.value)}
              className="text-[11px] bg-muted/50 border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 max-w-[200px] truncate"
            >
              <optgroup label="Lovable AI">
                {LOVABLE_AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    ✦ {m.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="OpenRouter Free Tier">
                {freeModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </optgroup>
              {settingsModel && !LOVABLE_AI_MODELS.some(m => m.id === settingsModel) && !freeModels.some(m => m.id === settingsModel) && (
                <option value={settingsModel}>Settings: {settingsModel.split("/").pop()}</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <Card className="flex-1 flex flex-col overflow-hidden rounded-2xl border-border/50 min-h-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-12">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-secondary/20 via-primary/20 to-accent/20 rounded-full blur-xl" />
                <Bot className="w-16 h-16 text-secondary relative" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold mb-2">What would you like to learn?</h2>
                <p className="text-muted-foreground text-sm max-w-md">
                  I can help with Python code, explain concepts, create practice questions, and give exam tips — all scoped to GCSE Computer Science.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-2">
                {suggestedPrompts.map((sp, i) => {
                  const Icon = sp.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => send(sp.prompt)}
                      className="flex items-center gap-3 text-left px-4 py-3 rounded-xl border border-border/50 hover:border-secondary/50 hover:bg-secondary/5 transition-all group"
                    >
                      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors shrink-0" />
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{sp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {messages.map((msg, i) => {
            const isLastAssistant = msg.role === "assistant" && i === messages.length - 1 && !isLoading;

            const handleRegenerate = msg.role === "assistant" ? (bypass = true) => {
              let userMsgIndex = -1;
              for (let j = i - 1; j >= 0; j--) { if (messages[j].role === "user") { userMsgIndex = j; break; } }
              if (userMsgIndex >= 0) {
                const userText = messages[userMsgIndex].content;
                setMessages(prev => prev.slice(0, i));
                setTimeout(() => send(userText, { bypass }), 100);
              }
            } : undefined;

            if (msg.role === "user") {
              return (
                <ChatMessage key={i} role="user" content={msg.content} />
              );
            }

            return (
              <StructuredAiResponse
                key={i}
                content={msg.content}
                onRegenerate={handleRegenerate ? () => handleRegenerate(true) : undefined}
                meta={msg.meta}
                onSuggestionClick={i === messages.length - 1 ? (p) => send(p) : undefined}
                showHomeLink={isLastAssistant}
                isSuggestionsLoading={i === messages.length - 1 && isLoading}
                suggestionOrigin="ai_tutor"
                cachedAt={msg.cachedAt}
                onBypassCache={msg.cachedAt && handleRegenerate ? () => handleRegenerate(true) : undefined}
              />
            );
          })}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 mr-3 shrink-0">
                <Bot className="w-4 h-4 text-secondary" />
              </div>
              <div className="bg-muted/50 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                <span className="text-xs text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-border/50 p-3 md:p-4 bg-muted/10">
          <div className="flex items-end gap-2">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="shrink-0 rounded-xl text-muted-foreground hover:text-destructive h-10 w-10"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Python, GCSE topics, exam tips… (⌥/Alt + Enter skips cache)"
                rows={1}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 resize-none min-h-[42px] max-h-[120px] overflow-y-auto"
                style={{ height: "auto" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 120) + "px";
                }}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={(e) => send(input, { bypass: (e as React.MouseEvent).altKey })}
              size="icon"
              disabled={isLoading || !input.trim()}
              className="shrink-0 rounded-xl bg-secondary hover:bg-secondary/80 h-10 w-10"
              title="Send (Alt to bypass cache)"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            PyLearn AI is scoped to GCSE Computer Science. Press Enter to send, Shift+Enter for new line.
          </p>
        </div>
      </Card>
    </div>
  );
}
