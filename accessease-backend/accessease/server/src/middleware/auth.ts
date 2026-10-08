import type { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function signToken(userId: number): string {
  return jwt.sign({ sub: String(userId) }, config.jwtSecret, { expiresIn: "7d" });
}

function readUserId(req: Request): number | null {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) return null;
  try {
    const p = jwt.verify(h.slice(7), config.jwtSecret) as jwt.JwtPayload;
    const id = Number(p.sub);
    return Number.isInteger(id) ? id : null;
  } catch {
    return null;
  }
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const id = readUserId(req);
  if (!id) {
    res.status(401).json({ error: "Please log in to continue." });
    return;
  }
  res.locals.userId = id;
  next();
};

export const optionalAuth: RequestHandler = (req, res, next) => {
  const id = readUserId(req);
  if (id) res.locals.userId = id;
  next();
};
