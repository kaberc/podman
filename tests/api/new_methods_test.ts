import { assertEquals, assertRejects } from "@std/assert";
import { PodmanError } from "../../types/errors.ts";
import { ContainersApi } from "../../api/containers.ts";
import { ImagesApi } from "../../api/images.ts";
import { NetworksApi } from "../../api/networks.ts";
import { VolumesApi } from "../../api/volumes.ts";
import { SystemApi } from "../../api/system.ts";
import { mockTransport } from "./_test_helpers.ts";

// ---------------------------------------------------------------------------
// Networks — untested methods
// ---------------------------------------------------------------------------

Deno.test("networks.exists: returns true on 204, false on 404", async () => {
  const apiTrue = new NetworksApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  assertEquals(await apiTrue.exists("mynet"), true);

  const apiFalse = new NetworksApi(
    mockTransport(() => ({ status: 404, json: null })),
  );
  assertEquals(await apiFalse.exists("mynet"), false);
});

Deno.test("networks.update: succeeds on 200", async () => {
  let capturedPath = "";
  const api = new NetworksApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: null };
    }),
  );
  await api.update("mynet", { dns: ["8.8.8.8"] } as never);
  assertEquals(capturedPath.includes("mynet"), true);
});

Deno.test("networks.update: throws PodmanError on 500", async () => {
  const api = new NetworksApi(
    mockTransport(() => ({ status: 500, json: { message: "update failed" } })),
  );
  const err = await assertRejects(
    () => api.update("mynet", { dns: ["8.8.8.8"] } as never),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

// ---------------------------------------------------------------------------
// System — untested methods
// ---------------------------------------------------------------------------

Deno.test("system.df: returns SystemDfReport on 200", async () => {
  const api = new SystemApi(
    mockTransport(() => ({
      status: 200,
      json: { Images: [], Containers: [], Volumes: [] },
    })),
  );
  const result = await api.df();
  assertEquals(result.Images, []);
  assertEquals(result.Containers, []);
});

Deno.test("system.df: throws PodmanError on 500", async () => {
  const api = new SystemApi(
    mockTransport(() => ({ status: 500, json: { message: "df failed" } })),
  );
  const err = await assertRejects(() => api.df(), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("system.check: returns SystemCheckReport on 200", async () => {
  const api = new SystemApi(
    mockTransport(() => ({
      status: 200,
      json: { Errors: false },
    })),
  );
  const result = await api.check();
  assertEquals(result.Errors, false);
});

Deno.test("system.check: throws PodmanError on 500", async () => {
  const api = new SystemApi(
    mockTransport(() => ({ status: 500, json: { message: "check failed" } })),
  );
  const err = await assertRejects(() => api.check(), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("system.check: passes query params", async () => {
  let capturedPath = "";
  const api = new SystemApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: { Errors: false } };
    }),
  );
  await api.check({ quick: true } as never);
  assertEquals(capturedPath.includes("quick=true"), true);
});

// ---------------------------------------------------------------------------
// Containers — untested methods
// ---------------------------------------------------------------------------

Deno.test("containers.mount: returns mount path on 200", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({
      status: 200,
      json: "/var/lib/containers/storage/overlay/abc/merged",
    })),
  );
  const result = await api.mount("abc123");
  assertEquals(result, "/var/lib/containers/storage/overlay/abc/merged");
});

Deno.test("containers.mount: throws PodmanError on 500", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 500, json: { message: "mount failed" } })),
  );
  const err = await assertRejects(
    () => api.mount("abc123"),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("containers.mount: sends correct path", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: "/mnt" };
    }),
  );
  await api.mount("ctr1");
  assertEquals(capturedPath, "/containers/ctr1/mount");
});

Deno.test("containers.unmount: succeeds on 204", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 204, json: null })),
  );
  await api.unmount("abc123");
});

Deno.test("containers.unmount: throws PodmanError on 500", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({ status: 500, json: { message: "unmount failed" } })),
  );
  const err = await assertRejects(
    () => api.unmount("abc123"),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("containers.showMounted: returns record on 200", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({
      status: 200,
      json: { "abc123": "/mount/path" },
    })),
  );
  const result = await api.showMounted();
  assertEquals(result["abc123"], "/mount/path");
});

