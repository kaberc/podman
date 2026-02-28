import { assertEquals, assertRejects } from "@std/assert";
import { PodmanError } from "../../types/errors.ts";
import { ArtifactsApi } from "../../api/artifacts.ts";
import { QuadletsApi } from "../../api/quadlets.ts";
import { mockTransport } from "./_test_helpers.ts";

Deno.test("artifacts.remove: returns report on 200", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({
      status: 200,
      json: { ArtifactDigests: ["sha256:abc"] },
    })),
  );
  const result = await api.remove("myart");
  assertEquals(result.ArtifactDigests, ["sha256:abc"]);
});

Deno.test("artifacts.remove: throws PodmanError on error", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({ status: 500, json: { message: "internal" } })),
  );
  const err = await assertRejects(() => api.remove("myart"), PodmanError);
  assertEquals(err.status, 500);
  assertEquals(err.message, "internal");
});

Deno.test("artifacts.extract: returns stream via requestStream", async () => {
  let capturedPath = "";
  const stream = new ReadableStream<Uint8Array>();
  const api = new ArtifactsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: (_m, path) => {
        capturedPath = path;
        return Promise.resolve(stream);
      },
    }),
  );
  const result = await api.extract("myart");
  assertEquals(result, stream);
  assertEquals(capturedPath.includes("/artifacts/myart/extract"), true);
});

Deno.test("artifacts.inspect: returns data on 200", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({
      status: 200,
      json: { Digest: "sha256:abc", Name: "myart" },
    })),
  );
  const result = await api.inspect("myart");
  assertEquals(result?.Digest, "sha256:abc");
});

Deno.test("artifacts.inspect: returns null on 404", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({ status: 404, json: { message: "not found" } })),
  );
  const result = await api.inspect("gone");
  assertEquals(result, null);
});

Deno.test("artifacts.inspect: throws on other errors", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({ status: 500, json: { message: "internal" } })),
  );
  const err = await assertRejects(() => api.inspect("x"), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("artifacts.push: returns report on 200", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response(JSON.stringify({ ArtifactDigest: "sha256:abc" }), {
            status: 200,
          }),
        ),
    }),
  );
  const result = await api.push("myart");
  assertEquals(result.ArtifactDigest, "sha256:abc");
});

Deno.test("artifacts.push: throws PodmanError on error", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response(JSON.stringify({ message: "push failed" }), {
            status: 500,
          }),
        ),
    }),
  );
  const err = await assertRejects(() => api.push("myart"), PodmanError);
  assertEquals(err.status, 500);
  assertEquals(err.message, "push failed");
});

Deno.test("artifacts.add: returns report on 201", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response(JSON.stringify({ ArtifactDigest: "sha256:abc" }), {
            status: 201,
          }),
        ),
    }),
  );
  const result = await api.add(new ReadableStream(), {
    name: "myart",
    fileName: "file.txt",
  });
  assertEquals(result.ArtifactDigest, "sha256:abc");
});

Deno.test("artifacts.add: throws PodmanError on error", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response(JSON.stringify({ message: "add failed" }), {
            status: 500,
          }),
        ),
    }),
  );
  const err = await assertRejects(
    () => api.add(new ReadableStream(), { name: "myart", fileName: "f.txt" }),
    PodmanError,
  );
  assertEquals(err.status, 500);
  assertEquals(err.message, "add failed");
});

Deno.test("artifacts.list: returns array on 200", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Digest: "sha256:a" }, { Digest: "sha256:b" }],
    })),
  );
  const result = await api.list();
  assertEquals(result.length, 2);
});

Deno.test("artifacts.list: returns empty array on null json", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  const result = await api.list();
  assertEquals(result, []);
});

Deno.test("artifacts.addLocal: returns report on 201", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({
      status: 201,
      json: { ArtifactDigest: "sha256:abc" },
    })),
  );
  const result = await api.addLocal({
    name: "myart",
    path: "/tmp/file.txt",
    fileName: "file.txt",
  });
  assertEquals(result.ArtifactDigest, "sha256:abc");
});

