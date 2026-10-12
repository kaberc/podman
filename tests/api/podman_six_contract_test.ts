import { assertEquals, assertRejects } from "@std/assert";
import {
  createClient,
  type PodmanClient,
  PodmanConflictError,
  PodmanNotFoundError,
} from "../../mod.ts";

async function daemon(
  handler: (request: Request) => Response,
  action: (client: PodmanClient) => Promise<void>,
) {
  const server = Deno.serve(
    { hostname: "127.0.0.1", port: 0, onListen() {} },
    handler,
  );
  const client = createClient({ uri: `http://127.0.0.1:${server.addr.port}` });
  try {
    await action(client);
  } finally {
    client.close();
    await server.shutdown();
  }
}

Deno.test("volume prune exposes the libpod per-volume report rather than the Docker summary", async () => {
  await daemon(
    () => Response.json([{ Id: "volume", Size: 7, Err: "" }]),
    async (client) => {
      const reports = await client.volumes.prune();
      assertEquals(reports[0]?.Id, "volume");
      assertEquals(reports[0]?.Size, 7);
    },
  );
});

Deno.test("image inspection exposes native libpod metadata", async () => {
  await daemon(() =>
    Response.json({
      Digest: "sha256:image",
      Labels: { owner: "sdk" },
      Annotations: { source: "local" },
      History: [],
      Healthcheck: { Test: ["CMD", "true"] },
    }), async (client) => {
    const image = await client.images.inspect("image");
    assertEquals(image?.Digest, "sha256:image");
    assertEquals(image?.Labels, { owner: "sdk" });
    assertEquals(image?.Annotations, { source: "local" });
    assertEquals(image?.History, []);
    assertEquals(image?.Healthcheck?.Test, ["CMD", "true"]);
  });
});

Deno.test("pod stats accepts snapshots but excludes infinite streaming queries", async () => {
  type Query = NonNullable<Parameters<PodmanClient["pods"]["stats"]>[0]>;
  const streamingAccepted: { stream: true } extends Query ? true : false =
    false;
  assertEquals(streamingAccepted, false);
  let route = "";
  await daemon((request) => {
    route = new URL(request.url).search;
    return Response.json([]);
  }, async (client) => {
    assertEquals(await client.pods.stats({ stream: false }), []);
    assertEquals(route, "?stream=false");
  });
});

Deno.test("volume rename sends the new name and requires no response body", async () => {
  let route = "";
  await daemon((request) => {
    route = `${request.method} ${new URL(request.url).pathname}${
      new URL(request.url).search
    }`;
    return new Response(null, { status: 204 });
  }, async (client) => {
    await client.volumes.rename("old/name", { newName: "new-name" });
    assertEquals(
      route,
      "POST /v6.0.0/libpod/volumes/old%2Fname/rename?newName=new-name",
    );
  });
});

for (
  const [status, ErrorClass] of [[404, PodmanNotFoundError], [
    409,
    PodmanConflictError,
  ]] as const
) {
  Deno.test(`volume rename preserves HTTP ${status} as a typed failure`, async () => {
    await daemon(
      () => Response.json({ message: "rejected" }, { status }),
      async (client) => {
        await assertRejects(
          () => client.volumes.rename("volume", { newName: "new" }),
          ErrorClass,
        );
      },
    );
  });
}

Deno.test("system prune forwards Podman six options", async () => {
  let query = "";
  await daemon((request) => {
    query = new URL(request.url).search;
    return Response.json({ ImagesPruneReports: [] });
  }, async (client) => {
    await client.system.prune({
      all: true,
      volumes: false,
      external: true,
      build: true,
    });
    assertEquals(query, "?all=true&volumes=false&external=true&build=true");
  });
});

Deno.test("network create forwards the server's ignoreIfExists option", async () => {
  let query = "";
  await daemon((request) => {
    query = new URL(request.url).search;
    return Response.json({ name: "network" });
  }, async (client) => {
    await client.networks.create({ name: "network" }, { ignoreIfExists: true });
    assertEquals(query, "?ignoreIfExists=true");
  });
});
