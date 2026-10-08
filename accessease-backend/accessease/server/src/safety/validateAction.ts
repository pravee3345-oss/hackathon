import { z } from "zod";

/**
 * ALLOW-LIST. The AI never supplies URLs - it can only name a service id.
 * All URLs and selectors come from this table.
 */
export const SERVICES = {
  youtube: {
    label: "YouTube",
    home: "https://www.youtube.com/",
    search: (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
    searchInput: 'input[name="search_query"]',
    resultsUrl: /youtube\.com\/results/,
  },
  google: {
    label: "Google",
    home: "https://www.google.com/",
    search: (q: string) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    searchInput: 'textarea[name="q"], input[name="q"]',
    resultsUrl: /google\.[a-z.]+\/search/,
  },
  wikipedia: {
    label: "Wikipedia",
    home: "https://en.wikipedia.org/",
    search: (q: string) => `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(q)}`,
    searchInput: 'input[name="search"]',
    resultsUrl: /wikipedia\.org\/(w\/index\.php|wiki\/)/,
  },
} as const;

export type ServiceId = keyof typeof SERVICES;

const ALIASES: Record<string, ServiceId> = {
  youtube: "youtube", yt: "youtube", youtub: "youtube",
  google: "google", googlesearch: "google",
  wikipedia: "wikipedia", wiki: "wikipedia",
};

export function normalizeService(raw?: string | null): ServiceId | null {
  if (!raw) return null;
  return ALIASES[raw.toLowerCase().replace(/[^a-z]/g, "")] ?? null;
}

export function sanitizeQuery(raw?: string | null): string {
  return (raw ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

export const REFERENCE_RE = /\bAE-?(\d{4})\b/i;
export function extractReference(text?: string | null): string | null {
  const m = text?.match(REFERENCE_RE);
  return m ? `AE-${m[1]}` : null;
}

export type Action =
  | { intent: "open_website"; service: ServiceId }
  | { intent: "search_website"; service: ServiceId; query: string }
  | { intent: "close_website_tab"; service: ServiceId }
  | { intent: "close_current_tab" }
  | { intent: "list_open_tabs" }
  | { intent: "go_back" }
  | { intent: "scroll_page"; direction: "up" | "down" }
  | { intent: "check_demo_status"; reference: string };

export const RawActionSchema = z.object({
  intent: z.string().max(40),
  service: z.string().max(40).nullish(),
  query: z.string().max(300).nullish(),
  reference: z.string().max(20).nullish(),
  direction: z.enum(["up", "down"]).nullish(),
});
export type RawAction = z.infer<typeof RawActionSchema>;

export type ValidationResult =
  | { ok: true; action: Action }
  | { ok: false; reason: "unsupported_intent" | "unsupported_service" | "missing_service" | "missing_query" | "missing_reference" };

export function validateAction(raw: RawAction): ValidationResult {
  switch (raw.intent) {
    case "close_current_tab":
      return { ok: true, action: { intent: "close_current_tab" } };
    case "list_open_tabs":
      return { ok: true, action: { intent: "list_open_tabs" } };
    case "go_back":
      return { ok: true, action: { intent: "go_back" } };
    case "scroll_page":
      if (raw.direction !== "up" && raw.direction !== "down") {
        return { ok: false, reason: "unsupported_intent" };
      }
      return { ok: true, action: { intent: "scroll_page", direction: raw.direction } };
    case "close_website_tab": {
      if (!raw.service) return { ok: false, reason: "missing_service" };
      const service = normalizeService(raw.service);
      if (!service) return { ok: false, reason: "unsupported_service" };
      return { ok: true, action: { intent: "close_website_tab", service } };
    }
    case "open_website": {
      if (!raw.service) return { ok: false, reason: "missing_service" };
      const service = normalizeService(raw.service);
      if (!service) return { ok: false, reason: "unsupported_service" };
      return { ok: true, action: { intent: "open_website", service } };
    }
    case "search_website": {
      if (!raw.service) return { ok: false, reason: "missing_service" };
      const service = normalizeService(raw.service);
      if (!service) return { ok: false, reason: "unsupported_service" };
      const query = sanitizeQuery(raw.query);
      if (!query) return { ok: false, reason: "missing_query" };
      return { ok: true, action: { intent: "search_website", service, query } };
    }
    case "check_demo_status": {
      const reference = extractReference(raw.reference);
      if (!reference) return { ok: false, reason: "missing_reference" };
      return { ok: true, action: { intent: "check_demo_status", reference } };
    }
    default:
      return { ok: false, reason: "unsupported_intent" };
  }
}
