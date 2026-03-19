import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle2, XCircle, Clock, Target,
  BookOpen, Lightbulb, Code, ChevronDown, ChevronUp, RotateCcw,
  Trophy, Sparkles, FileText, Eye, EyeOff
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { allPaperSets, getQuestionsForSet } from "@/data/questionBank/paperSets";
import { ExamQuestion } from "@/data/questionBank/types";

export default function ExamSession() {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();

  const paperSet = useMemo(() => allPaperSets.find(s => s.id === setId), [setId]);
  const questions = useMemo(() => getQuestionsForSet(setId || ""), [setId]) as ExamQuestion[];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showMarkScheme, setShowMarkScheme] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [showPseudocode, setShowPseudocode] = useState<Record<string, boolean>>({});
  const [examFinished, setExamFinished] = useState(false);

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

  const handleSubmitAnswer = () => {
    setSubmitted(prev => ({ ...prev, [currentQ.id]: true }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    setExamFinished(true);
  };

  const answeredCount = Object.keys(submitted).length;

  if (examFinished) {
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
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="text-2xl font-display font-bold text-primary">{answeredCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">Answered</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="text-2xl font-display font-bold">{questions.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Total Questions</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="text-2xl font-display font-bold text-secondary">{totalMarks}</div>
                  <div className="text-xs text-muted-foreground mt-1">Total Marks</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-display font-bold text-sm">Review Your Answers</h3>
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => { setExamFinished(false); setCurrentIndex(i); }}
                    className="w-full text-left p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors flex items-center gap-3"
                  >
                    <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="text-sm flex-1 line-clamp-1">{q.question.split("\n")[0]}</span>
                    <Badge variant="outline" className="text-[10px] shrink-0">{q.marks} marks</Badge>
                    {submitted[q.id] ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Link to="/question-bank" className="flex-1">
                  <Button variant="outline" className="w-full rounded-full gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Question Bank
                  </Button>
                </Link>
                <Button onClick={() => { setAnswers({}); setSubmitted({}); setShowMarkScheme({}); setShowHint({}); setShowPseudocode({}); setCurrentIndex(0); setExamFinished(false); }} className="flex-1 rounded-full gap-2">
                  <RotateCcw className="w-4 h-4" /> Retake
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

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
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" />{totalMarks} marks</span>
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
                    <Button onClick={handleSubmitAnswer} disabled={!answers[currentQ.id]} className="rounded-full gap-1.5 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Submit Answer
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-none gap-1 px-3 py-1.5">
                      <CheckCircle2 className="w-3 h-3" /> Submitted
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
          <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs" onClick={handlePrev} disabled={currentIndex === 0}>
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </Button>
          <div className="flex gap-1.5 overflow-x-auto max-w-[50vw] px-2">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-7 h-7 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                  i === currentIndex
                    ? "bg-primary text-primary-foreground"
                    : submitted[q.id]
                      ? "bg-green-500/20 text-green-500"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {currentIndex === questions.length - 1 ? (
            <Button size="sm" className="rounded-full gap-1.5 text-xs" onClick={handleFinish}>
              Finish <Trophy className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs" onClick={handleNext}>
              Next <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
