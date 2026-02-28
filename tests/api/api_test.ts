import { assertEquals, assertRejects } from "@std/assert";
import { PodmanError } from "../../types/errors.ts";
import { ContainersApi } from "../../api/containers.ts";
import { ImagesApi } from "../../api/images.ts";
import { NetworksApi } from "../../api/networks.ts";
import { VolumesApi } from "../../api/volumes.ts";
import { PodsApi } from "../../api/pods.ts";
import { SecretsApi } from "../../api/secrets.ts";
import { SystemApi } from "../../api/system.ts";
import { ExecApi } from "../../api/exec.ts";
import { GenerateApi } from "../../api/generate.ts";
import { mockTransport } from "./_test_helpers.ts";

Deno.test("containers.create: returns response on 201", async () => {
  const api = new ContainersApi(
    mockTransport((_m, _p, _b) => ({
      status: 201,
      json: { Id: "abc123", Warnings: [] },
    })),
  );
  const result = await api.create({ image: "alpine" } as never);
  assertEquals(result.Id, "abc123");
});

Deno.test("containers.create: throws PodmanError on non-201", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({
      status: 409,
      json: { message: "name already in use" },
    })),
  );
  const err = await assertRejects(
    () => api.create({ image: "alpine" } as never),
    PodmanError,
  );
  assertEquals(err.status, 409);
  assertEquals(err.message, "name already in use");
});

Deno.test("containers.inspect: returns data on 200", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({
      status: 200,
      json: { Id: "abc123", State: { Running: true } },
    })),
  );
  const result = await api.inspect("abc123");
  assertEquals(result?.Id, "abc123");
});

Deno.test("containers.inspect: returns null on 404", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 404, json: { message: "not found" } })),
  );
  const result = await api.inspect("nonexistent");
  assertEquals(result, null);
});

Deno.test("containers.inspect: throws on other errors", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 500, json: { message: "internal" } })),
  );
  const err = await assertRejects(
    () => api.inspect("abc"),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("containers.list: returns array on 200", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Id: "a" }, { Id: "b" }],
    })),
  );
  const result = await api.list();
  assertEquals(result.length, 2);
});

Deno.test("containers.list: returns empty array on null json", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  const result = await api.list();
  assertEquals(result, []);
});

Deno.test("containers.list: passes query params to path", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: [] };
    }),
  );
  await api.list({ all: true });
  assertEquals(capturedPath, "/containers/json?all=true");
});

Deno.test("containers.start: succeeds on 204", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  await api.start("abc123");
});

Deno.test("containers.start: succeeds on 304 (already started)", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 304, json: null })),
  );
  await api.start("abc123");
});

Deno.test("containers.start: throws on error", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 404, json: { message: "not found" } })),
  );
  await assertRejects(() => api.start("abc123"), PodmanError);
});

Deno.test("containers.stop: succeeds on 204", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  await api.stop("abc123");
});

Deno.test("containers.stop: succeeds on 304 (already stopped)", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 304, json: null })),
  );
  await api.stop("abc123");
});

Deno.test("containers.stop: passes timeout query", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 204, json: null };
    }),
  );
  await api.stop("abc123", { timeout: 10 });
  assertEquals(capturedPath, "/containers/abc123/stop?timeout=10");
});

Deno.test("containers.remove: succeeds on 200", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  await api.remove("abc123");
});

Deno.test("containers.remove: succeeds on 204", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  await api.remove("abc123");
});

Deno.test("containers.remove: passes force query", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: null };
    }),
  );
  await api.remove("abc123", { force: true } as never);
  assertEquals(capturedPath, "/containers/abc123?force=true");
});

Deno.test("containers.kill: succeeds on 204", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  await api.kill("abc123");
});

Deno.test("containers.kill: passes signal query", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 204, json: null };
    }),
  );
  await api.kill("abc123", { signal: "SIGKILL" } as never);
  assertEquals(capturedPath, "/containers/abc123/kill?signal=SIGKILL");
});

Deno.test("containers.pause: succeeds on 204", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  await api.pause("abc123");
});

Deno.test("containers.unpause: succeeds on 204", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  await api.unpause("abc123");
});

Deno.test("containers.wait: returns status code number", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: 0 })),
  );
  const result = await api.wait("abc123");
  assertEquals(result, 0);
});

Deno.test("containers.rename: sends correct path", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 204, json: null };
    }),
  );
  await api.rename("abc123", "new-name");
  assertEquals(capturedPath, "/containers/abc123/rename?name=new-name");
});

Deno.test("containers.top: returns process list", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({
      status: 200,
      json: { Processes: [["root", "1"]], Titles: ["USER", "PID"] },
    })),
  );
  const result = await api.top("abc123");
  assertEquals(result.Titles?.length, 2);
});

Deno.test("containers.restart: succeeds on 204", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  await api.restart("abc123");
});

Deno.test("images.list: returns array on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Id: "sha256:abc" }],
    })),
  );
  const result = await api.list();
  assertEquals(result.length, 1);
});

Deno.test("images.list: returns empty array on null json", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  const result = await api.list();
  assertEquals(result, []);
});

