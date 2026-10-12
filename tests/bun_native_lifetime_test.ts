import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createTransport } from "../_node/transport.ts";
import { unixServerFixture } from "./node_transport_fixture.ts";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe(
  "Bun native request lifetime",
  { skip: !("Bun" in globalThis) },
  () => {
    const fixture = unixServerFixture();

    it("bounds upload buffering while the daemon does not read", async () => {
      // Given a stalled daemon and an infinite upload.
      let arrived: () => void = () => {};
      const requestArrived = new Promise<void>((resolve) => {
        arrived = resolve;
      });
      fixture.handler = () => arrived();
      const controller = new AbortController();
      let pulls = 0;
      let cancelled = false;
      const body = new ReadableStream<Uint8Array>({
        pull(output) {
          pulls++;
          output.enqueue(new Uint8Array(64 * 1024));
        },
        cancel() {
          cancelled = true;
        },
      });
      const transport = createTransport({
        socketPath: fixture.socketPath,
        signal: controller.signal,
      });
      try {
        // When a public request is backpressured and subsequently aborted.
        const pending = transport.requestRaw("POST", "/stalled", body);
        await requestArrived;
        await delay(100);
        assert.ok(pulls < 1000, `${pulls} unbounded upload pulls`);
        controller.abort(new Error("stop upload"));
        // Then pending fetch rejects and releases the source.
        await assert.rejects(pending);
        assert.equal(cancelled, true);
      } finally {
        transport.close();
      }
    });

    it("bounds unread response buffering", async () => {
      // Given a daemon with a large response.
      let written = 0;
      fixture.handler = (_req, res) => {
        const pump = () => {
          while (written < 16 * 1024 * 1024) {
            written += 64 * 1024;
            if (!res.write(new Uint8Array(64 * 1024))) break;
          }
          res.once("drain", pump);
        };
        pump();
      };
      const transport = createTransport({ socketPath: fixture.socketPath });
      try {
        // When the public response is left unread.
        const response = await transport.requestRaw("GET", "/large");
        await delay(100);
        // Then the daemon is backpressured rather than uploading everything.
        assert.ok(
          written < 8 * 1024 * 1024,
          `${written} unread bytes buffered`,
        );
        await response.body?.cancel();
      } finally {
        transport.close();
      }
    });

    for (const action of ["cancel", "timeout", "close", "complete"] as const) {
      it(`cancels an active upload when the response ${action}s`, async () => {
        // Given an infinite upload and a daemon responding before upload EOF.
        fixture.handler = (_req, res) => {
          res.writeHead(200);
          res.write("early");
          if (action === "complete") res.end();
        };
        let cancel: (reason?: unknown) => void = () => {};
        const cancelled = new Promise<unknown>((resolve) => {
          cancel = resolve;
        });
        let pulls = 0;
        const body = new ReadableStream<Uint8Array>({
          pull(controller) {
            pulls++;
            controller.enqueue(new Uint8Array(64 * 1024));
          },
          cancel,
        });
        const transport = createTransport({
          socketPath: fixture.socketPath,
          timeout: action === "timeout" ? 100 : null,
        });
        try {
          // When response consumption is stopped or finishes.
          const response = await transport.requestRaw("POST", "/upload", body);
          assert.ok(response.body);
          const reader = response.body.getReader();
          await reader.read();
          if (action === "cancel") await reader.cancel("downstream stopped");
          if (action === "close") transport.close();
          if (action === "timeout" || action === "close") {
            await assert.rejects(
              reader.read(),
            );
          }
          if (action === "complete") {
            while (!(await reader.read()).done) { /* Drain. */ }
          }
          // Then the source is actively cancelled, not merely abandoned locked.
          await Promise.race([
            cancelled,
            delay(1000).then(() =>
              assert.fail("upload source was not cancelled")
            ),
          ]);
          assert.ok(pulls < 1000, `${pulls} unbounded upload pulls`);
          reader.releaseLock();
        } finally {
          transport.close();
        }
      });
    }

    it("rejects truncated response bodies", async () => {
      // Given a daemon that disconnects before Content-Length bytes arrive.
      fixture.handler = (_req, res) => {
        res.writeHead(200, { "content-length": "100" });
        res.write("short");
        setTimeout(() => res.destroy(), 20);
      };
      const transport = createTransport({ socketPath: fixture.socketPath });
      try {
        // When reading the public response, then truncation is an error.
        const response = await transport.requestRaw("GET", "/truncated");
        await assert.rejects(response.text());
      } finally {
        transport.close();
      }
    });

    it("propagates upload failure after response headers", async () => {
      // Given an upload that remains open after the daemon starts responding.
      fixture.handler = (_req, res) => res.write("ready");
      let fail: (reason: Error) => void = () => {};
      const body = new ReadableStream<Uint8Array>({
        start(output) {
          output.enqueue(new Uint8Array(64 * 1024));
          fail = (reason) => output.error(reason);
        },
      });
      const transport = createTransport({ socketPath: fixture.socketPath });
      try {
        // When the source fails after headers are returned.
        const response = await transport.requestRaw(
          "POST",
          "/failed-upload",
          body,
        );
        fail(new Error("source failed"));
        // Then consumption rejects rather than returning a successful partial body.
        await assert.rejects(response.text());
      } finally {
        transport.close();
      }
    });

    it("preflights caller abort without taking upload ownership", async () => {
      // Given an already-aborted transport and an unlocked stream.
      const reason = new Error("preflight");
      const transport = createTransport({
        socketPath: fixture.socketPath,
        signal: AbortSignal.abort(reason),
      });
      const body = new ReadableStream<Uint8Array>();
      // When requesting, then no source reader is acquired.
      await assert.rejects(
        transport.requestRaw("POST", "/upload", body),
        reason,
      );
      assert.equal(body.locked, false);
      await body.cancel();
    });

    it("propagates caller abort to an already streaming response", async () => {
      // Given an open response tied to the caller's lifetime.
      fixture.handler = (_req, res) => res.write("ready");
      const controller = new AbortController();
      const transport = createTransport({
        socketPath: fixture.socketPath,
        signal: controller.signal,
      });
      try {
        const stream = await transport.requestStream("GET", "/events");
        const reader = stream.getReader();
        await reader.read();
        // When the caller aborts, then the pending response read rejects.
        const pending = reader.read();
        const reason = new Error("caller stopped");
        controller.abort(reason);
        await assert.rejects(pending, (error: unknown) => error === reason);
        reader.releaseLock();
        await assert.rejects(transport.request("GET", "/after"), reason);
      } finally {
        transport.close();
      }
    });
  },
);
