import "dotenv/config";
import crypto from "node:crypto";
import path from "node:path";

const isProd = process.env.NODE_ENV === "production";
const corsExtensionId = process.env.CORS_EXTENSION_ID?.trim() ?? "";
if (corsExtensionId && !/^[a-p]{32}$/.test(corsExtensionId)) {
  throw new Error("CORS_EXTENSION_ID must be a 32-character Chrome extension ID.");
}

let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  if (isProd) throw new Error("JWT_SECRET must be set in production");
  jwtSecret = crypto.randomBytes(32).toString("hex");
  console.warn("[config] JWT_SECRET not set - using a temporary secret (logins reset on restart).");
}

const groqKey = process.env.GROQ_API_KEY?.trim() ?? "";
const geminiKey = process.env.GEMINI_API_KEY?.trim() ?? "";

export const config = {
  isProd,
  port: Number(process.env.PORT ?? 5001),
  jwtSecret,
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5500,http://127.0.0.1:5500,http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  corsExtensionId,
  groqKey,
  groqModel: process.env.GROQ_MODEL ?? "openai/gpt-oss-120b",
  geminiKey,
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-3.7-flash",
  aiConfigured: !!(groqKey || geminiKey),
  enablePlaywright: process.env.ENABLE_PLAYWRIGHT === "true",
  dbPath: process.env.SQLITE_PATH ?? "./data/accessease.db",
  extensionPath: process.env.EXTENSION_PATH?.trim()
    ? path.resolve(process.env.EXTENSION_PATH.trim())
    : "",
  playwrightUserDataDir: path.resolve(process.env.PLAYWRIGHT_USER_DATA_DIR?.trim() || "./data/playwright-profile"),
};
