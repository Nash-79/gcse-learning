import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, BookOpen, ChevronDown, ChevronRight, Code,
  Lightbulb, GraduationCap, Target, CheckCircle2,
  ArrowRight, Layers, Sparkles, Play, AlertTriangle,
  RotateCcw, ListChecks, Brain, FileText, ClipboardList,
  Image as ImageIcon, Zap
} from "lucide-react";
import { AiHelper } from "@/components/ai/AiHelper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { paper1Theory } from "@/data/questionBank/paper1Theory";
import { paper2Theory } from "@/data/questionBank/paper2Theory";
import {
  TheorySection, DiagramData, DiagramImage,
  MermaidDiagram, WorkedExample, CommonMistake, Flashcard
} from "@/data/questionBank/theoryTypes";
import { topicMasterySets } from "@/data/questionBank/paperSets";
import { useExamBoard } from "@/hooks/useTopics";

const allTheory = [...paper1Theory, ...paper2Theory];

type Tab = "notes" | "flashcards" | "practice";

/* ── Block/Grid Diagram ─────────────────────────────────────────────────── */

function BlockDiagram({ data }: { data: DiagramData }) {
  const colorMap: Record<string, string> = {
    primary:   "bg-primary/15 border-primary/30 text-primary",
    secondary: "bg-secondary/15 border-secondary/30 text-secondary",
    accent:    "bg-accent/15 border-accent/30 text-accent-foreground",
  };

  if (data.type === "cycle") {
    return (
      <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
        <h4 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" /> {data.title}
        </h4>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {data.blocks.map((block, i) => (
            <div key={block.label} className="flex items-center gap-2">
              <div className={`px-4 py-3 rounded-xl border text-center min-w-[140px] ${colorMap[block.color || "primary"]}`}>
                <div className="font-display font-bold text-sm">{block.label}</div>
                {block.detail && <div className="text-[10px] mt-1 opacity-80">{block.detail}</div>}
              </div>
              {i < data.blocks.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              {i === data.blocks.length - 1 && data.connections && (
                <div className="text-muted-foreground text-[10px] font-mono">↻</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
      <h4 className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5" /> {data.title}
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {data.blocks.map(block => (
          <div key={block.label} className={`px-3 py-3 rounded-xl border text-center ${colorMap[block.color || "primary"]}`}>
            <div className="font-display font-bold text-xs">{block.label}</div>
            {block.detail && <div className="text-[10px] mt-1 opacity-80">{block.detail}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Diagram Image ──────────────────────────────────────────────────────── */

function ImageSection({ images }: { images: DiagramImage[] }) {
  const [lightbox, setLightbox] = useState<DiagramImage | null>(null);

  return (
    <>
      <div className={`grid gap-3 ${images.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        {images.map((img, i) => (
          <figure
            key={i}
            className="rounded-xl border border-border/50 overflow-hidden bg-muted/20 cursor-zoom-in group"
            onClick={() => setLightbox(img)}
          >
            <div className="relative">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-contain max-h-64 transition-transform group-hover:scale-[1.02]"
                onError={e => {
                  // Fallback: show placeholder when image not yet generated
                  const target = e.currentTarget;
                  target.style.display = "none";
                  target.nextElementSibling?.classList.remove("hidden");
                }}
              />
              {/* Placeholder shown when image missing */}
              <div className="hidden flex-col items-center justify-center h-32 gap-2 text-muted-foreground p-4">
                <ImageIcon className="w-8 h-8 opacity-30" />
                <span className="text-[10px] text-center opacity-50">{img.alt}</span>
                {img.aiPrompt && (
                  <span className="text-[9px] text-center opacity-40 italic">Run: npm run diagrams</span>
                )}
              </div>
            </div>
            {img.caption && (
              <figcaption className="px-3 py-2 text-[10px] text-muted-foreground border-t border-border/50 bg-muted/10">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-3xl w-full bg-background rounded-2xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <img src={lightbox.src} alt={lightbox.alt} className="w-full object-contain max-h-[70vh]" />
              {lightbox.caption && (
                <p className="px-4 py-3 text-xs text-muted-foreground border-t border-border/50">{lightbox.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Mermaid Diagram ────────────────────────────────────────────────────── */

function MermaidBlock({ data }: { data: MermaidDiagram }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("mermaid").then(m => {
      if (cancelled || !ref.current) return;
      m.default.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });
      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      m.default.render(id, data.code)
        .then(({ svg }) => {
          if (!cancelled && ref.current) {
            ref.current.innerHTML = svg;
            setRendered(true);
          }
        })
        .catch(() => { if (!cancelled) setError(true); });
    }).catch(() => setError(true));
    return () => { cancelled = true; };
  }, [data.code]);

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-muted/10">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/30 border-b border-border/50">
        <Layers className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] font-bold text-muted-foreground">{data.title}</span>
      </div>
      {error ? (
        <pre className="p-4 text-[10px] font-mono text-muted-foreground overflow-x-auto">{data.code}</pre>
      ) : (
        <div ref={ref} className="p-4 flex justify-center [&>svg]:max-w-full" />
      )}
    </div>
  );
}

/* ── Revision Summary ───────────────────────────────────────────────────── */

function RevisionSummary({ bullets }: { bullets: string[] }) {
  return (
    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
      <h4 className="text-[10px] font-bold text-emerald-600 uppercase mb-2.5 flex items-center gap-1.5">
        <ListChecks className="w-3.5 h-3.5" /> Quick Revision Summary
      </h4>
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Spec Point ─────────────────────────────────────────────────────────── */

function SpecPointBox({ text }: { text: string }) {
  return (
    <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-2">
      <FileText className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
      <div>
        <span className="text-[10px] font-bold text-blue-500 uppercase">Spec Point</span>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed italic">{text}</p>
      </div>
    </div>
  );
}

/* ── Common Mistakes ────────────────────────────────────────────────────── */

function CommonMistakesBox({ mistakes }: { mistakes: CommonMistake[] }) {
  return (
    <div className="rounded-xl border border-rose-500/20 overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-500/5 border-b border-rose-500/15">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
        <span className="text-[10px] font-bold text-rose-500 uppercase">Common Mistakes</span>
      </div>
      <div className="divide-y divide-border/50">
        {mistakes.map((m, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            <div className="p-3 bg-rose-500/5 flex items-start gap-2">
              <span className="text-rose-500 text-xs mt-0.5 shrink-0">✗</span>
              <p className="text-[11px] text-muted-foreground">{m.mistake}</p>
            </div>
            <div className="p-3 bg-emerald-500/5 border-t sm:border-t-0 sm:border-l border-border/50 flex items-start gap-2">
              <span className="text-emerald-500 text-xs mt-0.5 shrink-0">✓</span>
              <p className="text-[11px] text-muted-foreground">{m.correction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Worked Example ─────────────────────────────────────────────────────── */

function WorkedExampleCard({ example }: { example: WorkedExample }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="rounded-xl border border-violet-500/20 overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-violet-500/5 border-b border-violet-500/15">
        <Brain className="w-3.5 h-3.5 text-violet-500" />
        <span className="text-[10px] font-bold text-violet-500 uppercase">Worked Example</span>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-xs font-medium text-foreground">{example.question}</p>
        <div className="space-y-2">
          {example.steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-violet-500/15 text-violet-500 text-[10px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="text-[11px] font-medium text-foreground">{s.step}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.explanation}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowAnswer(!showAnswer)}
          className="flex items-center gap-1.5 text-[10px] font-bold text-violet-500 hover:text-violet-400 transition-colors mt-1"
        >
          <Zap className="w-3 h-3" />
          {showAnswer ? "Hide answer" : "Reveal answer"}
        </button>
        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-lg bg-violet-500/5 border border-violet-500/20 p-3"
            >
              <p className="text-[11px] text-muted-foreground">{example.answer}</p>
              {example.markScheme && (
                <ul className="mt-2 space-y-1">
                  {example.markScheme.map((pt, j) => (
                    <li key={j} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Flashcard Deck ─────────────────────────────────────────────────────── */

function FlashcardDeck({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];

  const next = () => { setFlipped(false); setTimeout(() => setIndex(i => (i + 1) % cards.length), 150); };
  const prev = () => { setFlipped(false); setTimeout(() => setIndex(i => (i - 1 + cards.length) % cards.length), 150); };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5">
          <RotateCcw className="w-3 h-3" /> Flashcards — {index + 1} / {cards.length}
        </span>
        <span className="text-[10px] text-muted-foreground">Tap card to flip</span>
      </div>
      <div
        className="flashcard-scene relative h-32 cursor-pointer select-none"
        onClick={() => setFlipped(f => !f)}
      >
        <motion.div
          className="flashcard-inner absolute inset-0"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Front */}
          <div className="flashcard-face absolute inset-0 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-center p-4">
            <p className="text-sm font-display font-bold text-center text-foreground">{card.front}</p>
          </div>
          {/* Back */}
          <div className="flashcard-face flashcard-face--back absolute inset-0 rounded-xl border border-secondary/20 bg-secondary/5 flex items-center justify-center p-4">
            <p className="text-xs text-center text-muted-foreground leading-relaxed">{card.back}</p>
          </div>
        </motion.div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={prev}>← Prev</Button>
        <div className="flex-1 flex justify-center gap-1">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to card ${i + 1}`}
              onClick={() => { setFlipped(false); setIndex(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? "bg-primary" : "bg-muted-foreground/30"}`}
            />
          ))}
        </div>
        <Button type="button" size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={next}>Next →</Button>
      </div>
    </div>
  );
}

/* ── Comparison / Table / Code (unchanged) ──────────────────────────────── */

function ComparisonCard({ data }: { data: NonNullable<TheorySection["comparisonData"]> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <h4 className="font-display font-bold text-xs text-primary mb-2">{data.itemA.title}</h4>
        <ul className="space-y-1.5">
          {data.itemA.points.map((p, i) => (
            <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
              <span className="text-primary mt-0.5 shrink-0">•</span>{p}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
        <h4 className="font-display font-bold text-xs text-secondary mb-2">{data.itemB.title}</h4>
        <ul className="space-y-1.5">
          {data.itemB.points.map((p, i) => (
            <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
              <span className="text-secondary mt-0.5 shrink-0">•</span>{p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DataTable({ data }: { data: NonNullable<TheorySection["tableData"]> }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/50">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="bg-muted/50">
            {data.headers.map(h => (
              <th key={h} className="px-3 py-2 text-left font-display font-bold text-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "" : "bg-muted/20"}>
              {row.map((cell, j) => (
                <td key={j} className={`px-3 py-2 text-muted-foreground ${j === 0 ? "font-medium text-foreground" : ""}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ data }: { data: NonNullable<TheorySection["codeExample"]> }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border/50">
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border/50">
        <Code className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{data.language}</span>
      </div>
      <pre className="p-4 bg-muted/20 overflow-x-auto">
        <code className="text-[11px] font-mono text-foreground leading-relaxed">{data.code}</code>
      </pre>
      {data.explanation && (
        <div className="px-4 py-3 bg-primary/5 border-t border-primary/10">
          <p className="text-[11px] text-muted-foreground flex items-start gap-1.5">
            <Lightbulb className="w-3 h-3 text-primary mt-0.5 shrink-0" />
            {data.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

function KeyTerms({ terms }: { terms: NonNullable<TheorySection["keyTerms"]> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {terms.map(t => (
        <div key={t.term} className="p-3 rounded-xl bg-muted/30 border border-border/50">
          <span className="font-display font-bold text-xs text-primary">{t.term}</span>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{t.definition}</p>
        </div>
      ))}
    </div>
  );
}

function ExamTipBox({ tip }: { tip: string }) {
  return (
    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-2">
      <GraduationCap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
      <div>
        <span className="text-[10px] font-bold text-amber-500 uppercase">Exam Tip</span>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{tip}</p>
      </div>
    </div>
  );
}

/* ── Section Renderer ───────────────────────────────────────────────────── */

function SectionCard({ section, index }: { section: TheorySection; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const hasFlashcards = section.flashcards && section.flashcards.length > 0;
  const totalExtras = [
    section.images,
    section.workedExample,
    section.commonMistakes,
    section.mermaid,
  ].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`rounded-2xl border-border/50 overflow-hidden transition-all ${expanded ? "border-primary/20" : ""}`}>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full p-5 flex items-center gap-3 text-left hover:bg-muted/20 transition-colors"
        >
          <span className="text-xl">{section.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-sm">{section.title}</h3>
            {!expanded && totalExtras > 0 && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {totalExtras} diagram{totalExtras > 1 ? "s" : ""}/example{totalExtras > 1 ? "s" : ""}
                {hasFlashcards ? " · flashcards" : ""}
              </p>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="px-5 pb-5 pt-0 space-y-4">
                {/* Spec point */}
                {section.specPoint && <SpecPointBox text={section.specPoint} />}

                {/* Revision summary */}
                {section.revisionSummary && section.revisionSummary.length > 0 && (
                  <RevisionSummary bullets={section.revisionSummary} />
                )}

                {/* Main content */}
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>

                {/* Diagram images */}
                {section.images && section.images.length > 0 && (
                  <ImageSection images={section.images} />
                )}

                {/* Block/grid diagram */}
                {section.diagram && <BlockDiagram data={section.diagram} />}

                {/* Mermaid diagram */}
                {section.mermaid && <MermaidBlock data={section.mermaid} />}

                {/* Comparison */}
                {section.comparisonData && <ComparisonCard data={section.comparisonData} />}

                {/* Table */}
                {section.tableData && <DataTable data={section.tableData} />}

                {/* Code example */}
                {section.codeExample && <CodeBlock data={section.codeExample} />}

                {/* Key terms */}
                {section.keyTerms && section.keyTerms.length > 0 && (
                  <div>
                    <h4 className="text-xs font-display font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> Key Terms
                    </h4>
                    <KeyTerms terms={section.keyTerms} />
                  </div>
                )}

                {/* Common mistakes */}
                {section.commonMistakes && section.commonMistakes.length > 0 && (
                  <CommonMistakesBox mistakes={section.commonMistakes} />
                )}

                {/* Worked example */}
                {section.workedExample && <WorkedExampleCard example={section.workedExample} />}

                {/* Exam tip */}
                {section.examTip && <ExamTipBox tip={section.examTip} />}

                {/* Flashcards (section-scoped) */}
                {section.flashcards && section.flashcards.length > 0 && (
                  <div className="pt-2 border-t border-border/50">
                    <FlashcardDeck cards={section.flashcards} />
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

/* ── Flashcard Tab ──────────────────────────────────────────────────────── */

function FlashcardTab({ sections }: { sections: TheorySection[] }) {
  const allCards: Flashcard[] = useMemo(() => {
    const cards: Flashcard[] = [];
    sections.forEach(s => {
      // Key terms become flashcards
      s.keyTerms?.forEach(t => cards.push({ front: t.term, back: t.definition }));
      // Explicit flashcards
      s.flashcards?.forEach(f => cards.push(f));
    });
    return cards;
  }, [sections]);

  if (allCards.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No flashcards available for this topic yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">{allCards.length} cards across all sections</p>
      <FlashcardDeck cards={allCards} />
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */

export default function TopicTheory() {
  const { slug } = useParams<{ slug: string }>();
  const topic = useMemo(() => allTheory.find(t => t.slug === slug), [slug]);
  const { board } = useExamBoard();
  const [activeTab, setActiveTab] = useState<Tab>("notes");

  const practiceSet = useMemo(() => {
    if (!topic) return null;
    return topicMasterySets.find(s => s.paper === topic.paper && s.topic === topic.title);
  }, [topic]);

  const [checkedSections, setCheckedSections] = useState<Set<string>>(new Set());

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <BookOpen className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-display font-bold">Topic Not Found</h2>
        <Link to="/theory">
          <Button variant="outline" className="rounded-full gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Theory
          </Button>
        </Link>
      </div>
    );
  }

  const completedCount = checkedSections.size;
  const totalSections = topic.sections.length;
  const progressPct = (completedCount / totalSections) * 100;

  const toggleSection = (id: string) => {
    setCheckedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const colorMap: Record<string, string> = {
    primary:     "from-[hsl(var(--primary))]",
    secondary:   "from-[hsl(var(--secondary))]",
    accent:      "from-[hsl(var(--accent))]",
    destructive: "from-[hsl(var(--destructive))]",
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "notes",      label: "Revision Notes", icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "flashcards", label: "Flashcards",      icon: <RotateCcw className="w-3.5 h-3.5" /> },
    { id: "practice",   label: "Practice",        icon: <ClipboardList className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[topic.color] || colorMap.primary} to-[hsl(var(--primary))] opacity-90`} />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 container px-4 md:px-6 mx-auto max-w-4xl py-8">
          <Link to="/theory" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-xs mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Theory Revision
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{topic.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="secondary" className="text-[10px] bg-white/15 text-white border-none">Paper {topic.paper}</Badge>
                {(board === "ocr" || board === "all") && (
                  <Badge variant="secondary" className="text-[10px] bg-white/15 text-white border-none">OCR {topic.ocrRef}</Badge>
                )}
                {(board === "aqa" || board === "all") && (
                  <Badge variant="secondary" className="text-[10px] bg-white/15 text-white border-none">AQA {topic.aqaRef.join(", ")}</Badge>
                )}
                {topic.spec_code && (
                  <Badge variant="secondary" className="text-[10px] bg-white/10 text-white/70 border-none">{topic.spec_code}</Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white">{topic.title}</h1>
              <p className="text-white/70 text-sm mt-1">{topic.description}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-2 rounded-full bg-white/15 overflow-hidden">
              <motion.div
                className="h-full bg-white/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-white/80 text-xs font-bold">{completedCount}/{totalSections} sections</span>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border/50">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl">
          <div className="flex gap-1 py-2">
            {tabs.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 md:px-6 mx-auto max-w-4xl mt-6 space-y-4">
        {/* ── NOTES TAB ── */}
        {activeTab === "notes" && (
          <>
            {/* Topic-level revision summary */}
            {topic.revisionSummary && topic.revisionSummary.length > 0 && (
              <Card className="rounded-2xl border-emerald-500/20">
                <CardContent className="p-4">
                  <RevisionSummary bullets={topic.revisionSummary} />
                </CardContent>
              </Card>
            )}

            {/* Table of contents */}
            <Card className="rounded-2xl border-border/50">
              <CardContent className="p-4">
                <h3 className="font-display font-bold text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Contents — {topic.sections.length} sections
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {topic.sections.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSection(s.id)}
                      className={`text-left px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-all ${
                        checkedSections.has(s.id) ? "bg-primary/10 text-primary" : "hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${checkedSections.has(s.id) ? "text-primary" : "text-muted-foreground/30"}`} />
                      <span className="text-muted-foreground/60 font-mono w-4">{i + 1}.</span>
                      <span className={checkedSections.has(s.id) ? "line-through opacity-70" : ""}>{s.title}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sections */}
            {topic.sections.map((section, i) => (
              <SectionCard key={section.id} section={section} index={i} />
            ))}

            {/* AI Chat Assistant */}
            <div className="mt-6">
              <AiHelper topicSlug={topic.slug} topicTitle={topic.title} />
            </div>
          </>
        )}

        {/* ── FLASHCARDS TAB ── */}
        {activeTab === "flashcards" && (
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-5">
              <FlashcardTab sections={topic.sections} />
            </CardContent>
          </Card>
        )}

        {/* ── PRACTICE TAB ── */}
        {activeTab === "practice" && (
          <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-sm">Ready to Practice?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Test your knowledge of {topic.title} with exam-style questions, mark schemes, and model answers.
                </p>
              </div>
              {practiceSet && (
                <Link to={`/exam-session/${practiceSet.id}`}>
                  <Button className="rounded-full gap-1.5 shrink-0">
                    <Play className="w-4 h-4" /> Start Practice <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
