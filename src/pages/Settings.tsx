import { useState, useMemo, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { appLog } from "@/lib/appLogger";
import { motion, AnimatePresence } from "framer-motion";
import { Settings as SettingsIcon, Key, Bot, Save, CheckCircle2, AlertCircle, Loader2, ExternalLink, Sparkles, Zap, Brain, Code2, Eye, Search, X, ChevronDown, Clock, AlertTriangle, Hash, Server, ShieldAlert, Lock, Users, Globe, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAiSettings, type RouteKey, type RoutePolicy } from "@/lib/useAiSettings";
import { useOpenRouterModels } from "@/lib/useOpenRouterModels";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAdminRole } from "@/hooks/useAdminRole";
import AdminLogViewer from "@/components/admin/AdminLogViewer";
import AdminUserRoles from "@/components/admin/AdminUserRoles";
import { Slider } from "@/components/ui/slider";

interface FreeModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: number;
  maxOutput: number | null;
  inputPrice: string;
  outputPrice: string;
  tags: string[];
  architecture: string;
  tokenizer: string;
  recommended?: boolean;
  deprecated?: string;
}

const freeModels: FreeModel[] = [
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B Instruct",
    provider: "Meta",
    description: "Fallback model list used only if live OpenRouter catalog is unavailable.",
    contextWindow: 65536,
    maxOutput: null,
    inputPrice: "$0.00",
    outputPrice: "$0.00",
    tags: ["Tools", "Best Quality"],
    architecture: "text -> text",
    tokenizer: "Llama3",
    recommended: true,
  },
];

function formatContext(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${Math.round(tokens / 1000)}K`;
  return String(tokens);
}

function TagBadge({ tag, size = "sm" }: { tag: string; size?: "sm" | "md" }) {
  const config: Record<string, { icon: React.ReactNode; color: string }> = {
    "Tools": { icon: <Zap className="w-2.5 h-2.5" />, color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    "Reasoning": { icon: <Brain className="w-2.5 h-2.5" />, color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
    "Vision": { icon: <Eye className="w-2.5 h-2.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    "Code": { icon: <Code2 className="w-2.5 h-2.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
    "Best Quality": { icon: <Sparkles className="w-2.5 h-2.5" />, color: "bg-primary/15 text-primary border-primary/20" },
  };
  const c = config[tag] || { icon: null, color: "bg-muted text-muted-foreground border-border" };
  const sizeClasses = size === "md" ? "px-2 py-0.5 text-[11px]" : "px-1.5 py-0.5 text-[10px]";
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border font-medium ${c.color} ${sizeClasses}`}>
      {c.icon}{tag}
    </span>
  );
}

const allTags = ["Tools", "Reasoning", "Vision", "Code", "Best Quality"] as const;

