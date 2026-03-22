import express from "express";
import cors from "cors";
import path from "path";
import { aiChatRouter } from "./routes/aiChat.js";
import { gcseChatRouter } from "./routes/gcseChat.js";
import { markAnswerRouter } from "./routes/markAnswer.js";

const app = express();
const isProd = process.env.NODE_ENV === "production";
const PORT = parseInt(process.env.PORT || (isProd ? "5000" : "3001"), 10);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/api/ai-chat", aiChatRouter);
app.use("/api/gcse-chat", gcseChatRouter);
app.use("/api/mark-answer", markAnswerRouter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

if (isProd) {
  const distPath = path.join(process.cwd(), "dist", "public");
  app.use(express.static(distPath));
  app.get("*path", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} [${isProd ? "production" : "development"}]`);
});
