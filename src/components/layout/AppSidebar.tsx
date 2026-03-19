import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Code2, LayoutDashboard, CheckCircle2, Search, Settings, GraduationCap, ChevronDown, FileText, Bot, History, Brain, LogIn, LogOut, User } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useListTopics, useGetProgress, useExamBoard, type Topic, type ExamBoard } from "@/hooks/useTopics";

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

export function AppSidebar() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [boardOpen, setBoardOpen] = useState(false);

  const { board, setBoard } = useExamBoard();
  const { data: topics, isLoading: topicsLoading } = useListTopics();
  const { data: progress } = useGetProgress();

  const isCompleted = (slug: string) => {
    return progress?.topicProgress.some(tp => tp.topicSlug === slug && tp.completed) ?? false;
  };

  const completedCount = progress?.completedTopics || 0;
  const totalCount = topics?.length || 0;

  const filteredTopics = topics?.filter(topic => {
    const query = searchQuery.toLowerCase();
    return topic.title.toLowerCase().includes(query) || topic.category.toLowerCase().includes(query);
  });

  const categories = filteredTopics?.reduce((acc: Record<string, Topic[]>, topic: Topic) => {
    if (!acc[topic.category]) {
      acc[topic.category] = [];
    }
    acc[topic.category].push(topic);
    return acc;
  }, {});

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="p-4 pt-6">
        <div className="flex items-center gap-3 px-2 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20">
            <Code2 className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold leading-none">PyLearn</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">GCSE CS</span>
          </div>
        </div>

        {/* Exam Board Selector */}
        <div className="px-2 mt-3 relative">
          <button
            onClick={() => setBoardOpen(!boardOpen)}
            className="w-full flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm font-medium hover:bg-muted/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span className={boardColors[board]}>{boardLabels[board]}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${boardOpen ? 'rotate-180' : ''}`} />
          </button>
          {boardOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-xl overflow-hidden">
              {(["ocr", "aqa", "all"] as ExamBoard[]).map((b) => (
                <button
                  key={b}
                  onClick={() => { setBoard(b); setBoardOpen(false); }}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-muted/60 flex items-center justify-between transition-colors ${board === b ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'}`}
                >
                  <span>{boardLabels[b]}</span>
                  {board === b && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-2 mt-2 mb-1">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5 px-1">
            <span>{completedCount}/{totalCount} complete</span>
            <span className="text-primary font-bold">{totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500" style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="relative px-2 mt-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted/40 py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                  <Link to="/">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/playground"}>
                  <Link to="/playground">
                    <Code2 className="h-4 w-4 text-secondary" />
                    <span className="font-medium text-secondary">Python Sandbox</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/question-bank"}>
                  <Link to="/question-bank">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="font-medium">Question Bank</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/ai-tutor"}>
                  <Link to="/ai-tutor">
                    <Bot className="h-4 w-4 text-secondary" />
                    <span className="font-medium text-secondary">AI Tutor</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/settings"}>
                  <Link to="/settings">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {topicsLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : Object.entries(categories ?? {}).length === 0 && searchQuery ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            No topics match "{searchQuery}"
          </div>
        ) : (
          Object.entries(categories ?? {}).map(([category, categoryTopics]) => (
            <SidebarGroup key={category}>
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4 mb-1">
                {category}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {categoryTopics.map((topic) => {
                    const completed = isCompleted(topic.slug);
                    const isActive = location.pathname === `/topic/${topic.slug}`;

                    return (
                      <SidebarMenuItem key={topic.id}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={topic.title}>
                          <Link to={`/topic/${topic.slug}`} className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <BookOpen className="h-3.5 w-3.5 shrink-0 opacity-60" />
                              <span className="truncate text-sm">{topic.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {topic.ocrRef && (
                                <span className="text-[9px] font-mono text-muted-foreground/50">{topic.ocrRef}</span>
                              )}
                              {completed && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                              )}
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
    </Sidebar>
  );
}