export default function Settings() {
  const { hasAi, maskedKey, model: currentModel, provider: currentProvider, updateSettings } = useAiSettings();
  const {
    freeModels: dynamicModels,
    loading: modelsLoading,
    refreshing: modelsRefreshing,
    error: modelsError,
    lastUpdatedAt,
    refreshModels,
  } = useOpenRouterModels();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminRole();
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState(currentModel);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [healthChecking, setHealthChecking] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [healthStatus, setHealthStatus] = useState<"idle" | "success" | "error">("idle");
  const [healthMsg, setHealthMsg] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [activeProviderFilter, setActiveProviderFilter] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showUserRoles, setShowUserRoles] = useState(false);
  const availableModels = dynamicModels.length > 0 ? dynamicModels : freeModels;

  useEffect(() => {
    if (!availableModels.some((m) => m.id === selectedModel) && availableModels.length > 0) {
      setSelectedModel(availableModels[0].id);
    }
  }, [availableModels, selectedModel]);

  const filteredModels = useMemo(() => {
    return availableModels.filter(m => {
      const q = modelSearch.toLowerCase();
      const matchesSearch = !q ||
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q));
      const matchesTag = !activeTagFilter || m.tags.includes(activeTagFilter);
      const matchesProvider = !activeProviderFilter || m.provider === activeProviderFilter;
      return matchesSearch && matchesTag && matchesProvider;
    });
  }, [availableModels, modelSearch, activeTagFilter, activeProviderFilter]);

  const allProviders = useMemo(
    () => [...new Set(availableModels.map((m) => m.provider))],
    [availableModels]
  );

  const hasActiveFilter = !!modelSearch || !!activeTagFilter || !!activeProviderFilter;
  const lastUpdatedLabel = lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString() : "Not yet loaded";

  const saveKey = () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    setStatus("idle");
    setTimeout(() => {
      updateSettings({ apiKey: apiKey.trim(), model: selectedModel });
      setStatus("success");
      setStatusMsg("Settings saved successfully!");
      setApiKey("");
      setSaving(false);
    }, 400);
  };

  const testConnection = async () => {
    setTesting(true);
    setStatus("idle");
    try {
      const response = await apiFetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          topicTitle: "Test",
          model: selectedModel,
          maxTokens: 120,
          messages: [{ role: "user", content: "Say 'Hello from PyLearn!' in exactly those words." }],
        }),
      });
      const raw = await response.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        const looksLikeHtml = raw.trimStart().startsWith("<") || raw.includes("The page could not be found");
        if (looksLikeHtml) {
          throw new Error("API route not reachable. Check VITE_API_BASE_URL and backend deployment.");
        }
        throw new Error("AI gateway returned a non-JSON response.");
      }
      if (!response.ok || data?.error || data?.detail) {
        const msg = data?.error || data?.detail || `Request failed (${response.status})`;
        throw new Error(msg);
      }
      const reply = data?.content || "No response";
      setStatus("success");
      setStatusMsg(`Connection successful! Model replied: "${reply.substring(0, 60)}"`);
    } catch (err: any) {
      void appLog({
        event_type: "api_error",
        origin: "Settings.testConnection",
        message: err?.message || "AI connection test failed",
        details: { provider: currentProvider, model: selectedModel },
        error_stack: err?.stack,
        severity: "error",
      });
      setStatus("error");
      setStatusMsg(err?.message ? `Connection test failed: ${err.message}` : "Connection test failed. Please try again in a moment.");
    } finally {
      setTesting(false);
    }
  };

  const checkApiHealth = async () => {
    setHealthChecking(true);
    setHealthStatus("idle");
    try {
      const response = await apiFetch("/api/health", { method: "GET" });
      const raw = await response.text();
      let payload: any = {};
      try {
        payload = raw ? JSON.parse(raw) : {};
      } catch {
        // non-JSON health responses are acceptable if status is 2xx
      }
      if (!response.ok) {
        throw new Error(payload?.error || `Health endpoint returned ${response.status}`);
      }
      setHealthStatus("success");
      setHealthMsg("API is reachable.");
    } catch (err: any) {
      void appLog({
        event_type: "api_error",
        origin: "Settings.checkApiHealth",
        message: err?.message || "API health check failed",
        details: { provider: currentProvider },
        error_stack: err?.stack,
        severity: "error",
      });
      setHealthStatus("error");
      setHealthMsg(err?.message || "API health check failed.");
    } finally {
      setHealthChecking(false);
    }
  };

  const handleSelectModel = (m: FreeModel) => {
    setSelectedModel(m.id);
    setExpandedModel(m.id);
    if (hasAi) {
      updateSettings({ model: m.id });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 pb-24">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary neon-glow">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Configure AI features for quiz generation, code review, and learning assistance.</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        {/* AI Provider Selection */}
        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              AI Provider
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose which AI backend to use for chat, exam marking, and quiz generation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => updateSettings({ provider: "openrouter" })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  currentProvider === "openrouter"
                    ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/5"
                    : "border-border/40 hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="font-display font-bold">OpenRouter</span>
                  {currentProvider === "openrouter" && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-semibold ml-auto">Active</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Free tier models from Meta, Google, Qwen, NVIDIA &amp; more. Requires API key. Rate limits may apply.</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* API Key Section — only show for OpenRouter */}
        {currentProvider === "openrouter" && (
          <Card className="rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                OpenRouter API Key
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sign up free at{" "}
                <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                  openrouter.ai/keys <ExternalLink className="w-3 h-3" />
                </a>
                {" "}— no credit card needed
              </p>

              {hasAi && (
                <div className="mb-4 flex items-center gap-2 text-sm bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl px-4 py-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>API key configured: <code className="font-mono text-xs">{maskedKey}</code></span>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  {hasAi ? "Update API Key" : "Enter API Key"}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>

              <AnimatePresence>
                {status !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className={`mt-3 flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border ${
                      status === "success" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {status === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {statusMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 mt-4">
                <Button onClick={saveKey} disabled={!apiKey.trim() || saving} className="gap-2 rounded-xl">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {hasAi ? "Update Key" : "Save Key"}
                </Button>
                <Button variant="outline" onClick={checkApiHealth} disabled={healthChecking} className="gap-2 rounded-xl">
                  {healthChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
                  Check API Health
                </Button>
                <Button variant="outline" onClick={testConnection} disabled={testing} className="gap-2 rounded-xl">
                  {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                  Test Connection
                </Button>
              </div>

              <AnimatePresence>
                {healthStatus !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className={`mt-3 flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border ${
                      healthStatus === "success" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {healthStatus === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {healthMsg}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        )}

        {/* Model Selection */}
        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-secondary" />
                  AI Model
                </h3>
                <p className="text-sm text-muted-foreground">
                  OpenRouter model catalog is loaded dynamically and cached. {availableModels.length} models available.
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">Last updated: {lastUpdatedLabel}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refreshModels()}
                disabled={modelsLoading || modelsRefreshing}
                className="gap-2 rounded-xl self-start"
              >
                {modelsRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Refresh Models
              </Button>
            </div>
            {modelsLoading && (
              <p className="text-xs text-muted-foreground mb-3">Refreshing model catalog...</p>
            )}
            {modelsRefreshing && (
              <p className="text-xs text-muted-foreground mb-3">Fetching latest catalog from OpenRouter...</p>
            )}
            {modelsError && (
              <p className="text-xs text-amber-500 mb-3">Using cached/fallback model list: {modelsError}</p>
            )}

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                value={modelSearch}
                onChange={e => setModelSearch(e.target.value)}
                placeholder="Search models by name, provider, or capability..."
                className="w-full bg-background border border-border rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              {modelSearch && (
                <button onClick={() => setModelSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-[11px] text-muted-foreground font-medium self-center">Capability:</span>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTagFilter(activeTagFilter === tag ? null : tag)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                    activeTagFilter === tag
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-background border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {tag === "Tools" && <Zap className="w-3 h-3" />}
                  {tag === "Reasoning" && <Brain className="w-3 h-3" />}
                  {tag === "Vision" && <Eye className="w-3 h-3" />}
                  {tag === "Code" && <Code2 className="w-3 h-3" />}
                  {tag === "Best Quality" && <Sparkles className="w-3 h-3" />}
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-[11px] text-muted-foreground font-medium self-center">Provider:</span>
              {allProviders.map(provider => (
                <button
                  key={provider}
                  onClick={() => setActiveProviderFilter(activeProviderFilter === provider ? null : provider)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                    activeProviderFilter === provider
                      ? "bg-secondary/15 text-secondary border-secondary/30"
                      : "bg-background border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {provider}
                </button>
              ))}
            </div>

            {hasActiveFilter && (
              <button
                onClick={() => { setModelSearch(""); setActiveTagFilter(null); setActiveProviderFilter(null); }}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 mb-3"
              >
                <X className="w-3 h-3" /> Clear all filters
              </button>
            )}

            {/* Model List */}
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
              {filteredModels.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No models match your filters.</p>
                </div>
              ) : (
                filteredModels.map(m => {
                  const isSelected = m.id === selectedModel;
                  const isExpanded = expandedModel === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => handleSelectModel(m)}
                      className={`rounded-2xl border-2 transition-all cursor-pointer group ${
                        isSelected
                          ? "border-primary/50 bg-gradient-to-br from-primary/5 via-card to-secondary/5 shadow-lg shadow-primary/5"
                          : "border-border/40 bg-card hover:border-primary/30 hover:shadow-md"
                      }`}
                    >
                      {/* Header */}
                      <div className="p-4 pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
                              <h4 className="font-display font-bold text-base text-foreground">{m.name}</h4>
                              <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 rounded-md bg-muted/50">{m.provider}</span>
                              {m.recommended && (
                                <span className="text-[11px] font-bold bg-gradient-to-r from-primary/20 to-secondary/20 text-primary px-2 py-0.5 rounded-md flex items-center gap-1 border border-primary/20">
                                  <Sparkles className="w-3 h-3" /> Recommended
                                </span>
                              )}
                            </div>
                            {m.deprecated && (
                              <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-1">
                                <AlertTriangle className="w-3 h-3" /> {m.deprecated}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-xs font-bold text-green-400 bg-green-500/15 px-2.5 py-1 rounded-lg border border-green-500/20">FREE</span>
                          </div>
                        </div>

                        {/* Quick specs row */}
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                          <span className="text-[11px] text-muted-foreground">
                            In: <span className="text-green-400 font-semibold">{m.inputPrice}</span>
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Out: <span className="text-green-400 font-semibold">{m.outputPrice}</span>
                          </span>
                          <span className="text-muted-foreground/30">|</span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Hash className="w-3 h-3" /> {formatContext(m.contextWindow)} ctx
                          </span>
                          <div className="flex items-center gap-1.5 ml-auto">
                            {m.tags.map(t => <TagBadge key={t} tag={t} size="md" />)}
                          </div>
                        </div>
                      </div>

                      {/* Expand toggle */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedModel(isExpanded ? null : m.id); }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors border-t border-border/30"
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        {isExpanded ? "Less details" : "More details"}
                      </button>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
                              <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>

                              {/* Specs Grid — OpenRouter style */}
                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-muted-foreground">↕</span>
                                    <span className="text-[11px] text-muted-foreground font-medium">Input Price</span>
                                  </div>
                                  <p className="text-lg font-display font-bold text-green-400">{m.inputPrice}</p>
                                  <p className="text-[10px] text-muted-foreground">/ M tokens</p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-muted-foreground">↕</span>
                                    <span className="text-[11px] text-muted-foreground font-medium">Output Price</span>
                                  </div>
                                  <p className="text-lg font-display font-bold text-green-400">{m.outputPrice}</p>
                                  <p className="text-[10px] text-muted-foreground">/ M tokens</p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-[11px] text-muted-foreground font-medium">Context Window</span>
                                  </div>
                                  <p className="text-lg font-display font-bold">{formatContext(m.contextWindow)}</p>
                                  <p className="text-[10px] text-muted-foreground">tokens</p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-[11px] text-muted-foreground font-medium">Max Output</span>
                                  </div>
                                  <p className="text-lg font-display font-bold">{m.maxOutput ? formatContext(m.maxOutput) : "Unlimited"}</p>
                                  <p className="text-[10px] text-muted-foreground">tokens</p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Server className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-[11px] text-muted-foreground font-medium">Architecture</span>
                                  </div>
                                  <p className="text-sm font-semibold font-mono">{m.architecture}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-[11px] text-muted-foreground font-medium">Tokenizer</span>
                                  </div>
                                  <p className="text-sm font-semibold font-mono">{m.tokenizer}</p>
                                </div>
                              </div>

                              {/* Capabilities */}
                              {m.tags.length > 0 && (
                                <div>
                                  <p className="text-[11px] text-muted-foreground font-medium mb-2">Capabilities</p>
                                  <div className="flex flex-wrap gap-2">
                                    {m.tags.map(t => <TagBadge key={t} tag={t} size="md" />)}
                                  </div>
                                </div>
                              )}

                              {/* Model ID */}
                              <p className="text-[11px] text-muted-foreground/50 font-mono">Model ID: {m.id}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reset Progress */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Reset Progress
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Clear all saved progress, quiz scores, and time tracking data. This cannot be undone.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Are you sure you want to reset all progress?")) {
                  localStorage.removeItem("pylearn-progress");
                  window.dispatchEvent(new Event("pylearn-progress-update"));
                  window.location.reload();
                }
              }}
              className="gap-2 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              Reset All Progress
            </Button>
          </CardContent>
        </Card>

        {/* Admin Panel */}
        {user && isAdmin && (
          <div className="space-y-4">
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-lg font-display font-bold flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-primary" />
                      Admin Panel
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Manage users, roles, and view application logs
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={showUserRoles ? "default" : "outline"}
                      onClick={() => setShowUserRoles(!showUserRoles)}
                      className="gap-2 rounded-xl"
                    >
                      <Users className="w-4 h-4" />
                      {showUserRoles ? "Hide Users" : "Manage Users"}
                    </Button>
                    <Button
                      variant={showAdminPanel ? "default" : "outline"}
                      onClick={() => setShowAdminPanel(!showAdminPanel)}
                      className="gap-2 rounded-xl"
                    >
                      <Lock className="w-4 h-4" />
                      {showAdminPanel ? "Hide Logs" : "View Logs"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AnimatePresence>
              {showUserRoles && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AdminUserRoles />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showAdminPanel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <AdminLogViewer />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* About */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              About PyLearn
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              PyLearn is a GCSE Computer Science revision platform built for AQA and OCR students.
              It features interactive Python lessons with live code execution powered by Skulpt,
              AI-powered quiz generation and code review via OpenRouter, and a Python sandbox for free experimentation.
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
      </div>
    </div>
  );
}
