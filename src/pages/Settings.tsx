import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings as SettingsIcon, Key, Bot, Save, CheckCircle2, AlertCircle, Loader2, ExternalLink, Sparkles, Zap, Brain, Code2, Eye, Search, X, ChevronDown, Clock, AlertTriangle, Hash, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAiSettings } from "@/lib/useAiSettings";

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
    description: "Meta's most capable free model. A 70 billion parameter multilingual LLM, pretrained and instruction-tuned for excellent code generation, reasoning, and instruction following. Best all-round choice for education and tutoring.",
    contextWindow: 65536, maxOutput: null,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools", "Best Quality"], architecture: "text → text", tokenizer: "Llama3", recommended: true,
  },
  {
    id: "google/gemma-3-27b-it:free",
    name: "Gemma 3 27B",
    provider: "Google",
    description: "Google's open-weight multimodal model supporting vision-language input and text output. Handles context windows up to 128K tokens. Strong at instruction following, text generation, and image understanding.",
    contextWindow: 131072, maxOutput: 8192,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Vision", "Tools"], architecture: "text+image → text", tokenizer: "Gemini", recommended: true,
  },
  {
    id: "qwen/qwen3-coder:free",
    name: "Qwen3 Coder 480B",
    provider: "Qwen",
    description: "Qwen's Mixture-of-Experts code generation model with 480B total parameters (35B active). Optimised for coding tasks — generation, review, debugging, and explanation.",
    contextWindow: 262000, maxOutput: 262000,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools", "Code"], architecture: "text → text", tokenizer: "Qwen3",
  },
  {
    id: "nvidia/nemotron-3-super-120b-a12b:free",
    name: "Nemotron 3 Super 120B",
    provider: "NVIDIA",
    description: "NVIDIA's 120B-parameter open hybrid MoE model, activating just 12B parameters per inference for maximum efficiency. Strong reasoning capabilities.",
    contextWindow: 262144, maxOutput: 262144,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools", "Reasoning"], architecture: "text → text", tokenizer: "Other",
  },
  {
    id: "qwen/qwen3-next-80b-a3b-instruct:free",
    name: "Qwen3 Next 80B",
    provider: "Qwen",
    description: "Instruction-tuned chat model in the Qwen3-Next series. 80B total parameters with 3B active. Strong at quiz generation and educational content creation.",
    contextWindow: 262144, maxOutput: null,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools"], architecture: "text → text", tokenizer: "Qwen3",
  },
  {
    id: "openai/gpt-oss-120b:free",
    name: "GPT-OSS 120B",
    provider: "OpenAI",
    description: "OpenAI's open-weight 117B-parameter Mixture-of-Experts language model designed for high-reasoning tasks. Released under the Apache 2.0 licence.",
    contextWindow: 131072, maxOutput: 131072,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools"], architecture: "text → text", tokenizer: "GPT",
  },
  {
    id: "stepfun/step-3.5-flash:free",
    name: "Step 3.5 Flash",
    provider: "StepFun",
    description: "StepFun's most capable open-source foundation model. Built on a sparse Mixture of Experts architecture, optimised for speed and efficiency.",
    contextWindow: 256000, maxOutput: 256000,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools"], architecture: "text → text", tokenizer: "Other",
  },
  {
    id: "mistralai/mistral-small-3.1-24b-instruct:free",
    name: "Mistral Small 3.1 24B",
    provider: "Mistral",
    description: "Mistral's 24 billion parameter model with vision support. Fast responses with good instruction following. Suitable for chat, code review, and quick explanations.",
    contextWindow: 128000, maxOutput: null,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Vision", "Tools"], architecture: "text+image → text", tokenizer: "Mistral",
  },
  {
    id: "arcee-ai/trinity-large-preview:free",
    name: "Trinity Large Preview",
    provider: "Arcee AI",
    description: "Frontier-scale 400B-parameter sparse MoE model from Arcee. Reasoning-focused with strong structured output for quiz JSON generation and code analysis.",
    contextWindow: 131000, maxOutput: null,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools", "Reasoning"], architecture: "text → text", tokenizer: "Other",
  },
  {
    id: "openai/gpt-oss-20b:free",
    name: "GPT-OSS 20B",
    provider: "OpenAI",
    description: "OpenAI's smaller 21B parameter open-weight MoE model. Faster responses than the 120B variant, suitable for quick chat interactions.",
    contextWindow: 131072, maxOutput: 131072,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools"], architecture: "text → text", tokenizer: "GPT",
  },
  {
    id: "minimax/minimax-m2.5:free",
    name: "MiniMax M2.5",
    provider: "MiniMax",
    description: "State-of-the-art LLM designed for real-world productivity. Very large 197K context window for processing long code examples and conversations.",
    contextWindow: 196608, maxOutput: 196608,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools"], architecture: "text → text", tokenizer: "Other",
  },
  {
    id: "nvidia/nemotron-3-nano-30b-a3b:free",
    name: "Nemotron 3 Nano 30B",
    provider: "NVIDIA",
    description: "NVIDIA's efficient 30B MoE model with 3B active parameters. Compact but capable, with a massive 256K context window.",
    contextWindow: 256000, maxOutput: null,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools"], architecture: "text → text", tokenizer: "Other",
  },
  {
    id: "nousresearch/hermes-3-llama-3.1-405b:free",
    name: "Hermes 3 405B",
    provider: "Nous Research",
    description: "Massive 405B parameter generalist model with advanced agentic capabilities. The largest free model available — highest quality but may be slower.",
    contextWindow: 131072, maxOutput: null,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: [], architecture: "text → text", tokenizer: "Llama3",
  },
  {
    id: "nvidia/nemotron-nano-12b-v2-vl:free",
    name: "Nemotron Nano 12B VL",
    provider: "NVIDIA",
    description: "NVIDIA's multimodal vision-language model. Can understand images and video alongside text. 12B parameters with 128K context.",
    contextWindow: 128000, maxOutput: 128000,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Vision", "Tools"], architecture: "text+image+video → text", tokenizer: "Other",
  },
  {
    id: "nvidia/nemotron-nano-9b-v2:free",
    name: "Nemotron Nano 9B",
    provider: "NVIDIA",
    description: "NVIDIA's 9B parameter LLM trained from scratch for reasoning, coding, and chat. Fast and efficient for everyday interactions.",
    contextWindow: 128000, maxOutput: null,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools"], architecture: "text → text", tokenizer: "Other",
  },
  {
    id: "z-ai/glm-4.5-air:free",
    name: "GLM 4.5 Air",
    provider: "Z.ai",
    description: "Z.ai's efficient language model with 131K context and up to 96K output tokens. Good for generating longer responses.",
    contextWindow: 131072, maxOutput: 96000,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools"], architecture: "text → text", tokenizer: "Other",
  },
  {
    id: "arcee-ai/trinity-mini:free",
    name: "Trinity Mini",
    provider: "Arcee AI",
    description: "Arcee's compact model — smaller and faster sibling of Trinity Large. Good for quick responses and lightweight tasks.",
    contextWindow: 131072, maxOutput: null,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools"], architecture: "text → text", tokenizer: "Other",
  },
  {
    id: "google/gemma-3-12b-it:free",
    name: "Gemma 3 12B",
    provider: "Google",
    description: "Mid-size Google model with vision capabilities. Good balance of quality and speed for tutoring.",
    contextWindow: 32768, maxOutput: 8192,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Vision"], architecture: "text+image → text", tokenizer: "Gemini",
  },
  {
    id: "google/gemma-3-4b-it:free",
    name: "Gemma 3 4B",
    provider: "Google",
    description: "Google's smallest Gemma 3 model with vision support. Ultra-fast responses for simple questions.",
    contextWindow: 32768, maxOutput: 8192,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Vision"], architecture: "text+image → text", tokenizer: "Gemini",
  },
  {
    id: "qwen/qwen3-4b:free",
    name: "Qwen3 4B",
    provider: "Qwen",
    description: "4 billion parameter dense model from the Qwen3 series. Fast responses for quick chat and simple code explanations.",
    contextWindow: 40960, maxOutput: null,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools"], architecture: "text → text", tokenizer: "Qwen3",
  },
  {
    id: "meta-llama/llama-3.2-3b-instruct:free",
    name: "Llama 3.2 3B",
    provider: "Meta",
    description: "Meta's 3-billion-parameter multilingual LLM. Ultra-lightweight for the fastest possible responses. Best for simple Q&A.",
    contextWindow: 131072, maxOutput: null,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: [], architecture: "text → text", tokenizer: "Llama3",
  },
  {
    id: "meta-llama/llama-3.1-8b-instruct:free",
    name: "Llama 3.1 8B",
    provider: "Meta",
    description: "Older 8B parameter model from Meta. Superseded by Llama 3.2 and 3.3 series. Still works for basic tasks.",
    contextWindow: 131072, maxOutput: null,
    inputPrice: "$0.00", outputPrice: "$0.00",
    tags: ["Tools"], architecture: "text → text", tokenizer: "Llama3",
    deprecated: "Superseded by Llama 3.3 70B",
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
const allProviders = [...new Set(freeModels.map(m => m.provider))];

export default function Settings() {
  const { hasAi, maskedKey, model: currentModel, updateSettings } = useAiSettings();
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState(currentModel);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [activeProviderFilter, setActiveProviderFilter] = useState<string | null>(null);

  const filteredModels = useMemo(() => {
    return freeModels.filter(m => {
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
  }, [modelSearch, activeTagFilter, activeProviderFilter]);

  const hasActiveFilter = !!modelSearch || !!activeTagFilter || !!activeProviderFilter;

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
    const settings = JSON.parse(localStorage.getItem("pylearn-ai-settings") || "{}");
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: "user", content: "Say 'Hello from PyLearn!' in exactly those words." }],
          max_tokens: 20,
        }),
      });
      if (!res.ok) throw new Error("API returned " + res.status);
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "No response";
      setStatus("success");
      setStatusMsg(`Connection successful! Model replied: "${reply.substring(0, 60)}"`);
    } catch {
      setStatus("error");
      setStatusMsg("Connection test failed. Check your API key and try again.");
    } finally {
      setTesting(false);
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
        {/* API Key Section */}
        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              API Key
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
              <Button variant="outline" onClick={testConnection} disabled={!hasAi || testing} className="gap-2 rounded-xl">
                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Model Selection */}
        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-display font-bold mb-1 flex items-center gap-2">
              <Bot className="w-5 h-5 text-secondary" />
              AI Model
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              All models below are free tier — $0.00 input and $0.00 output per token
            </p>

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
