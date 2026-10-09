# AccessEase Backend (Node.js + Express + SQLite)

## Run
```bash
cd server
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev               # http://localhost:5001/api/health
```
Needs Node 20+. Website commands open a new tab in the user's regular browser by default. If the AccessEase browser extension is loaded there, it can appear on supported sites.

Optional:
- **GroqCloud AI:** put your Groq key in `GROQ_API_KEY` in `.env` (key stays server-side only). `GROQ_MODEL` defaults to `openai/gpt-oss-120b`. Gemini can be configured as a fallback with `GEMINI_API_KEY`. Without either key, the assistant uses its rule-based intent fallback.
- **Separate Playwright browser with the floating assistant:** set `ENABLE_PLAYWRIGHT=true` and `EXTENSION_PATH` to the absolute path of the existing `browser-extension` folder in `.env`, then run `npx playwright install chromium` once. The server loads that extension into a persistent Chromium profile and waits for its visible widget when opening a website. The floating assistant can send requests without a saved login token because the assistant endpoints allow optional authentication.

Website actions ask for confirmation before opening, searching, or closing a tab. With Playwright enabled, AccessEase keeps one browser and context alive for the server lifetime, opens websites in separate managed tabs, and supports “close YouTube”, “close the current tab”, and “list open tabs”. It only closes pages that AccessEase opened; a missing website tab is reported as not found. Voice transcripts use the same backend commands as typed messages.

To use the assistant on other websites, load the frontend's `browser-extension` folder as an unpacked Chrome/Edge extension and allow site access for the sites you use (or all sites). Set `CORS_EXTENSION_ID` in `.env` to the ID shown on the browser extensions page, then restart the backend. The extension can open allow-listed sites in a new tab and close its current supported site tab or an AccessEase-opened tab. Assistant chat endpoints use optional authentication; logging in is not required for chat or tab control.

## Connect the frontend
In `js/config.js`: `BASE_URL: "http://localhost:5001/api"`, `USE_BACKEND: true`.
Serve the frontend with Live Server (port 5500 is already allowed in CORS_ORIGINS).

## Endpoints
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | no | Health check |
| POST | `/api/auth/register` | no | `{name,email,password}` -> `{token,user,settings}` |
| POST | `/api/auth/login` | no | `{email,password}` -> `{token,user,settings}` |
| GET | `/api/user/me` | Bearer | Current user + settings |
| GET/PUT | `/api/user/settings` | Bearer | `{language,largeText,highContrast,voiceOutput}` (partial updates OK) |
| POST | `/api/assistant/chat` (alias `/api/ai/chat`) | optional | `{message,language?,sessionId?}` |
| POST | `/api/assistant/confirm` (alias `/api/ai/confirm`) | optional | `{confirm:true,action,language?,sessionId?}` |

Send the token as `Authorization: Bearer <token>`.

### Assistant response
```json
{
  "status": "reply | needs_info | needs_confirmation | success | failed",
  "message": "text to show / speak",
  "reply": "same as message",
  "action": { "intent": "search_website", "service": "youtube", "query": "AI news" },
  "steps": ["Open YouTube", "Search YouTube for \"AI news\"", "Check that the page loaded"],
  "openUrl": "https://...   (only when Playwright is off: frontend shows a link)",
  "sessionId": "echoed back"
}
```
- Generate a random `sessionId` once per chat on the frontend and send it every time; it is how follow-up questions work (e.g. asking for the reference number).
- `needs_confirmation` -> show Yes/No -> POST `/assistant/confirm` with the returned `action`.
- Saying "cancel" / "start over" / "ரத்து" resets the conversation.

## Safety design (from the plan)
- AI only returns an intent + service id; **URLs come from the server allow-list** (`safety/validateAction.ts`).
- Every AI output **and** every action sent back by the browser is re-validated.
- Unsupported sites/intents never execute. Gemini down -> rule-based fallback.
- Playwright failures return `failed`, never a fake success.
- `close_website_tab` and `list_open_tabs` operate only on AccessEase-managed Playwright pages; `close_current_tab` in Playwright mode closes the most recently opened managed page.
- Passwords hashed with bcrypt; JWT 7 days; rate limits on auth and assistant.

## Try it
```bash
curl.exe http://localhost:5001/api/health
curl -X POST localhost:5000/api/assistant/chat -H "Content-Type: application/json" \
  -d '{"message":"Check my application status","sessionId":"s1"}'
curl -X POST localhost:5000/api/assistant/chat -H "Content-Type: application/json" \
  -d '{"message":"AE-1001","sessionId":"s1"}'
curl -X POST localhost:5000/api/assistant/chat -H "Content-Type: application/json" \
  -d '{"message":"Open YouTube and search for AI news","sessionId":"s2"}'
```
Demo (fictional) references: `AE-1001` Approved, `AE-1002` Under Review, `AE-1003` Documents Needed.

## Windows: run and test Playwright control

From the repository root in PowerShell:

```powershell
Set-Location '.\accessease-backend\accessease\server'
npm install
npx playwright install chromium
npm test
npm run typecheck
npm run dev
```

The server `.env` must contain `ENABLE_PLAYWRIGHT=true`; restart the backend after changing it. In the frontend, confirm an open command, then try “Close YouTube tab” and “List open tabs”. A close command asks for confirmation; it reports success only after Playwright closes the managed page.
