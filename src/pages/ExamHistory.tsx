import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  History, Trophy, Target, Clock, TrendingUp, Star, AlertCircle,
  ChevronDown, ChevronUp, Brain, CheckCircle2, XCircle, ArrowLeft,
  Calendar, BarChart3, Flame, Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ExamAttempt {
  id: string;
  paper_set_id: string;
  paper_title: string;
  paper_number: string;
  total_marks: number;
  marks_awarded: number;
  percentage: number;
  grade: string;
  question_count: number;
  answered_count: number;
  duration_seconds: number | null;
  completed_at: string;
}

interface ExamAnswer {
  id: string;
  question_id: string;
  question_text: string;
  student_answer: string;
  marks_awarded: number;
  total_marks: number;
  grade: string | null;
  feedback: string | null;
  improvement_tip: string | null;
  mark_breakdown: any;
  topic: string | null;
  difficulty: string | null;
}

const gradeColors: Record<string, string> = {
  Excellent: "text-green-500 bg-green-500/10 border-green-500/20",
  Good: "text-primary bg-primary/10 border-primary/20",
  Satisfactory: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  "Needs Improvement": "text-red-400 bg-red-400/10 border-red-400/20",
};

const gradeIcons: Record<string, typeof Star> = {
  Excellent: Trophy,
  Good: Star,
  Satisfactory: TrendingUp,
  "Needs Improvement": AlertCircle,
};

export default function ExamHistory() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);
  const [attemptAnswers, setAttemptAnswers] = useState<Record<string, ExamAnswer[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingAnswers, setLoadingAnswers] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadAttempts();
  }, [user]);

  const loadAttempts = async () => {
    const { data, error } = await supabase
      .from("exam_attempts")
      .select("*")
      .order("completed_at", { ascending: false });

    if (!error && data) setAttempts(data);
    setLoading(false);
  };

  const loadAnswers = async (attemptId: string) => {
    if (attemptAnswers[attemptId]) {
      setExpandedAttempt(expandedAttempt === attemptId ? null : attemptId);
      return;
    }

    setLoadingAnswers(attemptId);
    setExpandedAttempt(attemptId);

    const { data, error } = await supabase
      .from("exam_answers")
      .select("*")
      .eq("attempt_id", attemptId)
      .order("created_at");

    if (!error && data) {
      setAttemptAnswers(prev => ({ ...prev, [attemptId]: data }));
    }
    setLoadingAnswers(null);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <History className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-display font-bold">Sign in to view your exam history</h2>
        <Link to="/auth"><Button className="rounded-full gap-2">Sign In</Button></Link>
      </div>
    );
  }

  // Stats
  const totalAttempts = attempts.length;
  const avgPercentage = totalAttempts > 0 ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / totalAttempts) : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0;
  const totalMarksEarned = attempts.reduce((s, a) => s + a.marks_awarded, 0);

  return (
    <div className="container px-4 md:px-6 mx-auto max-w-4xl py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            Exam History
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Review past attempts and AI feedback</p>
        </div>
        <Link to="/question-bank">
          <Button variant="outline" className="rounded-full gap-2 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Question Bank
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      {totalAttempts > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Attempts", value: totalAttempts, icon: Target, color: "text-primary" },
            { label: "Average Score", value: `${avgPercentage}%`, icon: BarChart3, color: "text-secondary" },
            { label: "Best Score", value: `${bestScore}%`, icon: Trophy, color: "text-green-500" },
            { label: "Total Marks", value: totalMarksEarned, icon: Flame, color: "text-amber-500" },
          ].map((stat, i) => (
            <Card key={i} className="rounded-xl border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="font-display font-extrabold text-lg">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Attempts list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : totalAttempts === 0 ? (
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-12 text-center space-y-4">
            <History className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="font-display font-bold text-lg">No exam attempts yet</h3>
            <p className="text-sm text-muted-foreground">Complete a mock exam to see your history here.</p>
            <Link to="/question-bank">
              <Button className="rounded-full gap-2">Start a Mock Exam</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => {
            const GradeIcon = gradeIcons[attempt.grade] || AlertCircle;
            const isExpanded = expandedAttempt === attempt.id;
            const answers = attemptAnswers[attempt.id];

            return (
              <Card key={attempt.id} className="rounded-xl border-border/50 overflow-hidden">
                <button
                  onClick={() => loadAnswers(attempt.id)}
                  className="w-full text-left p-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${gradeColors[attempt.grade]}`}>
                      <GradeIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-sm">{attempt.paper_title}</span>
                        <Badge variant="outline" className="text-[10px]">Paper {attempt.paper_number}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(attempt.completed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {attempt.answered_count}/{attempt.question_count} answered
                        </span>
                        {attempt.duration_seconds && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {Math.round(attempt.duration_seconds / 60)}m
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-display font-extrabold text-lg">{attempt.percentage}%</div>
                        <div className="text-[10px] text-muted-foreground">{attempt.marks_awarded}/{attempt.total_marks}</div>
                      </div>
                      <Badge className={`text-[10px] border ${gradeColors[attempt.grade]}`}>
                        {attempt.grade}
                      </Badge>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                  <Progress value={attempt.percentage} className="h-1 mt-3" />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="border-t border-border/50 p-4 space-y-3 bg-muted/10">
                        {loadingAnswers === attempt.id ? (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                          </div>
                        ) : answers?.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No detailed answers recorded.</p>
                        ) : (
                          answers?.map((ans, i) => (
                            <div key={ans.id} className="p-3 rounded-xl bg-background border border-border/30 space-y-2">
                              <div className="flex items-start gap-2">
                                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium line-clamp-2">{ans.question_text}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {ans.topic && <Badge variant="outline" className="text-[9px]">{ans.topic}</Badge>}
                                    {ans.difficulty && <Badge variant="secondary" className="text-[9px]">{ans.difficulty}</Badge>}
                                  </div>
                                </div>
                                <Badge className={`text-[10px] shrink-0 border ${gradeColors[ans.grade || "Needs Improvement"]}`}>
                                  {ans.marks_awarded}/{ans.total_marks}
                                </Badge>
                              </div>

                              <div className="ml-8 space-y-2">
                                <div className="text-[11px] p-2 rounded-lg bg-muted/50">
                                  <span className="font-semibold text-muted-foreground">Your answer: </span>
                                  <span className="text-foreground">{ans.student_answer}</span>
                                </div>

                                {ans.feedback && (
                                  <div className="text-[11px] p-2 rounded-lg bg-primary/5 border border-primary/10">
                                    <div className="flex items-center gap-1 text-primary font-semibold mb-1">
                                      <Brain className="w-3 h-3" /> AI Feedback
                                    </div>
                                    <p className="text-muted-foreground">{ans.feedback}</p>
                                  </div>
                                )}

                                {ans.mark_breakdown && Array.isArray(ans.mark_breakdown) && (
                                  <div className="space-y-1">
                                    {ans.mark_breakdown.map((mb: any, j: number) => (
                                      <div key={j} className="flex items-start gap-1.5 text-[10px]">
                                        {mb.awarded ? (
                                          <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                                        ) : (
                                          <XCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                                        )}
                                        <span className="text-muted-foreground">{mb.point}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {ans.improvement_tip && (
                                  <div className="flex items-start gap-1.5 text-[10px] p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                                    <TrendingUp className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">{ans.improvement_tip}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
