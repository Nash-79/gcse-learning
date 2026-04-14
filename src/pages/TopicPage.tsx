import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { useAiSettings } from "@/lib/useAiSettings";
import { appLog } from "@/lib/appLogger";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, BookOpen, Code2, Award, AlertTriangle, Lightbulb, Sparkles, Bot, Loader2, Swords, GraduationCap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CodeRunner } from "@/components/code/CodeRunner";
import { RunnableCode } from "@/components/code/RunnableCode";
import { QuizComponent } from "@/components/quiz/QuizComponent";
import { SteppedLearning } from "@/components/learning/SteppedLearning";
import type { QuizQuestion } from "@/data/topicContent";
import { AiHelper } from "@/components/ai/AiHelper";
import { CodingChallengePanel } from "@/components/challenges/CodingChallengePanel";
import { ExamQuestionBank } from "@/components/quiz/ExamQuestionBank";
import { topicData } from "@/data/topicContent";
import { topicLearningSteps } from "@/data/learningSteps";
import { useListTopics, useGetTopicProgress, useUpdateTopicProgress } from "@/hooks/useTopics";

// Correct YouTube videos per topic
const topicVideos: Record<string, string> = {
  "intro-to-python": "https://www.youtube.com/embed/kqtD5dpn9C8",
  "variables-data-types": "https://www.youtube.com/embed/cQT33yu9pY8",
  "variables-constants": "https://www.youtube.com/embed/cQT33yu9pY8",
  "data-types-casting": "https://www.youtube.com/embed/u_ECGvn1Z2c",
  "input-output-casting": "https://www.youtube.com/embed/I9h1c-121Uk",
  "arithmetic-operators": "https://www.youtube.com/embed/Aj8FQRIHJSc",
  "selection-if-else": "https://www.youtube.com/embed/Zp5MuPOtsSY",
  "iteration": "https://www.youtube.com/embed/6iF8Xb7Z3wQ",
  "string-handling": "https://www.youtube.com/embed/lSItwlnF0eU",
  "string-manipulation": "https://www.youtube.com/embed/lSItwlnF0eU",
  "lists-tuples-dicts": "https://www.youtube.com/embed/W8KRzm-HUcc",
  "2d-arrays": "https://www.youtube.com/embed/RHjtBv4dmas",
  "functions-scope": "https://www.youtube.com/embed/9Os0o3wzS_I",
  "file-handling": "https://www.youtube.com/embed/Uh2ebFW8OYM",
  "random-numbers": "https://www.youtube.com/embed/KzqSDvzOFNA",
  "error-handling": "https://www.youtube.com/embed/NIWwJbo-9_8",
  "robust-programming": "https://www.youtube.com/embed/NIWwJbo-9_8",
  "boolean-logic": "https://www.youtube.com/embed/UvI-AMAtrvE",
  "searching-algorithms": "https://www.youtube.com/embed/YNMnJmv8Cd4",
  "sorting-algorithms": "https://www.youtube.com/embed/kPRA0W1kECg",
  "insertion-sort": "https://www.youtube.com/embed/JU767SDMDvA",
  "sql-basics": "https://www.youtube.com/embed/27axs9dO7AE",
  "pseudocode-trace-tables": "https://www.youtube.com/embed/4jLO0hXPEAE",
  "exam-tips": "https://www.youtube.com/embed/4jLO0hXPEAE",
};

