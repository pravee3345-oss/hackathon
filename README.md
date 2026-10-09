# AccessEase Frontend

## Run
Run the backend and frontend in separate terminals. The frontend is configured to use `http://localhost:5001/api`.

### Backend
Requires Node.js 20 or newer:

```powershell
cd .\accessease-backend\accessease\server
Copy-Item .env.example .env
npm install
npm run dev
```

To enable GroqCloud, set `GROQ_API_KEY` in the backend `server/.env` file (the default model is `openai/gpt-oss-120b`; change `GROQ_MODEL` if needed). Keep the key server-side—never put it in frontend files or paste it into chat. Gemini is supported as a fallback via `GEMINI_API_KEY`; without either key, the backend uses its built-in rule-based assistant. Groq handles assistant requests after the browser recognizes speech; microphone transcription still requires browser speech-recognition support.

By default, confirmed website commands open a new tab in your regular browser. If the AccessEase extension is loaded in that browser, it can appear on supported sites. To use a separate Playwright-controlled Chromium window with the existing floating assistant, set `ENABLE_PLAYWRIGHT=true` and `EXTENSION_PATH` (the absolute path to the project's `browser-extension` folder) in the backend `server/.env`, then install its browser once:

```powershell
npx playwright install chromium
```

The assistant asks for confirmation before opening or searching YouTube, Google, or Wikipedia.

When Playwright is enabled, it also asks before closing a managed tab. Say or type “Close YouTube tab” to close an AccessEase-opened YouTube tab, “Close the current tab” to close the most recently opened AccessEase-managed tab, or “List open tabs” to see managed tabs. It never closes unrelated browser tabs, and it reports when the requested managed tab is not open.

### Frontend
In a second terminal, use VS Code + Live Server:
1. Open this folder in VS Code.
2. Right-click `index.html`.
3. Choose **Open with Live Server**.

The AccessEase chatbot stays fixed in the lower-right corner of the app. Register and log in with an email address; the backend stores your account and accessibility preferences.
Voice input requires a supported browser such as Chrome or Edge and microphone permission for the site currently hosting the assistant. Use the accessible microphone button to start listening, speak a command, then select the microphone again to stop; the recognized command is sent automatically. When a confirmation is required, say “yes” or “no” after starting the microphone again. Voice input turns on spoken replies for that assistant session, independently of the voice-output preference. The assistant uses the selected AccessEase language, shows words as they are recognized, and explains microphone or speech-service errors. When using the floating assistant on YouTube, allow microphone access for YouTube separately from the AccessEase site.
Confirmed website commands open a new tab and keep the assistant available. Say or type “close YouTube”, “close Google”, or “close Wikipedia” to close the most recently opened matching tab; unrelated tabs are not closed.

### Keep the assistant visible on web pages
The optional Chrome/Edge extension adds the floating assistant to regular HTTP/HTTPS web pages, so you can issue commands without switching back to AccessEase. Browser-internal pages (such as `chrome://extensions`), browser store pages, and some protected pages do not allow extensions to inject content.

1. Start the backend and AccessEase frontend.
2. Open `chrome://extensions` (or `edge://extensions`), enable **Developer mode**, and choose **Load unpacked**.
3. Select the project's `browser-extension` folder.
4. In the extension's **Details** page, set **Site access** to **On all sites** (or allow each site you want to use).
5. Copy the extension ID shown in `chrome://extensions` (or `edge://extensions`) into `CORS_EXTENSION_ID` in the backend `server/.env`, then restart the backend.
6. Reload the AccessEase page and the website tab. Extension chat and tab controls work without an AccessEase login; an AccessEase login is only needed for account-specific preferences.

The extension sends visible main-page text (up to 9,000 characters) with assistant requests so the configured AI provider can answer questions about the current page. Configure `GROQ_API_KEY` or `GEMINI_API_KEY` in the backend `server/.env` for AI-based screen questions. The extension uses speech recognition and spoken replies when supported by the browser, asks before opening a supported site in a new tab, and can close the current web tab or a supported tab opened by AccessEase. It does not close unrelated browser tabs.
