import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Binary,
  BookOpen,
  Brain,
  Clock,
  Code2,
  Database,
  GraduationCap,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
  ArrowRight,
} from "lucide-react";
import heroSnake from "@/assets/hero-snake.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { MasteryBadge } from "@/components/rewards/MasteryBadge";
import { RewardsSummaryCard } from "@/components/rewards/RewardsSummaryCard";
import { useListTopics, useGetProgress, useExamBoard, type ExamBoard, type Topic } from "@/hooks/useTopics";

type TopicDifficultyFilter = "all" | Topic["difficulty"];
type TopicLevelFilter = "all" | Topic["level"];

const categoryIcons: Record<string, React.ReactNode> = {
  "Getting Started": <Star className="w-4 h-4" />,
  "Programming Fundamentals": <Code2 className="w-4 h-4" />,
  "Data Structures & Strings": <Zap className="w-4 h-4" />,
  "Subroutines": <Target className="w-4 h-4" />,
  "Robust Programming": <Shield className="w-4 h-4" />,
  "Boolean Logic": <Binary className="w-4 h-4" />,
  "Algorithms": <Brain className="w-4 h-4" />,
  "SQL & IDEs": <Database className="w-4 h-4" />,
  "Exam Preparation": <GraduationCap className="w-4 h-4" />,
};

const categoryDescriptions: Record<string, string> = {
  "Getting Started": "Your first steps with Python",
  "Programming Fundamentals": "OCR J277 2.2 - Core programming concepts",
  "Data Structures & Strings": "OCR J277 2.2 - Working with data",
  "Subroutines": "OCR J277 2.2 - Functions, files & modules",
  "Robust Programming": "OCR J277 2.3 - Defensive design & testing",
  "Boolean Logic": "OCR J277 2.4 - Logic gates & truth tables",
  "Algorithms": "OCR J277 2.1 - Searching & sorting",
  "SQL & IDEs": "OCR J277 2.2 - Database queries",
  "Exam Preparation": "Pseudocode, trace tables, and exam strategies",
};

const boardLabels: Record<ExamBoard, string> = {
  ocr: "OCR J277",
  aqa: "AQA 8525",
  all: "All Boards",
};

