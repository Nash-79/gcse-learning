import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, ChevronDown, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { FollowUpSuggestions } from "@/components/chat/FollowUpSuggestions";
import { useAiSettings } from "@/lib/useAiSettings";
import { apiFetch } from "@/lib/apiFetch";
import { useOpenRouterModels } from "@/lib/useOpenRouterModels";
import { appLog } from "@/lib/appLogger";
import type { AiResponseMeta } from "@/lib/aiResponseMeta";
import { extractMeta } from "@/lib/aiResponseMeta";
import { LOVABLE_AI_MODELS } from "@/lib/lovableModels";

interface Message {
  role: "user" | "assistant";
  content: string;
  meta?: AiResponseMeta;
}

interface AiHelperProps {
  topicSlug: string;
  topicTitle: string;
  seedPrompt?: string;
}

function extractFollowUps(content: string): { cleanContent: string; suggestions: string[] } {
  const lines = content.split("\n");
  const suggestions: string[] = [];
  let followUpStart = -1;

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line.match(/^\*?\*?🔗/)) { followUpStart = i; break; }
  }

  if (followUpStart === -1) {
    for (let i = lines.length - 1; i >= Math.max(0, lines.length - 12); i--) {
      if (lines[i].trim() === "---" && i < lines.length - 2) {
        const nextNonEmpty = lines.slice(i + 1).find(l => l.trim());
        if (nextNonEmpty && nextNonEmpty.includes("🔗")) { followUpStart = i; break; }
      }
    }
  }

  if (followUpStart >= 0) {
    for (let i = followUpStart; i < lines.length; i++) {
      const match = lines[i].trim().match(/^[-•*]\s*"?(.+?)"?\s*$/);
      if (match) suggestions.push(match[1].replace(/^[""]|[""]$/g, ""));
    }
    return { cleanContent: lines.slice(0, followUpStart).join("\n").trimEnd(), suggestions };
  }

  return { cleanContent: content, suggestions: [] };
}

export function AiHelper({ topicSlug, topicTitle, seedPrompt }: AiHelperProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { model: settingsModel, provider: settingsProvider } = useAiSettings();
  const {
    freeModels,
    status: modelsStatus,
    refreshing: modelsRefreshing,
    refreshModels,
  } = useOpenRouterModels();
  const [chatModel, setChatModel] = useState(settingsModel);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (seedPrompt) {
      setInput(seedPrompt);
    }
  }, [seedPrompt]);

  const suggestedQuestions = [
    `Explain ${topicTitle} in simple terms`,
    "Can you give me an example?",
    "What are the common exam questions on this?",
    "I'm confused about this topic, help me",
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await apiFetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          topicTitle,
          model: chatModel,
          provider: settingsProvider,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Request failed");
      }

      const reply = data?.content || "Sorry, I couldn't generate a response.";
      const meta = extractMeta(data);
      setMessages(prev => [...prev, { role: "assistant", content: reply, meta }]);
    } catch (err: any) {
      void appLog({
        event_type: "api_error",
        origin: "AiHelper.sendMessage",
        message: err?.message || "AI helper request failed",
        details: { topicSlug, topicTitle, model: chatModel, provider: settingsProvider },
        error_stack: err?.stack,
        severity: "error",
      });
      setHasError(true);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Sorry, something went wrong: ${err?.message || "Unknown error"}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const modelLabel = chatModel.split("/").pop()?.replace(":free", "") || chatModel;

  return (
    <Card className="border-secondary/30 overflow-hidden rounded-2xl neon-glow-purple">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-secondary/10 to-primary/10">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-secondary" />
          <span className="font-semibold text-sm">AI Learning Assistant</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-medium">
            {hasError ? "Error" : "Connected"}
          </span>
        </div>
        <button
          onClick={() => setShowModelPicker(!showModelPicker)}
          className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          {modelLabel}
          <ChevronDown className={`w-3 h-3 transition-transform ${showModelPicker ? "rotate-180" : ""}`} />
        </button>
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
                  <option key={m.id} value={m.id}>
                    ✦ {m.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="OpenRouter Free">
                {freeModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <button
              type="button"
              onClick={() => { void refreshModels(); }}
              disabled={modelsRefreshing}
              aria-label="Refresh model list"
              title="Refresh model list"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-secondary/50 transition-colors disabled:opacity-50"
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

      <div ref={scrollRef} className="h-[400px] overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3">
            <Bot className="w-10 h-10 text-secondary/50" />
            <p className="text-sm text-muted-foreground">Ask me anything about <span className="font-semibold text-foreground">{topicTitle}</span></p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-secondary/50 hover:bg-secondary/5 text-muted-foreground hover:text-foreground transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isLastAssistant = msg.role === "assistant" && i === messages.length - 1 && !isLoading;
          const { cleanContent, suggestions } = isLastAssistant
            ? extractFollowUps(msg.content)
            : { cleanContent: msg.content, suggestions: [] };

          const handleRegenerate = msg.role === "assistant" ? () => {
            let userMsgIndex = -1;
            for (let j = i - 1; j >= 0; j--) { if (messages[j].role === "user") { userMsgIndex = j; break; } }
            if (userMsgIndex >= 0) {
              const userText = messages[userMsgIndex].content;
              setMessages(prev => prev.slice(0, i));
              setTimeout(() => sendMessage(userText), 100);
            }
          } : undefined;

          return (
            <div key={i}>
              <ChatMessage role={msg.role} content={cleanContent} onRegenerate={handleRegenerate} meta={msg.meta} />
              {isLastAssistant && suggestions.length > 0 && (
                <FollowUpSuggestions
                  suggestions={suggestions}
                  onSelect={sendMessage}
                  showHomeLink={false}
                />
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 mr-3 shrink-0">
              <Bot className="w-4 h-4 text-secondary" />
            </div>
            <div className="bg-muted/50 px-4 py-2.5 rounded-2xl rounded-bl-md flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-3 bg-muted/20">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this topic..."
            className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-secondary/50 focus:border-secondary/50"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-xl bg-secondary hover:bg-secondary/80 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
