import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useListTopics } from "@/hooks/useTopics";

const staticRoutes: Record<string, string> = {
  "/playground": "Python Sandbox",
  "/theory": "Theory Revision",
  "/question-bank": "Question Bank",
  "/ai-tutor": "AI Tutor",
  "/exam-history": "Exam History",
  "/spaced-repetition": "Spaced Repetition",
  "/settings": "Settings",
  "/auth": "Sign In",
};

interface Crumb {
  label: string;
  href?: string;
  icon?: boolean;
}

export function PageBreadcrumb() {
  const location = useLocation();
  const { data: topics } = useListTopics();

  const crumbs = useMemo<Crumb[]>(() => {
    const path = location.pathname;

    if (path === "/") return [];

    if (path.startsWith("/topic/")) {
      const slug = path.split("/topic/")[1];
      const topic = topics?.find((t) => t.slug === slug);
      return [
        { label: "Home", href: "/", icon: true },
        ...(topic
          ? [{ label: topic.category, href: "/" }, { label: topic.title }]
          : [{ label: "Topic" }]),
      ];
    }

    if (path.startsWith("/topic-theory/")) {
      const slug = path.replace("/topic-theory/", "");
      const topic = topics?.find((t) => t.slug === slug);
      return [
        { label: "Home", href: "/", icon: true },
        { label: "Theory Revision", href: "/theory" },
        ...(topic ? [{ label: topic.title }] : []),
      ];
    }

    if (path.startsWith("/exam-session/")) {
      return [
        { label: "Home", href: "/", icon: true },
        { label: "Question Bank", href: "/question-bank" },
        { label: "Exam Session" },
      ];
    }

    if (staticRoutes[path]) {
      return [
        { label: "Home", href: "/", icon: true },
        { label: staticRoutes[path] },
      ];
    }

    return [];
  }, [location.pathname, topics]);

  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-0.5 text-xs text-muted-foreground min-w-0 overflow-hidden"
    >
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-0.5 min-w-0">
          {i > 0 && (
            <ChevronRight className="w-3 h-3 shrink-0 opacity-35 mx-0.5" />
          )}
          {crumb.href ? (
            <Link
              to={crumb.href}
              className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0 py-1 px-1 rounded hover:bg-muted/50"
            >
              {crumb.icon ? (
                <Home className="w-3 h-3" />
              ) : (
                <span className="whitespace-nowrap">{crumb.label}</span>
              )}
            </Link>
          ) : (
            <span className="text-foreground/90 font-medium truncate max-w-[180px] px-1">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
