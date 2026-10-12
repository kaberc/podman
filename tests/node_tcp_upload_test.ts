import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createTcpTransport } from "../_node/transport.ts";

describe("native TCP streaming uploads", () => {
  const server = createServer((request, response) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk: string) => body += chunk);
    request.on("end", () =>
      response.end(JSON.stringify({
        body,
        auth: request.headers["x-registry-auth"],
      })));
  });
  before(async () => {
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve)
    );
  });
  after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
      server.closeAllConnections();
    });
  });

  it("forwards streamed bytes and registry authentication without an ordinary deadline", async () => {
    const address = server.address();
    assert.ok(address && typeof address === "object");
    const transport = createTcpTransport({
      uri: `http://127.0.0.1:${address.port}`,
      timeout: 0,
    });
    try {
      const stream = await transport.requestStream(
        "POST",
        "/build",
        new Blob(["context 世界"]).stream(),
        {
          "X-Registry-Auth": "synthetic-auth",
        },
      );
      const report: unknown = await new Response(stream).json();
      assert.deepEqual(report, {
        body: "context 世界",
        auth: "synthetic-auth",
      });
    } finally {
      transport.close();
    }
  });
});
