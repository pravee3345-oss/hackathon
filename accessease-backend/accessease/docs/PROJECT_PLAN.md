# AccessEase --- Project Plan and Development Phases

**Hackathon:** HackNova 2026\
**Problem Statement:** N-WEB-03 --- AccessEase: Inclusive Digital
Services Platform\
**Document purpose:** Give the team a clear, phased implementation plan.
Build a working app shell first, then add features inside the app one
phase at a time.

------------------------------------------------------------------------

## 1. Project Overview

AccessEase is an accessible digital-services assistant for elderly
users, persons with disabilities, and people with limited digital
literacy.

Users can type or speak what they want to do. AccessEase interprets the
request, guides the user through a supported workflow, and confirms the
result using text or voice. Users can personalize language and
accessibility settings.

### Core principle

**Build a small, working application first. Add and test one feature at
a time.**

Do not begin by trying to control every website, every phone
application, or the phone while it is powered off. The first version
will focus on a web app and a small number of controlled workflows.

## 2. MVP Goals

The first demonstrable version should let a user:

1.  Open the AccessEase web app.
2.  See a simple, accessible home screen.
3.  Choose a language and accessibility preferences.
4.  Type a request into the assistant.
5.  Receive a clear, step-by-step response.
6.  Use voice input and text-to-speech where the browser supports them.
7.  Complete at least one reliable guided service workflow.
8.  See a clear success, failure, or clarification message.

### Suggested first workflows

-   **Workflow A --- Open a public website:** Open an approved website
    such as YouTube in a new tab.
-   **Workflow B --- Search a public website:** Search for a
    user-provided topic using a supported workflow.
-   **Workflow C --- Demo service:** Use a mock
    scholarship/application-status service with fictional data. This is
    the best workflow for demonstrating a complete, predictable
    end-to-end process.

Keep account-sensitive actions, payments, and real personal records out
of the initial demo.

------------------------------------------------------------------------

## 3. Recommended Technology Stack

  -----------------------------------------------------------------------
  Layer                   Recommended technology  Responsibility
  ----------------------- ----------------------- -----------------------
  Frontend                React + TypeScript      Accessible web
                                                  interface

  Styling                 Tailwind CSS            Responsive layout and
                                                  visual styles

  UI components           Native semantic HTML;   Buttons, dialogs, forms
                          optional shadcn/ui      and menus

  Backend                 Node.js + Express       API, validation and
                                                  workflow coordination

  AI                      Gemini API, behind a    Interpret
                          backend service         natural-language
                                                  requests

  Browser automation      Playwright              Automate supported
                                                  workflows in a
                                                  dedicated browser

  Database                SQLite                  Save user preferences
                                                  and fictional demo data

  Speech input/output     Browser Web Speech APIs Speech recognition and
                          where supported         text-to-speech

  Language support        i18next or a simple     Tamil and English
                          translation dictionary  interface text
                          for the MVP             

  Tool integration        Optional MCP server     Standardized access to
                          later                   approved tools
  -----------------------------------------------------------------------

### Important architecture rule

The AI interprets the user's request; it should not have unrestricted
control of the computer. The backend validates the request and only
calls explicitly approved actions.

-   **AI:** Understands intent and helps decide the next step.
-   **Backend/workflow engine:** Checks permissions, validates inputs
    and coordinates actions.
-   **Playwright:** Performs supported actions in its own controlled
    browser.
-   **Frontend:** Shows progress, asks for clarification and confirms
    outcomes.
-   **SQLite:** Stores only the data needed for the demo.

MCP is optional. Do not add it until the basic workflows work. Normal
backend functions are enough for the first prototype.

------------------------------------------------------------------------

## 4. Development Phases

## Phase 0 --- Project setup and scope

**Goal:** Prepare the project before adding complex features.

Tasks: - Create a project repository and a clear folder structure. - Set
up React + TypeScript frontend. - Set up Node.js + Express backend. -
Add environment configuration for secrets. - Add a health-check
endpoint. - Confirm that frontend and backend can communicate. - Create
a short README with run instructions.

