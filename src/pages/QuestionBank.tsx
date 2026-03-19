import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, BookOpen, Clock, Target, Zap,
  ChevronRight, Sparkles, Layers, Calendar, ArrowRight,
  GraduationCap, Trophy, BarChart3, Play
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { allQuestions, mockExamSets, practicePaperSets, topicMasterySets, fiveADaySets, allPaperSets } from "@/data/questionBank/paperSets";
import { PaperSet as PaperSetType } from "@/data/questionBank/types";
import { paper1Theory } from "@/data/questionBank/paper1Theory";
import { paper2Theory } from "@/data/questionBank/paper2Theory";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const p1Questions = allQuestions.filter(q => q.paper === "1");
const p2Questions = allQuestions.filter(q => q.paper === "2");

const heroStats = [
  { value: `${allQuestions.length}+`, label: "Questions" },
  { value: "11", label: "Topic Areas" },
  { value: "2", label: "Papers" },
  { value: "100%", label: "Spec Coverage" },
];

const paper1Topics = ["Systems Architecture", "Memory & Storage", "Computer Networks", "Network Security", "Systems Software", "Ethical, Legal & Environmental"];
const paper2Topics = ["Algorithms", "Programming Fundamentals", "Producing Robust Programs", "Boolean Logic", "Programming Languages & IDEs"];

