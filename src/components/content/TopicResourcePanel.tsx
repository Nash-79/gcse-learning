import { BookOpen, Download, ExternalLink, FileCheck, Files, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GroupedTopicLibraryResources, TopicLibraryResource } from "@/lib/contentLibrary";

interface TopicResourcePanelProps {
  title?: string;
  description?: string;
  groups: GroupedTopicLibraryResources;
}

function ResourceRow({ resource }: { resource: TopicLibraryResource }) {
  const label =
    resource.kind === "textbook" ? "Textbook" :
    resource.kind === "assessment-overview" ? "Assessment" :
    resource.kind === "assessment-set" ? `Set ${resource.setNumber}` :
    "Long Answer";

  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">{resource.title}</span>
          <Badge variant="secondary" className="text-[10px] border-none bg-primary/10 text-primary">
            {resource.board.toUpperCase()}
          </Badge>
          <Badge variant="secondary" className="text-[10px] border-none">
            {label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Printable PDF resource linked to this topic.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a href={resource.openUrl} target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline" className="rounded-full h-8 gap-1.5">
            <ExternalLink className="w-3.5 h-3.5" /> Open
          </Button>
        </a>
        <a href={resource.downloadUrl}>
          <Button size="sm" className="rounded-full h-8 gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download
          </Button>
        </a>
      </div>
    </div>
  );
}

function ResourceGroup({
  title,
  icon,
  resources,
}: {
  title: string;
  icon: React.ReactNode;
  resources: TopicLibraryResource[];
}) {
  if (resources.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-display font-bold">{title}</h3>
        <Badge variant="secondary" className="text-[10px] border-none bg-muted">
          {resources.length}
        </Badge>
      </div>
      <div className="space-y-2">
        {resources.map((resource) => (
          <ResourceRow key={`${resource.relativePath}-${resource.slug}`} resource={resource} />
        ))}
      </div>
    </div>
  );
}

export function TopicResourcePanel({
  title = "Topic Resources",
  description = "Printable textbook pages, topic assessments, and set PDFs linked to this topic.",
  groups,
}: TopicResourcePanelProps) {
  const hasAny =
    groups.textbook.length > 0 ||
    groups.assessmentOverview.length > 0 ||
    groups.assessmentSets.length > 0 ||
    groups.longAnswer.length > 0;

  if (!hasAny) return null;

  return (
    <Card className="rounded-2xl border-border/50">
      <CardContent className="p-5 space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Files className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>

        <ResourceGroup
          title="Quick Revision PDFs"
          icon={<BookOpen className="w-4 h-4 text-primary" />}
          resources={groups.textbook}
        />
        <ResourceGroup
          title="Topic Assessment Overview"
          icon={<FileCheck className="w-4 h-4 text-secondary" />}
          resources={groups.assessmentOverview}
        />
        <ResourceGroup
          title="Printable Topic Sets"
          icon={<Printer className="w-4 h-4 text-amber-500" />}
          resources={groups.assessmentSets}
        />
        <ResourceGroup
          title="Extended Long Answers"
          icon={<Files className="w-4 h-4 text-emerald-500" />}
          resources={groups.longAnswer}
        />
      </CardContent>
    </Card>
  );
}
