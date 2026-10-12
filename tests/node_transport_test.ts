// Runs under Deno, Node (>=22.18) and Bun: `deno test`, `node --test`, `bun test`.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { nodeRequest } from "../_node/node-request.ts";
import { createTransport } from "../_node/transport.ts";
import { unixServerFixture } from "./node_transport_fixture.ts";

const CHUNK = new Uint8Array(64 * 1024);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const never = new AbortController().signal;

describe("native Node transport", () => {
  const fixture = unixServerFixture();

  function call(
    method: string,
    body?: BodyInit,
    signal: AbortSignal = never,
    headers?: Record<string, string>,
  ) {
    return nodeRequest(
      "http://localhost/x",
      { socketPath: fixture.socketPath, method, headers },
      body,
      signal,
    );
  }

  function neverEndingBody(counters: { pulls: number; cancelled: boolean }) {
    return new ReadableStream<Uint8Array>({
      pull(c) {
        counters.pulls++;
        c.enqueue(CHUNK);
      },
      cancel() {
        counters.cancelled = true;
      },
    });
  }

  async function eventually(check: () => boolean, ms = 2000) {
    const end = Date.now() + ms;
    while (!check()) {
      assert.ok(Date.now() < end, "condition not reached");
      await sleep(10);
    }
  }

  describe("nodeRequest", () => {
    it(
      "returns a null body for body-forbidden statuses",
      { timeout: 1000 },
      async () => {
        for (const status of [204, 205, 304]) {
          fixture.handler = (_req, res) => res.writeHead(status).end();
          const res = await call("GET");
          assert.equal(res.status, status);
          assert.equal(res.body, null);
        }
      },
    );

    it(
      "rejects an unsupported response status",
      { timeout: 1000 },
      async () => {
        fixture.handler = (_req, res) => res.writeHead(700).end();
        await assert.rejects(call("GET"), RangeError);
      },
    );

    it("sends string, bytes, ArrayBuffer, stream and Blob bodies", async () => {
      fixture.handler = (req, res) => req.pipe(res);
      const bytes = new TextEncoder().encode("bytes");
      const stream = () =>
        new ReadableStream<Uint8Array>({
          start(c) {
            c.enqueue(bytes);
            c.close();
          },
        });
      assert.equal(await (await call("POST", "text")).text(), "text");
      assert.equal(await (await call("POST", bytes)).text(), "bytes");
      assert.equal(await (await call("POST", bytes.buffer)).text(), "bytes");
      assert.equal(await (await call("POST", stream())).text(), "bytes");
      assert.equal(
        await (await call("POST", new Blob(["blob"]))).text(),
        "blob",
      );
    });

    it("rejects unsupported body types explicitly", async () => {
      await assert.rejects(call("POST", new FormData()), TypeError);
      await assert.rejects(call("POST", new URLSearchParams("a=b")), TypeError);
    });

    it("rejects when already aborted", async () => {
      const reason = new Error("early");
      await assert.rejects(
        call("GET", undefined, AbortSignal.abort(reason)),
        reason,
      );
    });

    it("aborts before headers with the signal reason", async () => {
      fixture.handler = () => {};
      const controller = new AbortController();
      const pending = call("GET", undefined, controller.signal);
      await sleep(20);
      const reason = new Error("stop");
      controller.abort(reason);
      await assert.rejects(pending, reason);
    });

    for (
      const [name, reason] of [["Error", new Error("stop")], [
        "string",
        "stop",
      ]] as const
    ) {
      it(`errors the response body with the ${name} abort reason after headers`, async () => {
        fixture.handler = (_req, res) => {
          res.writeHead(200);
          res.write("partial");
        };
        const controller = new AbortController();
        const res = await call("GET", undefined, controller.signal);
        assert.ok(res.body);
        const reader = res.body.getReader();
        await reader.read();
        controller.abort(reason);
        await assert.rejects(
          reader.read(),
          (error: unknown) => error === reason,
        );
        reader.releaseLock();
      });
    }

    it("surfaces a truncated body as a read error", async () => {
      fixture.handler = (_req, res) => {
        res.writeHead(200, { "content-length": "100" });
        res.write("short");
        setTimeout(() => res.destroy(), 20);
      };
      const res = await call("GET");
      await assert.rejects(res.text());
    });

    it("applies response backpressure", async () => {
      let written = 0;
      fixture.handler = (_req, res) => {
        res.writeHead(200);
        const pump = () => {
          while (written < 16 * 1024 * 1024) {
            written += CHUNK.length;
            if (!res.write(CHUNK)) break;
          }
          res.once("drain", pump);
        };
        pump();
      };
      const res = await call("GET");
      await sleep(300);
      assert.ok(written < 8 * 1024 * 1024, `wrote ${written} unread bytes`);
      assert.ok(res.body);
      await res.body.cancel();
    });

    it("applies upload backpressure and cancels the source on abort", async () => {
      fixture.handler = () => {};
      const counters = { pulls: 0, cancelled: false };
      const controller = new AbortController();
      const pending = call(
        "POST",
        neverEndingBody(counters),
        controller.signal,
      );
      await sleep(300);
      assert.ok(counters.pulls < 1000, `${counters.pulls} pulls`);
      controller.abort(new Error("stop"));
      await assert.rejects(pending);
      await eventually(() => counters.cancelled);
    });

    it("cancels the upload source once the response completes", async () => {
      fixture.handler = (_req, res) => res.end("early");
      const counters = { pulls: 0, cancelled: false };
      const res = await call("POST", neverEndingBody(counters));
      assert.equal(await res.text(), "early");
      await eventually(() => counters.cancelled);
    });

    it("fails the response body when the upload fails after headers", async () => {
      fixture.handler = (_req, res) => {
        res.writeHead(200);
        res.write("go");
      };
      const failure = new Error("source broke");
      const source = new ReadableStream<Uint8Array>({
        async start(c) {
          c.enqueue(CHUNK);
          await sleep(50);
          c.error(failure);
        },
      });
      const res = await call("POST", source);
      await assert.rejects(res.text(), failure);
    });
  });

  describe("node unix transport", () => {
    it("keeps streams alive past the ordinary timeout and ends them on close", async () => {
      fixture.handler = (_req, res) => {
        res.writeHead(200);
        res.write("one\n");
      };
      const t = createTransport({
        socketPath: fixture.socketPath,
        timeout: 20,
      });
      const stream = await t.requestStream("GET", "/events");
      await sleep(100);
      const reader = stream.getReader();
      assert.equal(
        new TextDecoder().decode((await reader.read()).value),
        "one\n",
      );
      const next = reader.read();
      t.close();
      await assert.rejects(next);
      await assert.rejects(t.request("GET", "/after"));
      t.close();
    });

    it("times out ordinary requests", async () => {
      fixture.handler = () => {};
      const t = createTransport({
        socketPath: fixture.socketPath,
        timeout: 30,
      });
      await assert.rejects(t.request("GET", "/slow"), { name: "TimeoutError" });
      t.close();
    });

    it("honours a caller signal", async () => {
      fixture.handler = () => {};
      const controller = new AbortController();
      const t = createTransport({
        socketPath: fixture.socketPath,
        signal: controller.signal,
      });
      const pending = t.request("GET", "/slow");
      await sleep(20);
      controller.abort(new Error("stop"));
      await assert.rejects(pending, { message: "stop" });
    });

    it("parses empty 204 request responses as null json", async () => {
      fixture.handler = (_req, res) => res.writeHead(204).end();
      const t = createTransport({ socketPath: fixture.socketPath });
      assert.deepEqual(await t.request("DELETE", "/x"), {
        status: 204,
        json: null,
      });
      t.close();
    });
  });
});