Deno.test("artifacts.addLocal: throws PodmanError on error", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({ status: 500, json: { message: "fail" } })),
  );
  const err = await assertRejects(
    () => api.addLocal({ name: "x", path: "/tmp/f", fileName: "f" }),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("artifacts.pull: returns report on 200", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response(JSON.stringify({ ArtifactDigest: "sha256:abc" }), {
            status: 200,
          }),
        ),
    }),
  );
  const result = await api.pull({ name: "docker.io/lib/art:latest" });
  assertEquals(result.ArtifactDigest, "sha256:abc");
});

Deno.test("artifacts.pull: throws PodmanError on error", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response(JSON.stringify({ message: "pull failed" }), {
            status: 500,
          }),
        ),
    }),
  );
  const err = await assertRejects(
    () => api.pull({ name: "x" }),
    PodmanError,
  );
  assertEquals(err.status, 500);
  assertEquals(err.message, "pull failed");
});

Deno.test("artifacts.removeAll: returns report on 200", async () => {
  const api = new ArtifactsApi(
    mockTransport(() => ({
      status: 200,
      json: { ArtifactDigests: ["sha256:abc"] },
    })),
  );
  const result = await api.removeAll();
  assertEquals(result.ArtifactDigests, ["sha256:abc"]);
});

Deno.test("quadlets.install: returns report on 200", async () => {
  const api = new QuadletsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              InstalledQuadlets: { "test.container": "/path" },
            }),
            { status: 200 },
          ),
        ),
    }),
  );
  const result = await api.install(new ReadableStream());
  assertEquals(result.InstalledQuadlets?.["test.container"], "/path");
});

Deno.test("quadlets.install: throws PodmanError on error", async () => {
  const api = new QuadletsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response(JSON.stringify({ message: "install failed" }), {
            status: 500,
          }),
        ),
    }),
  );
  const err = await assertRejects(
    () => api.install(new ReadableStream()),
    PodmanError,
  );
  assertEquals(err.status, 500);
  assertEquals(err.message, "install failed");
});

Deno.test("quadlets.removeAll: returns report on 200", async () => {
  const api = new QuadletsApi(
    mockTransport(() => ({
      status: 200,
      json: { Removed: ["test.container"] },
    })),
  );
  const result = await api.removeAll();
  assertEquals(result.Removed, ["test.container"]);
});

Deno.test("quadlets.remove: returns report on 200", async () => {
  let capturedPath = "";
  const api = new QuadletsApi(
    mockTransport((_m, path) => {
      capturedPath = path;
      return { status: 200, json: { Removed: ["test.container"] } };
    }),
  );
  const result = await api.remove("test.container");
  assertEquals(result.Removed, ["test.container"]);
  assertEquals(capturedPath.includes("/quadlets/test.container"), true);
});

Deno.test("quadlets.exists: returns true on 204, false on 404", async () => {
  const apiTrue = new QuadletsApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  assertEquals(await apiTrue.exists("myquad"), true);

  const apiFalse = new QuadletsApi(
    mockTransport(() => ({ status: 404, json: null })),
  );
  assertEquals(await apiFalse.exists("myquad"), false);
});

Deno.test("quadlets.file: returns text content on 200", async () => {
  const api = new QuadletsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response("[Container]\nImage=alpine", { status: 200 }),
        ),
    }),
  );
  const result = await api.file("test.container");
  assertEquals(result, "[Container]\nImage=alpine");
});

Deno.test("quadlets.file: throws PodmanError on error", async () => {
  const api = new QuadletsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response(JSON.stringify({ message: "not found" }), {
            status: 404,
          }),
        ),
    }),
  );
  const err = await assertRejects(
    () => api.file("missing.container"),
    PodmanError,
  );
  assertEquals(err.status, 404);
});

Deno.test("quadlets.list: returns array on 200", async () => {
  const api = new QuadletsApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Name: "test" }],
    })),
  );
  const result = await api.list();
  assertEquals(result.length, 1);
});

Deno.test("quadlets.list: returns empty array on null json", async () => {
  const api = new QuadletsApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  const result = await api.list();
  assertEquals(result, []);
});
