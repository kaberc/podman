import { assertEquals, assertRejects } from "@std/assert";
import { ManifestsApi } from "../../api/manifests.ts";
import { NetworksApi } from "../../api/networks.ts";
import { buildTransport, type DoFetchInit } from "../../transport_core.ts";
import { PodmanError } from "../../types/errors.ts";

interface Seen {
  method: string;
  path: string;
  init?: DoFetchInit;
}

function transportFor(
  respond: () => Response,
  seen: Seen[] = [],
  auth?: string,
) {
  return buildTransport(
    async (method, path, init) => {
      await Promise.resolve();
      seen.push({ method, path, init });
      return respond();
    },
    auth,
    () => {},
    { timeout: 1 },
  );
}

function manifests(wire: string, status = 200, seen?: Seen[], auth?: string) {
  return new ManifestsApi(
    transportFor(() => new Response(wire, { status }), seen, auth),
  );
}

function networks(response: () => Response, seen?: Seen[]) {
  return new NetworksApi(transportFor(response, seen));
}

Deno.test("manifests.push targets the registry route with the destination", async () => {
  // Given a quiet push that succeeds.
  const seen: Seen[] = [];
  const api = manifests('{"Id":"sha256:abc"}\n', 200, seen);
  // When pushing a manifest list.
  await api.push("list", "registry.example/ns/list:1");
  // Then the v4+ registry route is used, not the removed push/ route.
  assertEquals(seen[0]?.method, "POST");
  assertEquals(
    decodeURIComponent(seen[0]?.path ?? ""),
    "/manifests/list/registry/registry.example/ns/list:1",
  );
});

Deno.test("manifests.push quiet default resolves to the pushed digest", async () => {
  // Given the single-object quiet response.
  const api = manifests('{"Id":"sha256:abc"}\n');
  // When pushing without options.
  const result = await api.push("list", "registry.example/list");
  // Then the public result is an IDResponse.
  assertEquals(result, { Id: "sha256:abc" });
});

Deno.test("manifests.push nonquiet consumes progress and returns the terminal digest", async () => {
  // Given progress lines followed by a terminal report.
  const api = manifests(
    '{"Id":"","stream":"Writing manifest list\\n"}\n{"Id":"sha256:def"}\n',
  );
  // When pushing with quiet disabled.
  const result = await api.push("list", "registry.example/list", {
    quiet: false,
  });
  // Then only the digest is returned.
  assertEquals(result, { Id: "sha256:def" });
});

Deno.test("manifests.push rejects an in-band error after HTTP 200", async () => {
  // Given a nonquiet stream that fails after progress.
  const api = manifests(
    '{"Id":"","stream":"Writing\\n"}\n{"Id":"","error":"registry denied"}\n',
  );
  // When pushing.
  const error = await assertRejects(
    () => api.push("list", "registry.example/list", { quiet: false }),
    PodmanError,
    "registry denied",
  );
  // Then the failure reports the request identity.
  assertEquals(error.status, 200);
  assertEquals(error.method, "POST");
});

Deno.test("manifests.push rejects a stream that ends without a digest", async () => {
  // Given progress only, as after a dropped connection.
  const api = manifests('{"Id":"","stream":"Writing\\n"}\n');
  // When pushing.
  // Then no success is claimed.
  await assertRejects(
    () => api.push("list", "registry.example/list", { quiet: false }),
    PodmanError,
    "Missing terminal manifest push report",
  );
});

Deno.test("manifests.push surfaces HTTP errors", async () => {
  // Given a handler rejection.
  const api = manifests('{"message":"bad destination"}', 400);
  // When pushing.
  const error = await assertRejects(
    () => api.push("list", "registry.example/list"),
    PodmanError,
  );
  // Then the status survives.
  assertEquals(error.status, 400);
});

Deno.test("manifests.push sends registry credentials and has no request deadline", async () => {
  // Given a transport with credentials and a 1 ms ordinary timeout.
  const seen: Seen[] = [];
  const api = manifests('{"Id":"sha256:abc"}\n', 200, seen, "dG9rZW4=");
  // When pushing.
  await api.push("list", "registry.example/list");
  // Then credentials are forwarded on the streaming request.
  assertEquals(seen[0]?.init?.headers?.["X-Registry-Auth"], "dG9rZW4=");
});

Deno.test("networks.update accepts 204 No Content", async () => {
  // Given the handler's documented success status.
  const api = networks(() => new Response(null, { status: 204 }));
  // When updating.
  // Then it resolves.
  assertEquals(await api.update("net", {} as never), undefined);
});

Deno.test("networks.update rejects unexpected success statuses", async () => {
  // Given a 200 the handler never sends.
  const api = networks(() => new Response("{}", { status: 200 }));
  // When updating.
  // Then it is not treated as the contract.
  await assertRejects(() => api.update("net", {} as never), PodmanError);
});

Deno.test("networks.remove rejects an in-band report error", async () => {
  // Given HTTP 200 whose report carries an error object.
  const api = networks(() =>
    new Response('[{"Name":"net","Err":{}}]', { status: 200 })
  );
  // When removing.
  const error = await assertRejects(
    () => api.remove("net"),
    PodmanError,
  );
  // Then the failure is not reported as removed.
  assertEquals(error.status, 200);
});

Deno.test("networks.remove rejects a string report error with its text", async () => {
  // Given a report error carried as text.
  const api = networks(() =>
    new Response('[{"Name":"net","Err":"in use"}]', { status: 200 })
  );
  // When removing.
  // Then the text is the message.
  await assertRejects(() => api.remove("net"), PodmanError, "in use");
});

Deno.test("networks.remove accepts a clean report and a missing network", async () => {
  // Given a clean report and a 404.
  const removed = networks(() =>
    new Response('[{"Name":"net","Err":null}]', { status: 200 })
  );
  const missing = networks(() =>
    new Response('{"message":"not found"}', { status: 404 })
  );
  // When removing each.
  // Then success and absence stay distinguishable.
  assertEquals(await removed.remove("net"), { alreadyRemoved: false });
  assertEquals(await missing.remove("net"), { alreadyRemoved: true });
});

Deno.test("networks.remove rejects a malformed report", async () => {
  // Given a 200 body that is not a report array.
  const api = networks(() => new Response('{"ok":true}', { status: 200 }));
  // When removing.
  // Then no success is claimed.
  await assertRejects(() => api.remove("net"), PodmanError);
});

for (
  const test of [
    {
      name: "connect",
      invoke: (api: NetworksApi) =>
        api.connect("net", { container: "container" }),
      body: { container: "container" },
    },
    {
      name: "disconnect",
      invoke: (api: NetworksApi) =>
        api.disconnect("net", { Container: "container" }),
      body: { Container: "container" },
    },
  ]
) {
  Deno.test(`networks.${test.name} accepts the handler's plain OK response`, async () => {
    const seen: Seen[] = [];
    const api = networks(() => new Response("OK"), seen);
    await test.invoke(api);
    assertEquals(JSON.parse(String(seen[0]?.init?.body)), test.body);
    assertEquals(seen[0]?.init?.headers?.["Content-Type"], "application/json");
  });
}

for (const op of ["connect", "disconnect"] as const) {
  Deno.test(`networks.${op} surfaces 409 as an error, never idempotency`, async () => {
    // Given a 409, which the connect and disconnect handlers do not define.
    const api = networks(() => new Response("conflict", { status: 409 }));
    // When calling the operation.
    const error = await assertRejects(
      () => api[op]("net", { container: "c" } as never),
      PodmanError,
    );
    // Then it is an error.
    assertEquals(error.status, 409);
  });
}
