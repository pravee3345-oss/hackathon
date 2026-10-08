import { config } from "./src/config.js";

async function run() {
  const { chromium } = await import('playwright');
  
  console.log("Config EXTENSION_PATH:", config.extensionPath);
  console.log("Config USER_DATA_DIR:", config.playwrightUserDataDir);
  
  try {
     const context = await chromium.launchPersistentContext(config.playwrightUserDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${config.extensionPath}`,
        `--load-extension=${config.extensionPath}`,
      ],
    });
    console.log("3. Chromium launched using launchPersistentContext: YES");

    let serviceWorker = context.serviceWorkers()[0];
    if (!serviceWorker) {
        serviceWorker = await context.waitForEvent("serviceworker", { timeout: 5000 }).catch(() => null);
    }
    
    if (serviceWorker) {
        console.log("4. Extension loaded in Playwright: YES");
    } else {
        console.log("4. Extension loaded in Playwright: NO (no service worker found)");
    }

    await context.close();
  } catch (err) {
      console.log("Error during playwright test:", err);
  }
}

run().catch(console.error);
