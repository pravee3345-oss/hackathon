import assert from "node:assert/strict";
import Database from "better-sqlite3";
import { after, test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const previousSqlitePath = process.env.SQLITE_PATH;
const previousJwtSecret = process.env.JWT_SECRET;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "accessease-settings-"));
const dbPath = path.join(tempDir, "settings.db");

const legacyDb = new Database(dbPath);
legacyDb.exec(`
  CREATE TABLE settings (
    user_id INTEGER PRIMARY KEY,
    language TEXT NOT NULL DEFAULT 'en',
    large_text INTEGER NOT NULL DEFAULT 0,
    high_contrast INTEGER NOT NULL DEFAULT 0,
    voice_output INTEGER NOT NULL DEFAULT 0
  );
`);
legacyDb.close();

process.env.SQLITE_PATH = dbPath;
process.env.JWT_SECRET = "test-only-access-ease-secret";

const { db, getSettings, saveSettings } = await import("./db.js");

after(() => {
  db.close();
  fs.rmSync(tempDir, { recursive: true, force: true });
  if (previousSqlitePath === undefined) delete process.env.SQLITE_PATH;
  else process.env.SQLITE_PATH = previousSqlitePath;
  if (previousJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = previousJwtSecret;
});

test("migrates existing settings and persists the hands-free preference", () => {
  const result = db.prepare(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)"
  ).run("Test User", "hands-free-test@example.invalid", "not-used");
  const userId = Number(result.lastInsertRowid);

  assert.deepEqual(getSettings(userId), {
    language: "en",
    largeText: false,
    highContrast: false,
    voiceOutput: false,
    handsFreeVoice: false,
  });

  const updated = saveSettings(userId, { handsFreeVoice: true });
  assert.equal(updated.handsFreeVoice, true);
  assert.equal(getSettings(userId).handsFreeVoice, true);
});
