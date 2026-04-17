import { useState } from "react";
import { Brain, CheckCircle2, ClipboardCheck, Sparkles, ChevronDown, ChevronUp, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TopicAugmentation, LongAnswerPrompt } from "@/generated/topicAugmentations";

interface TopicAugmentationPanelProps {
  augmentation: TopicAugmentation;
  onUseAiPrompt?: (prompt: string) => void;
}

function LongAnswerPromptCard({ prompt, onUseAiPrompt }: { prompt: LongAnswerPrompt; onUseAiPrompt?: (prompt: string) => void }) {
  const [showIndicative, setShowIndicative] = useState(false);
  const [showSample, setShowSample] = useState(false);

  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h4 className="text-sm font-semibold text-foreground">{prompt.title}</h4>
        <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
          {prompt.tier}{prompt.markRange ? ` - ${prompt.markRange}` : ""}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{prompt.scenario}</p>
      <div className="rounded-lg bg-background/80 border border-border/50 p-3">
        <p className="text-xs font-semibold text-foreground mb-1">Task</p>
        <p className="text-sm text-muted-foreground">{prompt.task}</p>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {onUseAiPrompt && (
          <Button
            size="sm"
            variant="default"
            className="rounded-full gap-1.5 h-8 text-xs"
            onClick={() => onUseAiPrompt(prompt.aiPrompt)}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Try with AI
          </Button>
        )}
        
        {prompt.indicativePoints.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full gap-1.5 h-8 text-xs"
            onClick={() => setShowIndicative(!showIndicative)}
          >
            {showIndicative ? <ChevronUp className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showIndicative ? "Hide Points" : "Show Points"}
          </Button>
        )}

        {prompt.sampleAnswer && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-full gap-1.5 h-8 text-xs"
            onClick={() => setShowSample(!showSample)}
          >
            {showSample ? <ChevronUp className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            {showSample ? "Hide Answer" : "Model Answer"}
          </Button>
        )}
      </div>

      {showIndicative && prompt.indicativePoints.length > 0 && (
        <div className="pt-2 border-t border-border/30">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Indicative Marking Content</p>
          <ul className="space-y-1.5">
            {prompt.indicativePoints.map((point, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSample && prompt.sampleAnswer && (
        <div className="pt-2 border-t border-border/30">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Full Model Answer</p>
          <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap bg-background/50 p-3 rounded-lg border border-border/30 italic">
            {prompt.sampleAnswer}
          </div>
        </div>
      )}
    </div>
  );
}

export function TopicAugmentationPanel({ augmentation, onUseAiPrompt }: TopicAugmentationPanelProps) {
  const hasChecklist = augmentation.revisionChecklist.length > 0;
  const hasExamFocus = augmentation.examFocus.length > 0;
  const hasLongAnswers = augmentation.longAnswerPrompts.length > 0;

  if (!hasChecklist && !hasExamFocus && !hasLongAnswers) {
    return null;
  }

  return (
    <Card className="rounded-2xl border-border/50">
      <CardContent className="p-5 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold">Exam Board Booster</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Reviewed textbook insights and long-answer prompts layered onto this topic. Use the AI helper to grade your attempts.
            </p>
          </div>
        </div>

        {hasChecklist && (
          <div className="space-y-2">
            <h3 className="text-sm font-display font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              What You Must Know
            </h3>
            <ul className="space-y-2">
              {augmentation.revisionChecklist.map((item) => (
                <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasExamFocus && (
          <div className="space-y-2">
            <h3 className="text-sm font-display font-bold flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-secondary" />
              Common Exam Demands
            </h3>
            <div className="flex flex-wrap gap-2">
              {augmentation.examFocus.map((item) => (
                <span
                  key={item}
                  className="text-xs px-2.5 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {hasLongAnswers && (
          <div className="space-y-3">
            <h3 className="text-sm font-display font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Long-Answer Warm-Ups
            </h3>
            <div className="space-y-3">
              {augmentation.longAnswerPrompts.map((prompt) => (
                <LongAnswerPromptCard 
                  key={`${prompt.tier}-${prompt.title}`} 
                  prompt={prompt} 
                  onUseAiPrompt={onUseAiPrompt} 
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
