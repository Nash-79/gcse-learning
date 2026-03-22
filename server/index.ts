import express from "express";
import cors from "cors";
import { aiChatRouter } from "./routes/aiChat.js";
import { gcseChatRouter } from "./routes/gcseChat.js";
import { markAnswerRouter } from "./routes/markAnswer.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/api/ai-chat", aiChatRouter);
app.use("/api/gcse-chat", gcseChatRouter);
app.use("/api/mark-answer", markAnswerRouter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server running on port ${PORT}`);
});
