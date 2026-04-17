import { Router } from "express";
import path from "node:path";
import { existsSync } from "node:fs";

export const contentLibraryRouter = Router();

const CONTENT_LIBRARY_ROOT = path.resolve(process.cwd(), "content-library");

contentLibraryRouter.get("/", (req, res) => {
  const file = typeof req.query.file === "string" ? req.query.file : "";
  const download = req.query.download === "1";

  if (!file) {
    res.status(400).json({ error: "Missing file query parameter." });
    return;
  }

  const normalized = path.normalize(file).replace(/^([/\\])+/, "");
  const resolved = path.resolve(CONTENT_LIBRARY_ROOT, normalized);

  if (!resolved.startsWith(CONTENT_LIBRARY_ROOT)) {
    res.status(400).json({ error: "Invalid content-library path." });
    return;
  }

  if (!existsSync(resolved)) {
    res.status(404).json({ error: "Content-library file not found." });
    return;
  }

  if (download) {
    res.download(resolved);
    return;
  }

  res.sendFile(resolved, {
    headers: {
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
    },
  });
});
