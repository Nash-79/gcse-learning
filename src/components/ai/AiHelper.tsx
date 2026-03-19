import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { FollowUpSuggestions } from "@/components/chat/FollowUpSuggestions";
import { supabase } from "@/integrations/supabase/client";
import { useAiSettings } from "@/lib/useAiSettings";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiHelperProps {
  topicSlug: string;
  topicTitle: string;
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

export function AiHelper({ topicSlug, topicTitle }: AiHelperProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { model: settingsModel } = useAiSettings();
  const [chatModel, setChatModel] = useState(settingsModel);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

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
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          mode: "chat",
          topicTitle,
          model: chatModel,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const reply = data?.content || "Sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setHasError(true);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again in a moment."
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
        <div className="px-4 py-2 border-b border-border/50 bg-muted/20">
          <select
            value={chatModel}
            onChange={(e) => { setChatModel(e.target.value); setShowModelPicker(false); }}
            className="w-full text-xs bg-background border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option value={settingsModel}>Settings Default ({settingsModel.split("/").pop()?.replace(":free", "")})</option>
            <option value="google/gemini-3-flash-preview">Gemini 3 Flash (Lovable AI)</option>
            <option value="meta-llama/llama-3.3-70b-instruct:free">Llama 3.3 70B</option>
            <option value="google/gemma-3-27b-it:free">Gemma 3 27B</option>
            <option value="qwen/qwen3-coder:free">Qwen3 Coder 480B</option>
            <option value="mistralai/mistral-small-3.1-24b-instruct:free">Mistral Small 3.1</option>
          </select>
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

          return (
            <div key={i}>
              <ChatMessage role={msg.role} content={cleanContent} />
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