Deno.test("images.inspect: returns data on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({
      status: 200,
      json: { Id: "sha256:abc", Size: 1024 },
    })),
  );
  const result = await api.inspect("alpine");
  assertEquals(result?.Id, "sha256:abc");
});

Deno.test("images.inspect: returns null on 404", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 404, json: { message: "not found" } })),
  );
  const result = await api.inspect("nonexistent");
  assertEquals(result, null);
});

Deno.test("images.inspect: throws on other errors", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 500, json: { message: "internal" } })),
  );
  const err = await assertRejects(() => api.inspect("abc"), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("images.pull: succeeds on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ images: ["sha256:abc"] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    }),
  );
  const result = await api.pull({ reference: "alpine:latest" } as never);
  assertEquals(result.images, ["sha256:abc"]);
});
Deno.test("images.pull: throws on error", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ message: "pull failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }),
    }),
  );
  await assertRejects(
    () => api.pull({ reference: "bad" } as never),
    PodmanError,
  );
});

Deno.test("images.remove: returns report on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({
      status: 200,
      json: { Deleted: ["sha256:abc"], Untagged: ["alpine:latest"] },
    })),
  );
  const result = await api.remove("alpine");
  assertEquals(result.Deleted?.length, 1);
});

Deno.test("images.tag: succeeds on 201", async () => {
  let capturedPath = "";
  const api = new ImagesApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 201, json: null };
    }),
  );
  await api.tag("alpine", "myrepo", "v1");
  assertEquals(capturedPath, "/images/alpine/tag?repo=myrepo&tag=v1");
});

Deno.test("images.untag: succeeds on 201", async () => {
  let capturedPath = "";
  const api = new ImagesApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 201, json: null };
    }),
  );
  await api.untag("alpine", "myrepo");
  assertEquals(capturedPath, "/images/alpine/untag?repo=myrepo");
});

Deno.test("images.search: returns results on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Name: "alpine", Stars: 100 }],
    })),
  );
  const result = await api.search({ term: "alpine" } as never);
  assertEquals(result.length, 1);
});

Deno.test("images.history: returns history on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Id: "sha256:abc", Created: 1234567890 }],
    })),
  );
  const result = await api.history("alpine");
  assertEquals(result.length, 1);
});

Deno.test("images.prune: returns reports on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Id: "sha256:abc", Size: 1024 }],
    })),
  );
  const result = await api.prune();
  assertEquals(result.length, 1);
});

Deno.test("networks.create: returns network on 200", async () => {
  const api = new NetworksApi(
    mockTransport((_m, _p, body) => ({
      status: 200,
      json: { name: "test-net", driver: "bridge", ...(body as object) },
    })),
  );
  const result = await api.create({ name: "test-net" } as never);
  assertEquals(result.name, "test-net");
});

Deno.test("networks.create: throws on error", async () => {
  const api = new NetworksApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "create failed" },
    })),
  );
  await assertRejects(
    () => api.create({ name: "bad" } as never),
    PodmanError,
  );
});

Deno.test("networks.inspect: returns data on 200", async () => {
  const api = new NetworksApi(
    mockTransport(() => ({
      status: 200,
      json: { name: "bridge", driver: "bridge" },
    })),
  );
  const result = await api.inspect("bridge");
  assertEquals(result?.name, "bridge");
});

Deno.test("networks.inspect: returns null on 404", async () => {
  const api = new NetworksApi(
    mockTransport(() => ({ status: 404, json: { message: "not found" } })),
  );
  const result = await api.inspect("nonexistent");
  assertEquals(result, null);
});

Deno.test("networks.list: returns array on 200", async () => {
  const api = new NetworksApi(
    mockTransport(() => ({
      status: 200,
      json: [{ name: "bridge" }, { name: "podman" }],
    })),
  );
  const result = await api.list();
  assertEquals(result.length, 2);
});

Deno.test("networks.list: returns empty array on null json", async () => {
  const api = new NetworksApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  const result = await api.list();
  assertEquals(result, []);
});

Deno.test("networks.remove: succeeds on 200", async () => {
  const api = new NetworksApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  await api.remove("test-net");
});

Deno.test("networks.remove: succeeds on 204", async () => {
  const api = new NetworksApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  await api.remove("test-net");
});

Deno.test("networks.connect: succeeds on 200", async () => {
  let capturedBody: string | undefined;
  const api = new NetworksApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, body) => {
        capturedBody = typeof body === "string" ? body : undefined;
        return new Response("OK", { status: 200 });
      },
    }),
  );
  await api.connect("test-net", { container: "abc123" } as never);
  assertEquals(JSON.parse(capturedBody!).container, "abc123");
});
Deno.test("networks.disconnect: succeeds on 200", async () => {
  const api = new NetworksApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async () => new Response("OK", { status: 200 }),
    }),
  );
  await api.disconnect("test-net", { container: "abc123" } as never);
});

Deno.test("networks.prune: returns reports on 200", async () => {
  const api = new NetworksApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Name: "old-net", Error: "" }],
    })),
  );
  const result = await api.prune();
  assertEquals(result.length, 1);
});

