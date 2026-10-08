import { SERVICES, type ServiceId } from "../safety/validateAction.js";
import { config } from "../config.js";

interface SearchInput {
  fill(value: string, options?: { timeout?: number }): Promise<void>;
  press(key: string): Promise<void>;
}

interface LocatorLike {
  first(): SearchInput;
  waitFor(options?: { state?: "attached"; timeout?: number }): Promise<void>;
  evaluate<T>(fn: (element: HTMLElement) => T): Promise<T>;
}

interface PageLike {
  goto(url: string, options?: { waitUntil?: "domcontentloaded"; timeout?: number }): Promise<unknown>;
  goBack(options?: { waitUntil?: "domcontentloaded"; timeout?: number }): Promise<unknown | null>;
  url(): string;
  title(): Promise<string>;
  isClosed(): boolean;
  close(): Promise<void>;
  setDefaultTimeout(timeout: number): void;
  locator(selector: string): LocatorLike;
  waitForURL(url: RegExp, options?: { timeout?: number }): Promise<void>;
}

interface BrowserContextLike {
  newPage(): Promise<PageLike>;
  pages(): PageLike[];
}

interface BrowserLike {
  newContext(): Promise<BrowserContextLike>;
  isConnected(): boolean;
  on(event: "disconnected", listener: () => void): void;
  close(): Promise<void>;
}

export interface ManagedTab {
  service: ServiceId;
  url: string;
  title: string;
  assistantWidget: AssistantWidgetState | null;
}

export interface AssistantWidgetState {
  visible: boolean;
  position: string;
  right: string;
  bottom: string;
  visibility: string;
  width: number;
  height: number;
  zIndex: string;
  toggleVisible: boolean;
  toggleInteractive: boolean;
  toggleWidth: number;
  toggleHeight: number;
  panelPresent: boolean;
  statusText: string;
}

