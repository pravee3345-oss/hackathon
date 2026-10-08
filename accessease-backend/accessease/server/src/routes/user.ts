import { Router } from "express";
import { z } from "zod";
import { db, getSettings, saveSettings } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const SettingsPatch = z
  .object({
    language: z.enum(["en", "ta"]),
    largeText: z.boolean(),
    highContrast: z.boolean(),
    voiceOutput: z.boolean(),
  })
  .partial();

router.get("/me", (_req, res) => {
  const id = res.locals.userId as number;
  const u = db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(id);
  if (!u) {
    res.status(404).json({ error: "User not found." });
    return;
  }
  res.json({ user: u, settings: getSettings(id) });
});

router.get("/settings", (_req, res) => {
  res.json({ settings: getSettings(res.locals.userId as number) });
});

router.put("/settings", (req, res) => {
  const p = SettingsPatch.safeParse(req.body);
  if (!p.success) {
    res.status(400).json({ error: "Invalid settings.", details: p.error.flatten().fieldErrors });
    return;
  }
  res.json({ settings: saveSettings(res.locals.userId as number, p.data) });
});

export default router;