Deno.test("API error uses 'cause' field when 'message' is absent", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 500, json: { cause: "something broke" } })),
  );
  const err = await assertRejects(() => api.inspect("x"), PodmanError);
  assertEquals(err.message, "something broke");
});

Deno.test("API error uses 'Unknown error' when json has no message fields", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 500, json: { code: 500 } })),
  );
  const err = await assertRejects(() => api.inspect("x"), PodmanError);
  assertEquals(err.message, "Unknown error");
});

Deno.test("API error includes correct method and path", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 500, json: { message: "fail" } })),
  );
  const err = await assertRejects(() => api.start("mycontainer"), PodmanError);
  assertEquals(err.method, "POST");
  assertEquals(err.path, "/containers/mycontainer/start");
});


// ---------------------------------------------------------------------------
// URL Encoding Tests
// ---------------------------------------------------------------------------

Deno.test("containers.inspect: URL-encodes slashes in nameOrId", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: { Id: "abc" } };
    }),
  );
  await api.inspect("my/container");
  assertEquals(capturedPath, "/containers/my%2Fcontainer/json");
});

Deno.test("images.inspect: URL-encodes slashes in nameOrId", async () => {
  let capturedPath = "";
  const api = new ImagesApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: { Id: "sha256:abc" } };
    }),
  );
  await api.inspect("docker.io/library/alpine");
  assertEquals(capturedPath, "/images/docker.io%2Flibrary%2Falpine/json");
});

Deno.test("networks.inspect: URL-encodes slashes in nameOrId", async () => {
  let capturedPath = "";
  const api = new NetworksApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: { name: "net" } };
    }),
  );
  await api.inspect("my/net");
  assertEquals(capturedPath, "/networks/my%2Fnet");
});

Deno.test("volumes.inspect: URL-encodes slashes in nameOrId", async () => {
  let capturedPath = "";
  const api = new VolumesApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: { Name: "vol" } };
    }),
  );
  await api.inspect("my/vol");
  assertEquals(capturedPath, "/volumes/my%2Fvol/json");
});

// ---------------------------------------------------------------------------
// Containers — previously untested methods
// ---------------------------------------------------------------------------

Deno.test("containers.logs: returns ReadableStream with correct path", async () => {
  let capturedPath = "";
  const stream = new ReadableStream<Uint8Array>();
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, p) => {
        capturedPath = p;
        return stream;
      },
    }),
  );
  const result = await api.logs("abc");
  assertEquals(capturedPath, "/containers/abc/logs");
  assertEquals(result instanceof ReadableStream, true);
});

Deno.test("containers.logs: passes query params to path", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, p) => {
        capturedPath = p;
        return new ReadableStream<Uint8Array>();
      },
    }),
  );
  await api.logs("abc", { follow: true, stdout: true } as never);
  assertEquals(capturedPath, "/containers/abc/logs?follow=true&stdout=true");
});

Deno.test("containers.resize: succeeds on 200 with query params", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: null };
    }),
  );
  await api.resize("abc", { h: 24, w: 80 } as never);
  assertEquals(capturedPath, "/containers/abc/resize?h=24&w=80");
});

Deno.test("containers.export: returns ReadableStream with correct path", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, p) => {
        capturedPath = p;
        return new ReadableStream<Uint8Array>();
      },
    }),
  );
  const result = await api.export("abc");
  assertEquals(capturedPath, "/containers/abc/export");
  assertEquals(result instanceof ReadableStream, true);
});

Deno.test("containers.checkpoint: succeeds on 200", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  await api.checkpoint("abc");
});

Deno.test("containers.checkpoint: passes query params", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: null };
    }),
  );
  await api.checkpoint("abc", { export: "/tmp/cp" } as never);
  assertEquals(capturedPath, "/containers/abc/checkpoint?export=%2Ftmp%2Fcp");
});

Deno.test("containers.restore: succeeds on 200", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  await api.restore("abc");
});

Deno.test("containers.restore: passes query params", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: null };
    }),
  );
  await api.restore("abc", { name: "new" } as never);
  assertEquals(capturedPath, "/containers/abc/restore?name=new");
});

Deno.test("containers.restart: passes timeout query", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 204, json: null };
    }),
  );
  await api.restart("abc", { timeout: 5 } as never);
  assertEquals(capturedPath, "/containers/abc/restart?timeout=5");
});

// ---------------------------------------------------------------------------
// Images — previously untested methods
// ---------------------------------------------------------------------------

Deno.test("images.push: succeeds on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  await api.push("alpine");
});

Deno.test("images.push: passes query params", async () => {
  let capturedPath = "";
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, p, _b, _h) => {
        capturedPath = p;
        return new Response(null, { status: 200 });
      },
    }),
  );
  await api.push("alpine", { destination: "docker.io/foo" } as never);
  assertEquals(capturedPath, "/images/alpine/push?destination=docker.io%2Ffoo");
});
Deno.test("images.push: throws PodmanError on 500", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ message: "push failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }),
    }),
  );
  const err = await assertRejects(() => api.push("alpine"), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("images.import: returns image ID on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ Id: "sha256:abc" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    }),
  );
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      c.close();
    },
  });
  const result = await api.import(stream, { reference: "myimage" } as never);
  assertEquals(result, "sha256:abc");
});

