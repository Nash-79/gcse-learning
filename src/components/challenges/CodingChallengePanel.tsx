import { useState, useCallback } from "react";
import { Sparkles, Loader2, Zap, Flame, Target, Code2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeRunner } from "@/components/code/CodeRunner";
import { supabase } from "@/integrations/supabase/client";
import type { CodingChallenge, ChallengeDifficulty } from "@/data/codingChallenges";
import type { CodingChallenge, ChallengeDifficulty } from "@/data/codingChallenges";
import { getChallengesForTopic } from "@/data/codingChallenges";

const difficultyConfig: Record<ChallengeDifficulty, { label: string; icon: React.ElementType; color: string; bg: string; activeBg: string }> = {
  beginner: { label: "Beginner", icon: Zap, color: "text-green-400", bg: "bg-green-500/10 border-green-500/30 hover:bg-green-500/20", activeBg: "bg-green-500 text-white" },
  intermediate: { label: "Intermediate", icon: Flame, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20", activeBg: "bg-yellow-500 text-black" },
  hard: { label: "Hard", icon: Target, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30 hover:bg-red-500/20", activeBg: "bg-red-500 text-white" },
};

interface CodingChallengePanelProps {
  topicSlug: string;
  topicTitle: string;
}

export function CodingChallengePanel({ topicSlug, topicTitle }: CodingChallengePanelProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [aiChallenges, setAiChallenges] = useState<CodingChallenge[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const staticChallenges = getChallengesForTopic(topicSlug);
  const allChallenges = [...staticChallenges, ...aiChallenges];
  const filtered = selectedDifficulty === "all" ? allChallenges : allChallenges.filter(c => c.difficulty === selectedDifficulty);

  const counts = {
    beginner: allChallenges.filter(c => c.difficulty === "beginner").length,
    intermediate: allChallenges.filter(c => c.difficulty === "intermediate").length,
    hard: allChallenges.filter(c => c.difficulty === "hard").length,
  };

  const [genDifficulty, setGenDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const [showGenMenu, setShowGenMenu] = useState(false);

  const generateAiChallenges = useCallback(async (difficulty: ChallengeDifficulty | "all" = "all") => {
    setIsGenerating(true);
    setShowGenMenu(false);
    const diffPrompt = difficulty === "all"
      ? 'Generate exactly 3 Python coding challenges — one beginner, one intermediate, one hard.'
      : `Generate exactly 3 Python coding challenges, ALL at the "${difficulty}" difficulty level.`;
    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          mode: "generate",
          topicTitle,
          systemPromptOverride: `You are a GCSE Computer Science exam challenge generator. ${diffPrompt} about "${topicTitle}". Return ONLY a JSON object with a "challenges" array. Each object must have: id (string), title (string), description (string, 2-3 sentences describing the task), difficulty ("beginner"|"intermediate"|"hard"), starterCode (string, Python starter code with comments), hints (array of 2-3 strings), examStyle (boolean, true if exam-style). Make challenges practical and aligned with OCR J277 exam style.`,
          maxTokens: 2000,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const text = data?.content || "";
      const parsed = JSON.parse(text);
      const challenges: CodingChallenge[] = parsed.challenges || [];
      if (challenges.length > 0) {
        setAiChallenges(prev => [...prev, ...challenges.map((c, i) => ({ ...c, id: `ai-${Date.now()}-${i}` }))]);
      }
    } catch (err) {
      console.error("Failed to generate challenges:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [topicTitle]);

  if (selectedChallenge) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => { setSelectedChallenge(null); setShowHints(false); }} className="text-sm text-primary hover:underline">
            ← Back to challenges
          </button>
          <div className="flex items-center gap-2">
            {selectedChallenge.examStyle && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> OCR Exam Style
              </span>
            )}
            {(() => {
              const cfg = difficultyConfig[selectedChallenge.difficulty];
              const Icon = cfg.icon;
              return (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${cfg.bg} ${cfg.color}`}>
                  <Icon className="w-3 h-3" /> {cfg.label}
                </span>
              );
            })()}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-display font-bold mb-1">{selectedChallenge.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{selectedChallenge.description}</p>
        </div>

        {selectedChallenge.expectedOutput && (
          <div className="text-sm bg-muted/50 border border-border/50 rounded-xl px-4 py-3">
            <span className="font-semibold text-foreground">Expected output: </span>
            <code className="text-primary">{selectedChallenge.expectedOutput}</code>
          </div>
        )}

        <CodeRunner initialCode={selectedChallenge.starterCode} height="h-[350px]" />

        {selectedChallenge.hints.length > 0 && (
          <div>
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors flex items-center gap-1.5"
            >
              💡 {showHints ? "Hide hints" : `Show hints (${selectedChallenge.hints.length})`}
            </button>
            {showHints && (
              <ul className="mt-2 space-y-1.5">
                {selectedChallenge.hints.map((hint, i) => (
                  <li key={i} className="text-sm text-muted-foreground bg-yellow-500/5 border border-yellow-500/10 rounded-lg px-3 py-2">
                    {i + 1}. {hint}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDifficulty("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedDifficulty === "all" ? "bg-foreground text-background" : "bg-muted/50 border-border hover:bg-muted"}`}
          >
            All ({allChallenges.length})
          </button>
          {(["beginner", "intermediate", "hard"] as const).map(d => {
            const config = difficultyConfig[d];
            const count = counts[d];
            if (count === 0 && d !== "beginner") return null;
            const Icon = config.icon;
            return (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${selectedDifficulty === d ? config.activeBg : config.bg}`}
              >
                <Icon className="w-3 h-3" /> {config.label} ({count})
              </button>
            );
          })}
        </div>

        {hasAi && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGenMenu(!showGenMenu)}
              disabled={isGenerating}
              className="gap-2 rounded-full border-secondary/30 text-secondary hover:bg-secondary/10 shrink-0"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              AI Challenges
            </Button>
            {showGenMenu && !isGenerating && (
              <div className="absolute right-0 top-full mt-1 z-10 bg-card border border-border rounded-xl shadow-lg p-1.5 min-w-[160px] space-y-0.5">
                <button onClick={() => generateAiChallenges("all")} className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-muted transition-colors font-medium">🎯 Mixed (all levels)</button>
                <button onClick={() => generateAiChallenges("beginner")} className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-muted transition-colors font-medium text-green-500">⚡ Beginner × 3</button>
                <button onClick={() => generateAiChallenges("intermediate")} className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-muted transition-colors font-medium text-yellow-500">🔥 Intermediate × 3</button>
                <button onClick={() => generateAiChallenges("hard")} className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-muted transition-colors font-medium text-red-500">🎯 Hard × 3</button>
              </div>
            )}
          </div>
        )}
      </div>

      {aiChallenges.length > 0 && (
        <div className="flex items-center gap-2 text-sm bg-secondary/10 text-secondary border border-secondary/20 rounded-xl px-4 py-2.5">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{aiChallenges.length} AI-generated challenges added</span>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Code2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No challenges at this difficulty level yet.</p>
          {hasAi && <p className="text-xs mt-1">Click "AI Challenges" to generate some!</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((challenge) => {
            const cfg = difficultyConfig[challenge.difficulty];
            const Icon = cfg.icon;
            return (
              <Card
                key={challenge.id}
                className="rounded-xl border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
                onClick={() => setSelectedChallenge(challenge)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{challenge.title}</h4>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {challenge.examStyle && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                          EXAM
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${cfg.bg} ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{challenge.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
