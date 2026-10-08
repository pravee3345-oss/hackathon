import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db, getSettings, saveSettings } from "../db.js";
import { signToken } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

const RegisterBody = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(120),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  language: z.enum(["en", "ta"]).optional(),
});
const LoginBody = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(100),
});

interface UserRow { id: number; name: string; email: string; password_hash: string }

router.post("/register", asyncHandler(async (req, res) => {
  const p = RegisterBody.safeParse(req.body);
  if (!p.success) {
    res.status(400).json({ error: p.error.issues[0]?.message ?? "Invalid input", details: p.error.flatten().fieldErrors });
    return;
  }
  const { name, email, password, language } = p.data;
  const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (exists) {
    res.status(409).json({ error: "An account with this email already exists." });
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  const info = db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?,?,?)").run(name, email, hash);
  const id = Number(info.lastInsertRowid);
  const settings = saveSettings(id, language ? { language } : {});
  res.status(201).json({ token: signToken(id), user: { id, name, email }, settings });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const p = LoginBody.safeParse(req.body);
  if (!p.success) {
    res.status(400).json({ error: "Enter your email and password." });
    return;
  }
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(p.data.email) as UserRow | undefined;
  // Same message for unknown email and wrong password (don't reveal which accounts exist)
  const ok = row ? await bcrypt.compare(p.data.password, row.password_hash) : false;
  if (!row || !ok) {
    res.status(401).json({ error: "Incorrect email or password." });
    return;
  }
  res.json({
    token: signToken(row.id),
    user: { id: row.id, name: row.name, email: row.email },
    settings: getSettings(row.id),
  });
}));

export default router;
