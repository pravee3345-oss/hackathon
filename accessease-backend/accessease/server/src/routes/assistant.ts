import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { getSettings, type Lang } from "../db.js";
import { optionalAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { interpretRequest, toRawAction } from "../ai/interpretRequest.js";
import { t } from "../messages.js";
import {
  RawActionSchema, SERVICES, extractReference, normalizeService, sanitizeQuery, validateAction,
  type Action, type ServiceId,
} from "../safety/validateAction.js";
import { executeAction, planSteps, type AssistantResponse } from "../workflows/execute.js";

const router = Router();
router.use(optionalAuth);

/* ---------- conversation state (in memory, 10 min TTL) ---------- */
type Pending =
  | { type: "awaiting_reference"; tries: number }
  | { type: "awaiting_query"; service: ServiceId; tries: number }
  | { type: "awaiting_site"; query?: string; mode: "open" | "search"; tries: number }
  | { type: "awaiting_close_site"; tries: number };
const sessions = new Map<string, { pending: Pending; expires: number }>();
const TTL = 10 * 60 * 1000;

function getPending(id?: string): Pending | null {
  if (!id) return null;
  const s = sessions.get(id);
  if (!s || s.expires < Date.now()) { sessions.delete(id); return null; }
  return s.pending;
}
function setPending(id: string | undefined, pending: Pending) {
  if (id) sessions.set(id, { pending, expires: Date.now() + TTL });
}
function clearPending(id?: string) { if (id) sessions.delete(id); }

const CANCEL_RE = /^\s*(cancel|stop|start over|restart|reset|never ?mind|ரத்து|நிறுத்து)\b/i;

/* ---------- request schemas ---------- */
const ChatBody = z.object({
  message: z.string().trim().min(1).max(500),
  language: z.enum(["en", "ta"]).optional(),
  sessionId: z.string().max(64).optional(),
  pageContext: z.string().max(12000).optional(),
  client: z.enum(["browser-extension"]).optional(),
  preferences: z.object({ language: z.enum(["en", "ta"]).optional() }).passthrough().optional(),
});
const ConfirmBody = z.object({
  confirm: z.boolean(),
  action: RawActionSchema,
  language: z.enum(["en", "ta"]).optional(),
  sessionId: z.string().max(64).optional(),
  client: z.enum(["browser-extension"]).optional(),
});

function resolveLang(res: Response, body: { language?: Lang; preferences?: { language?: Lang } }): Lang {
  if (body.language) return body.language;
  if (body.preferences?.language) return body.preferences.language;
  const uid = res.locals.userId as number | undefined;
  return uid ? getSettings(uid).language : "en";
}

function isBrowserExtensionRequest(req: Request): boolean {
  return !!config.corsExtensionId
    && req.get("origin") === `chrome-extension://${config.corsExtensionId}`;
}

/** `reply` mirrors `message` so simple frontends can read either field. */
function send(res: Response, body: AssistantResponse, sessionId?: string, meta: Record<string, unknown> = {}) {
  res.json({ ...body, reply: body.message, sessionId, meta });
}

/** Turn a validated action into either a confirmation request or an immediate result. */
async function proceed(res: Response, action: Action, lang: Lang, sessionId: string | undefined, meta: Record<string, unknown>, client?: "browser-extension") {
  if (action.intent === "close_current_tab" && (client === "browser-extension" || !config.enablePlaywright)) {
    if (client !== "browser-extension") {
      return send(res, { status: "reply", message: t(lang, "closeTabExtensionOnly") }, sessionId, meta);
    }
    clearPending(sessionId);
    return send(res, {
      status: "needs_confirmation",
      message: t(lang, "confirmCloseTab"),
      action,
      steps: planSteps(action, lang),
    }, sessionId, meta);
  }
  if (action.intent === "close_website_tab" && !config.enablePlaywright) {
    return send(res, { status: "failed", message: t(lang, "managedBrowserDisabled"), action }, sessionId, meta);
  }
  if (action.intent === "close_current_tab" || action.intent === "close_website_tab") {
    clearPending(sessionId);
    return send(res, {
      status: "needs_confirmation",
      message: action.intent === "close_website_tab"
        ? t(lang, "confirmCloseWebsite", { site: SERVICES[action.service].label })
        : t(lang, "confirmCloseTab"),
      action,
      steps: planSteps(action, lang),
    }, sessionId, meta);
  }
  if (action.intent === "open_website" || action.intent === "search_website") {
    const site = SERVICES[action.service].label;
    clearPending(sessionId);
    return send(res, {
      status: "needs_confirmation",
      message: action.intent === "open_website"
        ? t(lang, "confirmOpen", { site })
        : t(lang, "confirmSearch", { site, query: action.query }),
      action,
      steps: planSteps(action, lang),
    }, sessionId, meta);
  }
  clearPending(sessionId);
  const result = await executeAction(action, lang);
  return send(res, { ...result, steps: planSteps(action, lang) }, sessionId, meta);
}

/* ---------- POST /chat ---------- */
router.post("/chat", asyncHandler(async (req, res) => {
  const p = ChatBody.safeParse(req.body);
  if (!p.success) {
    res.status(400).json({ status: "failed", error: "invalid_request", message: "Please type a message (up to 500 characters).", reply: "Please type a message (up to 500 characters)." });
    return;
  }
  const { message, sessionId } = p.data;
  const lang = resolveLang(res, p.data);

  // Cancel / start over works at any time
  if (CANCEL_RE.test(message)) {
    clearPending(sessionId);
    return send(res, { status: "reply", message: t(lang, "cancelled") }, sessionId);
  }

  // Continue a pending follow-up question
  const pending = getPending(sessionId);
  if (pending) {
    if (pending.tries >= 2) {
      clearPending(sessionId);
      return send(res, { status: "reply", message: t(lang, "tooMany") }, sessionId);
    }

    if (pending.type === "awaiting_reference") {
      const ref = extractReference(message);
      if (!ref) {
        setPending(sessionId, { ...pending, tries: pending.tries + 1 });
        return send(res, { status: "needs_info", message: t(lang, "badReference") }, sessionId);
      }
      return proceed(res, { intent: "check_demo_status", reference: ref }, lang, sessionId, { followUp: true });
    }

    if (pending.type === "awaiting_query") {
      const query = sanitizeQuery(message);
      return proceed(res, { intent: "search_website", service: pending.service, query }, lang, sessionId, { followUp: true });
    }

    if (pending.type === "awaiting_site") {
      const service = normalizeService(message.match(/\b(youtube|you tube|yt|google|wikipedia|wiki)\b/i)?.[1]?.replace(/\s/g, ""));
      if (!service) {
        setPending(sessionId, { ...pending, tries: pending.tries + 1 });
        return send(res, { status: "needs_info", message: t(lang, "unsupportedSite") }, sessionId);
      }
      if (pending.mode === "open") return proceed(res, { intent: "open_website", service }, lang, sessionId, { followUp: true });
      if (pending.query) return proceed(res, { intent: "search_website", service, query: pending.query }, lang, sessionId, { followUp: true });
      setPending(sessionId, { type: "awaiting_query", service, tries: 0 });
      return send(res, { status: "needs_info", message: t(lang, "askQuery", { site: SERVICES[service].label }) }, sessionId);
    }

    if (pending.type === "awaiting_close_site") {
      const site = message.match(/\b(youtube|you tube|yt|google|wikipedia|wiki)\b/i)?.[1];
      const service = normalizeService(site);
      if (!service) {
        setPending(sessionId, { ...pending, tries: pending.tries + 1 });
        return send(res, { status: "needs_info", message: t(lang, "unsupportedSite") }, sessionId);
      }
      return proceed(res, { intent: "close_website_tab", service }, lang, sessionId, { followUp: true });
    }
  }

  // New request: AI (or rule fallback) proposes, backend validates
  const interp = await interpretRequest(message, p.data.pageContext);
  const meta = { interpretedBy: interp.source };

  if (interp.intent === "page_question") {
    return send(res, {
      status: "reply",
      message: interp.answer || "I could not find that in the visible page text.",
    }, sessionId, meta);
  }
  if (interp.intent === "help") return send(res, { status: "reply", message: t(lang, "help") }, sessionId, meta);
  if (interp.intent === "unknown") {
    const message = p.data.pageContext && !config.aiConfigured
      ? "I received the visible page text, but answering questions about it requires an AI API key. Set GROQ_API_KEY or GEMINI_API_KEY in the backend server/.env and restart the backend. Open and search commands still work without an AI key."
      : p.data.pageContext
      ? "I could not answer from the visible page. The AI service may be unavailable; check the backend log and API key, or try asking about specific text shown on the page."
      : t(lang, "unknown");
    return send(res, { status: "reply", message }, sessionId, meta);
  }

  const v = validateAction(toRawAction(interp));
  if (v.ok) {
    const client = isBrowserExtensionRequest(req) ? "browser-extension" : undefined;
    return proceed(res, v.action, lang, sessionId, meta, client);
  }

  switch (v.reason) {
    case "missing_reference":
      setPending(sessionId, { type: "awaiting_reference", tries: 0 });
      return send(res, { status: "needs_info", message: t(lang, "askReference") }, sessionId, meta);
    case "missing_service":
      if (interp.intent === "close_website_tab") {
        setPending(sessionId, { type: "awaiting_close_site", tries: 0 });
        return send(res, { status: "needs_info", message: t(lang, "askCloseSite") }, sessionId, meta);
      }
      setPending(sessionId, {
        type: "awaiting_site",
        mode: interp.intent === "search_website" ? "search" : "open",
        query: sanitizeQuery(interp.query) || undefined,
        tries: 0,
      });
      return send(res, { status: "needs_info", message: t(lang, "askSite") }, sessionId, meta);
    case "missing_query": {
      const service = normalizeService(interp.service);
      if (service) setPending(sessionId, { type: "awaiting_query", service, tries: 0 });
      return send(res, { status: "needs_info", message: t(lang, "askQuery", { site: service ? SERVICES[service].label : "" }) }, sessionId, meta);
    }
    case "unsupported_service":
      return send(res, { status: "failed", message: t(lang, "unsupportedSite") }, sessionId, meta);
    default:
      return send(res, { status: "reply", message: t(lang, "unknown") }, sessionId, meta);
  }
}));

/* ---------- POST /confirm : user answered "yes/no" to a needs_confirmation ---------- */
router.post("/confirm", asyncHandler(async (req, res) => {
  const p = ConfirmBody.safeParse(req.body);
  if (!p.success) {
    res.status(400).json({ status: "failed", error: "invalid_request", message: "Invalid confirmation." });
    return;
  }
  const lang = resolveLang(res, p.data);
  if (!p.data.confirm) return send(res, { status: "reply", message: t(lang, "cancelled") }, p.data.sessionId);

  // The action sent by the browser is NOT trusted - it is validated again from scratch.
  const v = validateAction(p.data.action);
  if (!v.ok) return send(res, { status: "failed", message: t(lang, "unsupportedSite") }, p.data.sessionId);

  if (v.action.intent === "close_current_tab" && (!config.enablePlaywright || isBrowserExtensionRequest(req))) {
    if (!isBrowserExtensionRequest(req)) {
      return send(res, { status: "failed", message: t(lang, "closeTabExtensionOnly") }, p.data.sessionId);
    }
    return send(res, {
      status: "reply",
      message: t(lang, "closingTab"),
      action: v.action,
      closeTab: true,
      steps: planSteps(v.action, lang),
    }, p.data.sessionId);
  }

  const isManagedBrowserAction = v.action.intent === "close_current_tab"
    || v.action.intent === "close_website_tab"
    || v.action.intent === "list_open_tabs";
  const usePlaywright = isManagedBrowserAction
    ? config.enablePlaywright
    : p.data.client === "browser-extension" ? false : config.enablePlaywright;
  const result = await executeAction(v.action, lang, usePlaywright);
  send(res, { ...result, steps: planSteps(v.action, lang) }, p.data.sessionId);
}));

export default router;
