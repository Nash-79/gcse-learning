import { Router, type Request, type Response } from "express";
import { fetchOpenRouterModels, resolveApiKey } from "./openrouter.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const refresh = req.query.refresh === "1";
    const freeOnly = req.query.freeOnly !== "0";
    const apiKey = resolveApiKey(req);
    const models = await fetchOpenRouterModels({
      apiKey: apiKey || undefined,
      refresh,
      freeOnly,
    });
    res.json({ models, count: models.length, cached: !refresh });
  } catch (error: any) {
    res.status(500).json({
      error: error?.message || "Failed to fetch OpenRouter models",
      models: [],
    });
  }
});

export { router as openrouterModelsRouter };
