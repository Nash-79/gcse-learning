import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/hooks/useAuth";

import Home from "@/pages/Home";
import TopicPage from "@/pages/TopicPage";
import Playground from "@/pages/Playground";
import QuestionBank from "@/pages/QuestionBank";
import ExamSession from "@/pages/ExamSession";
import TopicTheory from "@/pages/TopicTheory";
import Settings from "@/pages/Settings";
import AiTutor from "@/pages/AiTutor";
import Auth from "@/pages/Auth";
import ExamHistory from "@/pages/ExamHistory";
import SpacedRepetition from "@/pages/SpacedRepetition";
import Theory from "@/pages/Theory";
import NotFound from "@/pages/NotFound";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import { ScrollRestoration } from "@/components/layout/ScrollRestoration";
import { SkipToContent } from "@/components/layout/SkipToContent";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="pylearn-theme">
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <SidebarProvider
                style={
                  {
                    "--sidebar-width": "17rem",
                    "--sidebar-width-icon": "3.5rem",
                  } as React.CSSProperties
                }
              >
                <SkipToContent />
                {/* Root flex row: sidebar + right panel */}
                <div className="flex h-svh w-full overflow-hidden bg-background">
                  <AppSidebar />

                  {/* Right panel: header + scrollable content + footer */}
                  <div
                    className="flex flex-col flex-1 min-w-0 overflow-hidden transition-[margin-left] duration-200 ease-linear"
                  >
                    <Header />
                    <main
                      id="main-content"
                      className="flex-1 overflow-y-auto overflow-x-hidden"
                      tabIndex={-1}
                      aria-label="Main content"
                    >
                      <ScrollRestoration />
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/topic/:slug" element={<TopicPage />} />
                        <Route path="/playground" element={<Playground />} />
                        <Route path="/question-bank" element={<QuestionBank />} />
                        <Route path="/exam-session/:setId" element={<ExamSession />} />
                        <Route path="/topic-theory/:slug" element={<TopicTheory />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/ai-tutor" element={<AiTutor />} />
                        <Route path="/exam-history" element={<ExamHistory />} />
                        <Route path="/spaced-repetition" element={<SpacedRepetition />} />
                        <Route path="/theory" element={<Theory />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <footer className="shrink-0 border-t border-border/50 bg-muted/20 px-6 py-3 text-xs text-muted-foreground flex items-center justify-between gap-4">
                      <span>PyLearn — GCSE Computer Science Revision</span>
                      <span className="hidden sm:inline">AQA &amp; OCR syllabus · Master Python. Ace Your Exams.</span>
                    </footer>
                  </div>
                </div>
              </SidebarProvider>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