Deno.test("images.import: throws on non-200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ message: "import failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }),
    }),
  );
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      c.close();
    },
  });
  const err = await assertRejects(() => api.import(stream), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("images.export: returns ReadableStream with correct path", async () => {
  let capturedPath = "";
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, p) => {
        capturedPath = p;
        return new ReadableStream<Uint8Array>();
      },
    }),
  );
  const result = await api.export("alpine");
  assertEquals(capturedPath, "/images/alpine/get");
  assertEquals(result instanceof ReadableStream, true);
});

Deno.test("images.build: returns ReadableStream on success", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) => {
        const body = new ReadableStream<Uint8Array>({
          start(c) {
            c.close();
          },
        });
        return new Response(body, { status: 200 });
      },
    }),
  );
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      c.close();
    },
  });
  const result = await api.build(stream);
  assertEquals(result instanceof ReadableStream, true);
});

Deno.test("images.build: throws on 400+", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ message: "build failed" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }),
    }),
  );
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      c.close();
    },
  });
  const err = await assertRejects(() => api.build(stream), PodmanError);
  assertEquals(err.status, 400);
});

// ---------------------------------------------------------------------------
// VolumesApi Tests
// ---------------------------------------------------------------------------

Deno.test("volumes.create: returns volume on 201", async () => {
  const api = new VolumesApi(
    mockTransport(() => ({
      status: 201,
      json: { Name: "myvol", Driver: "local" },
    })),
  );
  const result = await api.create({ Name: "myvol" } as never);
  assertEquals(result.Name, "myvol");
});

Deno.test("volumes.create: throws PodmanError on 500", async () => {
  const api = new VolumesApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "create failed" },
    })),
  );
  const err = await assertRejects(
    () => api.create({ Name: "bad" } as never),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("volumes.inspect: returns data on 200", async () => {
  const api = new VolumesApi(
    mockTransport(() => ({
      status: 200,
      json: { Name: "myvol", Driver: "local" },
    })),
  );
  const result = await api.inspect("myvol");
  assertEquals(result?.Name, "myvol");
});

Deno.test("volumes.inspect: returns null on 404", async () => {
  const api = new VolumesApi(
    mockTransport(() => ({ status: 404, json: { message: "not found" } })),
  );
  const result = await api.inspect("nonexistent");
  assertEquals(result, null);
});

Deno.test("volumes.inspect: throws on 500", async () => {
  const api = new VolumesApi(
    mockTransport(() => ({ status: 500, json: { message: "internal" } })),
  );
  const err = await assertRejects(() => api.inspect("x"), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("volumes.list: returns array on 200", async () => {
  const api = new VolumesApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Name: "v1" }, { Name: "v2" }],
    })),
  );
  const result = await api.list();
  assertEquals(result.length, 2);
});

Deno.test("volumes.list: returns empty array on null json", async () => {
  const api = new VolumesApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  const result = await api.list();
  assertEquals(result, []);
});

Deno.test("volumes.remove: succeeds on 204", async () => {
  const api = new VolumesApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  await api.remove("myvol");
});

Deno.test("volumes.remove: throws on 500", async () => {
  const api = new VolumesApi(
    mockTransport(() => ({ status: 500, json: { message: "remove failed" } })),
  );
  const err = await assertRejects(() => api.remove("x"), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("volumes.remove: passes force query", async () => {
  let capturedPath = "";
  const api = new VolumesApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 204, json: null };
    }),
  );
  await api.remove("myvol", { force: true } as never);
  assertEquals(capturedPath, "/volumes/myvol?force=true");
});

Deno.test("volumes.exists: returns true on 204, false on 404", async () => {
  const apiTrue = new VolumesApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  assertEquals(await apiTrue.exists("myvol"), true);

  const apiFalse = new VolumesApi(
    mockTransport(() => ({ status: 404, json: null })),
  );
  assertEquals(await apiFalse.exists("myvol"), false);
});

Deno.test("volumes.prune: returns array on 200", async () => {
  const api = new VolumesApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Id: "sha256:abc", Size: 1024 }],
    })),
  );
  const result = await api.prune();
  assertEquals(result.length, 1);
});

// ---------------------------------------------------------------------------
// PodsApi Tests
// ---------------------------------------------------------------------------

Deno.test("pods.create: returns IDResponse on 201", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 201,
      json: { Id: "pod123" },
    })),
  );
  const result = await api.create({ name: "mypod" } as never);
  assertEquals(result.Id, "pod123");
});

Deno.test("pods.create: throws on 500", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "create failed" },
    })),
  );
  const err = await assertRejects(
    () => api.create({ name: "bad" } as never),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("pods.inspect: returns data on 200", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 200,
      json: { Id: "pod123", Name: "mypod" },
    })),
  );
  const result = await api.inspect("mypod");
  assertEquals(result?.Id, "pod123");
});

Deno.test("pods.inspect: returns null on 404", async () => {
  const api = new PodsApi(
    mockTransport(() => ({ status: 404, json: { message: "not found" } })),
  );
  const result = await api.inspect("nonexistent");
  assertEquals(result, null);
});

