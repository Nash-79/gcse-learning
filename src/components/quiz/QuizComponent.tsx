import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, Trophy, RotateCcw, Lightbulb, Sparkles, Flame, Zap, Target, Bot, Loader2, HelpCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";
import { useSubmitQuizResult } from "@/hooks/useTopics";
import { apiFetch } from "@/lib/apiFetch";
import { useAiSettings } from "@/lib/useAiSettings";
import { appLog } from "@/lib/appLogger";

export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
  difficulty?: Difficulty;
}

interface QuizComponentProps {
  topicSlug: string;
  questions: QuizQuestion[];
  onGenerateMore?: () => void;
  isGenerating?: boolean;
  onSendToAiTutor?: (prompt: string) => void;
}

const AI_EXPLAIN_CACHE_KEY = "pylearn-quiz-ai-explain:v1";
const AI_EXPLAIN_CACHE_LIMIT = 200;

const djb2 = (str: string): string => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & 0xffffffff;
  }
  return (hash >>> 0).toString(36);
};

const readExplainCache = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(AI_EXPLAIN_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeExplainCache = (key: string, value: string) => {
  try {
    const cache = readExplainCache();
    // FIFO eviction: drop oldest entries when at limit
    const keys = Object.keys(cache);
    if (keys.length >= AI_EXPLAIN_CACHE_LIMIT && !(key in cache)) {
      const toDrop = keys.slice(0, keys.length - AI_EXPLAIN_CACHE_LIMIT + 1);
      toDrop.forEach(k => delete cache[k]);
    }
    cache[key] = value;
    localStorage.setItem(AI_EXPLAIN_CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore (private mode, quota, etc.) */
  }
};

const difficultyConfig = {
  easy: { label: "Easy", icon: Zap, color: "text-green-400", bg: "bg-green-500/10 border-green-500/30 hover:bg-green-500/20", activeBg: "bg-green-500 text-white" },
  medium: { label: "Medium", icon: Flame, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20", activeBg: "bg-yellow-500 text-black" },
  hard: { label: "Hard", icon: Target, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30 hover:bg-red-500/20", activeBg: "bg-red-500 text-white" },
};

export function QuizComponent({ topicSlug, questions, onGenerateMore, isGenerating }: QuizComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [usedHintThisAttempt, setUsedHintThisAttempt] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [aiExplaining, setAiExplaining] = useState(false);
  const [aiError, setAiError] = useState<string>("");

  const submitQuiz = useSubmitQuizResult();
  const { model: aiModel, provider: aiProvider } = useAiSettings();

  const filteredQuestions = useMemo(() => {
    if (selectedDifficulty === "all") return questions;
    return questions.filter(q => q.difficulty === selectedDifficulty);
  }, [questions, selectedDifficulty]);

  const activeQuestions = filteredQuestions.length > 0 ? filteredQuestions : questions;
  const currentQ = activeQuestions[currentIndex];
  const progressPercent = activeQuestions.length > 0 ? (currentIndex / activeQuestions.length) * 100 : 0;

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
  };

  const resetPerQuestionAi = () => {
    setAiExplanation("");
    setAiError("");
    setAiExplaining(false);
  };

  const handleNext = () => {
    const earnedPoint = selectedOption === currentQ.correctIndex ? 1 : 0;
    const newScore = score + earnedPoint;

    if (currentIndex < activeQuestions.length - 1) {
      setScore(newScore);
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
      resetPerQuestionAi();
    } else {
      finishQuiz(newScore);
    }
  };

  const explainWithAi = async () => {
    if (aiExplaining || !currentQ || selectedOption === null) return;
    setAiExplaining(true);
    setAiError("");
    setAiExplanation("");

    const studentChoice = currentQ.options[selectedOption];
    const correctChoice = currentQ.options[currentQ.correctIndex];
    const prompt =
      `I got this OCR GCSE Computer Science quick-quiz question wrong. Please explain in 2-3 short paragraphs why my answer is incorrect and why the correct one is right. Use simple GCSE-level language.\n\n` +
      `Question: ${currentQ.question}\n` +
      `My answer: ${studentChoice}\n` +
      `Correct answer: ${correctChoice}\n` +
      `Existing explanation: ${currentQ.explanation}`;

    try {
      const response = await apiFetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          topicTitle: topicSlug,
          model: aiModel,
          provider: aiProvider,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      if (!response.ok || data?.error) throw new Error(data?.error || "Request failed");
      setAiExplanation(data?.content || "No explanation returned.");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      void appLog({
        event_type: "api_error",
        origin: "QuizComponent.explainWithAi",
        message: errMsg || "Quiz AI explain failed",
        details: { topicSlug, question: currentQ.question },
        severity: "error",
      });
      setAiError(errMsg || "Couldn't reach AI tutor.");
    } finally {
      setAiExplaining(false);
    }
  };


  const finishQuiz = (computedScore: number) => {
    setFinalScore(computedScore);
    setIsFinished(true);

    if (computedScore >= activeQuestions.length * 0.8) {
      triggerConfetti();
    }

    submitQuiz.mutate({
      data: { topicSlug, score: computedScore, totalQuestions: activeQuestions.length, usedHints: usedHintThisAttempt }
    });
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setFinalScore(0);
    setIsFinished(false);
    setShowHint(false);
    setUsedHintThisAttempt(false);
    resetPerQuestionAi();
  };

  const switchDifficulty = (d: Difficulty | "all") => {
    setSelectedDifficulty(d);
    restartQuiz();
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) { clearInterval(interval); return; }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const hasDifficultyTags = questions.some(q => q.difficulty);
  const difficultyCounts = {
    easy: questions.filter(q => q.difficulty === "easy").length,
    medium: questions.filter(q => q.difficulty === "medium").length,
    hard: questions.filter(q => q.difficulty === "hard").length,
  };

  if (isFinished) {
    const percentage = Math.round((finalScore / activeQuestions.length) * 100);
    const isSuccess = percentage >= 60;

    return (
      <Card className="w-full border-primary/20 shadow-xl overflow-hidden relative neon-glow">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent animate-shimmer"></div>
        <CardContent className="pt-12 pb-8 flex flex-col items-center text-center">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-6 ${isSuccess ? 'bg-green-500/20 text-green-500 neon-glow-green' : 'bg-destructive/20 text-destructive'}`}>
            <Trophy className={`w-14 h-14 ${isSuccess ? 'animate-bounce' : ''}`} />
          </div>
          <h3 className="text-3xl font-display font-bold mb-2">
            {percentage >= 80 ? "Outstanding! 🎉" : isSuccess ? "Great Work!" : "Keep Practicing!"}
          </h3>
          <p className="text-muted-foreground mb-2 text-lg">
            You scored <span className="font-bold text-foreground">{finalScore}</span> out of <span className="font-bold text-foreground">{activeQuestions.length}</span> ({percentage}%)
          </p>

          <div className="flex gap-3 flex-wrap justify-center mt-4">
            <Button onClick={restartQuiz} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </Button>
            {onGenerateMore && (
              <Button onClick={onGenerateMore} disabled={isGenerating} className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Sparkles className="w-4 h-4" />
                {isGenerating ? "Generating..." : "AI Quiz"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQ) {
    return (
      <Card className="w-full p-8 text-center">
        <p className="text-muted-foreground mb-4">No questions available for this difficulty level.</p>
        <Button onClick={() => switchDifficulty("all")} variant="outline">Show All Questions</Button>
      </Card>
    );
  }

  return (
    <Card className="w-full border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        {hasDifficultyTags && (
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => switchDifficulty("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedDifficulty === "all" ? "bg-foreground text-background" : "bg-muted/50 border-border hover:bg-muted"}`}
            >
              All ({questions.length})
            </button>
            {(["easy", "medium", "hard"] as const).map(d => {
              const config = difficultyConfig[d];
              const count = difficultyCounts[d];
              if (count === 0) return null;
              const Icon = config.icon;
              return (
                <button
                  key={d}
                  onClick={() => switchDifficulty(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${selectedDifficulty === d ? config.activeBg : config.bg}`}
                >
                  <Icon className="w-3 h-3" />
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none">
            Question {currentIndex + 1} of {activeQuestions.length}
          </Badge>
          <span className="text-sm font-medium text-muted-foreground">Score: {score}</span>
        </div>
        <Progress value={progressPercent} className="h-2 bg-muted" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <h4 className="text-xl font-semibold text-foreground leading-tight">
          {currentQ.question}
        </h4>

        {currentQ.hint && !isAnswered && (
          <button
            onClick={() => {
              if (!showHint) {
                setUsedHintThisAttempt(true);
              }
              setShowHint(!showHint);
            }}
            className="flex items-center gap-2 text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? "Hide hint" : "Show hint"}
          </button>
        )}
        {showHint && currentQ.hint && (
          <div className="text-sm px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
            💡 {currentQ.hint}
          </div>
        )}

        <div className="grid gap-3">
          {currentQ.options.map((option, i) => {
            let optionStyle = "border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer";
            if (isAnswered) {
              if (i === currentQ.correctIndex) {
                optionStyle = "border-green-500 bg-green-500/10 text-green-500";
              } else if (i === selectedOption && i !== currentQ.correctIndex) {
                optionStyle = "border-red-500 bg-red-500/10 text-red-500";
              } else {
                optionStyle = "border-border/50 opacity-50";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center gap-3 ${optionStyle}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  isAnswered && i === currentQ.correctIndex ? 'bg-green-500 text-white' :
                  isAnswered && i === selectedOption ? 'bg-red-500 text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {isAnswered && i === currentQ.correctIndex ? <CheckCircle2 className="w-4 h-4" /> :
                   isAnswered && i === selectedOption ? <XCircle className="w-4 h-4" /> :
                   String.fromCharCode(65 + i)}
                </div>
                <span className="text-sm font-medium">{option}</span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`px-5 py-4 rounded-xl border text-sm ${
            selectedOption === currentQ.correctIndex 
              ? 'border-green-500/30 bg-green-500/5 text-green-400'
              : 'border-red-500/30 bg-red-500/5 text-red-400'
          }`}>
            <div className="flex items-start justify-between gap-3 mb-1">
              <p className="font-semibold">
                {selectedOption === currentQ.correctIndex ? "✓ Correct!" : "✗ Incorrect"}
              </p>
              {selectedOption !== currentQ.correctIndex && !aiExplanation && (
                <button
                  type="button"
                  onClick={explainWithAi}
                  disabled={aiExplaining}
                  className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-secondary/40 bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors disabled:opacity-60"
                >
                  {aiExplaining ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Asking AI…</>
                  ) : (
                    <><HelpCircle className="w-3 h-3" /> Why?</>
                  )}
                </button>
              )}
            </div>
            <p className="text-muted-foreground">{currentQ.explanation}</p>

            {aiError && (
              <p className="mt-3 text-xs text-destructive">⚠ {aiError}</p>
            )}

            {aiExplanation && (
              <div className="mt-3 px-4 py-3 rounded-xl border border-secondary/30 bg-secondary/5">
                <div className="flex items-center gap-2 mb-2 text-secondary">
                  <Bot className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">AI Tutor</span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{aiExplanation}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {isAnswered && (
        <CardFooter className="pt-0">
          <Button onClick={handleNext} className="w-full h-12 text-base font-semibold rounded-xl">
            {currentIndex < activeQuestions.length - 1 ? "Next Question →" : "See Results"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
