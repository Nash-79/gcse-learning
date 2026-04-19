import { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen, Code2, LayoutDashboard, CheckCircle2, Search, Settings,
  GraduationCap, ChevronDown, FileText, Bot, History, Brain, LogIn,
  LogOut, Library, ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useListTopics, useGetProgress, useExamBoard, type Topic, type ExamBoard } from "@/hooks/useTopics";
import { useAuth } from "@/hooks/useAuth";
import { usePendingApprovalCount } from "@/hooks/usePendingApprovalCount";

const boardLabels: Record<ExamBoard, string> = {
  ocr: "OCR J277",
  aqa: "AQA 8525",
  all: "All Boards",
};

const boardColors: Record<ExamBoard, string> = {
  ocr: "text-blue-400",
  aqa: "text-emerald-400",
  all: "text-muted-foreground",
};

function getStoredCollapsed(): Set<string> {
  try {
    const stored = localStorage.getItem("pylearn-collapsed-categories");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCollapsed(set: Set<string>) {
  try {
    localStorage.setItem("pylearn-collapsed-categories", JSON.stringify([...set]));
  } catch {}
}

export function AppSidebar() {
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [boardOpen, setBoardOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(getStoredCollapsed);
  const { user, signOut } = useAuth();
  const { count: pendingApprovals } = usePendingApprovalCount();

  const { board, setBoard } = useExamBoard();
  const { data: topics, isLoading: topicsLoading } = useListTopics();
  const { data: progress } = useGetProgress();

  const closeMobile = useCallback(() => {
    if (isMobile) setOpenMobile(false);
  }, [isMobile, setOpenMobile]);

  // Auto-expand the category containing the active topic
  useEffect(() => {
    if (!topics) return;
    const activeSlug = location.pathname.startsWith("/topic/")
      ? location.pathname.split("/topic/")[1]
      : null;
    if (!activeSlug) return;
    const activeTopic = topics.find((t) => t.slug === activeSlug);
    if (!activeTopic) return;
    setCollapsedCategories((prev) => {
      if (!prev.has(activeTopic.category)) return prev;
      const next = new Set(prev);
      next.delete(activeTopic.category);
      saveCollapsed(next);
      return next;
    });
  }, [location.pathname, topics]);

  const isCompleted = (slug: string) =>
    progress?.topicProgress.some((tp) => tp.topicSlug === slug && tp.completed) ?? false;

  const completedCount = progress?.completedTopics || 0;
  const totalCount = topics?.length || 0;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTopics = topics?.filter((topic) => {
    const q = searchQuery.toLowerCase();
    return topic.title.toLowerCase().includes(q) || topic.category.toLowerCase().includes(q);
  });

  const categories = filteredTopics?.reduce((acc: Record<string, Topic[]>, topic: Topic) => {
    if (!acc[topic.category]) acc[topic.category] = [];
    acc[topic.category].push(topic);
    return acc;
  }, {});

  const toggleCategory = useCallback((category: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      saveCollapsed(next);
      return next;
    });
  }, []);

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/playground", label: "Python Sandbox", icon: Code2, color: "text-secondary" },
    { to: "/theory", label: "Theory Revision", icon: Library, matchPrefix: "/topic-theory/" },
    { to: "/question-bank", label: "Question Bank", icon: FileText },
    { to: "/ai-tutor", label: "AI Tutor", icon: Bot, color: "text-secondary" },
    { to: "/exam-history", label: "Exam History", icon: History },
    { to: "/spaced-repetition", label: "Spaced Repetition", icon: Brain, color: "text-secondary" },
  ];

  const isNavActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return location.pathname === item.to;
    if (item.matchPrefix) return location.pathname === item.to || location.pathname.startsWith(item.matchPrefix);
    return location.pathname === item.to;
  };

  return (
    <Sidebar variant="sidebar" className="border-r border-sidebar-border">
      <SidebarHeader className="p-3 pb-2 gap-2">
        {/* Branding */}
        <div className="flex items-center gap-3 px-1 py-1">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-md shadow-primary/20 shrink-0"
            aria-hidden="true"
          >
            <Code2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-bold">PyLearn</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">GCSE CS</span>
          </div>
        </div>

        {/* Exam Board Selector */}
        <div className="relative px-1">
          <button
            onClick={() => setBoardOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium hover:bg-muted/50 transition-colors"
            aria-expanded={boardOpen}
            aria-haspopup="listbox"
            aria-label={`Exam board: ${boardLabels[board]}`}
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
              <span className={boardColors[board]}>{boardLabels[board]}</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${boardOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
          {boardOpen && (
            <div
              role="listbox"
              aria-label="Select exam board"
              className="absolute z-50 mt-1 left-1 right-1 rounded-lg border border-border bg-popover shadow-xl overflow-hidden"
            >
              {(["ocr", "aqa", "all"] as ExamBoard[]).map((b) => (
                <button
                  key={b}
                  role="option"
                  aria-selected={board === b}
                  onClick={() => { setBoard(b); setBoardOpen(false); }}
                  className={`w-full px-3 py-2 text-xs text-left hover:bg-muted/60 flex items-center justify-between transition-colors ${board === b ? "bg-primary/10 text-primary font-semibold" : "text-foreground"}`}
                >
                  <span>{boardLabels[b]}</span>
                  {board === b && <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="px-1" aria-label={`Progress: ${completedCount} of ${totalCount} topics complete`}>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1 px-0.5">
            <span>{completedCount}/{totalCount} topics</span>
            <span className="text-primary font-bold">{pct}%</span>
          </div>
          <div className="h-1 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Search */}
        <div className="relative px-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted/30 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
            aria-label="Search topics"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-1 gap-0" role="navigation" aria-label="Main navigation">
        {/* Primary nav */}
        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(item);
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link
                        to={item.to}
                        onClick={closeMobile}
                        className="flex items-center gap-2"
                        aria-current={active ? "page" : undefined}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${item.color || ""}`} aria-hidden="true" />
                        <span className={`text-sm ${item.color || ""}`}>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/settings"}>
                  <Link
                    to="/settings"
                    onClick={closeMobile}
                    className="flex items-center gap-2"
                    aria-current={location.pathname === "/settings" ? "page" : undefined}
                  >
                    <Settings className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="text-sm text-muted-foreground flex-1">Settings</span>
                    {pendingApprovals > 0 && (
                      <span
                        className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground shadow-sm shadow-destructive/30"
                        aria-label={`${pendingApprovals} pending approval${pendingApprovals === 1 ? "" : "s"}`}
                        title={`${pendingApprovals} pending approval${pendingApprovals === 1 ? "" : "s"}`}
                      >
                        {pendingApprovals > 99 ? "99+" : pendingApprovals}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                {user ? (
                  <SidebarMenuButton
                    onClick={() => { signOut(); closeMobile(); }}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="text-sm text-muted-foreground">Sign Out</span>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton asChild isActive={location.pathname === "/auth"}>
                    <Link
                      to="/auth"
                      onClick={closeMobile}
                      className="flex items-center gap-2"
                      aria-current={location.pathname === "/auth" ? "page" : undefined}
                    >
                      <LogIn className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="text-sm text-primary font-medium">Sign In</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider */}
        <div className="mx-3 my-2 h-px bg-border/60" role="separator" />

        {/* Topic groups */}
        <nav aria-label="Topics">
          {topicsLoading ? (
            <div className="px-3 py-2 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-7 w-full" />
                  <Skeleton className="h-7 w-full" />
                </div>
              ))}
            </div>
          ) : Object.entries(categories ?? {}).length === 0 && searchQuery ? (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground" role="status">
              No topics match &quot;<span className="font-medium text-foreground">{searchQuery}</span>&quot;
            </div>
          ) : (
            Object.entries(categories ?? {}).map(([category, categoryTopics]) => {
              const isCollapsed = collapsedCategories.has(category);
              const hasActiveTopic = categoryTopics.some(
                (t) => location.pathname === `/topic/${t.slug}`
              );

              return (
                <Collapsible
                  key={category}
                  open={!isCollapsed}
                  onOpenChange={() => toggleCategory(category)}
                >
                  <SidebarGroup className="py-0">
                    <CollapsibleTrigger asChild>
                      <SidebarGroupLabel
                        className="flex items-center justify-between cursor-pointer select-none hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted/40 h-auto"
                        aria-expanded={!isCollapsed}
                      >
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${hasActiveTopic && isCollapsed ? "text-primary" : ""}`}>
                          {category}
                        </span>
                        <ChevronRight
                          className={`w-3 h-3 shrink-0 transition-transform duration-200 ${!isCollapsed ? "rotate-90" : ""} ${hasActiveTopic && isCollapsed ? "text-primary" : "text-muted-foreground/50"}`}
                          aria-hidden="true"
                        />
                      </SidebarGroupLabel>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <SidebarMenu className="gap-0">
                          {categoryTopics.map((topic) => {
                            const completed = isCompleted(topic.slug);
                            const isActive = location.pathname === `/topic/${topic.slug}`;
                            return (
                              <SidebarMenuItem key={topic.id}>
                                <SidebarMenuButton
                                  asChild
                                  isActive={isActive}
                                  tooltip={topic.title}
                                  className="h-8"
                                >
                                  <Link
                                    to={`/topic/${topic.slug}`}
                                    onClick={closeMobile}
                                    className="flex w-full items-center gap-2"
                                    aria-current={isActive ? "page" : undefined}
                                  >
                                    <BookOpen className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden="true" />
                                    <span className="truncate text-xs flex-1">{topic.title}</span>
                                    <div className="flex items-center gap-1 shrink-0">
                                      {topic.ocrRef && (
                                        <span className="text-[9px] font-mono text-muted-foreground/40 hidden lg:block">
                                          {topic.ocrRef}
                                        </span>
                                      )}
                                      {completed && (
                                        <CheckCircle2
                                          className="h-3.5 w-3.5 text-green-500"
                                          aria-label="Completed"
                                        />
                                      )}
                                    </div>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>
              );
            })
          )}
        </nav>
      </SidebarContent>

      {user && (
        <SidebarFooter className="p-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/30" aria-label="Signed in as">
            <div
              className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              aria-hidden="true"
            >
              {user.email?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span className="text-xs text-muted-foreground truncate flex-1">
              {user.email}
            </span>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