export default function TopicPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: topics, isLoading: topicsLoading } = useListTopics("all");
  const { data: progress } = useGetTopicProgress(slug);
  const updateProgress = useUpdateTopicProgress();
  

  const content = topicData[slug];
  const topicMeta = topics?.find(t => t.slug === slug);
  const learningSteps = topicLearningSteps[slug];
  const videoUrl = topicVideos[slug] || content?.videoUrl;

  const [aiQuestions, setAiQuestions] = useState<QuizQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [showAiHelper, setShowAiHelper] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const interval = setInterval(() => {
      updateProgress.mutate({ topicSlug: slug, data: { timeSpentSeconds: 10 } });
    }, 10000);
    return () => clearInterval(interval);
  }, [slug]);

  // Reset state when topic changes — including AI helper context
  useEffect(() => {
    setAiQuestions([]);
    setShowAiHelper(false);
  }, [slug]);

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
          systemPromptOverride: `You are a GCSE Computer Science quiz generator. Generate exactly 5 multiple-choice questions about "${topicMeta?.title || slug}" for Python programming. Return ONLY a JSON object with a "questions" array of objects with these fields: question (string), options (array of 4 strings), correctIndex (0-3), explanation (string), hint (string), difficulty ("easy"|"medium"|"hard"). Do not include any other text.`,
          userPromptOverride: `Generate 5 new quiz questions about ${topicMeta?.title || slug}. Existing questions to avoid repeating: ${content.quiz.map(q => q.question).join("; ")}`,
          maxTokens: 2000,
        }),
      });
      const data = await response.json();
      if (!response.ok || data?.error) throw new Error(data?.error || "Request failed");
      const text = data?.content || "";
      const parsed = JSON.parse(text);
      const questions: QuizQuestion[] = Array.isArray(parsed) ? parsed : parsed.questions || [];
      if (questions.length === 0) throw new Error("No questions generated");
      setAiQuestions(prev => [...prev, ...questions]);
    } catch (err: any) {
      void appLog({
        event_type: "api_error",
        origin: "TopicPage.generateMoreQuestions",
        message: err?.message || "Failed to generate topic questions",
        details: { slug, topicTitle: topicMeta?.title || slug },
        error_stack: err?.stack,
        severity: "error",
      });
      setGenerationError(err.message || "Failed to generate questions");
    } finally {
      setIsGenerating(false);
    }
  }, [slug, content, topicMeta]);

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

  const currentIndex = topics?.findIndex(t => t.slug === slug) ?? -1;
  const prevTopic = currentIndex > 0 ? topics?.[currentIndex - 1] : null;
  const nextTopic = currentIndex < (topics?.length || 0) - 1 ? topics?.[currentIndex + 1] : null;

  const allQuestions: QuizQuestion[] = [...content.quiz, ...aiQuestions];
  const hasSteps = learningSteps && learningSteps.length > 0;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
          className="mb-3 -ml-2 gap-1.5 text-muted-foreground hover:text-foreground text-xs h-8 rounded-lg"
          aria-label="Go back to previous page"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Back
        </Button>

        <div className="flex items-center gap-2 text-sm font-medium text-primary mb-3">
          <BookOpen className="w-4 h-4" />
          <span>{topicMeta.category}</span>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-muted-foreground text-xs">Topic {currentIndex + 1} of {topics?.length || 0}</span>
          {topicMeta.ocrRef && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> OCR §{topicMeta.ocrRef}
              </span>
            </>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-foreground">
            {topicMeta.title}
          </h1>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAiHelper(!showAiHelper)}
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

      {/* AI Helper — key={slug} forces reset when topic changes */}
      {showAiHelper && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-8">
          <AiHelper key={slug} topicSlug={slug} topicTitle={topicMeta.title} />
        </motion.div>
      )}

      <Tabs defaultValue={hasSteps ? "learn" : "lesson"} className="w-full">
        <div className="overflow-x-auto -mx-4 px-4 mb-8 scrollbar-none">
        <TabsList className="inline-flex h-11 min-w-max bg-muted/50 p-1 rounded-xl gap-0.5" aria-label="Topic sections">
          {hasSteps && (
            <TabsTrigger value="learn" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm px-3 py-2">
              <GraduationCap className="w-4 h-4 shrink-0" aria-hidden="true" /> <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="lesson" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm px-3 py-2">
            <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" /> <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
          <TabsTrigger value="challenges" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm px-3 py-2">
            <Swords className="w-4 h-4 shrink-0" aria-hidden="true" /> <span className="hidden sm:inline">Challenges</span>
          </TabsTrigger>
          <TabsTrigger value="practice" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm px-3 py-2">
            <Code2 className="w-4 h-4 shrink-0" aria-hidden="true" /> <span className="hidden sm:inline">Practice</span>
          </TabsTrigger>
          <TabsTrigger value="exam" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm px-3 py-2">
            <FileText className="w-4 h-4 shrink-0" aria-hidden="true" /> <span className="hidden sm:inline">Exam Qs</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 text-xs sm:text-sm px-3 py-2">
            <Award className="w-4 h-4 shrink-0" aria-hidden="true" /> <span className="hidden sm:inline">Quiz</span>
          </TabsTrigger>
        </TabsList>
        </div>

        {/* Interactive Stepped Learning */}
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
                  ></iframe>
                </div>
              )}
              <SteppedLearning steps={learningSteps} topicTitle={topicMeta.title} />
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
                ></iframe>
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              {content.explanation.map((para, i) => (
                <p key={i} className="text-lg leading-relaxed text-muted-foreground">{para}</p>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8 mt-10">
              {content.codeExamples.map((ex, i) => (
                <RunnableCode key={i} code={ex.code} title={ex.title} description={ex.description} />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <Card className="border-primary/20 bg-primary/5 shadow-none rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-primary mb-4 font-display">
                    <Lightbulb className="w-5 h-5" /> Key Takeaways
                  </h3>
                  <ul className="space-y-3">
                    {content.keyPoints.map((kp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {kp}
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
                    {content.commonMistakes.map((cm, i) => (
                      <li key={i} className="text-sm">
                        <span className="text-destructive/80">✗ {cm.mistake}</span>
                        <br />
                        <span className="text-green-500">✓ {cm.fix}</span>
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
              <p className="text-muted-foreground">Edit and run code to practice what you've learned.</p>
            </div>
            <CodeRunner initialCode={content.codeExamples[0]?.code || 'print("Hello!")'} height="h-[400px]" />
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
              onQuestionsGenerated={(newQs) => setAiQuestions(prev => [...prev, ...newQs])}
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
              {(
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateMoreQuestions}
                  disabled={isGenerating}
                  className="gap-2 rounded-full border-secondary/30 text-secondary hover:bg-secondary/10 shrink-0"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate AI Questions
                </Button>
              )}
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
                <button onClick={() => setGenerationError(null)} className="text-xs underline opacity-80 hover:opacity-100">Dismiss</button>
              </div>
            )}

            <QuizComponent topicSlug={slug} questions={allQuestions} />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Topic Navigation */}
      <nav
        aria-label="Topic navigation"
        className="flex justify-between gap-3 mt-16 pt-8 border-t border-border/50"
      >
        {prevTopic ? (
          <Link
            to={`/topic/${prevTopic.slug}`}
            aria-label={`Previous topic: ${prevTopic.title}`}
            className="flex-1 max-w-[45%]"
          >
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-primary/10 text-left h-auto py-2 px-3"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="flex flex-col items-start min-w-0">
                <span className="text-[10px] text-muted-foreground">Previous</span>
                <span className="text-sm font-medium truncate w-full">{prevTopic.title}</span>
              </span>
            </Button>
          </Link>
        ) : <div className="flex-1" />}
        {nextTopic ? (
          <Link
            to={`/topic/${nextTopic.slug}`}
            aria-label={`Next topic: ${nextTopic.title}`}
            className="flex-1 max-w-[45%]"
          >
            <Button
              variant="ghost"
              className="w-full justify-end gap-2 hover:bg-primary/10 text-right h-auto py-2 px-3"
            >
              <span className="flex flex-col items-end min-w-0">
                <span className="text-[10px] text-muted-foreground">Up Next</span>
                <span className="text-sm font-medium truncate w-full">{nextTopic.title}</span>
              </span>
              <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Button>
          </Link>
        ) : <div className="flex-1" />}
      </nav>
    </div>
  );
}
