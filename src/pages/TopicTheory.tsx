import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, BookOpen, ChevronDown, ChevronRight, Code,
  Lightbulb, GraduationCap, Target, CheckCircle2,
  ArrowRight, Layers, Sparkles, Play
} from "lucide-react";
import { AiHelper } from "@/components/ai/AiHelper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { paper1Theory } from "@/data/questionBank/paper1Theory";
import { paper2Theory } from "@/data/questionBank/paper2Theory";
import { TheorySection, DiagramData } from "@/data/questionBank/theoryTypes";
import { topicMasterySets } from "@/data/questionBank/paperSets";

const allTheory = [...paper1Theory, ...paper2Theory];

/* ── Visual Components ─────────────────────────── */

function BlockDiagram({ data }: { data: DiagramData }) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/15 border-primary/30 text-primary",
    secondary: "bg-secondary/15 border-secondary/30 text-secondary",
    accent: "bg-accent/15 border-accent/30 text-accent-foreground",
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

/* ── Section Renderer ─────────────────────────── */

function SectionCard({ section, index }: { section: TheorySection; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`rounded-2xl border-border/50 overflow-hidden transition-all ${expanded ? "border-primary/20" : ""}`}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-5 flex items-center gap-3 text-left hover:bg-muted/20 transition-colors"
        >
          <span className="text-xl">{section.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-sm">{section.title}</h3>
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
                {/* Main content */}
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>

                {/* Diagram */}
                {section.diagram && <BlockDiagram data={section.diagram} />}

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

                {/* Exam tip */}
                {section.examTip && <ExamTipBox tip={section.examTip} />}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

/* ── Main Page ────────────────────────────────── */

export default function TopicTheory() {
  const { slug } = useParams<{ slug: string }>();
  const topic = useMemo(() => allTheory.find(t => t.slug === slug), [slug]);

  // Find matching practice set for this topic
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const colorMap: Record<string, string> = {
    primary: "from-[hsl(var(--primary))]",
    secondary: "from-[hsl(var(--secondary))]",
    accent: "from-[hsl(var(--accent))]",
    destructive: "from-[hsl(var(--destructive))]",
  };

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
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-[10px] bg-white/15 text-white border-none">Paper {topic.paper}</Badge>
                <Badge variant="secondary" className="text-[10px] bg-white/15 text-white border-none">OCR {topic.ocrRef}</Badge>
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

      {/* Content */}
      <div className="container px-4 md:px-6 mx-auto max-w-4xl mt-6 space-y-4">
        {/* Table of Contents */}
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-4">
            <h3 className="font-display font-bold text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Contents — {topic.sections.length} sections
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {topic.sections.map((s, i) => (
                <button
                  key={s.id}
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

        {/* Practice CTA */}
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
      </div>
    </div>
  );
}
