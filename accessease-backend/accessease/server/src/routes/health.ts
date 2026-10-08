import { Router } from "express";
import { config } from "../config.js";

const router = Router();
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    aiConfigured: config.aiConfigured,
    aiProvider: config.groqKey ? "groq" : config.geminiKey ? "gemini" : "rules",
    playwrightEnabled: config.enablePlaywright,
    extensionConfigured: !!config.extensionPath,
  });
});
export default router;
