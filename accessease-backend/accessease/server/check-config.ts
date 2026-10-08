import { config } from "./src/config.js";
console.log("Diagnostic check for real app config:");
console.log("EXTENSION_PATH from config:", `'${config.extensionPath}'`);
console.log("Will it launch persistent context?", config.extensionPath ? "YES" : "NO");
