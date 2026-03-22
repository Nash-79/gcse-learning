import { Link } from "react-router-dom";
import { Moon, Sun, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/lib/theme";
import { PageBreadcrumb } from "./PageBreadcrumb";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 flex h-12 w-full items-center gap-2 border-b bg-background/90 px-3 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SidebarTrigger className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-colors" />
        <div className="hidden sm:flex min-w-0">
          <PageBreadcrumb />
        </div>
      </div>

      <Link
        to="/"
        className="flex items-center gap-2 sm:hidden shrink-0 transition-opacity hover:opacity-80"
        aria-label="PyLearn home"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow shadow-primary/20">
          <Code2 className="h-3.5 w-3.5" />
        </div>
        <span className="font-display text-base font-bold tracking-tight">
          Py<span className="gradient-text">Learn</span>
        </span>
      </Link>

      <div className="flex items-center gap-1 shrink-0">
        <Link to="/playground" className="hidden sm:block">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 text-xs h-8"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Sandbox</span>
          </Button>
        </Link>
        <Link to="/settings">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground h-8 w-8"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground hover:text-foreground h-8 w-8"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
