import { Link } from "react-router-dom";
import { Moon, Sun, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/lib/theme";
import { PageBreadcrumb } from "./PageBreadcrumb";
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { state, isMobile } = useSidebar();
  const sidebarCollapsed = state === "collapsed" && !isMobile;

  return (
    <header
      className="sticky top-0 z-50 flex h-12 w-full items-center gap-2 border-b bg-background/90 px-3 backdrop-blur-md shrink-0"
      role="banner"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SidebarTrigger
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-colors"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        />

        {/* Show logo on desktop when sidebar is collapsed */}
        {sidebarCollapsed && (
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 transition-opacity hover:opacity-80 hidden md:flex"
            aria-label="PyLearn home"
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow shadow-primary/20"
              aria-hidden="true"
            >
              <Code2 className="h-3.5 w-3.5" />
            </div>
            <span className="font-display text-sm font-bold tracking-tight">
              Py<span className="gradient-text">Learn</span>
            </span>
          </Link>
        )}

        <div className="hidden sm:flex min-w-0 overflow-hidden">
          <PageBreadcrumb />
        </div>
      </div>

      {/* Mobile logo — visible when sidebar is closed on mobile */}
      <Link
        to="/"
        className="flex items-center gap-2 sm:hidden shrink-0 transition-opacity hover:opacity-80"
        aria-label="PyLearn home"
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow shadow-primary/20"
          aria-hidden="true"
        >
          <Code2 className="h-3.5 w-3.5" />
        </div>
        <span className="font-display text-base font-bold tracking-tight">
          Py<span className="gradient-text">Learn</span>
        </span>
      </Link>

      <div className="flex items-center gap-1 shrink-0" role="toolbar" aria-label="Header actions">
        <Link to="/playground" className="hidden sm:block">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 text-xs h-8"
            aria-label="Open Python Sandbox"
          >
            <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Sandbox</span>
          </Button>
        </Link>
        <FeedbackDialog sectionKey="header" />
        <Link to="/settings">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground h-8 w-8"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground hover:text-foreground h-8 w-8"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    </header>
  );
}
