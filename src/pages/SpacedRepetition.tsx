import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, RotateCcw, CheckCircle2, XCircle, Zap, Flame, Target,
  ArrowRight, Loader2, Trophy, Clock, BarChart3, Inbox
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SRItem {
  id: string;
  question_id: string;
  question_text: string;
  question_data: any;
  topic: string | null;
  difficulty: string | null;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
  times_correct: number;
  times_incorrect: number;
}

const difficultyColors: Record<string, string> = {
  easy: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  hard: "bg-red-500/10 text-red-400 border-red-500/20",
  foundation: "bg-green-500/10 text-green-400 border-green-500/20",
  mixed: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  challenge: "bg-red-500/10 text-red-400 border-red-500/20",
};

// SM-2 algorithm
function sm2(item: SRItem, quality: number): { easeFactor: number; interval: number; repetitions: number } {
  let ef = item.ease_factor;
  let interval: number;
  let reps: number;

  if (quality >= 3) {
    // Correct
    if (item.repetitions === 0) interval = 1;
    else if (item.repetitions === 1) interval = 6;
    else interval = Math.round(item.interval_days * ef);
    reps = item.repetitions + 1;
  } else {
    // Incorrect — reset
    interval = 1;
    reps = 0;
  }

  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  return { easeFactor: ef, interval, repetitions: reps };
}