**Acceptance criteria:** - The frontend starts successfully. - The
backend starts successfully. - The frontend can call the backend
health-check endpoint. - API keys are not placed in frontend code or
committed to source control.

**Deliverable:** A running but basic application.

## Phase 1 --- Open the app and build the basic interface

**Goal:** First open AccessEase and make the main screen usable. Do not
integrate AI or Playwright yet.

Build these screens/components: - Welcome/home screen. - AccessEase
title and short explanation. - Assistant chat area. - Text input
field. - Send button. - Microphone button placeholder (it can be
disabled until Phase 4). - Visible Help and Back controls where
relevant. - Settings panel for language, text size, contrast and voice
preference. - Clear loading, error and empty states.

Accessibility requirements: - Use semantic HTML and labelled form
controls. - Support keyboard navigation. - Make focus indicators
visible. - Use readable text and sufficiently large buttons. - Do not
rely on colour alone to communicate status. - Ensure the layout works on
mobile and desktop.

For this phase, the assistant may return a fixed demo response, such as:
"Hello! Tell me what you would like to do."

**Acceptance criteria:** - The app opens without errors. - The user can
type a message and see it in the chat. - The app displays a demo
reply. - Settings can be changed in the interface. - The interface is
usable with a keyboard.

**Deliverable:** A working AccessEase UI shell.

## Phase 2 --- Add guided chat behaviour

**Goal:** Make the assistant guide users through a task without
controlling external websites yet.

Tasks: - Define supported intents such as `open_website`,
`search_website`, `check_demo_status`, `help` and `unknown`. - Create a
workflow state for each task. - Ask follow-up questions when required
information is missing. - Show the steps the assistant plans to
perform. - Add Cancel and Start Over controls. - Display success,
failure and retry messages.

Example: 1. User: "I want to check my application status." 2. Assistant:
"I can help with the demo application-status service." 3. Assistant asks
for a fictional demo reference number if needed. 4. User provides the
test reference. 5. Assistant displays the mock result and explains it.

**Acceptance criteria:** - At least two guided conversation paths work
reliably. - The assistant asks for clarification when a request is
incomplete. - Users can cancel or restart a workflow.

**Deliverable:** A guided assistant using mock actions.

## Phase 3 --- Add the AI service

**Goal:** Allow natural-language requests to be interpreted by an AI
model.

Tasks: - Add a backend-only Gemini integration. - Send the user request
to the model with a restricted list of supported actions. - Require a
structured response, for example:

``` json
{
  "intent": "search_website",
  "service": "youtube",
  "query": "AI news",
  "needs_confirmation": false
}
```

-   Validate every AI response on the backend.
-   Reject unsupported actions and unknown services.
-   Never execute arbitrary code or blindly trust a URL supplied by the
    model.
-   Keep API keys in server-side environment variables.
-   Add a safe fallback when the AI service is unavailable.

**Acceptance criteria:** - The assistant correctly interprets a set of
test requests. - Invalid or unsupported intents do not execute. - The
app gives understandable messages when the AI fails.

**Deliverable:** AI-powered intent understanding.

## Phase 4 --- Add voice and speech output

**Goal:** Support voice interaction while keeping text input available.

Tasks: - Add microphone permission handling. - Convert speech to text
where the browser supports speech recognition. - Show the recognized
text before or as it is submitted. - Add a text-to-speech button for
assistant responses. - Add a mute/stop-speaking control. - Provide clear
messages when microphone access is denied or speech recognition is
unavailable. - Test Tamil and English separately; do not assume every
browser supports both equally.

**Acceptance criteria:** - A user can type commands even if voice is
unavailable. - Voice input works in the chosen demo browser, if
supported. - The user can hear an assistant response and stop
playback. - Permission errors have a usable fallback.

**Deliverable:** Voice input and spoken responses.

## Phase 5 --- Add persistent accessibility preferences

**Goal:** Make the app adapt to each user's preferences.

