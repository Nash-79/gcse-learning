import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, BookOpen, Clock, Target, Brain, Zap, Flame,
  ChevronRight, Sparkles, GraduationCap, Play, CheckCircle2,
  Layers, Calendar, ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useListTopics, useExamBoard } from "@/hooks/useTopics";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const heroStats = [
  { value: "600+", label: "Questions" },
  { value: "8", label: "Topic Areas" },
  { value: "2", label: "Papers" },
  { value: "100%", label: "Spec Coverage" },
];

interface PaperSet {
  title: string;
  description: string;
  badge?: string;
  duration?: string;
  count?: string;
  paper: "1" | "2";
}

const mockExams: PaperSet[] = [
  { title: "OCR J277/01 Mock Exam Set", description: "2 full 90-minute mock exams for Paper 1 — Computer Systems. Professional quality exam preparation.", badge: "2 Exams", duration: "90 min each", paper: "1" },
  { title: "OCR J277/02 Mock Exam Set", description: "2 full 90-minute mock exams for Paper 2 — Computational Thinking, Algorithms and Programming.", badge: "2 Exams", duration: "90 min each", paper: "2" },
];

const practicePapers: PaperSet[] = [
  { title: "OCR J277/01 Practice Paper Set", description: "3 × 60-minute practice papers for Paper 1. Foundation, Mixed, and Challenge levels.", badge: "3 Papers", duration: "60 min each", paper: "1" },
  { title: "OCR J277/02 Practice Paper Set", description: "3 × 60-minute practice papers for Paper 2. Progressive difficulty to develop exam skills.", badge: "3 Papers", duration: "60 min each", paper: "2" },
];

const paper1Topics = ["Systems Architecture", "Memory & Storage", "Computer Networks", "Network Security", "Systems Software", "Ethical, Legal & Environmental"];
const paper2Topics = ["Algorithms", "Programming Fundamentals", "Producing Robust Programs", "Boolean Logic", "Programming Languages & IDEs"];

const fiveADay = [
  { title: "OCR J277/01 Five A Day", description: "Daily bite-sized practice for Paper 1. 5 questions per day covering all topics. Perfect for consistent revision.", paper: "1" as const },
  { title: "OCR J277/02 Five A Day", description: "Daily bite-sized practice for Paper 2. 5 questions per day covering programming and computational thinking.", paper: "2" as const },
];

function PaperCard({ set }: { set: PaperSet }) {
  return (
    <Card className="rounded-2xl border-border/50 overflow-hidden group hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h4 className="font-display font-bold text-sm">{set.title}</h4>
              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-none">Paper {set.paper}</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{set.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {set.badge && (
            <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{set.badge}</span>
          )}
          {set.duration && (
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{set.duration}</span>
          )}
        </div>
        <Button size="sm" variant="outline" className="w-fit rounded-full text-xs h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
          Start Practice <ArrowRight className="w-3 h-3" />
        </Button>
      </CardContent>
    </Card>
  );
}

function TopicMasteryCard({ title, topics, paper }: { title: string; topics: string[]; paper: string }) {
  return (
    <Card className="rounded-2xl border-border/50 overflow-hidden">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h4 className="font-display font-bold text-sm">{title}</h4>
          <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-none">Paper {paper}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">Focused practice assignments for each topic. Perfect for targeted revision and skill building.</p>
        <div className="flex flex-wrap gap-1.5">
          {topics.map(t => (
            <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer">
              {t}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function QuestionBank() {
  const { data: topics } = useListTopics();
  const { board } = useExamBoard();
  const totalQuestions = topics?.reduce((sum, t) => sum + (t.questionCount || 0), 0) || 600;

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

          {/* Mock Exams */}
          <motion.section variants={item}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📝</span>
              <h2 className="text-xl font-display font-bold">Mock Exam Sets</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockExams.map(s => <PaperCard key={s.title} set={s} />)}
            </div>
          </motion.section>

          {/* Practice Papers */}
          <motion.section variants={item}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📄</span>
              <h2 className="text-xl font-display font-bold">Practice Paper Sets</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {practicePapers.map(s => <PaperCard key={s.title} set={s} />)}
            </div>
          </motion.section>

          {/* Topic Mastery */}
          <motion.section variants={item}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🎯</span>
              <h2 className="text-xl font-display font-bold">Topic Mastery Sets</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TopicMasteryCard title="OCR J277/01 Topic Mastery" topics={paper1Topics} paper="1" />
              <TopicMasteryCard title="OCR J277/02 Topic Mastery" topics={paper2Topics} paper="2" />
            </div>
          </motion.section>

          {/* Five A Day */}
          <motion.section variants={item}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🌟</span>
              <h2 className="text-xl font-display font-bold">Five A Day Sets</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fiveADay.map(f => (
                <Card key={f.title} className="rounded-2xl border-border/50 overflow-hidden group hover:border-primary/30 transition-all">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-secondary" />
                      <h4 className="font-display font-bold text-sm">{f.title}</h4>
                      <Badge variant="secondary" className="text-[10px] bg-secondary/10 text-secondary border-none">Paper {f.paper}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Zap className="w-3 h-3 text-secondary" />
                      <span>5 questions daily · All topics covered</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-fit rounded-full text-xs h-8 gap-1.5 border-secondary/30 text-secondary hover:bg-secondary/10">
                      Start Today <ArrowRight className="w-3 h-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

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
                    Our library contains over 600 professionally-written questions aligned to the OCR J277 GCSE Computer Science specification. Every question includes mark schemes, model answers, and pseudocode hints.
                  </p>
                </div>
                <Link to="/">
                  <Button className="rounded-full gap-1.5 shrink-0">
                    Browse Topics <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
