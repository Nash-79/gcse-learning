import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Layers,
  Search,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useExamBoard } from "@/hooks/useTopics";
import { paper1Theory } from "@/data/questionBank/paper1Theory";
import { paper2Theory } from "@/data/questionBank/paper2Theory";
import { TopicTheoryData } from "@/data/questionBank/theoryTypes";
import { getTopicLibraryResources } from "@/lib/contentLibrary";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const colorMap: Record<string, string> = {
  primary: "from-primary/15 to-primary/5 border-primary/20 hover:border-primary/40",
  secondary: "from-secondary/15 to-secondary/5 border-secondary/20 hover:border-secondary/40",
  accent: "from-accent/15 to-accent/5 border-accent/20 hover:border-accent/40",
  destructive: "from-destructive/15 to-destructive/5 border-destructive/20 hover:border-destructive/40",
};

const iconColorMap: Record<string, string> = {
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary/15 text-secondary",
  accent: "bg-accent/15 text-accent-foreground",
  destructive: "bg-destructive/15 text-destructive",
};

function getLinkedPdfCount(topic: TopicTheoryData, board: "ocr" | "aqa" | "all") {
  const resources = getTopicLibraryResources(topic.slug, board);
  return (
    resources.textbook.length +
    resources.assessmentOverview.length +
    resources.assessmentSets.length +
    resources.longAnswer.length
  );
}

function hasValidationMetadata(topic: TopicTheoryData) {
  return Boolean(topic.spec_code) &&
    Boolean(topic.spec_version) &&
    Boolean(topic.source_url) &&
    Boolean(topic.last_reviewed_at);
}

function TheoryCard({ topic }: { topic: TopicTheoryData }) {
  const linkedPdfCount = getLinkedPdfCount(topic, "all");

  return (
    <motion.div variants={item}>
      <Link to={`/topic-theory/${topic.slug}`}>
        <Card className={`rounded-2xl bg-gradient-to-br ${colorMap[topic.color] || colorMap.primary} border overflow-hidden group transition-all duration-300 cursor-pointer h-full hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5`}>
          <CardContent className="p-5 flex flex-col gap-3 h-full">
            <div className="flex items-start justify-between gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl ${iconColorMap[topic.color] || iconColorMap.primary}`}>
                {topic.icon}
              </div>
              <div className="flex gap-1.5 flex-wrap justify-end">
                <Badge variant="secondary" className="text-[10px] bg-background/60 border-none">
                  Paper {topic.paper}
                </Badge>
                <Badge variant="secondary" className="text-[10px] bg-background/60 border-none font-mono">
                  OCR {topic.ocrRef}
                </Badge>
                <Badge variant="secondary" className="text-[10px] bg-background/60 border-none font-mono">
                  AQA {topic.aqaRef.join(", ")}
                </Badge>
                {linkedPdfCount > 0 && (
                  <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-none">
                    {linkedPdfCount} linked PDF{linkedPdfCount === 1 ? "" : "s"}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-display font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                {topic.title}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                {topic.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {topic.sections.length} sections
                </span>
                {hasValidationMetadata(topic) && (
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Reviewed {topic.last_reviewed_at}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-primary font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                Study now <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function Theory() {
  const [search, setSearch] = useState("");
  const { board, setBoard } = useExamBoard();

  const allTheory = [...paper1Theory, ...paper2Theory];
  const boardFiltered =
    board === "all" ? allTheory : allTheory.filter((topic) => topic.examBoards.includes(board));

  const validatedCount = boardFiltered.filter(hasValidationMetadata).length;
  const linkedPdfCount = boardFiltered.reduce(
    (count, topic) => count + getLinkedPdfCount(topic, board === "all" ? "all" : board),
    0
  );

  const filtered = boardFiltered.filter((topic) => {
    const searchTerm = search.trim().toLowerCase();
    if (!searchTerm) return true;

    const searchableText = [
      topic.title,
      topic.description,
      topic.ocrRef,
      topic.aqaRef.join(" "),
      topic.revisionSummary?.join(" "),
      ...topic.sections.flatMap((section) => [
        section.title,
        section.content,
        section.specPoint,
        section.examTip,
        section.revisionSummary?.join(" "),
        section.keyTerms?.map((term) => `${term.term} ${term.definition}`).join(" "),
      ]),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm);
  });

  return (
    <div className="flex flex-col min-h-full pb-20">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--secondary))] to-[hsl(var(--primary))] opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-[20%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 container px-4 md:px-6 mx-auto max-w-6xl py-10 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
                  Theory Revision
                </h1>
                <p className="text-white/70 text-sm md:text-base mt-1">
                  Rich GCSE Computer Science notes, diagrams, and linked printable practice
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={board === "ocr" ? "secondary" : "outline"}
                onClick={() => setBoard("ocr")}
                className="h-8"
              >
                OCR J277
              </Button>
              <Button
                size="sm"
                variant={board === "aqa" ? "secondary" : "outline"}
                onClick={() => setBoard("aqa")}
                className="h-8"
              >
                AQA 8525
              </Button>
              <Button
                size="sm"
                variant={board === "all" ? "secondary" : "outline"}
                onClick={() => setBoard("all")}
                className="h-8"
              >
                All Topics
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 max-w-2xl">
              {[
                { value: `${boardFiltered.length}`, label: "Topics" },
                { value: `${boardFiltered.reduce((sum, topic) => sum + topic.sections.length, 0)}`, label: "Sections" },
                { value: `${validatedCount}/${boardFiltered.length}`, label: "Reviewed Topics" },
                { value: `${linkedPdfCount}`, label: "Linked PDFs" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                  className="rounded-xl bg-white/15 backdrop-blur-sm px-4 py-3 text-center border border-white/10"
                >
                  <div className="text-2xl md:text-3xl font-display font-extrabold text-white">{stat.value}</div>
                  <div className="text-white/60 text-xs font-medium mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container px-4 md:px-6 mx-auto max-w-6xl mt-8">
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics, section names, keywords..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {filtered.length > 0 && (
          <motion.div variants={container} initial="hidden" animate="show">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((topic) => (
                <TheoryCard key={topic.slug} topic={topic} />
              ))}
            </div>
          </motion.div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No topics match your search.</p>
          </div>
        )}

        <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 mt-10">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-sm">Ready to Test Your Knowledge?</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Head to the Question Bank for exam-style practice with AI-powered marking.
              </p>
            </div>
            <Link to="/question-bank">
              <Button className="rounded-full gap-1.5 shrink-0">
                Question Bank <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