Deno.test("pods.inspect: throws on 500", async () => {
  const api = new PodsApi(
    mockTransport(() => ({ status: 500, json: { message: "internal" } })),
  );
  const err = await assertRejects(() => api.inspect("x"), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("pods.list: returns array on 200", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Id: "p1" }, { Id: "p2" }],
    })),
  );
  const result = await api.list();
  assertEquals(result.length, 2);
});

Deno.test("pods.list: returns empty array on null json", async () => {
  const api = new PodsApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  const result = await api.list();
  assertEquals(result, []);
});

Deno.test("pods.list: passes query params to path", async () => {
  let capturedPath = "";
  const api = new PodsApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: [] };
    }),
  );
  await api.list({ filters: { name: ["test"] } } as never);
  assertEquals(
    capturedPath,
    "/pods/json?filters=%7B%22name%22%3A%5B%22test%22%5D%7D",
  );
});

Deno.test("pods.remove: returns PodRmReport on 200", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 200,
      json: { Id: "pod123" },
    })),
  );
  const result = await api.remove("mypod");
  assertEquals(result.Id, "pod123");
});

Deno.test("pods.remove: passes force query", async () => {
  let capturedPath = "";
  const api = new PodsApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: { Id: "pod123" } };
    }),
  );
  await api.remove("mypod", { force: true } as never);
  assertEquals(capturedPath, "/pods/mypod?force=true");
});

Deno.test("pods.remove: throws on 500", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "remove failed" },
    })),
  );
  const err = await assertRejects(() => api.remove("x"), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("pods.start: returns report on 200", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 200,
      json: { Id: "pod123" },
    })),
  );
  const result = await api.start("mypod");
  assertEquals(result.Id, "pod123");
});

Deno.test("pods.start: succeeds on 304", async () => {
  const api = new PodsApi(
    mockTransport(() => ({ status: 304, json: null })),
  );
  await api.start("mypod");
});

Deno.test("pods.start: throws on 500", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "start failed" },
    })),
  );
  const err = await assertRejects(() => api.start("x"), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("pods.stop: returns report on 200", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 200,
      json: { Id: "pod123" },
    })),
  );
  const result = await api.stop("mypod");
  assertEquals(result.Id, "pod123");
});

Deno.test("pods.stop: succeeds on 304", async () => {
  const api = new PodsApi(
    mockTransport(() => ({ status: 304, json: null })),
  );
  await api.stop("mypod");
});

Deno.test("pods.stop: passes timeout query", async () => {
  let capturedPath = "";
  const api = new PodsApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: { Id: "pod123" } };
    }),
  );
  await api.stop("mypod", { timeout: 10 } as never);
  assertEquals(capturedPath, "/pods/mypod/stop?timeout=10");
});

Deno.test("pods.restart: returns report on 200", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 200,
      json: { Id: "pod123" },
    })),
  );
  const result = await api.restart("mypod");
  assertEquals(result.Id, "pod123");
});

Deno.test("pods.restart: throws on 500", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "restart failed" },
    })),
  );
  const err = await assertRejects(() => api.restart("x"), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("pods.kill: returns report on 200", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 200,
      json: { Id: "pod123" },
    })),
  );
  const result = await api.kill("mypod");
  assertEquals(result.Id, "pod123");
});

Deno.test("pods.kill: passes signal query", async () => {
  let capturedPath = "";
  const api = new PodsApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: { Id: "pod123" } };
    }),
  );
  await api.kill("mypod", { signal: "SIGKILL" } as never);
  assertEquals(capturedPath, "/pods/mypod/kill?signal=SIGKILL");
});

Deno.test("pods.kill: throws on 500", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "kill failed" },
    })),
  );
  const err = await assertRejects(() => api.kill("x"), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("pods.pause: returns report on 200", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 200,
      json: { Id: "pod123" },
    })),
  );
  const result = await api.pause("mypod");
  assertEquals(result.Id, "pod123");
});

Deno.test("pods.unpause: returns report on 200", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 200,
      json: { Id: "pod123" },
    })),
  );
  const result = await api.unpause("mypod");
  assertEquals(result.Id, "pod123");
});

Deno.test("pods.top: returns PodTopOKBody on 200", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 200,
      json: { Processes: [["root", "1"]], Titles: ["USER", "PID"] },
    })),
  );
  const result = await api.top("mypod");
  assertEquals(result.Titles?.length, 2);
});

Deno.test("pods.top: passes query params", async () => {
  let capturedPath = "";
  const api = new PodsApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return {
        status: 200,
        json: { Processes: [], Titles: [] },
      };
    }),
  );
  await api.top("mypod", { ps_args: "-ef" } as never);
  assertEquals(capturedPath, "/pods/mypod/top?ps_args=-ef");
});

Deno.test("pods.exists: returns true on 204, false on 404", async () => {
  const apiTrue = new PodsApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  assertEquals(await apiTrue.exists("mypod"), true);

  const apiFalse = new PodsApi(
    mockTransport(() => ({ status: 404, json: null })),
  );
  assertEquals(await apiFalse.exists("mypod"), false);
});

