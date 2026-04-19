import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";

function toDollar(value?: string | number | null): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "$0.00";
  return `$${n.toFixed(6)}`;
}

function isFreeModel(raw: any): boolean {
  const id = String(raw?.id || "");
  if (id.endsWith(":free")) return true;
  const prompt = Number(raw?.pricing?.prompt ?? NaN);
  const completion = Number(raw?.pricing?.completion ?? NaN);
  if (Number.isFinite(prompt) && Number.isFinite(completion)) {
    return prompt === 0 && completion === 0;
  }
  return false;
}

function mapModel(raw: any) {
  return {
    id: String(raw?.id || ""),
    name: String(raw?.name || raw?.id || "Unknown"),
    provider: String(raw?.top_provider?.name || raw?.provider?.name || "OpenRouter"),
    description: String(raw?.description || ""),
    contextWindow: Number(raw?.context_length || 0),
    maxOutput:
      typeof raw?.top_provider?.max_completion_tokens === "number"
        ? raw.top_provider.max_completion_tokens
        : null,
    inputPrice: toDollar(raw?.pricing?.prompt),
    outputPrice: toDollar(raw?.pricing?.completion),
    tags: Array.isArray(raw?.architecture?.modality) ? raw.architecture.modality : [],
    architecture: String(raw?.architecture?.input_modalities?.join("+") || "text -> text"),
    tokenizer: String(raw?.architecture?.tokenizer || "Unknown"),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = (Deno.env.get("OPENROUTER_API_KEY") || "").trim();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "HTTP-Referer": "https://gcse-pylearn.lovable.app",
      "X-Title": "PyLearn",
    };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const upstream = await fetch(OPENROUTER_MODELS_URL, { headers });
    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("OpenRouter models upstream error:", upstream.status, text.slice(0, 240));
      return new Response(
        JSON.stringify({
          error: `OpenRouter models API failed: ${upstream.status}`,
          models: [],
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload = await upstream.json();
    const rawModels = Array.isArray(payload?.data) ? payload.data : [];
    const models = rawModels
      .filter(isFreeModel)
      .map(mapModel)
      .filter((m: { id: string }) => m.id);

    return new Response(
      JSON.stringify({ models, count: models.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("openrouter-models error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
        models: [],
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
