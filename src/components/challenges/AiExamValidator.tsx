import { useState } from "react";
import { Bot, Send, Loader2, CheckCircle2, XCircle, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface AiExamValidatorProps {
  topicTitle: string;
  topicSlug: string;
}

interface ValidationResult {
  score: number;
  maxScore: number;
  grade: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
  examTips: string[];
}

export function AiExamValidator({ topicTitle, topicSlug }: AiExamValidatorProps) {
  const [code, setCode] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // No longer need useAiSettings - backend handles API key

  const validate = async () => {
    if (!code.trim() || !hasAi) return;
    setIsValidating(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${settings.apiKey}`,
          "HTTP-Referer": window.location.origin,
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [{
            role: "system",
            content: `You are an OCR GCSE Computer Science exam marker. Grade Python code submissions for the topic "${topicTitle}". 

Return ONLY a JSON object with:
- score (0-10 integer)
- maxScore (always 10)
- grade ("A*"|"A"|"B"|"C"|"D"|"U")
- feedback (2-3 sentence overall feedback as an encouraging teacher)
- strengths (array of 2-3 things done well)
- improvements (array of 1-3 things to improve)
- examTips (array of 1-2 OCR exam-specific tips relevant to this code)

Grade using OCR mark scheme criteria:
- Correct syntax and logic (3 marks)
- Appropriate use of programming constructs (2 marks)  
- Code clarity and comments (2 marks)
- Completeness of solution (3 marks)

Be encouraging but honest. Reference OCR J277 exam expectations where relevant.`
          }, {
            role: "user",
            content: `Topic: ${topicTitle}\n${taskDescription ? `Task: ${taskDescription}\n` : ""}Student code:\n\`\`\`python\n${code}\n\`\`\``
          }],
          max_tokens: 1000,
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "";
      const parsed: ValidationResult = JSON.parse(text);
      setResult(parsed);
    } catch (err: any) {
      setError(err.message || "Failed to validate. Check your API key in Settings.");
    } finally {
      setIsValidating(false);
    }
  };

  if (!hasAi) {
    return (
      <Card className="border-secondary/20 rounded-2xl">
        <CardContent className="p-6 text-center">
          <Bot className="w-10 h-10 mx-auto mb-3 text-secondary/50" />
          <h3 className="font-display font-bold mb-1">AI Exam Validator</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Configure an OpenRouter API key in Settings to unlock AI-powered code grading.
          </p>
        </CardContent>
      </Card>
    );
  }

  const gradeColor = (grade: string) => {
    if (grade === "A*" || grade === "A") return "text-green-500";
    if (grade === "B") return "text-blue-400";
    if (grade === "C") return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className="border-secondary/20 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b bg-gradient-to-r from-secondary/10 to-primary/10">
        <Sparkles className="w-4 h-4 text-secondary" />
        <span className="font-semibold text-sm">AI Exam Validator</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-medium">OCR J277</span>
      </div>

      <CardContent className="p-5 space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Task Description (optional)
          </label>
          <input
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="e.g. Write a program that validates a password..."
            className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-secondary/50"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Your Python Code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your Python code here for grading..."
            className="w-full h-[200px] bg-[#1e1e1e] text-blue-100 font-mono text-sm border border-border rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-1 focus:ring-secondary/50"
            spellCheck={false}
          />
        </div>

        <Button
          onClick={validate}
          disabled={isValidating || !code.trim()}
          className="w-full gap-2 bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground rounded-xl h-11 font-semibold"
        >
          {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {isValidating ? "Marking..." : "Submit for Grading"}
        </Button>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4 pt-2">
            {/* Score Header */}
            <div className="flex items-center justify-between bg-muted/30 rounded-xl px-5 py-4 border border-border/50">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Your Score</p>
                <p className="text-3xl font-display font-bold">
                  {result.score}<span className="text-base text-muted-foreground">/{result.maxScore}</span>
                </p>
              </div>
              <div className={`text-4xl font-display font-extrabold ${gradeColor(result.grade)}`}>
                {result.grade}
              </div>
            </div>

            {/* Feedback */}
            <p className="text-sm text-foreground/80 leading-relaxed bg-muted/20 rounded-xl px-4 py-3 border border-border/30">
              {result.feedback}
            </p>

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-green-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                </h4>
                <ul className="space-y-1.5">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-foreground/80 bg-green-500/5 border border-green-500/10 rounded-lg px-3 py-2">
                      ✓ {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {result.improvements.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-yellow-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> Areas to Improve
                </h4>
                <ul className="space-y-1.5">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="text-sm text-foreground/80 bg-yellow-500/5 border border-yellow-500/10 rounded-lg px-3 py-2">
                      → {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Exam Tips */}
            {result.examTips.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> OCR Exam Tips
                </h4>
                <ul className="space-y-1.5">
                  {result.examTips.map((s, i) => (
                    <li key={i} className="text-sm text-foreground/80 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
                      💡 {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
