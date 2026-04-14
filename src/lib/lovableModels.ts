export interface LovableModel {
  id: string;
  name: string;
  description: string;
}

export const LOVABLE_AI_MODELS: LovableModel[] = [
  {
    id: "google/gemini-3-flash-preview",
    name: "Gemini 3 Flash (Fast)",
    description: "Fast, balanced speed and capability",
  },
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Good multimodal + reasoning, lower cost",
  },
  {
    id: "google/gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    description: "Fastest and cheapest, good for simple tasks",
  },
  {
    id: "google/gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "Top-tier reasoning and complex tasks",
  },
  {
    id: "google/gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro (Preview)",
    description: "Latest next-gen reasoning model",
  },
];

export const DEFAULT_LOVABLE_MODEL = "google/gemini-3-flash-preview";
