# AccessEase Frontend

## Run
You can open `index.html` directly in a browser.

For best results, use VS Code + Live Server:
1. Open this folder in VS Code.
2. Right-click `index.html`.
3. Choose **Open with Live Server**.

## Backend connection
Open `js/config.js`:

```js
const API_CONFIG = {
  BASE_URL: "http://localhost:5000/api",
  USE_BACKEND: false
};
```

When your friend's backend is ready, change:
- `BASE_URL` to the backend API URL
- `USE_BACKEND` to `true`

Current expected endpoint examples:
- POST `/auth/login`
- POST `/auth/register`
- PUT `/user/settings`
- POST `/ai/chat`

If your friend's endpoint names are different, update only `js/api.js`.

## Demo mode
Until backend is connected:
- Registration works with browser localStorage.
- Login works with the registered demo user.
- Settings persist in localStorage.
- Language selection persists.
- AI assistant UI works in demo mode.
