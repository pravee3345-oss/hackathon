import { config } from "./src/config.js";

async function run() {
  const { chromium } = await import('playwright');
  
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
      console.log("Has Shadow Root: true");
      
      const toggleInfo = await page.evaluate(() => {
          const root = document.getElementById('accessease-extension-root');
          if (!root) return "root not found";
          
          const shadow = root.shadowRoot;
          if (!shadow) return "shadowRoot is null (still closed?)";
          
          const toggle = shadow.getElementById('toggle');
          if (!toggle) return "toggle not found";
          
          const rect = toggle.getBoundingClientRect();
          const style = window.getComputedStyle(toggle);
          
          return {
              rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
              display: style.display,
              visibility: style.visibility,
              opacity: style.opacity,
              zIndex: style.zIndex,
              position: style.position,
              rootStyle: root.style.cssText
          };
      });
      console.log("Toggle Info:", toggleInfo);
  } catch (e) {
      console.log("Error finding element:", e);
  }

  await context.close();
}

run().catch(console.error);