Deno.test("containers.showMounted: throws PodmanError on 500", async () => {
  const api = new ContainersApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "showmounted failed" },
    })),
  );
  const err = await assertRejects(() => api.showMounted(), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("containers.statsAll: returns stream with correct path", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, p) => {
        capturedPath = p;
        return new ReadableStream<Uint8Array>();
      },
    }),
  );
  const result = await api.statsAll();
  assertEquals(capturedPath, "/containers/stats");
  assertEquals(result instanceof ReadableStream, true);
});

Deno.test("containers.statsAll: passes query params", async () => {
  let capturedPath = "";
  const api = new ContainersApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, p) => {
        capturedPath = p;
        return new ReadableStream<Uint8Array>();
      },
    }),
  );
  await api.statsAll({ stream: true } as never);
  assertEquals(capturedPath.includes("stream=true"), true);
});

// ---------------------------------------------------------------------------
// Images — untested methods
// ---------------------------------------------------------------------------

Deno.test("images.load: returns ImageLoadReport on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ Names: ["alpine:latest"] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    }),
  );
  const result = await api.load(new ReadableStream());
  assertEquals(result.Names, ["alpine:latest"]);
});

Deno.test("images.load: throws PodmanError on 500", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ message: "load failed" }), {
          status: 500,
        }),
    }),
  );
  const err = await assertRejects(
    () => api.load(new ReadableStream()),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("images.tree: returns ImageTreeReport on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({
      status: 200,
      json: { Tree: "└── sha256:abc" },
    })),
  );
  const result = await api.tree("alpine");
  assertEquals(result.Tree, "└── sha256:abc");
});

Deno.test("images.tree: throws PodmanError on 500", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 500, json: { message: "tree failed" } })),
  );
  const err = await assertRejects(
    () => api.tree("alpine"),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("images.tree: path includes nameOrId", async () => {
  let capturedPath = "";
  const api = new ImagesApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: { Tree: "" } };
    }),
  );
  await api.tree("myimage");
  assertEquals(capturedPath, "/images/myimage/tree");
});

Deno.test("images.changes: returns array on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({
      status: 200,
      json: [{ Path: "/etc", Kind: 0 }],
    })),
  );
  const result = await api.changes("alpine");
  assertEquals(result.length, 1);
  assertEquals((result[0] as { Path: string }).Path, "/etc");
});

Deno.test("images.changes: returns empty array on null json", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null })),
  );
  const result = await api.changes("alpine");
  assertEquals(result, []);
});

Deno.test("images.resolve: returns full name on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: "docker.io/library/alpine:latest" })),
  );
  const result = await api.resolve("alpine");
  assertEquals(result, "docker.io/library/alpine:latest");
});

Deno.test("images.resolve: throws PodmanError on 500", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 500, json: { message: "resolve failed" } })),
  );
  const err = await assertRejects(
    () => api.resolve("alpine"),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("images.resolve: sends correct path", async () => {
  let capturedPath = "";
  const api = new ImagesApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: "docker.io/library/myimage:latest" };
    }),
  );
  await api.resolve("myimage");
  assertEquals(capturedPath, "/images/myimage/resolve");
});

Deno.test("images.exportMultiple: returns stream with correct path", async () => {
  let capturedPath = "";
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, p) => {
        capturedPath = p;
        return new ReadableStream<Uint8Array>();
      },
    }),
  );
  const result = await api.exportMultiple();
  assertEquals(capturedPath, "/images/export");
  assertEquals(result instanceof ReadableStream, true);
});

Deno.test("images.removeAll: returns ImageRemoveReport on 200", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({
      status: 200,
      json: { ExitCode: 0 },
    })),
  );
  const result = await api.removeAll();
  assertEquals(result.ExitCode, 0);
});

