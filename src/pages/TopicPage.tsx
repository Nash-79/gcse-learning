import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Award,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  GraduationCap,
  Lightbulb,
  Loader2,
  Sparkles,
  Swords,
} from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";
import { useAiSettings } from "@/lib/useAiSettings";
import { appLog } from "@/lib/appLogger";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RunnableCode } from "@/components/code/RunnableCode";
import { CodeRunner } from "@/components/code/CodeRunner";
import { AiHelper } from "@/components/ai/AiHelper";
import { CodingChallengePanel } from "@/components/challenges/CodingChallengePanel";
import { TopicAugmentationPanel } from "@/components/content/TopicAugmentationPanel";
import { TopicNotes } from "@/components/content/TopicNotes";
import { SteppedLearning } from "@/components/learning/SteppedLearning";
import { ExamQuestionBank } from "@/components/quiz/ExamQuestionBank";
import { QuizComponent } from "@/components/quiz/QuizComponent";
import { MasteryBadge } from "@/components/rewards/MasteryBadge";
import { topicLearningSteps } from "@/data/learningSteps";
import { topicData, type QuizQuestion } from "@/data/topicContent";
import { useRewards } from "@/hooks/useRewards";
import { useExamBoard, useGetTopicProgress, useListTopics, useUpdateTopicProgress } from "@/hooks/useTopics";
import { getTopicAugmentation } from "@/lib/topicAugmentation";
import { getRelatedTheory } from "@/lib/topicCrossLinks";

