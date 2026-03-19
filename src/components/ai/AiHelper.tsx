import { useState } from "react";
import { Bot, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiHelperProps {
  topicSlug: string;
  topicTitle: string;
}

export function AiHelper({ topicSlug, topicTitle }: AiHelperProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    `Explain ${topicTitle} in simple terms`,
    "Can you give me an example?",
    "What are the common exam questions on this?",
    "I'm confused about this topic, help me",
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (no backend available)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Great question about ${topicTitle}! This feature requires an AI backend to be configured. You can set up an API key in the Settings page to enable AI-powered assistance.`
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="border-secondary/30 overflow-hidden rounded-2xl neon-glow-purple">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-secondary/10 to-primary/10">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-secondary" />
          <span className="font-semibold text-sm">AI Learning Assistant</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-medium">Beta</span>
        </div>
      </div>

      <div className="h-[300px] overflow-y-auto p-4 space-y-4">
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

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-muted rounded-bl-md"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted px-4 py-2.5 rounded-2xl rounded-bl-md">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
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
