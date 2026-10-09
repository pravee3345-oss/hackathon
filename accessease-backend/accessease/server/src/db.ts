import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";

fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
export const db = new Database(config.dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS settings (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  language TEXT NOT NULL DEFAULT 'en',
  large_text INTEGER NOT NULL DEFAULT 0,
  high_contrast INTEGER NOT NULL DEFAULT 0,
  voice_output INTEGER NOT NULL DEFAULT 0,
  hands_free_voice INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS demo_applications (
  reference TEXT PRIMARY KEY,
  applicant_name TEXT NOT NULL,
  scholarship TEXT NOT NULL,
  status TEXT NOT NULL,
  details_en TEXT NOT NULL,
  details_ta TEXT NOT NULL
);
`);

const settingsColumns = db.prepare("PRAGMA table_info(settings)").all() as Array<{ name: string }>;
if (!settingsColumns.some((column) => column.name === "hands_free_voice")) {
  db.exec("ALTER TABLE settings ADD COLUMN hands_free_voice INTEGER NOT NULL DEFAULT 0");
}

// Fictional demo records only (Workflow C). No real personal data.
const count = db.prepare("SELECT COUNT(*) AS c FROM demo_applications").get() as { c: number };
if (count.c === 0) {
  const ins = db.prepare(
    "INSERT INTO demo_applications (reference, applicant_name, scholarship, status, details_en, details_ta) VALUES (?,?,?,?,?,?)"
  );
  ins.run("AE-1001", "Demo Student A", "Inclusive Learning Scholarship", "Approved",
    "Your scholarship is approved. Funds will arrive in 5 working days.",
    "உங்கள் உதவித்தொகை அங்கீகரிக்கப்பட்டது. 5 வேலை நாட்களில் பணம் வந்துசேரும்.");
  ins.run("AE-1002", "Demo Student B", "Inclusive Learning Scholarship", "Under Review",
    "Your application is being reviewed. This usually takes 7 to 10 days.",
    "உங்கள் விண்ணப்பம் பரிசீலனையில் உள்ளது. இதற்கு பொதுவாக 7 முதல் 10 நாட்கள் ஆகும்.");
  ins.run("AE-1003", "Demo Student C", "Inclusive Learning Scholarship", "Documents Needed",
    "Please upload your income certificate to continue.",
    "தொடர்வதற்கு உங்கள் வருமானச் சான்றிதழைப் பதிவேற்றவும்.");
}

export type Lang = "en" | "ta";
export interface Settings {
  language: Lang;
  largeText: boolean;
  highContrast: boolean;
  voiceOutput: boolean;
  handsFreeVoice: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  language: "en",
  largeText: false,
  highContrast: false,
  voiceOutput: false,
  handsFreeVoice: false,
};

export function getSettings(userId: number): Settings {
  const r = db.prepare("SELECT * FROM settings WHERE user_id = ?").get(userId) as
    | { language: Lang; large_text: number; high_contrast: number; voice_output: number; hands_free_voice: number }
    | undefined;
  if (!r) return { ...DEFAULT_SETTINGS };
  return {
    language: r.language,
    largeText: !!r.large_text,
    highContrast: !!r.high_contrast,
    voiceOutput: !!r.voice_output,
    handsFreeVoice: !!r.hands_free_voice,
  };
}

export function saveSettings(userId: number, patch: Partial<Settings>): Settings {
  const next = { ...getSettings(userId), ...patch };
  db.prepare(
    `INSERT INTO settings (user_id, language, large_text, high_contrast, voice_output, hands_free_voice) VALUES (?,?,?,?,?,?)
     ON CONFLICT(user_id) DO UPDATE SET language=excluded.language, large_text=excluded.large_text,
       high_contrast=excluded.high_contrast, voice_output=excluded.voice_output, hands_free_voice=excluded.hands_free_voice`
  ).run(userId, next.language, +next.largeText, +next.highContrast, +next.voiceOutput, +next.handsFreeVoice);
  return next;
}
