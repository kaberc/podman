import { assertEquals, assertRejects } from "@std/assert";
import { PodmanError } from "../../types/errors.ts";
import { ManifestsApi } from "../../api/manifests.ts";
import { KubeApi } from "../../api/kube.ts";
import { mockTransport } from "./_test_helpers.ts";


Deno.test("manifests.create: returns IDResponse on 200", async () => {
  let capturedPath = "";
  const api = new ManifestsApi(
    mockTransport((_m, p) => {
      capturedPath = p;
      return { status: 200, json: { Id: "sha256:abc" } };
    }),
  );
  const result = await api.create("mymanifest", {} as never);
  assertEquals(result.Id, "sha256:abc");
  assertEquals(capturedPath.includes("mymanifest"), true);
});

Deno.test("manifests.create: returns IDResponse on 201", async () => {
  const api = new ManifestsApi(
    mockTransport(() => ({ status: 201, json: { Id: "sha256:def" } })),
  );
  const result = await api.create("mymanifest", {} as never);
  assertEquals(result.Id, "sha256:def");
});

Deno.test("manifests.create: throws PodmanError on 500", async () => {
  const api = new ManifestsApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "internal error" },
    })),
  );
  const err = await assertRejects(
    () => api.create("mymanifest", {} as never),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("manifests.inspect: returns data on 200", async () => {
  const api = new ManifestsApi(
    mockTransport(() => ({
      status: 200,
      json: { mediaType: "application/vnd.oci.image.index.v1+json" },
    })),
  );
  const result = await api.inspect("mymanifest");
  assertEquals(
    (result as Record<string, unknown>).mediaType,
    "application/vnd.oci.image.index.v1+json",
  );
});

Deno.test("manifests.inspect: returns null on 404", async () => {
  const api = new ManifestsApi(
    mockTransport(() => ({ status: 404, json: { message: "not found" } })),
  );
  const result = await api.inspect("missing");
  assertEquals(result, null);
});

Deno.test("manifests.inspect: throws PodmanError on 500", async () => {
  const api = new ManifestsApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "server error" },
    })),
  );
  const err = await assertRejects(
    () => api.inspect("mymanifest"),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("manifests.exists: returns true on 204, false on 404", async () => {
  const make = (status: number) =>
    new ManifestsApi(
      mockTransport(() => ({ status, json: null })),
    );
  assertEquals(await make(204).exists("mymanifest"), true);
  assertEquals(await make(404).exists("missing"), false);
});

Deno.test("manifests.modify: returns ManifestModifyReport on 200", async () => {
  const api = new ManifestsApi(
    mockTransport(() => ({
      status: 200,
      json: { images: ["sha256:abc"] },
    })),
  );
  const result = await api.modify("mymanifest", {} as never);
  assertEquals(result.images, ["sha256:abc"]);
});

Deno.test("manifests.modify: throws PodmanError on 500", async () => {
  const api = new ManifestsApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "modify failed" },
    })),
  );
  const err = await assertRejects(
    () => api.modify("mymanifest", {} as never),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("manifests.remove: returns ImageRemoveReport on 200", async () => {
  const api = new ManifestsApi(
    mockTransport(() => ({
      status: 200,
      json: { ExitCode: 0 },
    })),
  );
  const result = await api.remove("mymanifest");
  assertEquals(result.ExitCode, 0);
});

Deno.test("manifests.remove: throws PodmanError on 500", async () => {
  const api = new ManifestsApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "delete failed" },
    })),
  );
  const err = await assertRejects(
    () => api.remove("mymanifest"),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("manifests.push: returns IDResponse on 200", async () => {
  let capturedPath = "";
  let capturedHeaders: Record<string, string> | undefined;
  const api = new ManifestsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: (_m, p, _b, headers) => {
        capturedPath = p;
        capturedHeaders = headers;
        return Promise.resolve(
          new Response(JSON.stringify({ Id: "sha256:abc" }), { status: 200 }),
        );
      },
    }),
  );
  const result = await api.push("mymanifest", "docker.io/lib/alpine");
  assertEquals(result.Id, "sha256:abc");
  assertEquals(capturedPath.includes("mymanifest"), true);
  assertEquals(capturedPath.includes("docker.io"), true);
  assertEquals(capturedHeaders !== undefined, true);
});
Deno.test("manifests.push: throws PodmanError on 500", async () => {
  const api = new ManifestsApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response(JSON.stringify({ message: "push failed" }), {
            status: 500,
          }),
        ),
    }),
  );
  const err = await assertRejects(
    () => api.push("mymanifest", "docker.io/lib/alpine"),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("manifests.push: sends X-Registry-Auth header when auth configured", async () => {
  let capturedHeaders: Record<string, string> | undefined;
  const transport = mockTransport(() => ({ status: 200, json: null }), {
    requestRaw: (_m, _p, _b, headers) => {
      capturedHeaders = headers;
      return Promise.resolve(
        new Response(JSON.stringify({ Id: "sha256:abc" }), { status: 200 }),
      );
    },
  });
  // Override getAuthHeader to return a token
  transport.getAuthHeader = () => "dGVzdDp0ZXN0";
  const api = new ManifestsApi(transport);
  await api.push("mymanifest", "docker.io/lib/alpine");
  assertEquals(capturedHeaders?.["X-Registry-Auth"], "dGVzdDp0ZXN0");
});


Deno.test("kube.play: returns PlayKubeReport with string body", async () => {
  let capturedHeaders: Record<string, string> | undefined;
  const api = new KubeApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: (_m, _p, _b, headers) => {
        capturedHeaders = headers;
        return Promise.resolve(
          new Response(JSON.stringify({ Pods: [{ ID: "pod1" }] }), {
            status: 200,
          }),
        );
      },
    }),
  );
  const result = await api.play("apiVersion: v1");
  assertEquals(result.Pods?.[0]?.ID, "pod1");
  assertEquals(capturedHeaders?.["Content-Type"], "application/x-yaml");
});

