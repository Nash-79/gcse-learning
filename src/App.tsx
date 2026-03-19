import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/lib/theme";

import Home from "@/pages/Home";
import TopicPage from "@/pages/TopicPage";
import Playground from "@/pages/Playground";
import QuestionBank from "@/pages/QuestionBank";
import ExamSession from "@/pages/ExamSession";
import TopicTheory from "@/pages/TopicTheory";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";

const queryClient = new QueryClient();

const App = () => {
  const sidebarStyle = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="pylearn-theme">
        <TooltipProvider>
          <BrowserRouter>
            <SidebarProvider style={sidebarStyle}>
              <div className="flex h-screen w-full overflow-hidden bg-background">
                <AppSidebar />
                <div className="flex flex-col flex-1 min-w-0">
                  <Header />
                  <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/topic/:slug" element={<TopicPage />} />
                      <Route path="/playground" element={<Playground />} />
                      <Route path="/question-bank" element={<QuestionBank />} />
                      <Route path="/exam-session/:setId" element={<ExamSession />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <footer className="shrink-0 border-t border-border/50 bg-muted/20 px-6 py-3 text-xs text-muted-foreground flex items-center justify-between">
                    <span>PyLearn — GCSE Computer Science Revision</span>
                    <span>AQA &amp; OCR syllabus · Master Python. Ace Your Exams.</span>
                  </footer>
                </div>
              </div>
            </SidebarProvider>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
