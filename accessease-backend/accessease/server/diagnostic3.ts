import { openSite, closeBrowser } from "./src/automation/browser.js";
import { config } from "./src/config.js";

async function run() {
  console.log("Config EXTENSION_PATH:", config.extensionPath);
  console.log("Config USER_DATA_DIR:", config.playwrightUserDataDir);
  
  try {
     console.log("Calling openSite('youtube')...");
     await openSite("youtube");
     console.log("openSite finished.");
     
     // Wait a bit to observe
     await new Promise(r => setTimeout(r, 5000));
     
     console.log("Closing browser...");
     await closeBrowser();
  } catch (err) {
      console.log("Error:", err);
  }
}

run().catch(console.error);