Deno.test("kube.play: sends correct Content-Type for stream body", async () => {
  let capturedHeaders: Record<string, string> | undefined;
  const api = new KubeApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: (_m, _p, _b, headers) => {
        capturedHeaders = headers;
        return Promise.resolve(
          new Response(JSON.stringify({ Pods: [] }), { status: 200 }),
        );
      },
    }),
  );
  await api.play(new ReadableStream<Uint8Array>());
  assertEquals(capturedHeaders?.["Content-Type"], "application/x-tar");
});

Deno.test("kube.play: throws PodmanError on 500", async () => {
  const api = new KubeApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response(JSON.stringify({ message: "play failed" }), {
            status: 500,
          }),
        ),
    }),
  );
  const err = await assertRejects(
    () => api.play("apiVersion: v1"),
    PodmanError,
  );
  assertEquals(err.status, 500);
});

Deno.test("kube.down: returns PlayKubeReport on 200", async () => {
  const api = new KubeApi(
    mockTransport(() => ({
      status: 200,
      json: { Pods: [] },
    })),
  );
  const result = await api.down();
  assertEquals(result.Pods, []);
});

Deno.test("kube.down: throws PodmanError on 500", async () => {
  const api = new KubeApi(
    mockTransport(() => ({
      status: 500,
      json: { message: "down failed" },
    })),
  );
  const err = await assertRejects(() => api.down(), PodmanError);
  assertEquals(err.status, 500);
});

Deno.test("kube.apply: returns string on 200", async () => {
  const api = new KubeApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response(JSON.stringify("applied"), { status: 200 }),
        ),
    }),
  );
  const result = await api.apply("apiVersion: v1");
  assertEquals(result, "applied");
});

Deno.test("kube.apply: sends correct Content-Type for string body", async () => {
  let capturedHeaders: Record<string, string> | undefined;
  const api = new KubeApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: (_m, _p, _b, headers) => {
        capturedHeaders = headers;
        return Promise.resolve(
          new Response(JSON.stringify("ok"), { status: 200 }),
        );
      },
    }),
  );
  await api.apply("apiVersion: v1");
  assertEquals(capturedHeaders?.["Content-Type"], "application/x-yaml");
});

Deno.test("kube.apply: throws PodmanError on 500", async () => {
  const api = new KubeApi(
    mockTransport(() => ({ status: 200, json: null }), {
      requestRaw: () =>
        Promise.resolve(
          new Response(JSON.stringify({ message: "apply failed" }), {
            status: 500,
          }),
        ),
    }),
  );
  const err = await assertRejects(
    () => api.apply("apiVersion: v1"),
    PodmanError,
  );
  assertEquals(err.status, 500);
});