Deno.test("images.removeAll: throws PodmanError on 500", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "delete failed" },
    })),
  );
  const err = await assertRejects(() => api.removeAll(), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("images.scp: returns ScpReport on 200", async () => {
  let capturedPath = "";
  const api = new ImagesApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: { Id: "sha256:abc" } };
    }),
  );
  const result = await api.scp("myimage");
  assertEquals(result.Id, "sha256:abc");
  assertEquals(capturedPath.includes("myimage"), true);
});

Deno.test("images.scp: throws PodmanError on 500", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "scp failed" },
    })),
  );
  const err = await assertRejects(
    () => api.scp("myimage"),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("images.scp: path includes nameOrId", async () => {
  let capturedPath = "";
  const api = new ImagesApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: { Id: "sha256:abc" } };
    }),
  );
  await api.scp("docker.io/library/alpine");
  assertEquals(
    capturedPath,
    "/images/scp/docker.io%2Flibrary%2Falpine",
  );
});

// ---------------------------------------------------------------------------
// Images — loadLocal / buildLocal (local file operations)
// ---------------------------------------------------------------------------

Deno.test("images.loadLocal: returns ImageLoadReport on 200", async () => {
  let capturedPath = "";
  const api = new ImagesApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: { Names: ["alpine:latest"] } };
    }),
  );
  const result = await api.loadLocal({ source: "/tmp/alpine.tar" } as never);
  assertEquals(result.Names, ["alpine:latest"]);
  assertEquals(capturedPath.includes("/local/images/load"), true);
  assertEquals(capturedPath.includes("source="), true);
});

Deno.test("images.loadLocal: throws PodmanError on 500", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "loadLocal failed" },
    })),
  );
  const err = await assertRejects(
    () => api.loadLocal({ source: "/tmp/alpine.tar" } as never),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("images.buildLocal: returns stream on success", async () => {
  let capturedPath = "";
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, p, _b, _h) => {
        capturedPath = p;
        return new Response(new ReadableStream<Uint8Array>(), {
          status: 200,
        });
      },
    }),
  );
  const result = await api.buildLocal({ contextdir: "/src" } as never);
  assertEquals(result instanceof ReadableStream, true);
  assertEquals(capturedPath.includes("/local/build"), true);
  assertEquals(capturedPath.includes("contextdir="), true);
});

Deno.test("images.buildLocal: throws PodmanError on 400", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ message: "build failed" }), {
          status: 400,
        }),
    }),
  );
  const err = await assertRejects(
    () => api.buildLocal({ contextdir: "/src" } as never),
    PodmanError,
  );
  assertEquals(err.status, 400);
});

Deno.test("images.buildLocal: throws on missing response body", async () => {
  const api = new ImagesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(null, { status: 200 }),
    }),
  );
  await assertRejects(
    () => api.buildLocal({ contextdir: "/src" } as never),
    Error,
    "No response body for build",
  );
});

// ---------------------------------------------------------------------------
// Volumes — untested methods
// ---------------------------------------------------------------------------

Deno.test("volumes.export: returns stream with correct path", async () => {
  let capturedPath = "";
  const api = new VolumesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestStream: async (_m, p) => {
        capturedPath = p;
        return new ReadableStream<Uint8Array>();
      },
    }),
  );
  const result = await api.export("myvol");
  assertEquals(capturedPath, "/volumes/myvol/export");
  assertEquals(result instanceof ReadableStream, true);
});

Deno.test("volumes.import: succeeds on 204", async () => {
  let capturedPath = "";
  const api = new VolumesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, p, _b, _h) => {
        capturedPath = p;
        return new Response(null, { status: 204 });
      },
    }),
  );
  await api.import("myvol", new ReadableStream());
  assertEquals(capturedPath.includes("myvol"), true);
  assertEquals(capturedPath.includes("/import"), true);
});

Deno.test("volumes.import: throws PodmanError on 500", async () => {
  const api = new VolumesApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: async (_m, _p, _b, _h) =>
        new Response(JSON.stringify({ message: "import failed" }), {
          status: 500,
        }),
    }),
  );
  const err = await assertRejects(
    () => api.import("myvol", new ReadableStream()),
    PodmanError,
  );
  assertEquals(err.status, 500);
});
