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
    tabs: { remove: async () => {} },
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

test("continues sending the saved bearer token when one is available", async () => {
  let messageListener;
  let authorization;
  const chrome = {
    storage: { local: { get: async () => ({ accessEaseToken: "test-token" }) } },
    runtime: { onMessage: { addListener: listener => { messageListener = listener; } } },
    tabs: { remove: async () => {} },
  };
  const fetch = async (_url, options) => {
    authorization = options.headers.Authorization;
    return { ok: true, json: async () => ({ status: "reply", message: "Hello" }) };
  };
  const source = await readFile(new URL("./background.js", import.meta.url), "utf8");
  vm.runInNewContext(source, { chrome, fetch, URL });
  messageListener({ type: "chat", payload: { message: "Hello" } }, {}, () => {});
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.equal(authorization, "Bearer test-token");
});
