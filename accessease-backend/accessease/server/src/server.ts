import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import "./db.js";
import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import assistantRoutes from "./routes/assistant.js";
import { closeBrowser } from "./automation/browser.js";

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, cb) {
      // No origin = curl/Postman. "null" = frontend opened via file:// (dev only).
      let localDevelopmentOrigin = false;
      if (!config.isProd && origin) {
        try {
          const url = new URL(origin);
          localDevelopmentOrigin = url.protocol === "http:"
            && ["localhost", "127.0.0.1"].includes(url.hostname);
        } catch {
          localDevelopmentOrigin = false;
        }
      }
      const extensionOrigin = config.corsExtensionId
        ? `chrome-extension://${config.corsExtensionId}`
        : null;
      if (!origin || config.corsOrigins.includes(origin) || origin === extensionOrigin || localDevelopmentOrigin || (!config.isProd && origin === "null")) return cb(null, true);
      cb(new Error(`Origin not allowed: ${origin}`));
    },
  })
);
app.use(express.json({ limit: "50kb" }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false, message: { error: "Too many attempts. Please wait a few minutes." } });
const aiLimiter = rateLimit({ windowMs: 60 * 1000, limit: 40, standardHeaders: true, legacyHeaders: false, message: { status: "failed", message: "You are sending requests too quickly. Please wait a moment." } });

app.use("/api", healthRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/assistant", aiLimiter, assistantRoutes);
app.use("/api/ai", aiLimiter, assistantRoutes); // alias: README expects POST /api/ai/chat

app.use("/api", (_req, res) => { res.status(404).json({ error: "Not found" }); });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[error]", err.message);
  res.status(err.message.startsWith("Origin not allowed") ? 403 : 500).json({
    error: config.isProd ? "Something went wrong." : err.message,
  });
});

const server = app.listen(config.port, () => {
  console.log(`AccessEase API running on http://localhost:${config.port}/api`);
  const aiProvider = config.groqKey
    ? `Groq (${config.groqModel})`
    : config.geminiKey
      ? `Gemini (${config.geminiModel})`
      : "rule-based fallback (no AI API key)";
  console.log(`  AI: ${aiProvider}`);
  console.log(`  Playwright: ${config.enablePlaywright ? "enabled" : "disabled (frontend opens links)"}`);
});

async function shutdown() {
  server.close();
  await closeBrowser();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
