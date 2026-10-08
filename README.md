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
Voice input requires a supported browser such as Chrome or Edge and microphone permission for the site currently hosting the assistant. Select the microphone to start listening, speak a command, then review or edit the recognized words in the message field and select Send. The assistant uses the selected AccessEase language, shows words as they are recognized, and explains microphone or speech-service errors. When using the floating assistant on YouTube, allow microphone access for YouTube separately from the AccessEase site.

### Keep the assistant visible on web pages
The optional Chrome/Edge extension adds the floating assistant to regular HTTP/HTTPS web pages, so you can issue commands without switching back to AccessEase. Browser-internal pages (such as `chrome://extensions`), browser store pages, and some protected pages do not allow extensions to inject content.

1. Start the backend and AccessEase frontend, then log in to AccessEase.
2. Open `chrome://extensions` (or `edge://extensions`), enable **Developer mode**, and choose **Load unpacked**.
3. Select the project's `browser-extension` folder.
4. Copy the extension ID shown in the extensions page into `CORS_EXTENSION_ID` in the backend `server/.env`, then restart the backend.
5. Reload the AccessEase page so the extension can sync your existing login, then reload the web tab where you want the assistant. The AccessEase assistant appears in the page's lower-right corner.

The extension receives your AccessEase login from the local app and clears it when you log out. It sends visible main-page text (up to 9,000 characters) with assistant requests so the configured AI provider can answer questions about the current page. Configure `GROQ_API_KEY` or `GEMINI_API_KEY` in the backend `server/.env` for AI-based screen questions. The extension uses speech recognition and spoken replies when supported by the browser, asks before navigating to a supported site, and asks before closing its current web tab.