Tasks: - Add language selection (start with Tamil and English). - Add
larger text and high-contrast modes. - Add voice-response preference. -
Save preferences locally first; add database-backed profiles only if
needed. - Apply preferences consistently across the app. - Test keyboard
and screen-reader-friendly navigation.

**Acceptance criteria:** - Preferences remain selected after refresh on
the same device. - Text size and contrast settings visibly change the
interface. - Core tasks remain usable without voice.

**Deliverable:** Personalized accessible interface.

## Phase 6 --- Add the first external website workflow with Playwright

**Goal:** Demonstrate controlled browser automation for one supported
public website.

Tasks: - Install Playwright in the Node.js project. - Launch a dedicated
browser session controlled by the backend. - Start with one explicit
action: open an approved website. - Then add a search workflow for that
website. - Use stable locators and verify that the expected page or
results appear. - Report progress and failures to the frontend. - Add
timeouts and close browser resources correctly. - Restrict the initial
workflow to a short allow-list of approved public sites.

Example: 1. User: "Open YouTube and search for AI news." 2. AI returns a
`search_website` intent. 3. Backend validates the intent and service. 4.
Playwright opens the dedicated browser and performs the supported
search. 5. The workflow verifies that the results page appeared. 6.
AccessEase reports the result.

**Important limitations:** - Playwright controls the browser session
that it launches or is explicitly connected to; it does not
automatically control the user's existing Chrome session. - A web app
cannot freely control every native phone app. - Website layouts and
automation rules can change, so every workflow needs testing. - Never
ask users to provide their passwords to the chatbot. Do not automate
sensitive account actions in the MVP.

**Acceptance criteria:** - The approved open-website workflow works. -
The search workflow works for the chosen demo case. - Failures are shown
clearly and do not falsely report success.

**Deliverable:** One working external website workflow.

## Phase 7 --- Add a complete controlled service workflow

**Goal:** Demonstrate the full problem-statement flow from request to
confirmation.

Recommended option: a mock scholarship/application-status service owned
by the project.

Tasks: - Create a simple demo service page or backend endpoint. - Use
fictional test records. - Guide the user through the required fields. -
Explain each step in simple language. - Validate inputs and allow
correction. - Show the result and read it aloud if enabled. - Ask for
confirmation before any consequential submission.

**Acceptance criteria:** - A user can complete the entire demo
workflow. - The app handles missing or invalid input. - The final status
is confirmed accurately.

**Deliverable:** One complete end-to-end service workflow.

## Phase 8 --- Testing, safety and presentation

**Goal:** Make the demo reliable and explainable.

Test: - Empty and unclear requests. - Unsupported service names. -
AI/API failure. - Network failure. - Browser automation timeout. -
Microphone denied or unsupported. - Keyboard-only navigation. - Large
text and high contrast. - Tamil and English interface text. - Cancel and
retry paths. - Small screens and desktop screens.

Prepare: - A 2--3 minute demo script. - An architecture diagram. - A
list of supported features and limitations. - A backup recording or
screenshots in case the internet or API fails.

**Acceptance criteria:** - The main demo can be repeated successfully. -
The team can explain the architecture and limitations. - No secrets or
real personal records appear in the demo.

**Deliverable:** Review-ready prototype.

------------------------------------------------------------------------

## 5. Suggested Folder Structure

``` text
accessease/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AssistantChat.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── VoiceControls.tsx
│   │   │   └── AccessibilitySettings.tsx
│   │   ├── pages/
│   │   │   └── HomePage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── i18n/
│   │   └── App.tsx
│   └── package.json
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── health.ts
│   │   │   └── assistant.ts
│   │   ├── ai/
│   │   │   └── interpretRequest.ts
│   │   ├── workflows/
│   │   │   ├── openWebsite.ts
│   │   │   ├── searchWebsite.ts
│   │   │   └── demoApplicationStatus.ts
│   │   ├── automation/
│   │   │   └── browser.ts
│   │   ├── safety/
│   │   │   └── validateAction.ts
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
├── docs/
│   └── PROJECT_PLAN.md
├── .gitignore
└── README.md
```

