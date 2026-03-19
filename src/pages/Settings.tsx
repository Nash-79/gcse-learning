import { Settings as SettingsIcon, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary neon-glow">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure your learning experience</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              About PyLearn
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              PyLearn is a GCSE Computer Science revision platform built for AQA and OCR students. 
              It features interactive Python lessons with live code execution powered by Skulpt, 
              quizzes with difficulty levels, and a Python sandbox for free experimentation.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-sm font-semibold text-foreground">Version</p>
                <p className="text-xs text-muted-foreground">1.0.0</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-sm font-semibold text-foreground">Python Runner</p>
                <p className="text-xs text-muted-foreground">Skulpt (Browser)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-display font-bold mb-4">Reset Progress</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Clear all saved progress, quiz scores, and time tracking data. This cannot be undone.
            </p>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to reset all progress?")) {
                  localStorage.removeItem("pylearn-progress");
                  window.dispatchEvent(new Event("pylearn-progress-update"));
                  window.location.reload();
                }
              }}
              className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-sm font-semibold hover:bg-destructive/20 transition-colors"
            >
              Reset All Progress
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