Deno.test("pods.stats: returns array on 200", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 200,
      json: [{ CID: "ctr1", CPU: "10.5%" }],
    })),
  );
  const result = await api.stats();
  assertEquals(result.length, 1);
});

Deno.test("pods.stats: passes query params", async () => {
  let capturedPath = "";
  const api = new PodsApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: [] };
    }),
  );
  await api.stats({ all: true } as never);
  assertEquals(capturedPath, "/pods/stats?all=true");
});

Deno.test("pods.prune: returns report on 200", async () => {
  const api = new PodsApi(
    mockTransport(() => ({
      status: 200,
      json: { Id: "pod123" },
    })),
  );
  const result = await api.prune();
  assertEquals(result.Id, "pod123");
});

// ---------------------------------------------------------------------------
// SecretsApi Tests
// ---------------------------------------------------------------------------

Deno.test("secrets.create: returns report on 201", async () => {
  const api = new SecretsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ ID: "abc123" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }),
    }),
  );
  const result = await api.create("mysecret", { name: "sec1" } as never);
  assertEquals(result.ID, "abc123");
});

Deno.test("secrets.create: throws on non-201", async () => {
  const api = new SecretsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ message: "secret error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }),
    }),
  );
  const err = await assertRejects(
    () => api.create("mysecret", { name: "sec1" } as never),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("secrets.inspect: returns data on 200", async () => {
  const api = new SecretsApi(
    mockTransport(() => ({
      status: 200,
      json: { ID: "abc123", Spec: { Name: "sec1" } },
    })),
  );
  const result = await api.inspect("sec1");
  assertEquals(result?.ID, "abc123");
});

Deno.test("secrets.inspect: returns null on 404", async () => {
  const api = new SecretsApi(
    mockTransport(() => ({ status: 404, json: { message: "not found" } })),
  );
  const result = await api.inspect("nonexistent");
  assertEquals(result, null);
});

Deno.test("secrets.inspect: throws on 500", async () => {
  const api = new SecretsApi(
    mockTransport(() => ({ status: 500, json: { message: "internal" } })),
  );
  const err = await assertRejects(() => api.inspect("x"), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("secrets.list: returns array on 200", async () => {
  const api = new SecretsApi(
    mockTransport(() => ({
      status: 200,
      json: [{ ID: "s1" }, { ID: "s2" }],
    })),
  );
  const result = await api.list();
  assertEquals(result.length, 2);
});

Deno.test("secrets.list: returns empty array on null json", async () => {
  const api = new SecretsApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  const result = await api.list();
  assertEquals(result, []);
});

Deno.test("secrets.remove: succeeds on 204", async () => {
  const api = new SecretsApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  await api.remove("sec1");
});

Deno.test("secrets.remove: throws on 500", async () => {
  const api = new SecretsApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "remove failed" },
    })),
  );
  const err = await assertRejects(() => api.remove("x"), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("secrets.exists: returns true on 204, false on 404", async () => {
  const apiTrue = new SecretsApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  assertEquals(await apiTrue.exists("sec1"), true);

  const apiFalse = new SecretsApi(
    mockTransport(() => ({ status: 404, json: null })),
  );
  assertEquals(await apiFalse.exists("sec1"), false);
});

// ---------------------------------------------------------------------------
// SystemApi Tests
// ---------------------------------------------------------------------------

Deno.test("system.info: returns LibpodInfo on 200", async () => {
  const api = new SystemApi(
    mockTransport(() => ({
      status: 200,
      json: { host: { hostname: "test" }, version: { Version: "4.0.0" } },
    })),
  );
  const result = await api.info();
  assertEquals(result.host?.hostname, "test");
});

Deno.test("system.info: throws on 500", async () => {
  const api = new SystemApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "info failed" },
    })),
  );
  const err = await assertRejects(() => api.info(), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("system.version: returns version on 200", async () => {
  const api = new SystemApi(
    mockTransport(() => ({
      status: 200,
      json: { Version: "4.0.0", ApiVersion: "4.0.0" },
    })),
  );
  const result = await api.version();
  assertEquals(result.Version, "4.0.0");
});

Deno.test("system.version: throws on 500", async () => {
  const api = new SystemApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "version failed" },
    })),
  );
  const err = await assertRejects(() => api.version(), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("system.ping: returns true on 200", async () => {
  const api = new SystemApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () => Promise.resolve(new Response("OK", { status: 200 })),
    }),
  );
  assertEquals(await api.ping(), true);
});
Deno.test("system.ping: returns false on non-200", async () => {
  const api = new SystemApi(
    mockTransport(() => ({ status: 500, json: null }), {
      requestRaw: () => Promise.resolve(new Response(null, { status: 500 })),
    }),
  );
  assertEquals(await api.ping(), false);
});

Deno.test("system.prune: returns report on 200", async () => {
  const api = new SystemApi(
    mockTransport(() => ({
      status: 200,
      json: {
        ContainerPruneReports: [],
        ImagePruneReports: [],
        ReclaimedSpace: 0,
      },
    })),
  );
  const result = await api.prune();
  assertEquals(result.ReclaimedSpace, 0);
});