export default function Home() {
  const { board, setBoard } = useExamBoard();
  const { data: topics, isLoading: topicsLoading } = useListTopics();
  const { data: progress, isLoading: progressLoading } = useGetProgress();
  const [difficultyFilter, setDifficultyFilter] = useState<TopicDifficultyFilter>("all");
  const [levelFilter, setLevelFilter] = useState<TopicLevelFilter>("all");

  const filteredTopics = useMemo(() => {
    return (topics || []).filter((topic) => {
      if (difficultyFilter !== "all" && topic.difficulty !== difficultyFilter) return false;
      if (levelFilter !== "all" && topic.level !== levelFilter) return false;
      return true;
    });
  }, [topics, difficultyFilter, levelFilter]);

  const completedCount = progress?.completedTopics || 0;
  const totalCount = topics?.length || 0;
  const percentComplete = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const weeklySeconds = progress?.weeklyTimeSpentSeconds || 0;
  const weekHours = Math.floor(weeklySeconds / 3600);
  const weekMins = Math.floor((weeklySeconds % 3600) / 60);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const item = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
  };

  const categories = filteredTopics.reduce((acc: Record<string, Topic[]>, topic) => {
    if (!acc[topic.category]) acc[topic.category] = [];
    acc[topic.category].push(topic);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-full pb-20">
      <div className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/5" />
          <div className="absolute top-10 left-[16%] w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px] glow-pulse" />
          <div className="absolute bottom-0 right-[20%] w-[400px] h-[400px] bg-secondary/8 rounded-full blur-[120px] glow-pulse" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl flex-1"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-5 border border-primary/20 font-medium text-sm"
            >
              <GraduationCap className="w-4 h-4" />
              <span>GCSE Computer Science - {boardLabels[board]}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-foreground leading-[1.08] mb-5">
              Master Python.
              <br />
              <span className="gradient-text">Ace Your Exams.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
              Interactive lessons, live code execution, AI-powered quizzes, and exam-style practice - mapped to the {boardLabels[board]} specification.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {(["ocr", "aqa", "all"] as ExamBoard[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setBoard(value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    board === value
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                  }`}
                >
                  {boardLabels[value]}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to={`/topic/${topics?.[0]?.slug || "intro-to-python"}`}>
                <Button size="lg" className="h-13 px-8 text-base font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 transition-all">
                  Start Learning <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/playground">
                <Button size="lg" variant="outline" className="h-13 px-8 text-base font-semibold rounded-full border-primary/30 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 hover:-translate-y-0.5 transition-all">
                  <Code2 className="mr-2 w-5 h-5" /> Python Sandbox
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex flex-shrink-0 items-center justify-center"
          >
            <img src={heroSnake} alt="PyLearn mascot" className="w-[340px] xl:w-[400px] h-auto drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>

      <div className="container px-4 md:px-6 mx-auto max-w-6xl -mt-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14"
        >
          {progressLoading ? (
            [1, 2, 3].map((index) => <Skeleton key={index} className="h-28 rounded-2xl" />)
          ) : (
            <>
              {progress && <RewardsSummaryCard progress={progress} />}
              <Card className="glass card-shine rounded-2xl overflow-hidden group hover:neon-glow transition-all duration-500">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Topics Completed</p>
                    <div className="flex items-end justify-between">
                      <h3 className="text-2xl font-bold font-display">
                        {completedCount}
                        <span className="text-base text-muted-foreground">/{totalCount}</span>
                      </h3>
                      <span className="text-xs font-bold text-primary">{Math.round(percentComplete)}%</span>
                    </div>
                    <Progress value={percentComplete} className="h-1 mt-2 bg-muted/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass card-shine rounded-2xl overflow-hidden group hover:neon-glow-purple transition-all duration-500">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center text-secondary shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Time This Week</p>
                    <h3 className="text-2xl font-bold font-display">
                      {weekHours > 0 ? `${weekHours}h ` : ""}
                      {weekMins}m
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass card-shine rounded-2xl overflow-hidden group hover:neon-glow-green transition-all duration-500">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-accent shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Best Quiz Score</p>
                    <h3 className="text-2xl font-bold font-display">
                      {progress?.overallBestScore !== null && progress?.overallBestScore !== undefined ? (
                        <>
                          {progress.overallBestScore}
                          <span className="text-base text-muted-foreground">/5</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>

        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold mb-1">Course Curriculum</h2>
            <p className="text-muted-foreground text-sm">
              {filteredTopics.length} filtered topics mapped to the <span className="font-semibold text-foreground">{boardLabels[board]}</span> specification
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Difficulty</span>
            {(["all", "beginner", "intermediate", "hard"] as TopicDifficultyFilter[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDifficultyFilter(value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  difficultyFilter === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {value === "all" ? "All Difficulties" : value}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Level</span>
            {(["all", "gcse", "expert"] as TopicLevelFilter[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLevelFilter(value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  levelFilter === value
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {value === "all" ? "All Levels" : value.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {topicsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((index) => <Skeleton key={index} className="h-24 rounded-2xl" />)}
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">
            {Object.entries(categories).map(([category, categoryTopics]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {categoryIcons[category] || <BookOpen className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold">{category}</h3>
                    {categoryDescriptions[category] && (
                      <p className="text-xs text-muted-foreground">{categoryDescriptions[category]}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  {categoryTopics.map((topic, index) => {
                    const topicProgress = progress?.topicProgress.find((entry) => entry.topicSlug === topic.slug);
                    const completed = Boolean(topicProgress?.completed);
                    return (
                      <motion.div key={topic.id} variants={item}>
                        <Link to={`/topic/${topic.slug}`}>
                          <Card className="glass card-shine rounded-xl overflow-hidden group hover:neon-glow transition-all duration-300 cursor-pointer h-full">
                            <CardContent className="p-4 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold font-display ${completed ? "bg-green-500/15 text-green-500" : "bg-muted/60 text-muted-foreground"}`}>
                                  {completed ? <Trophy className="w-4 h-4" /> : <span>{index + 1}</span>}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">{topic.title}</h4>
                                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                    {topic.ocrRef && (
                                      <span className="text-[10px] font-mono text-muted-foreground/60">S{topic.ocrRef}</span>
                                    )}
                                    <MasteryBadge tier={topicProgress?.masteryTier || "none"} compact />
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{topic.difficulty}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/10 text-secondary">{topic.level.toUpperCase()}</span>
                                  </div>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