This is a target structure, not a requirement to create every file on
day one. Start with the smallest working structure and add folders when
their phase begins.

------------------------------------------------------------------------

## 6. Example Backend Workflow Contract

Keep the frontend and backend communication simple. The frontend can
send:

``` json
{
  "message": "Open YouTube and search for AI news",
  "language": "en",
  "preferences": {
    "largeText": true,
    "highContrast": false,
    "voiceOutput": true
  }
}
```

The backend should respond with a validated status and user-facing
message, for example:

``` json
{
  "status": "needs_confirmation",
  "message": "I can search YouTube for AI news. Shall I continue?",
  "action": {
    "intent": "search_website",
    "service": "youtube",
    "query": "AI news"
  }
}
```

The exact response format can be adjusted during implementation. The
important point is to validate AI output on the server and keep the
allowed actions explicit.

------------------------------------------------------------------------

## 7. 24-Hour Hackathon Priority Plan

Time is limited. Use this order and stop adding new features if the core
demo is unstable.

  -----------------------------------------------------------------------
  Priority                Work                    Expected result
  ----------------------- ----------------------- -----------------------
  P0                      App setup and main      App opens and displays
                          screen                  correctly

  P0                      Chat UI with mock       User can enter a
                          response                request

  P0                      Guided demo service     One complete
                                                  predictable workflow

  P1                      AI intent understanding Natural-language
                                                  requests are
                                                  interpreted

  P1                      Accessibility           Large text, contrast
                          preferences             and language settings

  P1                      Text-to-speech          Assistant can read a
                                                  response

  P2                      Speech-to-text          Voice request works in
                                                  the demo browser

  P2                      Playwright website      One supported public
                          search                  website is automated

  P3                      MCP integration         Add only if the core
                                                  app is already stable

  Later                   Native phone            Separate
                          control/background wake platform-specific
                          word                    project phase
  -----------------------------------------------------------------------

**Recommended rule:** A reliable guided demo service is more valuable
than five unreliable automations.

------------------------------------------------------------------------

## 8. What Is Out of Scope for the First Version?

Do not promise these as working MVP features: - Control of every website
on the internet. - Control of every installed mobile app. - Listening
for a wake word while the phone is powered off. - Bypassing login,
CAPTCHA, permissions or website security. - Storing users' website
passwords. - Automatically submitting sensitive forms without user
review. - Guaranteed speech recognition in every browser or language.

These may require different APIs, native application development,
explicit permissions, or additional safety and privacy work.

------------------------------------------------------------------------

## 9. Demo Script for the First Review

1.  Open AccessEase.
2.  Show the simple home screen and accessibility settings.
3.  Switch to Tamil or English.
4.  Enable large text and voice output.
5.  Type or say: "Help me check my application status."
6.  Show the assistant guiding the user through the mock service.
7.  Display the fictional result and read it aloud.
8.  If ready, demonstrate: "Open YouTube and search for AI news."
9.  Explain that Playwright controls a dedicated browser workflow and
    that broader website support is future work.
10. Explain how the same architecture can support additional services.

------------------------------------------------------------------------

## 10. Questions the Team Must Be Able to Answer

-   What specific accessibility problem are we solving?
-   Who are our primary users?
-   What does the AI do, and what does the backend do?
-   Why is Playwright needed?
-   Is MCP required for the MVP?
-   What happens when the AI misunderstands a request?
-   How do we verify that a workflow actually succeeded?
-   How are user preferences stored?
-   Which features require an internet connection?
-   What is the one complete workflow we can reliably demonstrate?

------------------------------------------------------------------------

## Final Development Rule

**Phase 1 first: open the app and build the accessible interface. Then
add the next feature inside the app, test it, and only then move to the
next phase.**

Keep the first version small, safe, accessible, and demonstrable. Add
AI, voice, Playwright and optional MCP incrementally instead of
attempting everything at once.