Deno.test("system.prune: throws on 500", async () => {
  const api = new SystemApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "prune failed" },
    })),
  );
  const err = await assertRejects(() => api.prune(), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("system.events: returns ReadableStream", async () => {
  const stream = new ReadableStream<Uint8Array>();
  const api = new SystemApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, _p) => stream,
    }),
  );
  const result = await api.events();
  assertEquals(result instanceof ReadableStream, true);
});

Deno.test("system.events: passes query params", async () => {
  let capturedPath = "";
  const api = new SystemApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, p) => {
        capturedPath = p;
        return new ReadableStream<Uint8Array>();
      },
    }),
  );
  await api.events({ since: "2024-01-01" } as never);
  assertEquals(capturedPath, "/events?since=2024-01-01");
});


// ---------------------------------------------------------------------------
// Containers — new methods
// ---------------------------------------------------------------------------

Deno.test("containers.exists: returns true on 204", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  assertEquals(await api.exists("abc"), true);
});

Deno.test("containers.exists: returns false on 404", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 404, json: null })),
  );
  assertEquals(await api.exists("abc"), false);
});

Deno.test("containers.prune: returns array on 200", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Id: "ctr1", Size: 512 }],
    })),
  );
  const result = await api.prune();
  assertEquals(result.length, 1);
});

Deno.test("containers.prune: throws on error", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 500, json: { message: "prune failed" } })),
  );
  const err = await assertRejects(() => api.prune(), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("containers.stats: returns ReadableStream with correct path", async () => {
  let capturedPath = "";
  const stream = new ReadableStream<Uint8Array>();
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, p) => {
        capturedPath = p;
        return stream;
      },
    }),
  );
  const result = await api.stats("abc");
  assertEquals(capturedPath, "/containers/abc/stats");
  assertEquals(result instanceof ReadableStream, true);
});

Deno.test("containers.attach: returns ReadableStream with correct path", async () => {
  let capturedPath = "";
  const stream = new ReadableStream<Uint8Array>();
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, p) => {
        capturedPath = p;
        return stream;
      },
    }),
  );
  const result = await api.attach("abc");
  assertEquals(capturedPath, "/containers/abc/attach");
  assertEquals(result instanceof ReadableStream, true);
});

Deno.test("containers.getArchive: returns ReadableStream with query path", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, p) => {
        capturedPath = p;
        return new ReadableStream<Uint8Array>();
      },
    }),
  );
  const result = await api.getArchive("abc", { path: "/etc/hosts" } as never);
  assertEquals(capturedPath, "/containers/abc/archive?path=%2Fetc%2Fhosts");
  assertEquals(result instanceof ReadableStream, true);
});

Deno.test("containers.putArchive: succeeds on 200", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(null, { status: 200 }),
    }),
  );
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      c.close();
    },
  });
  await api.putArchive("abc", stream, { path: "/tmp" } as never);
});

Deno.test("containers.putArchive: throws on error", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ message: "archive failed" }), {
          status: 500,
        }),
    }),
  );
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      c.close();
    },
  });
  const err = await assertRejects(
    () => api.putArchive("abc", stream, { path: "/tmp" } as never),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("containers.healthcheck: returns HealthCheckResults on 200", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({
      status: 200,
      json: { Status: "healthy", FailingStreak: 0, Log: [] },
    })),
  );
  const result = await api.healthcheck("abc");
  assertEquals(result.Status, "healthy");
});

Deno.test("containers.healthcheck: throws on error", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 404, json: { message: "not found" } })),
  );
  const err = await assertRejects(
    () => api.healthcheck("abc"),
    PodmanError,
  );
  assertEquals(err.status, 404);
});

Deno.test("containers.init: succeeds on 204", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  await api.init("abc");
});

Deno.test("containers.init: succeeds on 304", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 304, json: null })),
  );
  await api.init("abc");
});

Deno.test("containers.init: throws on error", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 404, json: { message: "not found" } })),
  );
  await assertRejects(() => api.init("abc"), PodmanError);
});

Deno.test("containers.update: succeeds on 201 with body", async () => {
  let capturedBody: unknown;
  const api = new ContainersApi(
    mockTransport((_m, _p, body) => {
      capturedBody = body;
      return { status: 201, json: null };
    }),
  );
  await api.update("abc", { CpuPeriod: 100000 } as never);
  assertEquals((capturedBody as { CpuPeriod: number }).CpuPeriod, 100000);
});

Deno.test("containers.update: throws on error", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 500, json: { message: "update failed" } })),
  );
  const err = await assertRejects(
    () => api.update("abc", {} as never),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("containers.changes: returns array on 200", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Path: "/tmp/foo", Kind: 0 }],
    })),
  );
  const result = await api.changes("abc");
  assertEquals(result.length, 1);
});

// ---------------------------------------------------------------------------
// Images — new methods
// ---------------------------------------------------------------------------

Deno.test("images.exists: returns true on 204", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  assertEquals(await api.exists("alpine"), true);
});

Deno.test("images.exists: returns false on 404", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 404, json: null })),
  );
  assertEquals(await api.exists("alpine"), false);
});

