import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, BookOpen, Code2, Award, AlertTriangle, Lightbulb, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CodeRunner } from "@/components/code/CodeRunner";
import { RunnableCode } from "@/components/code/RunnableCode";
import { QuizComponent } from "@/components/quiz/QuizComponent";
import { AiHelper } from "@/components/ai/AiHelper";
import { topicData } from "@/data/topicContent";
import { useListTopics, useGetTopicProgress, useUpdateTopicProgress } from "@/hooks/useTopics";

export default function TopicPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  
  const { data: topics } = useListTopics();
  const { data: progress } = useGetTopicProgress(slug);
  const updateProgress = useUpdateTopicProgress();

  const content = topicData[slug];
  const topicMeta = topics?.find(t => t.slug === slug);

  const [showAiHelper, setShowAiHelper] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const interval = setInterval(() => {
      updateProgress.mutate({ topicSlug: slug, data: { timeSpentSeconds: 10 } });
    }, 10000);
    return () => clearInterval(interval);
  }, [slug]);

  useEffect(() => {
    setShowAiHelper(false);
  }, [slug]);

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

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-primary mb-3">
          <BookOpen className="w-4 h-4" />
          <span>{topicMeta.category}</span>
          <span className="text-muted-foreground/40">·</span>
          <span className="text-muted-foreground text-xs">Topic {currentIndex + 1} of {topics?.length || 0}</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-foreground">
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

      {showAiHelper && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-8">
          <AiHelper topicSlug={slug} topicTitle={topicMeta.title} />
        </motion.div>
      )}

      <Tabs defaultValue="lesson" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-8 h-12 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="lesson" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2">
            <BookOpen className="w-4 h-4" /> Lesson
          </TabsTrigger>
          <TabsTrigger value="practice" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2">
            <Code2 className="w-4 h-4" /> Practice
          </TabsTrigger>
          <TabsTrigger value="quiz" className="rounded-lg font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2">
            <Award className="w-4 h-4" /> Quiz
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lesson" className="space-y-10 focus-visible:outline-none focus-visible:ring-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {content.videoUrl && (
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-black mb-10 neon-glow">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={content.videoUrl} 
                  title="YouTube video player" 
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

        <TabsContent value="practice" className="focus-visible:outline-none focus-visible:ring-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6">
              <h2 className="text-2xl font-display font-bold mb-2">Practice</h2>
              <p className="text-muted-foreground">Edit and run code to practice what you've learned.</p>
            </div>
            <CodeRunner initialCode={content.codeExamples[0]?.code || 'print("Hello!")'} height="h-[400px]" />
          </motion.div>
        </TabsContent>

        <TabsContent value="quiz" className="focus-visible:outline-none focus-visible:ring-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6">
              <h2 className="text-2xl font-display font-bold mb-2">Quiz</h2>
              <p className="text-muted-foreground">Test your understanding of {topicMeta.title}.</p>
            </div>
            <QuizComponent topicSlug={slug} questions={content.quiz} />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between mt-16 pt-8 border-t border-border/50">
        {prevTopic ? (
          <Link to={`/topic/${prevTopic.slug}`}>
            <Button variant="ghost" className="gap-2 hover:bg-primary/10">
              <ChevronLeft className="w-4 h-4" /> {prevTopic.title}
            </Button>
          </Link>
        ) : <div />}
        {nextTopic ? (
          <Link to={`/topic/${nextTopic.slug}`}>
            <Button variant="ghost" className="gap-2 hover:bg-primary/10">
              {nextTopic.title} <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
