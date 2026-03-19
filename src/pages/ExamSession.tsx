import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, Clock, Target,
  BookOpen, Lightbulb, Code, RotateCcw, Trophy, Sparkles,
  FileText, Eye, EyeOff, Brain, Loader2, Star, TrendingUp, AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { allPaperSets, getQuestionsForSet } from "@/data/questionBank/paperSets";
import { ExamQuestion } from "@/data/questionBank/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AiMarking {
  marksAwarded: number;
  totalMarks: number;
  feedback: string;
  markBreakdown: { point: string; awarded: boolean; comment: string }[];
  grade: "Excellent" | "Good" | "Satisfactory" | "Needs Improvement";
  improvementTip: string;
}

const gradeColors: Record<string, string> = {
  "Excellent": "text-green-500 bg-green-500/10 border-green-500/20",
  "Good": "text-primary bg-primary/10 border-primary/20",
  "Satisfactory": "text-amber-500 bg-amber-500/10 border-amber-500/20",
  "Needs Improvement": "text-red-400 bg-red-400/10 border-red-400/20",
};

const gradeIcons: Record<string, typeof Star> = {
  "Excellent": Trophy,
  "Good": Star,
  "Satisfactory": TrendingUp,
  "Needs Improvement": AlertCircle,
};

export default function ExamSession() {
  const { setId } = useParams<{ setId: string }>();
  const { user } = useAuth();

  const paperSet = useMemo(() => allPaperSets.find(s => s.id === setId), [setId]);
  const questions = useMemo(() => getQuestionsForSet(setId || ""), [setId]) as ExamQuestion[];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [marking, setMarking] = useState<Record<string, boolean>>({});
  const [aiMarkings, setAiMarkings] = useState<Record<string, AiMarking>>({});
  const [showMarkScheme, setShowMarkScheme] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [showPseudocode, setShowPseudocode] = useState<Record<string, boolean>>({});
  const [examFinished, setExamFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [startTime] = useState(Date.now());

  // Save attempt when exam finishes
  useEffect(() => {
    if (!examFinished || saved || !user || !paperSet) return;
    const saveAttempt = async () => {
      const answeredCount = Object.keys(submitted).length;
      const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
      const totalAwarded = Object.values(aiMarkings).reduce((sum, m) => sum + m.marksAwarded, 0);
      const percentage = totalMarks > 0 ? Math.round((totalAwarded / totalMarks) * 100) : 0;
      const grade = percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : percentage >= 40 ? "Satisfactory" : "Needs Improvement";
      const duration = Math.round((Date.now() - startTime) / 1000);

      const { data: attempt, error } = await supabase.from("exam_attempts").insert({
        user_id: user.id,
        paper_set_id: paperSet.id,
        paper_title: paperSet.title,
        paper_number: paperSet.paper,
        total_marks: totalMarks,
        marks_awarded: totalAwarded,
        percentage,
        grade,
        question_count: questions.length,
        answered_count: answeredCount,
        duration_seconds: duration,
      }).select().single();

      if (error) { console.error("Save attempt error:", error); return; }

      // Save individual answers + add wrong ones to spaced repetition
      const answerRows = questions.filter(q => submitted[q.id]).map(q => {
        const m = aiMarkings[q.id];
        return {
          attempt_id: attempt.id,
          user_id: user.id,
          question_id: q.id,
          question_text: q.question,
          student_answer: answers[q.id] || "",
          marks_awarded: m?.marksAwarded || 0,
          total_marks: q.marks,
          grade: m?.grade || null,
          feedback: m?.feedback || null,
          improvement_tip: m?.improvementTip || null,
          mark_breakdown: m?.markBreakdown || null,
          topic: q.topic || null,
          difficulty: q.difficulty || null,
        };
      });

      if (answerRows.length > 0) {
        await supabase.from("exam_answers").insert(answerRows);
      }

      // Add wrong answers to spaced repetition
      const wrongQuestions = questions.filter(q => {
        const m = aiMarkings[q.id];
        return m && m.marksAwarded < m.totalMarks;
      });

      for (const q of wrongQuestions) {
        await supabase.from("spaced_repetition").upsert({
          user_id: user.id,
          question_id: q.id,
          question_text: q.question,
          question_data: {
            options: q.options,
            correctAnswer: q.correctAnswer,
            modelAnswer: q.modelAnswer,
            markScheme: q.markScheme,
            type: q.type,
          },
          topic: q.topic || null,
          difficulty: q.difficulty || null,
          next_review_at: new Date().toISOString(),
        }, { onConflict: "user_id,question_id" });
      }

      setSaved(true);
      toast.success("Exam saved to your history!");
    };
    saveAttempt();
  }, [examFinished]);

  if (!paperSet || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FileText className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-display font-bold">Paper Set Not Found</h2>
        <p className="text-muted-foreground text-sm">This question set could not be loaded.</p>
        <Link to="/question-bank">
          <Button variant="outline" className="rounded-full gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Question Bank
          </Button>
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((Object.keys(submitted).length) / questions.length) * 100;
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const totalAwarded = Object.values(aiMarkings).reduce((sum, m) => sum + m.marksAwarded, 0);

  const handleSubmitAnswer = async () => {
    const answer = answers[currentQ.id];
    if (!answer) return;

    setSubmitted(prev => ({ ...prev, [currentQ.id]: true }));

    // For multiple-choice, auto-mark without AI
    if (currentQ.type === "multiple-choice") {
      const correct = answer === currentQ.correctAnswer;
      setAiMarkings(prev => ({
        ...prev,
        [currentQ.id]: {
          marksAwarded: correct ? currentQ.marks : 0,
          totalMarks: currentQ.marks,
          feedback: correct
            ? `Correct! ${currentQ.modelAnswer}`
            : `The correct answer is "${currentQ.correctAnswer}". ${currentQ.modelAnswer}`,
          markBreakdown: [{ point: currentQ.markScheme[0], awarded: correct, comment: correct ? "Correct answer selected" : `You selected "${answer}" but the answer is "${currentQ.correctAnswer}"` }],
          grade: correct ? "Excellent" : "Needs Improvement",
          improvementTip: correct ? "Great work! Keep practising to maintain your knowledge." : "Review this topic and try to understand why this is the correct answer.",
        },
      }));
      return;
    }

    // AI marking for non-MCQ
    setMarking(prev => ({ ...prev, [currentQ.id]: true }));

    try {
      const { data, error } = await supabase.functions.invoke("mark-answer", {
        body: {
          question: currentQ.question,
          studentAnswer: answer,
          markScheme: currentQ.markScheme,
          modelAnswer: currentQ.modelAnswer,
          marks: currentQ.marks,
          questionType: currentQ.type,
        },
      });

      if (error) {
        console.error("Marking error:", error);
        toast.error("Could not get AI feedback. Check the mark scheme manually.");
        setShowMarkScheme(prev => ({ ...prev, [currentQ.id]: true }));
        return;
      }

      if (data?.error) {
        if (data.error.includes("Rate limit")) {
          toast.error("Too many requests — please wait a moment and try again.");
        } else if (data.error.includes("credits") || data.error.includes("Payment")) {
          toast.error("AI credits exhausted. Please add funds in workspace settings.");
        } else {
          toast.error(data.error);
        }
        setShowMarkScheme(prev => ({ ...prev, [currentQ.id]: true }));
        return;
      }

      setAiMarkings(prev => ({ ...prev, [currentQ.id]: data as AiMarking }));
    } catch (err) {
      console.error("AI marking failed:", err);
      toast.error("AI marking unavailable. Showing mark scheme instead.");
      setShowMarkScheme(prev => ({ ...prev, [currentQ.id]: true }));
    } finally {
      setMarking(prev => ({ ...prev, [currentQ.id]: false }));
    }
  };

  const answeredCount = Object.keys(submitted).length;

  /* ── Results screen ─────────────────────── */
  if (examFinished) {
    const markedCount = Object.keys(aiMarkings).length;
    const percentage = totalMarks > 0 ? Math.round((totalAwarded / totalMarks) * 100) : 0;
    const overallGrade = percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : percentage >= 40 ? "Satisfactory" : "Needs Improvement";

    return (
      <div className="container px-4 md:px-6 mx-auto max-w-4xl py-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <Card className="rounded-2xl border-primary/20 overflow-hidden">
            <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-display font-extrabold">Exam Complete!</h1>
              <p className="text-muted-foreground">{paperSet.title}</p>
              <Badge className={`text-sm px-4 py-1.5 border ${gradeColors[overallGrade]}`}>
                {overallGrade} — {percentage}%
              </Badge>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="text-2xl font-display font-bold text-primary">{totalAwarded}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Marks Earned</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="text-2xl font-display font-bold">{totalMarks}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Total Marks</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="text-2xl font-display font-bold text-secondary">{percentage}%</div>
                  <div className="text-[10px] text-muted-foreground mt-1">Score</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="text-2xl font-display font-bold">{markedCount}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">AI Marked</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-sm">Review Your Answers</h3>
                {questions.map((q, i) => {
                  const m = aiMarkings[q.id];
                  return (
                    <button
                      key={q.id}
                      onClick={() => { setExamFinished(false); setCurrentIndex(i); }}
                      className="w-full text-left p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors flex items-center gap-3"
                    >
                      <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <span className="text-xs flex-1 line-clamp-1">{q.question.split("\n")[0]}</span>
                      {m ? (
                        <Badge className={`text-[10px] shrink-0 border ${gradeColors[m.grade]}`}>
                          {m.marksAwarded}/{m.totalMarks}
                        </Badge>
                      ) : submitted[q.id] ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Link to="/question-bank" className="flex-1">
                  <Button variant="outline" className="w-full rounded-full gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Question Bank
                  </Button>
                </Link>
                <Button onClick={() => {
                  setAnswers({}); setSubmitted({}); setAiMarkings({}); setMarking({});
                  setShowMarkScheme({}); setShowHint({}); setShowPseudocode({});
                  setCurrentIndex(0); setExamFinished(false);
                }} className="flex-1 rounded-full gap-2">
                  <RotateCcw className="w-4 h-4" /> Retake
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  /* ── Question view ──────────────────────── */
  const currentMarking = aiMarkings[currentQ.id];
  const isMarking = marking[currentQ.id];

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Header bar */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl flex items-center gap-4 py-3">
          <Link to="/question-bank">
            <Button variant="ghost" size="sm" className="rounded-full gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-sm truncate">{paperSet.title}</h2>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1"><Target className="w-3 h-3" />Q {currentIndex + 1} of {questions.length}</span>
              {paperSet.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{paperSet.duration} min</span>}
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" />{totalAwarded}/{totalMarks} marks</span>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-none">Paper {paperSet.paper}</Badge>
        </div>
        <div className="container px-4 md:px-6 mx-auto max-w-4xl pb-2">
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Question */}
      <div className="container px-4 md:px-6 mx-auto max-w-4xl mt-6 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div key={currentQ.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <Card className="rounded-2xl border-border/50 overflow-hidden">
              <CardContent className="p-6 space-y-5">
                {/* Question header */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-[10px]">{currentQ.topic}</Badge>
                  <Badge variant="secondary" className={`text-[10px] border-none ${
                    currentQ.difficulty === "foundation" ? "bg-green-500/10 text-green-500" :
                    currentQ.difficulty === "mixed" ? "bg-amber-500/10 text-amber-500" :
                    "bg-red-500/10 text-red-500"
                  }`}>
                    {currentQ.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">{currentQ.marks} mark{currentQ.marks > 1 ? "s" : ""}</Badge>
                  <Badge variant="outline" className="text-[10px] capitalize">{currentQ.type.replace("-", " ")}</Badge>
                </div>

                {/* Question text */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {currentQ.question}
                </div>

                {/* Multiple choice */}
                {currentQ.type === "multiple-choice" && currentQ.options && (
                  <div className="space-y-2">
                    {currentQ.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => !submitted[currentQ.id] && setAnswers(prev => ({ ...prev, [currentQ.id]: opt }))}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                          answers[currentQ.id] === opt
                            ? submitted[currentQ.id]
                              ? opt === currentQ.correctAnswer ? "border-green-500 bg-green-500/10 text-green-400" : "border-red-500 bg-red-500/10 text-red-400"
                              : "border-primary bg-primary/10 text-primary"
                            : submitted[currentQ.id] && opt === currentQ.correctAnswer
                              ? "border-green-500 bg-green-500/10 text-green-400"
                              : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                        }`}
                        disabled={!!submitted[currentQ.id]}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Text answer */}
                {currentQ.type !== "multiple-choice" && (
                  <textarea
                    value={answers[currentQ.id] || ""}
                    onChange={e => !submitted[currentQ.id] && setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                    placeholder="Type your answer here..."
                    className="w-full min-h-[120px] rounded-xl border border-border/50 bg-muted/20 p-4 text-sm resize-y focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground/40"
                    disabled={!!submitted[currentQ.id]}
                  />
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                  {!submitted[currentQ.id] ? (
                    <Button onClick={handleSubmitAnswer} disabled={!answers[currentQ.id] || isMarking} className="rounded-full gap-1.5 text-xs">
                      {isMarking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
                      {isMarking ? "AI Marking..." : "Submit & Mark"}
                    </Button>
                  ) : isMarking ? (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none gap-1 px-3 py-1.5">
                      <Loader2 className="w-3 h-3 animate-spin" /> AI is marking...
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-none gap-1 px-3 py-1.5">
                      <CheckCircle2 className="w-3 h-3" /> Marked
                    </Badge>
                  )}
                  <Button
                    variant="ghost" size="sm"
                    className="rounded-full text-xs gap-1"
                    onClick={() => setShowHint(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> {showHint[currentQ.id] ? "Hide" : "Show"} Hint
                  </Button>
                  {currentQ.pseudocodeHint && (
                    <Button
                      variant="ghost" size="sm"
                      className="rounded-full text-xs gap-1"
                      onClick={() => setShowPseudocode(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                    >
                      <Code className="w-3.5 h-3.5" /> Pseudocode
                    </Button>
                  )}
                  {submitted[currentQ.id] && (
                    <Button
                      variant="ghost" size="sm"
                      className="rounded-full text-xs gap-1"
                      onClick={() => setShowMarkScheme(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                    >
                      {showMarkScheme[currentQ.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      Mark Scheme
                    </Button>
                  )}
                </div>

                {/* ── AI Marking Result ─────────── */}
                <AnimatePresence>
                  {currentMarking && !isMarking && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <div className={`p-4 rounded-xl border ${gradeColors[currentMarking.grade]} space-y-3`}>
                        {/* Score header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            <span className="font-display font-bold text-sm">AI Examiner Feedback</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`border ${gradeColors[currentMarking.grade]}`}>
                              {currentMarking.grade}
                            </Badge>
                            <span className="font-display font-extrabold text-lg">
                              {currentMarking.marksAwarded}/{currentMarking.totalMarks}
                            </span>
                          </div>
                        </div>

                        {/* Feedback */}
                        <p className="text-xs leading-relaxed opacity-90">{currentMarking.feedback}</p>

                        {/* Mark breakdown */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase opacity-70">Mark Breakdown</span>
                          {currentMarking.markBreakdown.map((mb, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              {mb.awarded ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                              )}
                              <div>
                                <span className="font-medium">{mb.point}</span>
                                {mb.comment && <span className="text-muted-foreground ml-1">— {mb.comment}</span>}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Improvement tip */}
                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-background/50 border border-border/30">
                          <TrendingUp className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[10px] font-bold text-primary uppercase">How to Improve</span>
                            <p className="text-xs text-muted-foreground mt-0.5">{currentMarking.improvementTip}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Hint */}
                <AnimatePresence>
                  {showHint[currentQ.id] && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                        <div className="flex items-center gap-2 text-amber-500 text-xs font-bold mb-2">
                          <Lightbulb className="w-3.5 h-3.5" /> Hint
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{currentQ.hint || `Think about the key points: ${currentQ.markScheme.slice(0, 2).map(m => m.replace(/\s*\(\d+\)\s*/g, "")).join(". ")}.`}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pseudocode */}
                <AnimatePresence>
                  {showPseudocode[currentQ.id] && currentQ.pseudocodeHint && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 text-primary text-xs font-bold mb-2">
                          <Code className="w-3.5 h-3.5" /> OCR Pseudocode
                        </div>
                        <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">{currentQ.pseudocodeHint}</pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mark scheme + model answer */}
                <AnimatePresence>
                  {showMarkScheme[currentQ.id] && submitted[currentQ.id] && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
                      <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                        <div className="flex items-center gap-2 text-green-500 text-xs font-bold mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Model Answer
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{currentQ.modelAnswer}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 text-primary text-xs font-bold mb-2">
                          <BookOpen className="w-3.5 h-3.5" /> Mark Scheme
                        </div>
                        <ul className="space-y-1">
                          {currentQ.markScheme.map((m, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span> {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs" onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0}>
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </Button>
          <div className="flex gap-1.5 overflow-x-auto max-w-[50vw] px-2">
            {questions.map((q, i) => {
              const m = aiMarkings[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-7 h-7 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                    i === currentIndex
                      ? "bg-primary text-primary-foreground"
                      : m
                        ? m.marksAwarded === m.totalMarks
                          ? "bg-green-500/20 text-green-500"
                          : m.marksAwarded > 0
                            ? "bg-amber-500/20 text-amber-500"
                            : "bg-red-400/20 text-red-400"
                        : submitted[q.id]
                          ? "bg-green-500/20 text-green-500"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          {currentIndex === questions.length - 1 ? (
            <Button size="sm" className="rounded-full gap-1.5 text-xs" onClick={() => setExamFinished(true)}>
              Finish <Trophy className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs" onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}>
              Next <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
