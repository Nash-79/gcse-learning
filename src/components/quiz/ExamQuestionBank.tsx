import { useState, useMemo, useCallback } from "react";
import { ChevronDown, Lightbulb, CheckCircle2, XCircle, Sparkles, Loader2, AlertTriangle, Code2, Zap, Flame, Target, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { QuizQuestion } from "@/data/topicContent";
import { supabase } from "@/integrations/supabase/client";

interface ExamQuestionBankProps {
  topicSlug: string;
  topicTitle: string;
  questions: QuizQuestion[];
  onQuestionsGenerated?: (questions: QuizQuestion[]) => void;
}

const difficultyConfig = {
  easy: { label: "Easy", icon: Zap, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", badge: "bg-green-500/20 text-green-400" },
  medium: { label: "Medium", icon: Flame, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", badge: "bg-yellow-500/20 text-yellow-400" },
  hard: { label: "Hard", icon: Target, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", badge: "bg-red-500/20 text-red-400" },
};

function QuestionItem({ question, index }: { question: QuizQuestion; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const diff = question.difficulty || "medium";
  const config = difficultyConfig[diff];
  const DiffIcon = config.icon;

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelectedOption(i);
    setRevealed(true);
  };

  const reset = () => {
    setSelectedOption(null);
    setRevealed(false);
    setShowHint(false);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:bg-muted/30 ${isOpen ? "bg-muted/20 border-primary/30" : "border-border/50"}`}>
          <span className="text-xs font-bold text-muted-foreground w-7 shrink-0">Q{index + 1}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${config.badge}`}>
            <DiffIcon className="w-3 h-3" />
            {config.label}
          </span>
          <span className="text-sm font-medium text-foreground text-left flex-1 line-clamp-1">{question.question}</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-2 ml-7 space-y-3">
          {/* Pseudocode / Hint */}
          {question.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-xs text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              {showHint ? "Hide pseudocode / hint" : "Show pseudocode / hint"}
            </button>
          )}
          {showHint && question.hint && (
            <div className="text-xs px-3 py-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-mono whitespace-pre-wrap">
              💡 {question.hint}
            </div>
          )}

          {/* Options */}
          <div className="grid gap-2">
            {question.options.map((opt, i) => {
              let style = "border-border/50 hover:border-primary/40 hover:bg-primary/5 cursor-pointer";
              if (revealed) {
                if (i === question.correctIndex) style = "border-green-500/50 bg-green-500/10 text-green-400";
                else if (i === selectedOption) style = "border-red-500/50 bg-red-500/10 text-red-400";
                else style = "border-border/30 opacity-50";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={revealed}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm flex items-center gap-2 transition-all ${style}`}
                >
                  <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 ${
                    revealed && i === question.correctIndex ? "bg-green-500 text-white" :
                    revealed && i === selectedOption ? "bg-red-500 text-white" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {revealed && i === question.correctIndex ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                     revealed && i === selectedOption ? <XCircle className="w-3.5 h-3.5" /> :
                     String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {revealed && (
            <div className={`text-xs px-3 py-2.5 rounded-lg border ${
              selectedOption === question.correctIndex
                ? "border-green-500/20 bg-green-500/5 text-green-400"
                : "border-red-500/20 bg-red-500/5 text-red-400"
            }`}>
              <span className="font-semibold">{selectedOption === question.correctIndex ? "✓ Correct!" : "✗ Incorrect"}</span>
              <span className="text-muted-foreground ml-1">{question.explanation}</span>
            </div>
          )}

          {revealed && (
            <button onClick={reset} className="text-xs text-primary hover:underline">Try again</button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function ExamQuestionBank({ topicSlug, topicTitle, questions, onQuestionsGenerated }: ExamQuestionBankProps) {
  
  const [filterDifficulty, setFilterDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [genCount, setGenCount] = useState(0);

  const filtered = useMemo(() => {
    if (filterDifficulty === "all") return questions;
    return questions.filter(q => q.difficulty === filterDifficulty);
  }, [questions, filterDifficulty]);

  const counts = useMemo(() => ({
    all: questions.length,
    easy: questions.filter(q => q.difficulty === "easy").length,
    medium: questions.filter(q => q.difficulty === "medium").length,
    hard: questions.filter(q => q.difficulty === "hard").length,
  }), [questions]);

  const generateExamQuestions = useCallback(async () => {
    setIsGenerating(true);
    setGenError(null);
    try {
      const systemPrompt = `You are an OCR GCSE Computer Science exam question writer. Generate exactly 9 multiple-choice exam-style questions about "${topicTitle}" — 3 easy, 3 medium, 3 hard. 
            
Each question MUST include a "hint" field containing pseudocode or a structured hint that helps students plan their answer. The pseudocode should use standard OCR pseudocode notation where applicable (e.g., IF...THEN...ENDIF, FOR...NEXT, WHILE...ENDWHILE, INPUT, OUTPUT, PRINT).

Return ONLY a JSON object with a "questions" array of objects with: question (string), options (array of 4 strings), correctIndex (0-3), explanation (string), hint (string - pseudocode or structured hint), difficulty ("easy"|"medium"|"hard").

Make questions exam-realistic — reference OCR J277 specification topics. Include questions about tracing code, identifying errors, predicting output, and understanding concepts. Do not repeat these existing questions: ${questions.slice(0, 5).map(q => q.question).join("; ")}`;

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          mode: "generate",
          topicTitle,
          systemPromptOverride: systemPrompt,
          userPromptOverride: `Generate 9 OCR GCSE exam-style questions about ${topicTitle} with pseudocode hints.`,
          maxTokens: 3000,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const text = data?.content || "";
      const parsed = JSON.parse(text);
      const newQuestions: QuizQuestion[] = Array.isArray(parsed) ? parsed : parsed.questions || [];
      if (newQuestions.length === 0) throw new Error("No questions generated");
      setGenCount(prev => prev + newQuestions.length);
      onQuestionsGenerated?.(newQuestions);
    } catch (err: any) {
      setGenError(err.message || "Failed to generate exam questions");
    } finally {
      setIsGenerating(false);
    }
  }, [topicTitle, questions, onQuestionsGenerated]);

  return (
    <Card className="border-border/50 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="font-display font-bold text-sm">Exam Question Bank</span>
          <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-none">{questions.length} questions</Badge>
        </div>
        {hasAi && (
          <Button
            variant="outline"
            size="sm"
            onClick={generateExamQuestions}
            disabled={isGenerating}
            className="gap-1.5 rounded-full border-secondary/30 text-secondary hover:bg-secondary/10 text-xs h-8"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {isGenerating ? "Generating..." : "Generate AI Questions"}
          </Button>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Difficulty filters */}
        <div className="flex flex-wrap gap-2">
          {(["all", "easy", "medium", "hard"] as const).map(d => {
            const isActive = filterDifficulty === d;
            const label = d === "all" ? "All" : difficultyConfig[d].label;
            const count = counts[d];
            return (
              <button
                key={d}
                onClick={() => setFilterDifficulty(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isActive
                    ? d === "all" ? "bg-foreground text-background" : difficultyConfig[d].badge + " border-current"
                    : "bg-muted/30 border-border/50 hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {genCount > 0 && (
          <div className="flex items-center gap-2 text-xs bg-secondary/10 text-secondary border border-secondary/20 rounded-lg px-3 py-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            {genCount} AI-generated questions added to the bank
          </div>
        )}

        {genError && (
          <div className="flex items-center justify-between gap-2 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-lg px-3 py-2">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {genError}
            </div>
            <button onClick={() => setGenError(null)} className="text-[10px] underline opacity-80 hover:opacity-100">Dismiss</button>
          </div>
        )}

        {/* Question list */}
        <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No questions for this difficulty. {hasAi && "Try generating some with AI!"}
            </p>
          ) : (
            filtered.map((q, i) => (
              <QuestionItem key={`${topicSlug}-${filterDifficulty}-${i}`} question={q} index={i} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