function SetCard({ set }: { set: PaperSetType }) {
  const qCount = set.questionIds.length;
  const totalMarks = allQuestions.filter(q => set.questionIds.includes(q.id)).reduce((s, q) => s + q.marks, 0);

  return (
    <Card className="rounded-2xl border-border/50 overflow-hidden group hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h4 className="font-display font-bold text-sm">{set.title}</h4>
              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-none">Paper {set.paper}</Badge>
              {set.difficulty && (
                <Badge variant="secondary" className={`text-[10px] border-none ${
                  set.difficulty === "foundation" ? "bg-green-500/10 text-green-500" :
                  set.difficulty === "mixed" ? "bg-amber-500/10 text-amber-500" :
                  "bg-red-500/10 text-red-500"
                }`}>
                  {set.difficulty}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{set.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{qCount} questions</span>
          {set.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{set.duration} min</span>}
          {set.totalMarks && <span className="flex items-center gap-1"><Target className="w-3 h-3" />{totalMarks} marks</span>}
          {set.badge && <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" />{set.badge}</span>}
        </div>
        <Link to={`/exam-session/${set.id}`}>
          <Button size="sm" variant="outline" className="w-fit rounded-full text-xs h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
            <Play className="w-3 h-3" /> Start Practice <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function TopicMasterySection({ title, paper, topics, sets }: { title: string; paper: string; topics: string[]; sets: PaperSetType[] }) {
  return (
    <Card className="rounded-2xl border-border/50 overflow-hidden">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h4 className="font-display font-bold text-sm">{title}</h4>
          <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-none">Paper {paper}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Focused practice for each topic. Click a topic to start targeted revision.</p>
        <div className="flex flex-wrap gap-1.5">
          {sets.filter(s => s.paper === paper).map(s => {
            const topicName = s.topic || s.title;
            return (
              <Link key={s.id} to={`/exam-session/${s.id}`}>
                <span className="text-[11px] px-2.5 py-1.5 rounded-full bg-muted/60 text-muted-foreground border border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer inline-flex items-center gap-1">
                  {topicName.replace(`Paper ${paper}: `, "")}
                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-none">{s.questionIds.length}</Badge>
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function QuestionBank() {
  const p1Mocks = mockExamSets.filter(s => s.paper === "1");
  const p2Mocks = mockExamSets.filter(s => s.paper === "2");
  const p1Practice = practicePaperSets.filter(s => s.paper === "1");
  const p2Practice = practicePaperSets.filter(s => s.paper === "2");
  const p1TopicSets = topicMasterySets.filter(s => s.paper === "1");
  const p2TopicSets = topicMasterySets.filter(s => s.paper === "2");
  const p1FiveADay = fiveADaySets.filter(s => s.paper === "1");
  const p2FiveADay = fiveADaySets.filter(s => s.paper === "2");

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(270,83%,60%)] via-[hsl(260,80%,55%)] to-[hsl(221,83%,53%)]" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-[20%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 container px-4 md:px-6 mx-auto max-w-6xl py-10 lg:py-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
                  Question Bank Practice
                </h1>
                <p className="text-white/70 text-sm md:text-base mt-1">
                  Practice OCR J277 exam-style questions — Full specification coverage
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
              {heroStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="rounded-xl bg-white/15 backdrop-blur-sm px-4 py-3 text-center border border-white/10"
                >
                  <div className="text-2xl md:text-3xl font-display font-extrabold text-white">{s.value}</div>
                  <div className="text-white/60 text-xs font-medium mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 md:px-6 mx-auto max-w-6xl mt-8">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">

          {/* Available Course Library callout */}
          <motion.section variants={item}>
            <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 overflow-hidden">
              <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-base mb-1">Available Course Library</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our library contains over {allQuestions.length} professionally-written questions aligned to the OCR J277 GCSE Computer Science specification.
                    Every question includes mark schemes, model answers, and pseudocode hints. Covering {paper1Topics.length + paper2Topics.length} topic areas across both papers.
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3 text-primary" />{p1Questions.length} Paper 1 Qs</span>
                    <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3 text-secondary" />{p2Questions.length} Paper 2 Qs</span>
                    <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-500" />{allPaperSets.length} Practice Sets</span>
                  </div>
                </div>
                <Link to="/">
                  <Button className="rounded-full gap-1.5 shrink-0">
                    Browse Topics <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.section>

          {/* Mock Exams */}
          <motion.section variants={item}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📝</span>
              <h2 className="text-xl font-display font-bold">Mock Exam Sets</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4 ml-8">Full-length 90-minute mock exams matching the OCR J277 exam format. {mockExamSets.length} exams available across both papers.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockExamSets.map(s => <SetCard key={s.id} set={s} />)}
            </div>
          </motion.section>

          {/* Practice Papers */}
          <motion.section variants={item}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📄</span>
              <h2 className="text-xl font-display font-bold">Practice Paper Sets</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4 ml-8">60-minute practice papers at Foundation, Mixed, and Challenge levels. {practicePaperSets.length} papers — 3 per paper, progressing in difficulty.</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-display font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> Paper 1 — Computer Systems
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {p1Practice.map(s => <SetCard key={s.id} set={s} />)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-display font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> Paper 2 — Computational Thinking
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {p2Practice.map(s => <SetCard key={s.id} set={s} />)}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Topic Mastery */}
          <motion.section variants={item}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🎯</span>
              <h2 className="text-xl font-display font-bold">Topic Mastery Sets</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4 ml-8">Targeted practice for individual topics. {topicMasterySets.length} topic sets covering all {paper1Topics.length + paper2Topics.length} specification areas.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TopicMasterySection title="OCR J277/01 Topic Mastery" paper="1" topics={paper1Topics} sets={p1TopicSets} />
              <TopicMasterySection title="OCR J277/02 Topic Mastery" paper="2" topics={paper2Topics} sets={p2TopicSets} />
            </div>
          </motion.section>

          {/* Five A Day */}
          <motion.section variants={item}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🌟</span>
              <h2 className="text-xl font-display font-bold">Five A Day Sets</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4 ml-8">Daily bite-sized practice — 5 questions per session. {fiveADaySets.length} daily sets to keep your knowledge sharp.</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-display font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Paper 1 Five A Day
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {p1FiveADay.map(f => (
                    <Link key={f.id} to={`/exam-session/${f.id}`}>
                      <Card className="rounded-2xl border-border/50 overflow-hidden group hover:border-secondary/30 transition-all cursor-pointer h-full">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-secondary" />
                            <h4 className="font-display font-bold text-xs">{f.title}</h4>
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{f.description}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{f.questionIds.length} Qs</span>
                            <span>·</span>
                            <span>{f.duration} min</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-display font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Paper 2 Five A Day
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {p2FiveADay.map(f => (
                    <Link key={f.id} to={`/exam-session/${f.id}`}>
                      <Card className="rounded-2xl border-border/50 overflow-hidden group hover:border-secondary/30 transition-all cursor-pointer h-full">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-secondary" />
                            <h4 className="font-display font-bold text-xs">{f.title}</h4>
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{f.description}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{f.questionIds.length} Qs</span>
                            <span>·</span>
                            <span>{f.duration} min</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
