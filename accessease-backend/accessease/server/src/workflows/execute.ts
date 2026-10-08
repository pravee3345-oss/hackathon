import { config } from "../config.js";
import type { Lang } from "../db.js";
import { t } from "../messages.js";
import { SERVICES, type Action } from "../safety/validateAction.js";
import { closeManagedTab, goBack, listOpenTabs, openSite, scrollPage, searchSite } from "../automation/browser.js";
import { lookupApplication } from "./demoApplicationStatus.js";

export type Status = "reply" | "needs_info" | "needs_confirmation" | "success" | "failed";

export interface AssistantResponse {
  status: Status;
  message: string;
  action?: Record<string, unknown>;
  steps?: string[];
  /** When set (and Playwright is off), the frontend should open this URL in a new tab */
  openUrl?: string;
  closeTab?: boolean;
  data?: Record<string, unknown>;
}

export function planSteps(action: Action, lang: Lang): string[] {
  if (action.intent === "close_current_tab") {
    return [t(lang, "confirmCloseTab")];
  }
  if (action.intent === "close_website_tab") {
    return [t(lang, "confirmCloseWebsite", { site: SERVICES[action.service].label })];
  }
  if (action.intent === "list_open_tabs") return [t(lang, "stepListTabs")];
  if (action.intent === "go_back") return [t(lang, "stepGoBack")];
  if (action.intent === "scroll_page") return [t(lang, "stepScroll", { direction: action.direction })];
  if (action.intent === "open_website") {
    const site = SERVICES[action.service].label;
    return [t(lang, "stepOpen", { site }), t(lang, "stepVerify")];
  }
  if (action.intent === "search_website") {
    const site = SERVICES[action.service].label;
    return [t(lang, "stepOpen", { site }), t(lang, "stepSearch", { site, query: action.query }), t(lang, "stepVerify")];
  }
  return [t(lang, "stepLookup", { ref: action.reference }), t(lang, "stepExplain")];
}

/** Executes an ALREADY-VALIDATED action. Reports failure honestly; never fakes success. */
export async function executeAction(action: Action, lang: Lang, usePlaywright = config.enablePlaywright): Promise<AssistantResponse> {
  try {
    if (action.intent === "check_demo_status") {
      const r = lookupApplication(action.reference, lang);
      if (!r.found) return { status: "failed", message: t(lang, "notFound", { ref: action.reference }), action };
      return { status: "success", message: r.message, action, data: r.record };
    }

    if (action.intent === "list_open_tabs") {
      if (!usePlaywright) return { status: "failed", message: t(lang, "managedBrowserDisabled"), action };
      const tabs = await listOpenTabs();
      return {
        status: "success",
        message: tabs.length
          ? `${t(lang, "openTabsHeader")}\n${tabs.map((tab) => `- ${tab.title || SERVICES[tab.service].label} (${tab.url})`).join("\n")}`
          : t(lang, "noOpenTabs"),
        action,
        data: { tabs },
      };
    }

    if (action.intent === "go_back" || action.intent === "scroll_page") {
      if (!usePlaywright) return { status: "failed", message: t(lang, "managedBrowserDisabled"), action };
      if (action.intent === "go_back") {
        const navigated = await goBack();
        return navigated
          ? { status: "success", message: t(lang, "wentBack"), action }
          : { status: "failed", message: t(lang, "noPreviousPage"), action };
      }
      const scrolled = await scrollPage(action.direction);
      return scrolled
        ? { status: "success", message: t(lang, "scrolledPage", { direction: action.direction }), action }
        : { status: "failed", message: t(lang, "managedPageNotFound"), action };
    }

    if (action.intent === "close_current_tab" || action.intent === "close_website_tab") {
      if (!usePlaywright) return { status: "failed", message: t(lang, "managedBrowserDisabled"), action };
      const service = action.intent === "close_website_tab" ? action.service : undefined;
      const closed = await closeManagedTab(service);
      if (!closed) {
        return {
          status: "failed",
          message: action.intent === "close_website_tab"
            ? t(lang, "tabNotFound", { site: SERVICES[action.service].label })
            : t(lang, "currentTabNotFound"),
          action,
        };
      }
      return {
        status: "success",
        message: action.intent === "close_website_tab"
          ? t(lang, "closedWebsite", { site: SERVICES[action.service].label })
          : t(lang, "closedCurrentTab"),
        action,
      };
    }

    const svc = SERVICES[action.service];
    const site = svc.label;

    if (action.intent === "open_website") {
      if (usePlaywright) {
        await openSite(action.service);
        return { status: "success", message: t(lang, "done", { site }), action };
      }
      return { status: "success", message: t(lang, "opening", { site }), action, openUrl: svc.home };
    }

    // search_website
    if (usePlaywright) {
      await searchSite(action.service, action.query);
      return { status: "success", message: t(lang, "doneSearch", { site, query: action.query }), action };
    }
    return { status: "success", message: t(lang, "searching", { site, query: action.query }), action, openUrl: svc.search(action.query) };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("[workflow] failed:", error.message);
    const disconnected = /disconnect|browser.*closed|target.*closed/i.test(error.message);
    return { status: "failed", message: t(lang, disconnected ? "browserDisconnected" : "failed"), action };
  }
}