export default function TopicPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { board } = useExamBoard();

  const { provider: settingsProvider } = useAiSettings();
  const { data: topics, isLoading: topicsLoading } = useListTopics("all");
  const { data: progress } = useGetTopicProgress(slug);
  const updateProgress = useUpdateTopicProgress();
  const rewards = useRewards();

  const content = topicData[slug];
  const topicMeta = topics?.find((topic) => topic.slug === slug);
  const learningSteps = topicLearningSteps[slug];
  const hasSteps = Boolean(learningSteps && learningSteps.length > 0);
  const videoUrl = content?.videoUrl;

  const [aiQuestions, setAiQuestions] = useState<QuizQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(hasSteps ? "learn" : "lesson");
  const [aiSeedPrompt, setAiSeedPrompt] = useState("");

  const augmentation = getTopicAugmentation(slug, board);
  const relatedTheory = getRelatedTheory(slug);

  useEffect(() => {
    if (!slug) return;
    const interval = setInterval(() => {
      updateProgress.mutate({ topicSlug: slug, data: { timeSpentSeconds: 10 } });
    }, 10000);
    return () => clearInterval(interval);
  }, [slug]);

  useEffect(() => {
    setAiQuestions([]);
    setShowAiHelper(false);
    setGenerationError(null);
    setActiveTab(hasSteps ? "learn" : "lesson");
    setAiSeedPrompt("");
  }, [slug, hasSteps]);

  const generateMoreQuestions = useCallback(async () => {
    if (!content) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await apiFetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "generate",
            topicTitle: topicMeta?.title || slug,
            provider: settingsProvider,
            systemPromptOverride:
              `You are a GCSE Computer Science quiz generator. Generate exactly 5 multiple-choice questions about "${topicMeta?.title || slug}" for Python programming. ` +
              `Return ONLY a JSON object with a "questions" array of objects with these fields: question (string), options (array of 4 strings), correctIndex (0-3), explanation (string), hint (string), difficulty ("easy"|"medium"|"hard"). Do not include any other text.`,
            userPromptOverride: `Generate 5 new quiz questions about ${topicMeta?.title || slug}. Existing questions to avoid repeating: ${content.quiz.map(q => q.question).join("; ")}`,
            maxTokens: 2000,
          }),
      });

      const data = await response.json();
      if (!response.ok || data?.error) {
        throw new Error(data?.error || "Request failed");
      }

      const parsed = JSON.parse(data?.content || "{}");
      const questions: QuizQuestion[] = Array.isArray(parsed) ? parsed : parsed.questions || [];

      if (questions.length === 0) {
        throw new Error("No questions generated");
      }

      setAiQuestions((previous) => [...previous, ...questions]);
      setActiveTab("quiz");
    } catch (err: any) {
      void appLog({
        event_type: "api_error",
        origin: "TopicPage.generateMoreQuestions",
        message: err?.message || "Failed to generate topic questions",
        details: { slug, topicTitle: topicMeta?.title || slug },
        error_stack: err?.stack,
        severity: "error",
      });
      setGenerationError(err?.message || "Failed to generate questions");
    } finally {
      setIsGenerating(false);
    }
  }, [content, slug, topicMeta]);

  if (topicsLoading) {
    return (
      <div className="container max-w-5xl mx-auto p-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!content || !topicMeta) {
    return (
      <div className="container max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <AlertTriangle className="w-12 h-12 text-destructive opacity-70" />
        <h2 className="text-2xl font-bold">Topic not found</h2>
        <p className="text-muted-foreground">
          The topic <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{slug}</code> does not exist.
        </p>
        <Link to="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const currentIndex = topics.findIndex((topic) => topic.slug === slug);
  const previousTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;
  const allQuestions: QuizQuestion[] = [...content.quiz, ...aiQuestions];
  const handleUseAiPrompt = (prompt: string) => {
    setAiSeedPrompt(prompt);
    setShowAiHelper(true);
    setActiveTab("lesson");
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 pb-24">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
          className="mb-3 -ml-2 gap-1.5 text-muted-foreground hover:text-foreground text-xs h-8 rounded-lg"
          aria-label="Go back to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-2 text-sm font-medium text-primary mb-3 flex-wrap">
          <BookOpen className="w-4 h-4" />
          <span>{topicMeta.category}</span>
          <span className="text-muted-foreground/40">-</span>
          <span className="text-muted-foreground text-xs">Topic {currentIndex + 1} of {topics.length}</span>
          {topicMeta.ocrRef && (
            <>
              <span className="text-muted-foreground/40">-</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> OCR {topicMeta.ocrRef}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-foreground">
            {topicMeta.title}
          </h1>
          <div className="flex items-center gap-3 shrink-0">
            <MasteryBadge tier={progress?.masteryTier || "none"} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAiHelper((value) => !value)}
              className="gap-1.5 text-secondary hover:text-secondary hover:bg-secondary/10 rounded-full"
            >
              <Bot className="w-4 h-4" />
              AI Help
            </Button>
            {progress?.completed && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 neon-glow-green">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold text-sm">Completed</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showAiHelper && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-8">
          <AiHelper key={slug} topicSlug={slug} topicTitle={topicMeta.title} seedPrompt={aiSeedPrompt} />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)] gap-6 mb-8">
        {/* Primary action card */}
        <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-display font-bold">Quick Check Before Full Practice</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Try the built-in quiz, generate extra AI questions, or open the AI tutor for this topic.
                  When you&apos;re ready, head into the full exam question bank.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button size="sm" className="rounded-full gap-1.5" onClick={() => setActiveTab("quiz")}>
                    <Award className="w-4 h-4" /> Open Quick Quiz
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full gap-1.5"
                    disabled={isGenerating}
                    onClick={() => void generateMoreQuestions()}
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate Extra Questions
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full gap-1.5"
                    onClick={() => {
                      setShowAiHelper(true);
                      setAiSeedPrompt(`Explain ${topicMeta.title} in simple terms`);
                      setActiveTab("lesson");
                    }}
                  >
                    <Bot className="w-4 h-4" /> Ask AI Tutor
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* At-a-glance stats card — fills the previously empty right gutter */}
        <Card className="rounded-2xl border-border/60 bg-gradient-to-br from-muted/30 via-transparent to-muted/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              <Lightbulb className="w-3 h-3" /> At a glance
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-card/60 border border-border/50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Quick Quiz</div>
                <div className="text-xl font-display font-bold text-foreground mt-0.5">
                  {content.quiz.length}
                  {aiQuestions.length > 0 && (
                    <span className="text-xs font-medium text-primary ml-1">+{aiQuestions.length}</span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground">questions</div>
              </div>
              <div className="rounded-xl bg-card/60 border border-border/50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Code Examples</div>
                <div className="text-xl font-display font-bold text-foreground mt-0.5">{content.codeExamples.length}</div>
                <div className="text-[10px] text-muted-foreground">runnable</div>
              </div>
              <div className="rounded-xl bg-card/60 border border-border/50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Spec</div>
                <div className="text-sm font-display font-bold text-foreground mt-0.5 truncate">
                  {topicMeta.ocrRef ? `OCR ${topicMeta.ocrRef}` : "—"}
                </div>
                <div className="text-[10px] text-muted-foreground capitalize">{topicMeta.difficulty}</div>
              </div>
              <div className="rounded-xl bg-card/60 border border-border/50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Status</div>
                <div className="text-sm font-display font-bold text-foreground mt-0.5">
                  {progress?.completed ? "Complete" : progress?.lessonCompleted ? "In progress" : "Not started"}
                </div>
                <div className="text-[10px] text-muted-foreground capitalize">
                  {progress?.masteryTier && progress.masteryTier !== "none" ? `${progress.masteryTier} mastery` : "no badge yet"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto -mx-4 px-4 mb-8 scrollbar-none">
          <TabsList className="inline-flex h-11 min-w-max bg-muted/50 p-1 rounded-xl gap-0.5" aria-label="Topic sections">
            {hasSteps && (
              <TabsTrigger value="learn" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm px-3 py-2">
                <GraduationCap className="w-4 h-4 shrink-0" /> <span className="hidden sm:inline">Learn</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="lesson" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm px-3 py-2">
              <BookOpen className="w-4 h-4 shrink-0" /> <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm px-3 py-2">
              <Swords className="w-4 h-4 shrink-0" /> <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm px-3 py-2">
              <Code2 className="w-4 h-4 shrink-0" /> <span className="hidden sm:inline">Practice</span>
            </TabsTrigger>
            <TabsTrigger value="exam" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm px-3 py-2">
              <FileText className="w-4 h-4 shrink-0" /> <span className="hidden sm:inline">Exam Qs</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm px-3 py-2">
              <Award className="w-4 h-4 shrink-0" /> <span className="hidden sm:inline">Quiz</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {hasSteps && (
          <TabsContent value="learn" className="focus-visible:outline-none focus-visible:ring-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {videoUrl && (
                <div className="w-full aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-black mb-8 neon-glow">
                  <iframe
                    width="100%"
                    height="100%"
                    src={videoUrl}
                    title={`${topicMeta.title} video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
              <SteppedLearning
                steps={learningSteps}
                topicTitle={topicMeta.title}
                onComplete={() => rewards.completeTheoryActivity(slug)}
                onCodeRun={() => rewards.recordTopicCodeRun(slug)}
              />
            </motion.div>
          </TabsContent>
        )}

        <TabsContent value="lesson" className="space-y-10 focus-visible:outline-none focus-visible:ring-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {!hasSteps && videoUrl && (
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-black mb-10 neon-glow">
                <iframe
                  width="100%"
                  height="100%"
                  src={videoUrl}
                  title={`${topicMeta.title} video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}

            <TopicNotes paragraphs={content.explanation} />

            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">Ready to lock this lesson in?</p>
                <p className="text-xs text-muted-foreground">Mark the notes as complete to collect XP and move this topic toward Bronze mastery.</p>
              </div>
              <Button
                size="sm"
                className="rounded-full"
                variant={progress?.lessonCompleted ? "outline" : "default"}
                onClick={() => rewards.completeLesson(slug)}
              >
                {progress?.lessonCompleted ? "Lesson completed" : "Mark lesson complete"}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-10">
              {content.codeExamples.map((example, index) => (
                <RunnableCode key={index} code={example.code} title={example.title} description={example.description} />
              ))}
            </div>


            {augmentation && (
              <div className="mt-10">
                <TopicAugmentationPanel augmentation={augmentation} onUseAiPrompt={handleUseAiPrompt} />
              </div>
            )}

            {relatedTheory && (
              <Link
                to={`/topic-theory/${relatedTheory.slug}`}
                className="block mt-10 group"
                aria-label={`Open revision theory: ${relatedTheory.title}`}
              >
                <Card className="rounded-2xl border-secondary/30 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 transition-colors group-hover:border-secondary/60">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 text-2xl">
                      {relatedTheory.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-secondary mb-1">
                        <GraduationCap className="w-3 h-3" /> Revise the theory
                        <span className="px-2 py-0.5 rounded-full bg-secondary/15">Paper {relatedTheory.paper}</span>
                      </div>
                      <h3 className="text-base font-display font-bold text-foreground">{relatedTheory.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Spec-aligned revision notes, diagrams, and exam-style questions for this topic.
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 group-hover:text-secondary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <Card className="border-primary/20 bg-primary/5 shadow-none rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-primary mb-4 font-display">
                    <Lightbulb className="w-5 h-5" /> Key Takeaways
                  </h3>
                  <ul className="space-y-3">
                    {content.keyPoints.map((keyPoint, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-foreground/80">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {keyPoint}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-destructive/20 bg-destructive/5 shadow-none rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-destructive mb-4 font-display">
                    <AlertTriangle className="w-5 h-5" /> Common Mistakes
                  </h3>
                  <ul className="space-y-4">
                    {content.commonMistakes.map((mistake, index) => (
                      <li key={index} className="text-sm">
                        <span className="text-destructive/80">X {mistake.mistake}</span>
                        <br />
                        <span className="text-green-500">Correct: {mistake.fix}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {content.workedExample && (
              <Card className="mt-10 border-secondary/20 bg-secondary/5 shadow-none rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-secondary mb-2 font-display">{content.workedExample.title}</h3>
                  <p className="text-muted-foreground mb-2"><strong>Problem:</strong> {content.workedExample.problem}</p>
                  <p className="text-muted-foreground mb-4"><strong>Approach:</strong> {content.workedExample.solution}</p>
                  <RunnableCode code={content.workedExample.code} />
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="challenges" className="focus-visible:outline-none focus-visible:ring-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div>
              <h2 className="text-2xl font-display font-bold mb-2">Coding Challenges</h2>
              <p className="text-muted-foreground text-sm">
                Exam-style coding tasks at every level. Write real code, get AI feedback.
              </p>
            </div>
            <CodingChallengePanel topicSlug={slug} topicTitle={topicMeta.title} />
          </motion.div>
        </TabsContent>

        <TabsContent value="practice" className="focus-visible:outline-none focus-visible:ring-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6">
              <h2 className="text-2xl font-display font-bold mb-2">Practice</h2>
              <p className="text-muted-foreground">Edit and run code to practice what you have learned.</p>
            </div>
            <CodeRunner
              initialCode={content.codeExamples[0]?.code || 'print("Hello!")'}
              height="h-[400px]"
              onRunSuccess={() => rewards.recordTopicCodeRun(slug)}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="exam" className="focus-visible:outline-none focus-visible:ring-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6">
              <h2 className="text-2xl font-display font-bold mb-2">Exam Questions</h2>
              <p className="text-muted-foreground">Browse exam-style questions with pseudocode hints. Click to expand and attempt each one.</p>
            </div>
            <ExamQuestionBank
              topicSlug={slug}
              topicTitle={topicMeta.title}
              questions={allQuestions}
              onQuestionsGenerated={(newQuestions) => setAiQuestions((previous) => [...previous, ...newQuestions])}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="quiz" className="focus-visible:outline-none focus-visible:ring-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold mb-2">Quiz</h2>
                <p className="text-muted-foreground">Test your understanding of {topicMeta.title}.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void generateMoreQuestions()}
                disabled={isGenerating}
                className="gap-2 rounded-full border-secondary/30 text-secondary hover:bg-secondary/10 shrink-0"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate AI Questions
              </Button>
            </div>

            {aiQuestions.length > 0 && (
              <div className="mb-4 flex items-center gap-2 text-sm bg-secondary/10 text-secondary border border-secondary/20 rounded-xl px-4 py-2.5">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{aiQuestions.length} AI-generated questions added</span>
              </div>
            )}
            {generationError && (
              <div className="mb-4 flex items-center justify-between gap-2 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{generationError}</span>
                </div>
                <button type="button" onClick={() => setGenerationError(null)} className="text-xs underline opacity-80 hover:opacity-100">
                  Dismiss
                </button>
              </div>
            )}

            <QuizComponent topicSlug={slug} questions={allQuestions} onSendToAiTutor={handleUseAiPrompt} />
          </motion.div>
        </TabsContent>
      </Tabs>

      <nav aria-label="Topic navigation" className="flex justify-between gap-3 mt-16 pt-8 border-t border-border/50">
        {previousTopic ? (
          <Link to={`/topic/${previousTopic.slug}`} aria-label={`Previous topic: ${previousTopic.title}`} className="flex-1 max-w-[45%]">
            <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-primary/10 text-left h-auto py-2 px-3">
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span className="flex flex-col items-start min-w-0">
                <span className="text-[10px] text-muted-foreground">Previous</span>
                <span className="text-sm font-medium truncate w-full">{previousTopic.title}</span>
              </span>
            </Button>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextTopic ? (
          <Link to={`/topic/${nextTopic.slug}`} aria-label={`Next topic: ${nextTopic.title}`} className="flex-1 max-w-[45%]">
            <Button variant="ghost" className="w-full justify-end gap-2 hover:bg-primary/10 text-right h-auto py-2 px-3">
              <span className="flex flex-col items-end min-w-0">
                <span className="text-[10px] text-muted-foreground">Up Next</span>
                <span className="text-sm font-medium truncate w-full">{nextTopic.title}</span>
              </span>
              <ChevronRight className="w-4 h-4 shrink-0" />
            </Button>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </nav>
    </div>
  );
}
