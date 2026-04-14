import { useState, useCallback } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { useAiSettings } from "@/lib/useAiSettings";
import { appLog } from "@/lib/appLogger";
import { Sparkles, Loader2, Zap, Flame, Target, Code2, GraduationCap, CheckCircle2, Circle, PlayCircle, Eye, EyeOff, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeRunner } from "@/components/code/CodeRunner";
import { AiExamValidator } from "@/components/challenges/AiExamValidator";
import type { CodingChallenge, ChallengeDifficulty } from "@/data/codingChallenges";
import { getChallengesForTopic } from "@/data/codingChallenges";
import { useChallengeProgress, type ChallengeStatus } from "@/hooks/useChallengeProgress";

const difficultyConfig: Record<ChallengeDifficulty, { label: string; icon: React.ElementType; color: string; bg: string; activeBg: string }> = {
  beginner: { label: "Beginner", icon: Zap, color: "text-green-400", bg: "bg-green-500/10 border-green-500/30 hover:bg-green-500/20", activeBg: "bg-green-500 text-white" },
  intermediate: { label: "Intermediate", icon: Flame, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20", activeBg: "bg-yellow-500 text-black" },
  hard: { label: "Hard", icon: Target, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30 hover:bg-red-500/20", activeBg: "bg-red-500 text-white" },
};

const statusConfig: Record<ChallengeStatus, { icon: React.ElementType; color: string; label: string }> = {
  "not-started": { icon: Circle, color: "text-muted-foreground/40", label: "Not started" },
  "in-progress": { icon: PlayCircle, color: "text-yellow-500", label: "In progress" },
  "completed": { icon: CheckCircle2, color: "text-green-500", label: "Completed" },
};

interface CodingChallengePanelProps {
  topicSlug: string;
  topicTitle: string;
}

/** Deterministic grading: compare output to expectedOutput */
function gradeOutput(actual: string, expected: string | undefined): { result: "correct" | "partial" | "incorrect"; feedback: string } {
  if (!expected) return { result: "partial", feedback: "No expected output defined for this challenge. Check your code runs without errors." };
  const clean = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();
  const a = clean(actual);
  const e = clean(expected);
  if (a === e) return { result: "correct", feedback: "Your output matches the expected output exactly. Well done!" };
  // Check partial — if expected output is contained in actual
  if (a.includes(e) || e.split("\n").every(line => a.includes(clean(line)))) {
    return { result: "partial", feedback: "Your output contains the expected result but has extra content. Check you are only printing what is asked for." };
  }
  return { result: "incorrect", feedback: `Expected output: "${expected}" but got: "${actual.trim()}". Check your code logic and try again.` };
}

export function CodingChallengePanel({ topicSlug, topicTitle }: CodingChallengePanelProps) {
  const { provider: settingsProvider } = useAiSettings();
  const [selectedDifficulty, setSelectedDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showMarkScheme, setShowMarkScheme] = useState(false);
  const [aiChallenges, setAiChallenges] = useState<CodingChallenge[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [gradeResult, setGradeResult] = useState<{ result: string; feedback: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [generatedModelAnswers, setGeneratedModelAnswers] = useState<Record<string, string>>({});
  const [generatingModelAnswerId, setGeneratingModelAnswerId] = useState<string | null>(null);
  const [editorCode, setEditorCode] = useState("");
  const { getStatus, setStatus } = useChallengeProgress();

  const staticChallenges = getChallengesForTopic(topicSlug);
  const allChallenges = [...staticChallenges, ...aiChallenges];
  const filtered = selectedDifficulty === "all" ? allChallenges : allChallenges.filter(c => c.difficulty === selectedDifficulty);

  const counts = {
    beginner: allChallenges.filter(c => c.difficulty === "beginner").length,
    intermediate: allChallenges.filter(c => c.difficulty === "intermediate").length,
    hard: allChallenges.filter(c => c.difficulty === "hard").length,
  };

  const [showGenMenu, setShowGenMenu] = useState(false);

  const generateAiChallenges = useCallback(async (difficulty: ChallengeDifficulty | "all" = "all") => {
    setIsGenerating(true);
    setShowGenMenu(false);
    const diffPrompt = difficulty === "all"
      ? 'Generate exactly 3 Python coding challenges — one beginner, one intermediate, one hard.'
      : `Generate exactly 3 Python coding challenges, ALL at the "${difficulty}" difficulty level.`;
    try {
      const response = await apiFetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "generate",
          topicTitle,
          provider: settingsProvider,
          systemPromptOverride: `You are a GCSE Computer Science exam challenge generator. ${diffPrompt} about "${topicTitle}". Return ONLY a JSON object with a "challenges" array. Each object must have: id (string), title (string), description (string, 2-3 sentences describing the task), difficulty ("beginner"|"intermediate"|"hard"), starterCode (string, Python starter code with comments), expectedOutput (string, what the output should be), hints (array of 2-3 strings), modelAnswer (string, simple GCSE-level Python solution using only basic syntax), markScheme (array of 2-3 strings describing what earns marks), examStyle (boolean, true if exam-style). IMPORTANT: Use only simple Python - no f-strings, no try/except, no classes, no comprehensions. Use print(), input(), string concatenation with +, basic if/elif/else, for loops, while loops.`,
          maxTokens: 2000,
        }),
      });
      const data = await response.json();
      if (!response.ok || data?.error) throw new Error(data?.error || "Request failed");
      const text = data?.content || "";
      const parsed = JSON.parse(text);
      const challenges: CodingChallenge[] = parsed.challenges || [];
      if (challenges.length > 0) {
        setAiChallenges(prev => [...prev, ...challenges.map((c, i) => ({ ...c, id: `ai-${Date.now()}-${i}` }))]);
      }
    } catch (err: any) {
      void appLog({
        event_type: "api_error",
        origin: "CodingChallengePanel.generateAiChallenges",
        message: err?.message || "Failed to generate AI challenges",
        details: { topicSlug, topicTitle, difficulty },
        error_stack: err?.stack,
        severity: "error",
      });
      console.error("Failed to generate challenges:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [topicTitle]);

  const handleCodeRun = (output: string) => {
    if (!selectedChallenge) return;
    // Mark as in-progress at minimum
    if (getStatus(selectedChallenge.id) === "not-started") {
      setStatus(selectedChallenge.id, "in-progress");
    }
    // Grade deterministically
    const grade = gradeOutput(output, selectedChallenge.expectedOutput);
    setGradeResult(grade);
    if (grade.result === "correct") {
      setStatus(selectedChallenge.id, "completed");
    }
  };

  const copyModelAnswer = () => {
    if (selectedChallenge?.modelAnswer) {
      navigator.clipboard.writeText(selectedChallenge.modelAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Build mark scheme from available data
  const getMarkScheme = (challenge: CodingChallenge): string[] => {
    if (challenge.markScheme && challenge.markScheme.length > 0) return challenge.markScheme;
    // Auto-generate from hints and expected output
    const scheme: string[] = [];
    if (challenge.expectedOutput) scheme.push("Program produces the correct output: " + challenge.expectedOutput);
    scheme.push("Code runs without errors");
    scheme.push("Uses appropriate Python constructs (variables, print, input)");
    if (challenge.hints.length > 0) scheme.push("Follows the approach suggested in hints");
    return scheme;
  };

  const getModelAnswer = (challenge: CodingChallenge): string | null => {
    return challenge.modelAnswer || generatedModelAnswers[challenge.id] || null;
  };

  const generateModelAnswer = useCallback(async (challenge: CodingChallenge) => {
    setGeneratingModelAnswerId(challenge.id);
    try {
      const response = await apiFetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "generate",
          topicTitle,
          provider: settingsProvider,
          systemPromptOverride:
            'You are a GCSE Computer Science model-answer generator. Return ONLY JSON with keys: "modelAnswer" (string Python solution) and "markScheme" (array of 3-5 concise points). Use simple Python only: print, input, variables, if/elif/else, for, while, basic lists/dicts, string concatenation with +. Avoid classes, decorators, generators.',
          userPromptOverride: `Write a model answer for this challenge:\nTitle: ${challenge.title}\nDescription: ${challenge.description}\nStarter code:\n${challenge.starterCode}\nHints: ${challenge.hints.join(" | ")}`,
          maxTokens: 2200,
        }),
      });
      const data = await response.json();
      if (!response.ok || data?.error) throw new Error(data?.error || "Request failed");
      const parsed = JSON.parse(data?.content || "{}");
      if (parsed?.modelAnswer) {
        setGeneratedModelAnswers((prev) => ({
          ...prev,
          [challenge.id]: String(parsed.modelAnswer),
        }));
      }
    } catch (error: any) {
      void appLog({
        event_type: "api_error",
        origin: "CodingChallengePanel.generateModelAnswer",
        message: error?.message || "Failed to generate AI model answer",
        details: { topicSlug, topicTitle, challengeId: challenge.id },
        error_stack: error?.stack,
        severity: "error",
      });
      console.error("Failed to generate model answer:", error);
    } finally {
      setGeneratingModelAnswerId(null);
    }
  }, [topicTitle]);

  if (selectedChallenge) {
    const status = getStatus(selectedChallenge.id);
    const StatusIcon = statusConfig[status].icon;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => { setSelectedChallenge(null); setShowHints(false); setShowMarkScheme(false); setGradeResult(null); }} className="text-sm text-primary hover:underline">
            ← Back to challenges
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${statusConfig[status].color} ${status === "completed" ? "bg-green-500/10 border-green-500/30" : status === "in-progress" ? "bg-yellow-500/10 border-yellow-500/30" : "bg-muted/50 border-border"}`}>
              <StatusIcon className="w-3 h-3" /> {statusConfig[status].label}
            </span>
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

        <CodeRunner
          initialCode={selectedChallenge.starterCode}
          height="h-[350px]"
          onOutput={handleCodeRun}
          onCodeChange={setEditorCode}
        />

        {/* Grading Result */}
        {gradeResult && (
          <div className={`text-sm rounded-xl px-4 py-3 border ${
            gradeResult.result === "correct" ? "bg-green-500/10 border-green-500/30 text-green-400" :
            gradeResult.result === "partial" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" :
            "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            <div className="flex items-center gap-2 font-semibold mb-1">
              {gradeResult.result === "correct" ? <CheckCircle2 className="w-4 h-4" /> :
               gradeResult.result === "partial" ? <PlayCircle className="w-4 h-4" /> :
               <Circle className="w-4 h-4" />}
              {gradeResult.result === "correct" ? "Correct!" :
               gradeResult.result === "partial" ? "Partially Correct" : "Incorrect"}
            </div>
            <p>{gradeResult.feedback}</p>
          </div>
        )}

        {/* Hints */}
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

        {/* Mark Scheme */}
        <div>
          <button
            onClick={() => setShowMarkScheme(!showMarkScheme)}
            className="text-sm text-secondary hover:text-secondary/80 transition-colors flex items-center gap-1.5"
          >
            {showMarkScheme ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showMarkScheme ? "Hide Mark Scheme" : "Show Mark Scheme"}
          </button>
          {showMarkScheme && (
            <div className="mt-3 space-y-3">
              {/* Mark checklist */}
              <div className="bg-secondary/5 border border-secondary/20 rounded-xl px-4 py-3">
                <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">What earns full marks</h4>
                <ul className="space-y-1.5">
                  {getMarkScheme(selectedChallenge).map((point, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-secondary shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Model answer */}
              {getModelAnswer(selectedChallenge) && (
                <div className="bg-muted/30 border border-border/50 rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Model Answer</h4>
                    <button onClick={copyModelAnswer} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <pre className="text-sm font-mono text-blue-300 bg-[#1e1e1e] rounded-lg px-3 py-2 overflow-x-auto whitespace-pre-wrap">{getModelAnswer(selectedChallenge)}</pre>
                </div>
              )}
              {!getModelAnswer(selectedChallenge) && (
                <div className="bg-muted/20 border border-border/40 rounded-xl px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-2">No static model answer is available for this challenge yet.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateModelAnswer(selectedChallenge)}
                    disabled={generatingModelAnswerId === selectedChallenge.id}
                    className="gap-2"
                  >
                    {generatingModelAnswerId === selectedChallenge.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    Generate AI Model Answer
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <AiExamValidator
          topicTitle={topicTitle}
          topicSlug={topicSlug}
          prefilledTaskDescription={selectedChallenge.description}
          prefilledCode={editorCode}
        />
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
              <button onClick={() => generateAiChallenges("all")} className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-muted transition-colors font-medium">Mixed (all levels)</button>
              <button onClick={() => generateAiChallenges("beginner")} className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-muted transition-colors font-medium text-green-500">Beginner x 3</button>
              <button onClick={() => generateAiChallenges("intermediate")} className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-muted transition-colors font-medium text-yellow-500">Intermediate x 3</button>
              <button onClick={() => generateAiChallenges("hard")} className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-muted transition-colors font-medium text-red-500">Hard x 3</button>
            </div>
          )}
        </div>
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
          <p className="text-xs mt-1">Click "AI Challenges" to generate some!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((challenge) => {
            const cfg = difficultyConfig[challenge.difficulty];
            const Icon = cfg.icon;
            const status = getStatus(challenge.id);
            const SIcon = statusConfig[status].icon;
            return (
              <Card
                key={challenge.id}
                className="rounded-xl border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
                onClick={() => {
                  setSelectedChallenge(challenge);
                  setEditorCode(challenge.starterCode);
                  setGradeResult(null);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <SIcon className={`w-4 h-4 shrink-0 ${statusConfig[status].color}`} />
                      <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">{challenge.title}</h4>
                    </div>
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
