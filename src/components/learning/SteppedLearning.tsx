import { useState } from "react";
import { Lightbulb, FileCode2, CheckCircle2, Zap, Flame, Target, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeRunner } from "@/components/code/CodeRunner";
import type { LearningStep, StepDifficulty } from "@/data/topicContent";

const difficultyConfig: Record<StepDifficulty, { label: string; icon: React.ElementType; color: string; bgActive: string; bgInactive: string; badge: string }> = {
  beginner: { label: "Beginner", icon: Zap, color: "text-green-500", bgActive: "bg-green-500/15 border-green-500/40", bgInactive: "bg-muted/40 border-border/50", badge: "bg-green-500/10 text-green-500 border-green-500/20" },
  intermediate: { label: "Intermediate", icon: Flame, color: "text-yellow-500", bgActive: "bg-yellow-500/15 border-yellow-500/40", bgInactive: "bg-muted/40 border-border/50", badge: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  hard: { label: "Hard", icon: Target, color: "text-red-500", bgActive: "bg-red-500/15 border-red-500/40", bgInactive: "bg-muted/40 border-border/50", badge: "bg-red-500/10 text-red-500 border-red-500/20" },
};

interface SteppedLearningProps {
  steps: LearningStep[];
  topicTitle: string;
}

export function SteppedLearning({ steps, topicTitle }: SteppedLearningProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [visibleHints, setVisibleHints] = useState<Set<number>>(new Set());
  const [filterDifficulty, setFilterDifficulty] = useState<StepDifficulty | "all">("all");

  const filtered = filterDifficulty === "all" ? steps : steps.filter(s => s.difficulty === filterDifficulty);
  const step = filtered[currentStep];

  const counts = {
    beginner: steps.filter(s => s.difficulty === "beginner").length,
    intermediate: steps.filter(s => s.difficulty === "intermediate").length,
    hard: steps.filter(s => s.difficulty === "hard").length,
  };

  const markComplete = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    if (currentStep < filtered.length - 1) {
      setCurrentStep(currentStep + 1);
      setVisibleHints(new Set());
    }
  };

  const toggleHint = (idx: number) => {
    setVisibleHints(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const switchFilter = (d: StepDifficulty | "all") => {
    setFilterDifficulty(d);
    setCurrentStep(0);
    setVisibleHints(new Set());
  };

  if (!step) {
    return <div className="text-center py-10 text-muted-foreground">No steps available for this difficulty.</div>;
  }

  const cfg = difficultyConfig[step.difficulty];
  const DiffIcon = cfg.icon;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Steps Sidebar */}
      <div className="lg:w-80 shrink-0 space-y-3">
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="text-sm font-display font-bold">📚 Learning Steps</span>
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <button
            onClick={() => switchFilter("all")}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${filterDifficulty === "all" ? "bg-foreground text-background border-foreground" : "bg-muted/50 border-border hover:bg-muted"}`}
          >
            All ({steps.length})
          </button>
          {(["beginner", "intermediate", "hard"] as const).map(d => {
            const c = difficultyConfig[d];
            const Icon = c.icon;
            return counts[d] > 0 ? (
              <button
                key={d}
                onClick={() => switchFilter(d)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all flex items-center gap-1 ${filterDifficulty === d ? `${c.badge} border-current` : "bg-muted/50 border-border hover:bg-muted"}`}
              >
                <Icon className="w-3 h-3" /> {c.label} ({counts[d]})
              </button>
            ) : null;
          })}
        </div>

        {/* Step Cards */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filtered.map((s, i) => {
            const sc = difficultyConfig[s.difficulty];
            const isActive = i === currentStep;
            const isCompleted = completedSteps.has(i);

            return (
              <button
                key={i}
                onClick={() => { setCurrentStep(i); setVisibleHints(new Set()); }}
                className={`w-full text-left rounded-xl border-2 p-3 transition-all ${isActive ? sc.bgActive : sc.bgInactive} ${isActive ? "shadow-md" : "hover:bg-muted/60"}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${isCompleted ? "bg-green-500 text-white" : isActive ? `${sc.color} bg-background border border-current` : "bg-muted text-muted-foreground"}`}>
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold leading-tight ${isActive ? "text-foreground" : "text-foreground/80"}`}>{s.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{s.explanation.substring(0, 80)}...</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 p-3">
          <p className="text-[11px] font-semibold text-yellow-500 mb-1">💡 Learning Tips</p>
          <ul className="text-[11px] text-muted-foreground space-y-0.5">
            <li>• Run your code frequently to test it</li>
            <li>• Try modifying examples to experiment</li>
            <li>• Use hints if you're stuck</li>
          </ul>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Step Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold mb-1">
              Step {currentStep + 1}: {step.title}
            </h2>
            <p className="text-sm text-muted-foreground">{step.explanation.substring(0, 120)}{step.explanation.length > 120 ? "..." : ""}</p>
          </div>
          <span className={`text-[11px] px-3 py-1 rounded-full border font-semibold flex items-center gap-1.5 shrink-0 ${cfg.badge}`}>
            <DiffIcon className="w-3.5 h-3.5" /> {cfg.label}
          </span>
        </div>

        {/* Explanation Card */}
        <Card className="border-primary/20 bg-primary/5 rounded-2xl shadow-none">
          <CardContent className="p-5">
            <h3 className="flex items-center gap-2 text-base font-bold text-primary mb-3 font-display">
              <Lightbulb className="w-4 h-4" /> Explanation
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{step.explanation}</p>
          </CardContent>
        </Card>

        {/* Examples */}
        {step.examples.length > 0 && (
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold mb-3 font-display">
              <FileCode2 className="w-4 h-4 text-secondary" /> Examples
            </h3>
            <div className="space-y-3">
              {step.examples.map((ex, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-border/50 bg-[#1e1e1e]">
                  <pre className="p-4 text-sm font-mono text-blue-100 whitespace-pre-wrap overflow-x-auto">{ex.code}</pre>
                  {ex.description && (
                    <div className="px-4 py-2 bg-muted/20 border-t border-border/30 text-xs text-muted-foreground">
                      {ex.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hints */}
        {step.hints.length > 0 && (
          <div>
            <button
              onClick={() => toggleHint(0)}
              className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors flex items-center gap-1.5 font-medium"
            >
              💡 Show Hint ({step.hints.length} available)
            </button>
            {step.hints.map((hint, i) => (
              visibleHints.has(i) ? (
                <div key={i} className="mt-2 text-sm bg-yellow-500/5 border border-yellow-500/10 rounded-xl px-4 py-3 text-foreground/80 flex items-start gap-2">
                  <span className="text-yellow-500 shrink-0">💡</span>
                  <span>{hint}</span>
                  {i < step.hints.length - 1 && !visibleHints.has(i + 1) && (
                    <button onClick={() => toggleHint(i + 1)} className="text-xs text-yellow-500 underline ml-auto shrink-0">
                      Next hint →
                    </button>
                  )}
                </div>
              ) : null
            ))}
          </div>
        )}

        {/* Interactive Task */}
        {step.interactiveTask && (
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold mb-3 font-display">
              ⌨️ Code Editor
              <span className="text-[10px] text-muted-foreground font-normal ml-auto">Python 3 • Interactive Runtime</span>
            </h3>
            <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3 mb-3 text-sm text-foreground/80">
              <span className="font-semibold text-yellow-600">YOUR TASK:</span> {step.interactiveTask.instruction}
            </div>
            <CodeRunner initialCode={step.interactiveTask.starterCode} height="h-[250px]" />
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentStep === 0}
            onClick={() => { setCurrentStep(currentStep - 1); setVisibleHints(new Set()); }}
          >
            ← Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            {currentStep + 1} / {filtered.length}
          </span>
          {currentStep < filtered.length - 1 ? (
            <Button size="sm" onClick={markComplete} className="gap-1.5">
              Next Step <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button size="sm" onClick={markComplete} className="gap-1.5 bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
