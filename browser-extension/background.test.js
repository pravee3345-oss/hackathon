import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("sends assistant chat to the backend without requiring a stored token", async () => {
  let messageListener;
  const requests = [];
  const chrome = {
    storage: { local: { get: async () => ({}) } },
    runtime: { onMessage: { addListener: listener => { messageListener = listener; } } },
    tabs: { remove: async () => {}, onRemoved: { addListener: () => {} } },
  };
  const fetch = async (url, options) => {
    requests.push({ url, options });
    return { ok: true, json: async () => ({ status: "reply", message: "Hello" }) };
  };
  const source = await readFile(new URL("./background.js", import.meta.url), "utf8");
  vm.runInNewContext(source, { chrome, fetch, URL });

  let response;
  const keepsChannelOpen = messageListener(
    { type: "chat", payload: { message: "Hello" } },
    {},
    result => { response = result; },
  );
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.equal(keepsChannelOpen, true);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "http://localhost:5001/api/ai/chat");
  assert.equal(requests[0].options.headers.Authorization, undefined);
  assert.equal(response.result.message, "Hello");
});

test("does not send a login token for chat or confirmation commands from other tabs", async () => {
  let messageListener;
  const authorizations = [];
  const endpoints = [];
  const chrome = {
    storage: { local: { get: async () => ({ accessEaseToken: "test-token" }) } },
    runtime: { onMessage: { addListener: listener => { messageListener = listener; } } },
    tabs: { remove: async () => {}, onRemoved: { addListener: () => {} } },
  };
  const fetch = async (url, options) => {
    endpoints.push(url);
    authorizations.push(options.headers.Authorization);
    return { ok: true, json: async () => ({ status: "reply", message: "Hello" }) };
  };
  const source = await readFile(new URL("./background.js", import.meta.url), "utf8");
  vm.runInNewContext(source, { chrome, fetch, URL });
  for (const type of ["chat", "confirm"]) {
    messageListener({ type, payload: { message: "Hello" } }, {}, () => {});
  }
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.deepEqual(endpoints, [
    "http://localhost:5001/api/ai/chat",
    "http://localhost:5001/api/ai/confirm",
  ]);
  assert.deepEqual(authorizations, [undefined, undefined]);
});

test("opens only allow-listed destinations in a managed new tab", async () => {
  let messageListener;
  const created = [];
  const storage = {};
  const chrome = {
    storage: { local: {
      get: async key => ({ [key]: storage[key] }),
      set: async values => Object.assign(storage, values),
    } },
    runtime: { onMessage: { addListener: listener => { messageListener = listener; } } },
    tabs: {
      create: async properties => {
        created.push(properties);
        return { id: created.length };
      },
      remove: async () => {},
      onRemoved: { addListener: () => {} },
    },
  };
  const source = await readFile(new URL("./background.js", import.meta.url), "utf8");
  vm.runInNewContext(source, { chrome, fetch: async () => {}, URL, console });

  let response;
  messageListener(
    { type: "openManagedTab", url: "https://www.youtube.com/results?search_query=accessibility" },
    {},
    result => { response = result; },
  );
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.equal(created.length, 1);
  assert.equal(created[0].url, "https://www.youtube.com/results?search_query=accessibility");
  assert.equal(created[0].active, true);
  assert.equal(storage.accessEaseManagedTabs.length, 1);
  assert.equal(storage.accessEaseManagedTabs[0].tabId, 1);
  assert.equal(storage.accessEaseManagedTabs[0].service, "youtube");
  assert.equal(response.ok, true);

  let rejected;
  messageListener(
    { type: "openManagedTab", url: "https://example.com/" },
    {},
    result => { rejected = result; },
  );
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.match(rejected.error, /unsupported destination/);
});

test("closes only the latest AccessEase-managed tab for a requested website", async () => {
  let messageListener;
  const removed = [];
  const storage = {
    accessEaseManagedTabs: [
      { tabId: 4, service: "youtube" },
      { tabId: 5, service: "google" },
      { tabId: 6, service: "youtube" },
    ],
  };
  const chrome = {
    storage: { local: {
      get: async key => ({ [key]: storage[key] }),
      set: async values => Object.assign(storage, values),
    } },
    runtime: { onMessage: { addListener: listener => { messageListener = listener; } } },
    tabs: {
      remove: async tabId => removed.push(tabId),
      onRemoved: { addListener: () => {} },
    },
  };
  const source = await readFile(new URL("./background.js", import.meta.url), "utf8");
  vm.runInNewContext(source, { chrome, fetch: async () => {}, URL, console });

  let response;
  messageListener(
    { type: "closeManagedTab", service: "youtube" },
    {},
    result => { response = result; },
  );
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.deepEqual(removed, [6]);
  assert.deepEqual(storage.accessEaseManagedTabs, [
    { tabId: 4, service: "youtube" },
    { tabId: 5, service: "google" },
  ]);
  assert.equal(response.ok, true);
});

test("closes the current tab only when its website matches the spoken target", async () => {
  let messageListener;
  const removed = [];
  const chrome = {
    storage: { local: {
      get: async () => ({ accessEaseManagedTabs: [] }),
      set: async () => {},
    } },
    runtime: { onMessage: { addListener: listener => { messageListener = listener; } } },
    tabs: {
      remove: async tabId => removed.push(tabId),
      onRemoved: { addListener: () => {} },
    },
  };
  const source = await readFile(new URL("./background.js", import.meta.url), "utf8");
  vm.runInNewContext(source, { chrome, fetch: async () => {}, URL, console });

  let response;
  messageListener(
    { type: "closeManagedTab", service: "youtube" },
    { tab: { id: 22, url: "https://www.youtube.com/watch?v=123" } },
    result => { response = result; },
  );
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.deepEqual(removed, [22]);
  assert.equal(response.ok, true);

  messageListener(
    { type: "closeManagedTab", service: "youtube" },
    { tab: { id: 23, url: "https://www.google.com/" } },
    result => { response = result; },
  );
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.deepEqual(removed, [22]);
  assert.match(response.error, /No open youtube tab/);
});
