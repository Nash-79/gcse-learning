import { Link, useLocation } from "react-router-dom";
import { Zap, Moon, Sun, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/lib/theme";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground hidden sm:inline-block">
            Py<span className="gradient-text">Learn</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Link to="/playground">
          <Button variant="ghost" size="sm" className="gap-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 text-xs sm:text-sm">
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">Sandbox</span>
          </Button>
        </Link>
        <Link to="/settings">
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
