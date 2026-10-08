import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// 1. Check EXTENSION_PATH
const extensionDir = path.resolve(process.cwd(), "../../../browser-extension");
console.log("1. Extension path:", extensionDir);
console.log("   Exists:", fs.existsSync(extensionDir));

// 2. Check manifest.json
const manifestPath = path.join(extensionDir, "manifest.json");
console.log("2. Manifest exists:", fs.existsSync(manifestPath));
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log("   Manifest name:", manifest.name);
}

// Set up env for testing
process.env.EXTENSION_PATH = extensionDir;
process.env.PLAYWRIGHT_USER_DATA_DIR = path.resolve("./data/test-playwright-profile");
process.env.CORS_EXTENSION_ID = "cgcfkaololjehfeaabpfemgponcdndkd";

async function run() {
  const { openSite, closeManagedTab, closeBrowser } = await import('./src/automation/browser.js');
  const { config } = await import('./src/config.js');
  const { chromium } = await import('playwright');
  
  console.log("3 & 4 & 5. Launching playwright...");
  
  // We will directly use playwright to inject a script to check if content.js is loaded
  let launched = false;
  let extensionLoaded = false;
  let contentJsExecuted = false;
  let consoleErrors: string[] = [];
  
  try {
     const context = await chromium.launchPersistentContext(config.playwrightUserDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${config.extensionPath}`,
        `--load-extension=${config.extensionPath}`,
      ],
    });
    launched = true;
    console.log("3. Chromium launched using launchPersistentContext: YES");

    // Check extension background page (MV3 uses service worker)
    let serviceWorker = context.serviceWorkers()[0];
    if (!serviceWorker) {
        // Playwright might take a moment to discover the service worker
        serviceWorker = await context.waitForEvent("serviceworker", { timeout: 5000 }).catch(() => null);
    }
    
    let loadedId = null;
    if (serviceWorker) {
        extensionLoaded = true;
        console.log("4. Extension loaded in Playwright: YES");
        const url = new URL(serviceWorker.url());
        loadedId = url.hostname;
        console.log(`   Loaded Extension ID: ${loadedId}`);
        console.log(`8. CORS_EXTENSION_ID matches loaded ID: ${loadedId === config.corsExtensionId ? 'YES' : 'NO'}`);
    } else {
        console.log("4. Extension loaded in Playwright: NO (no service worker found)");
    }
    
    // Check content script on Youtube
    const page = await context.newPage();
    page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.goto("https://www.youtube.com", { waitUntil: "domcontentloaded" });
    
    // Check if content script injected the shadow DOM root
    try {
        await page.waitForSelector('#accessease-extension-root', { timeout: 5000 });
        contentJsExecuted = true;
    } catch (e) {
        contentJsExecuted = false;
    }
    console.log(`5. content.js executed on YouTube: ${contentJsExecuted ? 'YES' : 'NO'}`);
    
    console.log("6. Console errors:");
    if (consoleErrors.length === 0) console.log("   None");
    else consoleErrors.forEach(e => console.log("   - " + e));
    
    console.log("7. Checking if extension can reach backend...");
    if (serviceWorker) {
       try {
           const result = await serviceWorker.evaluate(async () => {
               try {
                  const res = await fetch("http://localhost:5001/api/health");
                  return res.ok;
               } catch (e) { return false; }
           });
           console.log(`   Extension can reach backend: ${result ? 'YES' : 'NO'}`);
       } catch (e) {
           console.log(`   Extension can reach backend: FAILED TO TEST (${e})`);
       }
    }

    await context.close();
  } catch (err) {
      console.log("Error during playwright test:", err);
  }
}

run().catch(console.error);