Deno.test("images.commit: succeeds on 201 with query path", async () => {
  let capturedPath = "";
  const api = new ImagesApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 201, json: null };
    }),
  );
  await api.commit({ container: "abc", repo: "myimage" } as never);
  assertEquals(capturedPath.startsWith("/commit?"), true);
  assertEquals(capturedPath.includes("container=abc"), true);
});

Deno.test("images.commit: throws on error", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 500, json: { message: "commit failed" } })),
  );
  const err = await assertRejects(
    () => api.commit({ container: "abc" } as never),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

// ---------------------------------------------------------------------------
// Volumes — prune type fix verification
// ---------------------------------------------------------------------------

Deno.test("volumes.prune: returns array on 200 (type fix verification)", async () => {
  const api = new VolumesApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Id: "vol1", Size: 2048 }],
    })),
  );
  const result = await api.prune();
  assertEquals(result.length, 1);
});

// ---------------------------------------------------------------------------
// ExecApi Tests
// ---------------------------------------------------------------------------

Deno.test("exec.create: returns exec ID on 201", async () => {
  let capturedPath = "";
  const api = new ExecApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, p, _b, _h) => {
        capturedPath = p;
        return new Response(JSON.stringify({ Id: "exec123" }), { status: 201 });
      },
    }),
  );
  const id = await api.create("mycontainer", {} as never);
  assertEquals(id, "exec123");
  assertEquals(capturedPath, "/containers/mycontainer/exec");
});

Deno.test("exec.create: throws on non-201", async () => {
  const api = new ExecApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ message: "create failed" }), {
          status: 500,
        }),
    }),
  );
  const err = await assertRejects(
    () => api.create("mycontainer", {} as never),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("exec.start: returns ReadableStream on success", async () => {
  let capturedPath = "";
  const api = new ExecApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, p, _b, _h) => {
        capturedPath = p;
        const body = new ReadableStream<Uint8Array>({
          start(c) {
            c.close();
          },
        });
        return new Response(body, { status: 200 });
      },
    }),
  );
  const result = await api.start("exec123");
  assertEquals(capturedPath, "/exec/exec123/start");
  assertEquals(result instanceof ReadableStream, true);
});

Deno.test("exec.start: throws on 400+ error", async () => {
  const api = new ExecApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ message: "start failed" }), {
          status: 404,
        }),
    }),
  );
  const err = await assertRejects(
    () => api.start("exec123"),
    PodmanError,
  );
  assertEquals(err.status, 404);
});

Deno.test("exec.inspect: returns InspectExecSession on 200", async () => {
  const api = new ExecApi(
    mockTransport(() => ({
      status: 200,
      json: { ID: "exec123", ExitCode: 0, Running: false },
    })),
  );
  const result = await api.inspect("exec123");
  assertEquals(result.ID, "exec123");
});

Deno.test("exec.inspect: throws on error", async () => {
  const api = new ExecApi(
    mockTransport(() => ({ status: 404, json: { message: "not found" } })),
  );
  const err = await assertRejects(
    () => api.inspect("exec123"),
    PodmanError,
  );
  assertEquals(err.status, 404);
});

Deno.test("exec.resize: succeeds on 201 with query params", async () => {
  let capturedPath = "";
  const api = new ExecApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 201, json: null };
    }),
  );
  await api.resize("exec123", { h: 24, w: 80 } as never);
  assertEquals(capturedPath, "/exec/exec123/resize?h=24&w=80");
});

Deno.test("exec.resize: throws on error", async () => {
  const api = new ExecApi(
    mockTransport(() => ({ status: 404, json: { message: "not found" } })),
  );
  const err = await assertRejects(
    () => api.resize("exec123", { h: 24, w: 80 } as never),
    PodmanError,
  );
  assertEquals(err.status, 404);
});

// ---------------------------------------------------------------------------
// GenerateApi Tests
// ---------------------------------------------------------------------------

Deno.test("generate.systemd: returns Record on 200 with correct path", async () => {
  let capturedPath = "";
  const api = new GenerateApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return {
        status: 200,
        json: { "container-abc.service": "[Unit]\nDescription=..." },
      };
    }),
  );
  const result = await api.systemd("abc");
  assertEquals(capturedPath, "/generate/abc/systemd");
  assertEquals(result["container-abc.service"], "[Unit]\nDescription=...");
});

Deno.test("generate.systemd: throws on error", async () => {
  const api = new GenerateApi(
    mockTransport(() => ({ status: 500, json: { message: "generate failed" } })),
  );
  const err = await assertRejects(
    () => api.systemd("abc"),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("generate.kube: returns YAML string on success", async () => {
  const api = new GenerateApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p) =>
        new Response("apiVersion: v1\nkind: Pod", { status: 200 }),
    }),
  );
  const result = await api.kube({ names: ["mypod"] } as never);
  assertEquals(result, "apiVersion: v1\nkind: Pod");
});

Deno.test("generate.kube: throws on 400+ error", async () => {
  const api = new GenerateApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p) =>
        new Response(JSON.stringify({ message: "kube failed" }), {
          status: 500,
        }),
    }),
  );
  const err = await assertRejects(
    () => api.kube({ names: ["bad"] } as never),
    PodmanError,
  );
  assertEquals(err.status, 500);
});