export function createBrowserController(
  launch: () => Promise<BrowserLike>,
  extensionConfigured: () => boolean = () => false,
) {
  let browser: BrowserLike | null = null;
  let browserPromise: Promise<BrowserLike> | null = null;
  let context: BrowserContextLike | null = null;
  let contextPromise: Promise<BrowserContextLike> | null = null;
  let keepAlivePage: PageLike | null = null;
  let disconnected = false;
  const managedPages = new Map<PageLike, ServiceId>();

  async function getBrowser(): Promise<BrowserLike> {
    if (browser) {
      if (browser.isConnected()) return browser;
      browser = null;
      browserPromise = null;
      context = null;
      contextPromise = null;
      keepAlivePage = null;
      managedPages.clear();
      disconnected = true;
    }
    if (browserPromise) return browserPromise;

    const pending = launch().then((instance) => {
      browser = instance;
      disconnected = false;
      instance.on("disconnected", () => {
        if (browser !== instance) return;
        disconnected = true;
        browser = null;
        browserPromise = null;
        context = null;
        contextPromise = null;
        keepAlivePage = null;
        managedPages.clear();
      });
      return instance;
    }).catch((error: unknown) => {
      if (browserPromise === pending) browserPromise = null;
      throw error;
    });
    browserPromise = pending;
    return pending;
  }

  async function getContext(): Promise<BrowserContextLike> {
    if (context) return context;
    if (contextPromise) return contextPromise;

    const pending = getBrowser().then((instance) => instance.newContext()).then((created) => {
      context = created;
      return created;
    }).catch((error: unknown) => {
      if (contextPromise === pending) contextPromise = null;
      throw error;
    });
    contextPromise = pending;
    return pending;
  }

  async function navigate(service: ServiceId, url: string): Promise<void> {
    const page = await (await getContext()).newPage();
    try {
      page.setDefaultTimeout(15_000);
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    } catch (error) {
      if (!page.isClosed()) {
        try {
          await page.close();
        } catch (closeError) {
          console.warn("[browser] failed to close page after navigation error:", closeError);
        }
      }
      throw error;
    }

    managedPages.set(page, service);
    if (extensionConfigured()) {
      const widget = await inspectAssistantWidget(page, 15_000);
      if (!widget.visible || !widget.toggleInteractive) {
        throw new Error("The AccessEase extension assistant did not render as a visible, interactive widget.");
      }
    }
  }

  async function inspectAssistantWidget(page: PageLike, timeout = 5_000): Promise<AssistantWidgetState> {
    const root = page.locator("#accessease-extension-root");
    await root.waitFor({ state: "attached", timeout });
    return root.evaluate((element) => {
      const hostStyle = getComputedStyle(element);
      const hostRect = element.getBoundingClientRect();
      const toggle = element.shadowRoot?.querySelector<HTMLButtonElement>(".toggle");
      const panel = element.shadowRoot?.querySelector<HTMLElement>(".panel");
      const toggleStyle = toggle ? getComputedStyle(toggle) : null;
      const toggleRect = toggle?.getBoundingClientRect();
      const statusText = element.shadowRoot?.querySelector("#status")?.textContent?.trim() ?? "";
      const panelOpen = panel?.classList.contains("open") ?? false;
      const toggleVisible = !!toggle && !!toggleRect && !!toggleStyle
        && toggleStyle.display !== "none"
        && toggleStyle.visibility !== "hidden"
        && Number(toggleStyle.opacity) > 0
        && toggleRect.width > 0
        && toggleRect.height > 0;
      if (toggle && panel) {
        toggle.click();
        const clickOpenedPanel = panel.classList.contains("open") !== panelOpen;
        toggle.click();
        panel.classList.toggle("open", panelOpen);
        return {
          visible: hostStyle.position === "fixed"
            && hostStyle.visibility !== "hidden"
            && Number(hostStyle.opacity) > 0
            && hostRect.width > 0
            && hostRect.height > 0
            && toggleVisible,
          position: hostStyle.position,
          right: hostStyle.right,
          bottom: hostStyle.bottom,
          visibility: hostStyle.visibility,
          width: hostRect.width,
          height: hostRect.height,
          zIndex: hostStyle.zIndex,
          toggleVisible,
          toggleInteractive: clickOpenedPanel,
          toggleWidth: toggleRect?.width ?? 0,
          toggleHeight: toggleRect?.height ?? 0,
          panelPresent: true,
          statusText,
        };
      }
      return {
        visible: hostStyle.position === "fixed"
          && hostStyle.visibility !== "hidden"
          && Number(hostStyle.opacity) > 0
          && hostRect.width > 0
          && hostRect.height > 0
          && toggleVisible,
        position: hostStyle.position,
        right: hostStyle.right,
        bottom: hostStyle.bottom,
        visibility: hostStyle.visibility,
        width: hostRect.width,
        height: hostRect.height,
        zIndex: hostStyle.zIndex,
        toggleVisible,
        toggleInteractive: false,
        toggleWidth: toggleRect?.width ?? 0,
        toggleHeight: toggleRect?.height ?? 0,
        panelPresent: !!panel,
        statusText,
      };
    });
  }

  async function listOpenTabs(): Promise<ManagedTab[]> {
    if (disconnected) throw new Error("The managed Playwright browser is disconnected.");
    if (!browserPromise && !browser) return [];
    if (browser && !browser.isConnected()) {
      throw new Error("The managed Playwright browser is disconnected.");
    }
    await browserPromise;
    const tabs: ManagedTab[] = [];
    for (const [page, service] of managedPages) {
      if (page.isClosed()) {
        managedPages.delete(page);
        continue;
      }
      tabs.push({
        service,
        url: page.url(),
        title: await page.title(),
        assistantWidget: extensionConfigured() ? await inspectAssistantWidget(page) : null,
      });
    }
    return tabs;
  }

  async function closeManagedTab(service?: ServiceId): Promise<boolean> {
    if (disconnected) throw new Error("The managed Playwright browser is disconnected.");
    if (!browserPromise && !browser) return false;
    if (browser && !browser.isConnected()) {
      throw new Error("The managed Playwright browser is disconnected.");
    }
    await browserPromise;
    const activeContext = context ?? (contextPromise ? await contextPromise : null);
    if (!activeContext) return false;
    const contextPages = new Set(activeContext.pages());
    const candidates = [...managedPages.entries()].reverse();
    let entry: [PageLike, ServiceId] | undefined;
    for (const candidate of candidates) {
      const [page, openedService] = candidate;
      if (page.isClosed() || !contextPages.has(page)) {
        managedPages.delete(page);
        continue;
      }
      if (!service || service === openedService) {
        entry = candidate;
        break;
      }
    }
    if (!entry) return false;

    const [page] = entry;
    const remainingPages = activeContext.pages().filter((openPage) => !openPage.isClosed() && openPage !== page);
    if (remainingPages.length === 0) {
      if (!keepAlivePage || keepAlivePage.isClosed()) {
        keepAlivePage = await activeContext.newPage();
        keepAlivePage.setDefaultTimeout(15_000);
      }
    }
    try {
      await page.close();
    } catch (error) {
      if (!page.isClosed()) throw error;
    }
    if (!page.isClosed()) {
      throw new Error("Playwright did not confirm that the managed tab was closed.");
    }
    managedPages.delete(page);
    return true;
  }

  async function getMostRecentManagedPage(): Promise<PageLike | null> {
    if (disconnected) throw new Error("The managed Playwright browser is disconnected.");
    if (!browserPromise && !browser) return null;
    if (browser && !browser.isConnected()) {
      throw new Error("The managed Playwright browser is disconnected.");
    }
    await browserPromise;
    const activeContext = context ?? (contextPromise ? await contextPromise : null);
    if (!activeContext) return null;
    const contextPages = new Set(activeContext.pages());
    const candidates = [...managedPages.keys()].reverse();
    for (const page of candidates) {
      if (page.isClosed() || !contextPages.has(page)) {
        managedPages.delete(page);
        continue;
      }
      return page;
    }
    return null;
  }

  async function goBack(): Promise<boolean> {
    const page = await getMostRecentManagedPage();
    if (!page) return false;
    return (await page.goBack({ waitUntil: "domcontentloaded", timeout: 15_000 })) !== null;
  }

  async function scrollPage(direction: "up" | "down"): Promise<boolean> {
    const page = await getMostRecentManagedPage();
    if (!page) return false;
    if (direction === "down") {
      await page.locator("html").evaluate((element) => {
        const view = element.ownerDocument.defaultView;
        if (!view) return false;
        view.scrollBy({ top: view.innerHeight * 0.8, behavior: "smooth" });
        return true;
      });
    } else {
      await page.locator("html").evaluate((element) => {
        const view = element.ownerDocument.defaultView;
        if (!view) return false;
        view.scrollBy({ top: -view.innerHeight * 0.8, behavior: "smooth" });
        return true;
      });
    }
    return true;
  }

  async function closeBrowser(): Promise<void> {
    const current = browser ?? (browserPromise ? await browserPromise : null);
    browser = null;
    browserPromise = null;
    context = null;
    contextPromise = null;
    keepAlivePage = null;
    disconnected = false;
    managedPages.clear();
    if (current?.isConnected()) await current.close();
  }

  return {
    openSite: (service: ServiceId) => navigate(service, SERVICES[service].home),
    searchSite: (service: ServiceId, query: string) => navigate(service, SERVICES[service].search(query)),
    listOpenTabs,
    closeManagedTab,
    goBack,
    scrollPage,
    closeBrowser,
  };
}

const browserController = createBrowserController(async () => {
  const { chromium } = await import("playwright");
  const fs = await import("node:fs");
  const path = await import("node:path");
  
  if (config.extensionPath) {
    const extensionPath = path.resolve(config.extensionPath);
    if (!fs.existsSync(path.join(extensionPath, "manifest.json"))) {
      throw new Error(`EXTENSION_PATH does not contain manifest.json: ${extensionPath}`);
    }
    const context = await chromium.launchPersistentContext(path.resolve(config.playwrightUserDataDir), {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });
    
    let connected = true;
    context.on("close", () => { connected = false; });
    
    return {
      newContext: async () => context as unknown as BrowserContextLike,
      isConnected: () => connected,
      on: (event: "disconnected", listener: () => void) => {
        if (event === "disconnected") context.on("close", listener);
      },
      close: async () => context.close(),
    };
  }

  return chromium.launch({ headless: false });
}, () => !!config.extensionPath);

export const openSite = browserController.openSite;
export const searchSite = browserController.searchSite;
export const listOpenTabs = browserController.listOpenTabs;
export const closeManagedTab = browserController.closeManagedTab;
export const goBack = browserController.goBack;
export const scrollPage = browserController.scrollPage;
export const closeBrowser = browserController.closeBrowser;
