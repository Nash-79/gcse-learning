import express from "express";
import cors from "cors";
import path from "path";
import { existsSync } from "fs";
import { aiChatRouter } from "./routes/aiChat.js";
import { gcseChatRouter } from "./routes/gcseChat.js";
import { markAnswerRouter } from "./routes/markAnswer.js";
import { openrouterModelsRouter } from "./routes/openrouterModels.js";
import { contentLibraryRouter } from "./routes/contentLibrary.js";

const app = express();

// In dev: Express runs on 3001 (Vite on 5000 proxies /api → 3001)
// In prod (deployed): Replit sets PORT, or default to 5000
const PORT = parseInt(process.env.PORT || "3001", 10);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/api/ai-chat", aiChatRouter);
app.use("/api/gcse-chat", gcseChatRouter);
app.use("/api/mark-answer", markAnswerRouter);
app.use("/api/openrouter/models", openrouterModelsRouter);
app.use("/api/content-library", contentLibraryRouter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Serve the frontend if the built static files are present.
// In dev: dist/public doesn't exist, so this block is skipped.
// In production: build-server.mjs places files there before deploy.
const distPublic = path.join(process.cwd(), "dist", "public");
if (existsSync(path.join(distPublic, "index.html"))) {
  console.log(`Serving static frontend from ${distPublic}`);
  app.use(express.static(distPublic));
  app.get("*path", (_req, res) => {
    res.sendFile(path.join(distPublic, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
