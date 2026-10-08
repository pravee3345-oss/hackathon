import { config } from "./src/config.js";

async function run() {
  const { chromium } = await import('playwright');
  
  console.log("Config EXTENSION_PATH:", config.extensionPath);
  
  const context = await chromium.launchPersistentContext(config.playwrightUserDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${config.extensionPath}`,
      `--load-extension=${config.extensionPath}`,
    ],
  });
  
  const page = await context.newPage();
  await page.goto("https://www.youtube.com", { waitUntil: "networkidle" });
  
  try {
      await page.waitForSelector('#accessease-extension-root', { timeout: 10000 });
      var hasShadowRoot = true;
  } catch (e) {
      var hasShadowRoot = false;
  }
  console.log("Has Shadow Root:", hasShadowRoot);

  if (hasShadowRoot) {
      const isVisible = await page.evaluate(() => {
          const root = document.getElementById('accessease-extension-root');
          const toggle = root.shadowRoot.getElementById('toggle');
          if (!toggle) return false;
          const rect = toggle.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && window.getComputedStyle(toggle).display !== 'none';
      });
      console.log("Is Toggle Visible:", isVisible);
  }

  await page.screenshot({ path: 'screenshot.png' });
  console.log("Screenshot saved.");

  await context.close();
}

run().catch(console.error);
