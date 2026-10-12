import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createTransport } from "../_node/transport.ts";
import { unixServerFixture } from "./node_transport_fixture.ts";

describe("upload ownership", () => {
  const fixture = unixServerFixture();

  it("rejects locked bodies without leaving a native request or changing its owner", async () => {
    let cancellations = 0;
    const body = new ReadableStream<Uint8Array>({
      cancel() {
        cancellations++;
      },
    });
    const owner = body.getReader();
    const transport = createTransport({ socketPath: fixture.socketPath });
    try {
      await assert.rejects(
        transport.requestRaw("POST", "/locked", body),
        TypeError,
      );
      transport.close();
      await new Promise((resolve) => setTimeout(resolve, 100));
      assert.equal(fixture.connections(), 0);
      assert.equal(cancellations, 0);
      assert.equal(body.locked, true);
    } finally {
      transport.close();
      owner.releaseLock();
    }
  });

  it("returns body ownership when request construction rejects its headers", async () => {
    const body = new ReadableStream<Uint8Array>();
    const transport = createTransport({ socketPath: fixture.socketPath });
    try {
      await assert.rejects(
        transport.requestRaw("POST", "/invalid", body, {
          "bad\nname": "value",
        }),
        TypeError,
      );
      assert.equal(body.locked, false);
    } finally {
      transport.close();
      await body.cancel();
    }
  });
});
