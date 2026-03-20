import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Bot, Send, Loader2, Trash2, Sparkles, Code2, GraduationCap, Lightbulb, BookOpen, Home, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { FollowUpSuggestions } from "@/components/chat/FollowUpSuggestions";
import { useAiSettings } from "@/lib/useAiSettings";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gcse-chat`;

const suggestedPrompts = [
  { icon: Code2, label: "Debug my code", prompt: "I have a Python error I need help with. Can you help me debug it?" },
  { icon: GraduationCap, label: "Exam technique", prompt: "What are the key exam techniques for a 6-mark Python programming question on the OCR J277 paper?" },
  { icon: Lightbulb, label: "Explain a concept", prompt: "Explain how for loops work in Python with a commented example and expected output." },
  { icon: BookOpen, label: "Practice question", prompt: "Give me an OCR exam-style Python question about lists and arrays, then walk me through the answer with comments." },
];

// Extract follow-up suggestions from AI response
function extractFollowUps(content: string): { cleanContent: string; suggestions: string[] } {
  const lines = content.split("\n");
  const suggestions: string[] = [];
  let followUpStart = -1;

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line.match(/^\*?\*?🔗/)) {
      followUpStart = i;
      break;
    }
  }

  if (followUpStart === -1) {
    // Try finding the separator before follow-ups
    for (let i = lines.length - 1; i >= Math.max(0, lines.length - 12); i--) {
      if (lines[i].trim() === "---" && i < lines.length - 2) {
        const nextNonEmpty = lines.slice(i + 1).find(l => l.trim());
        if (nextNonEmpty && nextNonEmpty.includes("🔗")) {
          followUpStart = i;
          break;
        }
      }
    }
  }

  if (followUpStart >= 0) {
    for (let i = followUpStart; i < lines.length; i++) {
      const line = lines[i].trim();
      const match = line.match(/^[-•*]\s*"?(.+?)"?\s*$/);
      if (match) {
        suggestions.push(match[1].replace(/^[""]|[""]$/g, ""));
      }
    }
    const cleanContent = lines.slice(0, followUpStart).join("\n").trimEnd();
    return { cleanContent, suggestions };
  }

  return { cleanContent: content, suggestions: [] };
}

async function streamChat({
  messages,
  model,
  provider,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  model?: string;
  provider?: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
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
  const [chatModel, setChatModel] = useState(settingsModel);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Extract follow-ups from the last assistant message
  const lastAssistantMsg = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return messages[i].content;
    }
    return "";
  }, [messages]);

  const { suggestions: followUps } = useMemo(
    () => extractFollowUps(lastAssistantMsg),
    [lastAssistantMsg]
  );

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: allMessages,
        model: chatModel,
        provider: settingsProvider,
        onDelta: (chunk) => upsertAssistant(chunk),
        onDone: () => setIsLoading(false),
        onError: (msg) => {
          setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${msg}` }]);
          setIsLoading(false);
        },
      });
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
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
              <option value="google/gemini-3-flash-preview">Gemini 3 Flash (Lovable AI)</option>
              <option value="google/gemini-2.5-flash">Gemini 2.5 Flash (Lovable AI)</option>
              <optgroup label="OpenRouter Free Tier">
                <option value="meta-llama/llama-3.3-70b-instruct:free">Llama 3.3 70B</option>
                <option value="google/gemma-3-27b-it:free">Gemma 3 27B</option>
                <option value="qwen/qwen3-coder:free">Qwen3 Coder 480B</option>
                <option value="nvidia/nemotron-3-super-120b-a12b:free">Nemotron 3 Super 120B</option>
                <option value="openai/gpt-oss-120b:free">GPT-OSS 120B</option>
                <option value="mistralai/mistral-small-3.1-24b-instruct:free">Mistral Small 3.1</option>
                <option value="nousresearch/hermes-3-llama-3.1-405b:free">Hermes 3 405B</option>
              </optgroup>
              {settingsModel && !["google/gemini-3-flash-preview", "google/gemini-2.5-flash"].includes(settingsModel) && (
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
            const { cleanContent, suggestions } = isLastAssistant
              ? extractFollowUps(msg.content)
              : { cleanContent: msg.content, suggestions: [] };

            const handleRegenerate = msg.role === "assistant" ? () => {
              // Find the user message before this assistant message
              const userMsgIndex = messages.slice(0, i).findLastIndex(m => m.role === "user");
              if (userMsgIndex >= 0) {
                const userText = messages[userMsgIndex].content;
                // Remove this assistant message and resend
                setMessages(prev => prev.slice(0, i));
                setTimeout(() => send(userText), 100);
              }
            } : undefined;

            return (
              <div key={i}>
                <ChatMessage role={msg.role} content={cleanContent} onRegenerate={handleRegenerate} />
                {isLastAssistant && suggestions.length > 0 && (
                  <FollowUpSuggestions
                    suggestions={suggestions}
                    onSelect={send}
                    showHomeLink={true}
                  />
                )}
              </div>
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
                placeholder="Ask about Python, GCSE topics, exam tips, or paste code for help..."
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
              onClick={() => send(input)}
              size="icon"
              disabled={isLoading || !input.trim()}
              className="shrink-0 rounded-xl bg-secondary hover:bg-secondary/80 h-10 w-10"
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
