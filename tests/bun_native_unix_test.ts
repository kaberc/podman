import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createTransport } from "../_node/transport.ts";
import { PodmanError } from "../types/errors.ts";
import { unixServerFixture } from "./node_transport_fixture.ts";

const bun = "Bun" in globalThis;

describe("Bun native Unix transport", { skip: !bun }, () => {
  const fixture = unixServerFixture();

  it("preserves native metadata, versioned query routes and auth headers", async () => {
    // Given a daemon that echoes the wire request.
    fixture.handler = (req, res) =>
      res.end(JSON.stringify({
        url: req.url,
        auth: req.headers["x-registry-auth"],
      }));
    const transport = createTransport({
      socketPath: fixture.socketPath,
      apiVersion: "5.8.0",
      auth: { identityToken: "token" },
    });
    try {
      // When the public raw API is called.
      const response = await transport.requestRaw(
        "GET",
        "/images?all=true",
        undefined,
        {
          "X-Registry-Auth": transport.getAuthHeader() ?? "",
        },
      );
      // Then native fetch metadata and routing survive the lifetime wrapper.
      assert.equal(
        response.url,
        "http://localhost/v5.8.0/libpod/images?all=true",
      );
      assert.equal(response.clone().url, response.url);
      assert.deepEqual(await response.json(), {
        url: "/v5.8.0/libpod/images?all=true",
        auth: btoa(JSON.stringify({ identityToken: "token" })),
      });
    } finally {
      transport.close();
    }
  });

  it("streams uploads and responses through the public API", async () => {
    // Given an echo server and a finite upload.
    fixture.handler = (req, res) => req.pipe(res);
    const transport = createTransport({ socketPath: fixture.socketPath });
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("archive"));
        controller.close();
      },
    });
    try {
      // When a streaming request is made.
      const stream = await transport.requestStream("POST", "/build", body);
      // Then upload bytes reach the daemon and return unchanged.
      assert.equal(await new Response(stream).text(), "archive");
    } finally {
      transport.close();
    }
  });

  it("retains typed HTTP error body metadata", async () => {
    // Given a daemon error.
    fixture.handler = (_req, res) =>
      res.writeHead(404).end('{"message":"missing"}');
    const transport = createTransport({ socketPath: fixture.socketPath });
    try {
      // When a stream endpoint fails, then the public typed error is preserved.
      await assert.rejects(
        transport.requestStream("GET", "/missing"),
        (error: unknown) => {
          assert.ok(error instanceof PodmanError);
          assert.equal(error.status, 404);
          assert.equal(error.method, "GET");
          assert.equal(error.path, "/missing");
          assert.equal(error.message, "missing");
          return true;
        },
      );
    } finally {
      transport.close();
    }
  });
});