export default function SpacedRepetition() {
  const { user } = useAuth();
  const [items, setItems] = useState<SRItem[]>([]);
  const [dueItems, setDueItems] = useState<SRItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    if (!user) return;
    loadItems();
  }, [user]);

  const loadItems = async () => {
    const { data, error } = await supabase
      .from("spaced_repetition")
      .select("*")
      .lte("next_review_at", new Date().toISOString())
      .order("next_review_at");

    if (!error && data) {
      setDueItems(data);
    }

    // Also get total count
    const { count } = await supabase
      .from("spaced_repetition")
      .select("*", { count: "exact", head: true });

    setLoading(false);
  };

  const handleAnswer = (optionIndex: number) => {
    if (revealed) return;
    setSelectedOption(optionIndex);
    setRevealed(true);
  };

  const handleRate = async (quality: number) => {
    const item = dueItems[currentIndex];
    const result = sm2(item, quality);
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + result.interval);

    const isCorrect = quality >= 3;
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }));

    await supabase
      .from("spaced_repetition")
      .update({
        ease_factor: result.easeFactor,
        interval_days: result.interval,
        repetitions: result.repetitions,
        next_review_at: nextReview.toISOString(),
        last_reviewed_at: new Date().toISOString(),
        times_correct: item.times_correct + (isCorrect ? 1 : 0),
        times_incorrect: item.times_incorrect + (isCorrect ? 0 : 1),
      })
      .eq("id", item.id);

    // Move to next
    if (currentIndex < dueItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setRevealed(false);
    } else {
      setSessionComplete(true);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Brain className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-display font-bold">Sign in to use Spaced Repetition</h2>
        <Link to="/auth"><Button className="rounded-full gap-2">Sign In</Button></Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Session complete
  if (sessionComplete) {
    const total = sessionStats.correct + sessionStats.incorrect;
    const pct = total > 0 ? Math.round((sessionStats.correct / total) * 100) : 0;

    return (
      <div className="container px-4 md:px-6 mx-auto max-w-2xl py-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="rounded-2xl border-primary/20 overflow-hidden">
            <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 text-center space-y-4">
              <Trophy className="w-12 h-12 text-primary mx-auto" />
              <h1 className="text-2xl font-display font-extrabold">Review Complete!</h1>
              <p className="text-muted-foreground text-sm">You've reviewed all due cards</p>
              <div className="flex justify-center gap-6 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-display font-bold text-green-500">{sessionStats.correct}</div>
                  <div className="text-[10px] text-muted-foreground">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display font-bold text-red-400">{sessionStats.incorrect}</div>
                  <div className="text-[10px] text-muted-foreground">To Review</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display font-bold text-primary">{pct}%</div>
                  <div className="text-[10px] text-muted-foreground">Accuracy</div>
                </div>
              </div>
            </div>
            <CardContent className="p-6 flex gap-3">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full rounded-full">Dashboard</Button>
              </Link>
              <Button onClick={() => { setSessionComplete(false); setCurrentIndex(0); setSessionStats({ correct: 0, incorrect: 0 }); loadItems(); }} className="flex-1 rounded-full gap-2">
                <RotateCcw className="w-4 h-4" /> Review Again
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // No due items
  if (dueItems.length === 0) {
    return (
      <div className="container px-4 md:px-6 mx-auto max-w-2xl py-10">
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="font-display font-bold text-xl">All caught up!</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              No questions due for review. Complete more exams and get questions wrong to build your review queue.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/question-bank">
                <Button variant="outline" className="rounded-full gap-2 text-xs">
                  <Target className="w-3.5 h-3.5" /> Practice Exams
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Review card
  const current = dueItems[currentIndex];
  const qData = current.question_data;
  const progress = ((currentIndex) / dueItems.length) * 100;

  return (
    <div className="container px-4 md:px-6 mx-auto max-w-2xl py-8 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg">Spaced Repetition</h1>
            <p className="text-[11px] text-muted-foreground">{dueItems.length} cards due for review</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">{currentIndex + 1} / {dueItems.length}</Badge>
      </div>

      <Progress value={progress} className="h-1.5" />

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={current.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <Card className="rounded-2xl border-border/50 overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                {current.topic && <Badge variant="outline" className="text-[10px]">{current.topic}</Badge>}
                {current.difficulty && (
                  <Badge className={`text-[10px] border ${difficultyColors[current.difficulty] || "bg-muted text-muted-foreground"}`}>
                    {current.difficulty}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <RotateCcw className="w-2.5 h-2.5" />
                  Reviewed {current.times_correct + current.times_incorrect}x
                </Badge>
              </div>

              <p className="text-sm font-medium leading-relaxed">{current.question_text}</p>

              {/* Multiple choice options */}
              {qData?.options && (
                <div className="grid gap-2">
                  {qData.options.map((opt: string, i: number) => {
                    let style = "border-border/50 hover:border-primary/40 hover:bg-primary/5 cursor-pointer";
                    if (revealed) {
                      if (i === qData.correctIndex) style = "border-green-500/50 bg-green-500/10 text-green-400";
                      else if (i === selectedOption) style = "border-red-500/50 bg-red-500/10 text-red-400";
                      else style = "border-border/30 opacity-50";
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={revealed}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm flex items-center gap-2 transition-all ${style}`}
                      >
                        <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 ${
                          revealed && i === qData.correctIndex ? "bg-green-500 text-white" :
                          revealed && i === selectedOption ? "bg-red-500 text-white" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {revealed && i === qData.correctIndex ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                           revealed && i === selectedOption ? <XCircle className="w-3.5 h-3.5" /> :
                           String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Text-based question — show answer */}
              {!qData?.options && (
                <div>
                  {!revealed ? (
                    <Button onClick={() => setRevealed(true)} variant="outline" className="rounded-full gap-2">
                      Show Answer <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  ) : (
                    <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20 text-sm">
                      <span className="font-semibold text-green-500">Answer: </span>
                      <span className="text-muted-foreground">{qData?.correctAnswer || qData?.modelAnswer || "See mark scheme"}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Explanation */}
              {revealed && qData?.explanation && (
                <div className="text-xs p-3 rounded-xl bg-muted/50 text-muted-foreground">
                  {qData.explanation}
                </div>
              )}

              {/* Rating buttons */}
              {revealed && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">How well did you know this?</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleRate(1)}
                      className="rounded-xl text-xs gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Again
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRate(3)}
                      className="rounded-xl text-xs gap-1.5 border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                    >
                      <Flame className="w-3.5 h-3.5" /> Hard
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRate(5)}
                      className="rounded-xl text-xs gap-1.5 border-green-500/30 text-green-500 hover:bg-green-500/10"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Easy
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
