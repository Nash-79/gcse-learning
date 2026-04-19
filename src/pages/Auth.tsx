import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, LogIn, UserPlus, Mail, Lock, User, Loader2, Eye, EyeOff, KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Auth() {
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Welcome back!");
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created — an admin will approve your access shortly. Check your email to confirm.");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20 mx-auto mb-4">
            <Code2 className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-extrabold">PyLearn</h1>
          <p className="text-sm text-muted-foreground mt-1">GCSE Computer Science Revision</p>
        </div>

        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-6">
            {/* Tab switcher */}
            <div className="flex rounded-xl bg-muted/50 p-1 mb-6">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "login" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "signup" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserPlus className="w-4 h-4" /> Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-border bg-muted/30 py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-border bg-muted/30 py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-border bg-muted/30 py-3 pl-10 pr-12 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full rounded-xl py-3 gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "login" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {submitting ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
              </Button>

              {mode === "login" && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) {
                      toast.error("Enter your email above first");
                      return;
                    }
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    if (error) {
                      toast.error(error.message);
                    } else {
                      toast.success("Password reset email sent. Check your inbox.");
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 w-full text-xs text-muted-foreground hover:text-primary transition-colors pt-1"
                >
                  <KeyRound className="w-3 h-3" />
                  Forgot password?
                </button>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
