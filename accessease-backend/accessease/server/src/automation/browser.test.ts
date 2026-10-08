import assert from "node:assert/strict";
import test from "node:test";
import { interpretWithRules } from "../ai/interpretRequest.js";
import { createBrowserController } from "./browser.js";

function createPage(initialTarget = "") {
  const history = initialTarget ? [initialTarget] : [];
  const page = {
    target: initialTarget,
    closed: false,
    evaluations: 0,
    goto: async (url: string) => { history.push(url); page.target = url; },
    goBack: async () => {
      if (history.length < 2) return null;
      history.pop();
      page.target = history[history.length - 1];
      return {};
    },
    url: () => page.target,
    title: async () => page.target,
    isClosed: () => page.closed,
    close: async () => { page.closed = true; },
    setDefaultTimeout: () => {},
    locator: () => ({
      first: () => ({ fill: async () => {}, press: async () => {} }),
      waitFor: async () => {},
      evaluate: async <T>() => { page.evaluations += 1; return true as T; },
    }),
    waitForURL: async () => {},
  };
  return page;
}

function createFixture() {
  const pages: ReturnType<typeof createPage>[] = [];
  let connected = true;
  let launchCount = 0;
  let contextCount = 0;
  let onDisconnected = () => {};

  const browser = {
    isConnected: () => connected,
    on: (_event: "disconnected", listener: () => void) => { onDisconnected = listener; },
    close: async () => { connected = false; },
    newContext: async () => {
      contextCount += 1;
      return {
        pages: () => pages,
        newPage: async () => {
          const page = createPage();
          pages.push(page);
          return page;
        },
      };
    },
  };
  const controller = createBrowserController(async () => {
    launchCount += 1;
    return browser;
  });

  return {
    controller,
    pages,
    get launchCount() { return launchCount; },
    get contextCount() { return contextCount; },
    disconnect() {
      connected = false;
      onDisconnected();
    },
  };
}

test("recognizes website close, educational-video search, back, and scroll commands", () => {
  assert.deepEqual(interpretWithRules("Close YouTube"), {
    intent: "close_website_tab",
    service: "youtube",
    source: "rules",
  });
  assert.deepEqual(interpretWithRules("Search for educational videos"), {
    intent: "search_website",
    service: "youtube",
    query: "educational videos",
    source: "rules",
  });
  assert.equal(interpretWithRules("Go back").intent, "go_back");
  assert.deepEqual(interpretWithRules("Scroll down"), {
    intent: "scroll_page",
    direction: "down",
    source: "rules",
  });
});

test("opens websites in the retained managed browser context", async () => {
  const fixture = createFixture();
  await fixture.controller.openSite("youtube");
  await fixture.controller.openSite("google");

  assert.equal(fixture.launchCount, 1);
  assert.equal(fixture.contextCount, 1);
  assert.equal(fixture.pages.length, 2);
  assert.deepEqual((await fixture.controller.listOpenTabs()).map((tab) => tab.service), ["youtube", "google"]);
});

test("closes the requested managed website tab", async () => {
  const fixture = createFixture();
  await fixture.controller.openSite("youtube");
  await fixture.controller.openSite("google");

  assert.equal(await fixture.controller.closeManagedTab("youtube"), true);
  assert.equal(fixture.pages[0].closed, true);
  assert.equal(fixture.pages[1].closed, false);
  assert.deepEqual((await fixture.controller.listOpenTabs()).map((tab) => tab.service), ["google"]);
});

test("keeps the browser context alive when closing its last managed page", async () => {
  const fixture = createFixture();
  await fixture.controller.openSite("youtube");

  assert.equal(await fixture.controller.closeManagedTab("youtube"), true);
  assert.equal(fixture.pages[0].closed, true);
  assert.equal(fixture.pages[1].closed, false);
  assert.deepEqual(await fixture.controller.listOpenTabs(), []);

  await fixture.controller.openSite("google");
  assert.equal(fixture.pages.length, 3);
  assert.deepEqual((await fixture.controller.listOpenTabs()).map((tab) => tab.service), ["google"]);
});

test("reports a missing managed website tab without closing another tab", async () => {
  const fixture = createFixture();
  await fixture.controller.openSite("google");

  assert.equal(await fixture.controller.closeManagedTab("youtube"), false);
  assert.equal(fixture.pages[0].closed, false);
  assert.deepEqual((await fixture.controller.listOpenTabs()).map((tab) => tab.service), ["google"]);
});

test("closes the newest matching managed tab and leaves unrelated context pages open", async () => {
  const fixture = createFixture();
  await fixture.controller.openSite("youtube");
  await fixture.controller.openSite("youtube");
  const unrelatedPage = createPage("https://example.com/");
  fixture.pages.push(unrelatedPage);

  assert.equal(await fixture.controller.closeManagedTab("youtube"), true);
  assert.equal(fixture.pages[0].closed, false);
  assert.equal(fixture.pages[1].closed, true);
  assert.equal(unrelatedPage.closed, false);
  assert.equal((await fixture.controller.listOpenTabs()).length, 1);
});

test("treats an already-closed managed page as not found and removes its stale reference", async () => {
  const fixture = createFixture();
  await fixture.controller.openSite("youtube");
  fixture.pages[0].closed = true;

  assert.equal(await fixture.controller.closeManagedTab("youtube"), false);
  assert.deepEqual(await fixture.controller.listOpenTabs(), []);
});

test("navigates back and scrolls only the newest managed page", async () => {
  const fixture = createFixture();
  await fixture.controller.openSite("google");
  await fixture.controller.openSite("youtube");
  await fixture.pages[1].goto("https://www.youtube.com/watch?v=example");

  assert.equal(await fixture.controller.goBack(), true);
  assert.equal(fixture.pages[1].url(), "https://www.youtube.com/");
  assert.equal(await fixture.controller.scrollPage("down"), true);
  assert.equal(fixture.pages[1].evaluations, 1);
  assert.equal(fixture.pages[0].evaluations, 0);
});

test("reports browser disconnection instead of claiming a tab was closed", async () => {
  const fixture = createFixture();
  await fixture.controller.openSite("youtube");
  fixture.disconnect();

  await assert.rejects(() => fixture.controller.closeManagedTab("youtube"), /browser is disconnected/i);
});
