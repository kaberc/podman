// Runs under Deno, Node (>=22.18) and Bun: `deno test`, `node --test`, `bun test`.
// Every case drives the public `createSshTransport` against a real `ssh`
// executable found on PATH (tests/fake_ssh.mjs) that forwards to a real local
// HTTP server on a Unix socket.
import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import * as path from "node:path";
import {
  PodmanSshError,
  type SshTransportOptions,
} from "../internal/ssh-lifetime.ts";
import type { Transport } from "../transport_core.ts";
import {
  eventually,
  isAlive,
  type Sandbox,
  sandbox,
  sleep,
} from "./node_ssh_fixture.ts";

type CreateSshTransport = (opts: SshTransportOptions) => Promise<Transport>;

const implementations: {
  name: string;
  load: () => Promise<CreateSshTransport>;
}[] = [
  {
    name: "node",
    load: async () =>
      (await import("../_node/ssh_transport.ts")).createSshTransport,
  },
  ...("Deno" in globalThis
    ? [{
      name: "deno",
      load: async () =>
        (await import("../ssh_transport.ts")).createSshTransport,
    }]
    : []),
];

for (const { name, load } of implementations) {
  describe(`ssh transport (${name})`, () => {
    let box: Sandbox;
    let create: CreateSshTransport;
    const open: Transport[] = [];

    beforeEach(async () => {
      box = sandbox();
      create = await load();
    });
    afterEach(() => {
      for (const t of open.splice(0)) t.close();
      box.dispose();
    });

    async function tunnel(
      host: string,
      extra: Partial<SshTransportOptions> = {},
    ) {
      const transport = await create({ host, ...extra });
      open.push(transport);
      return transport;
    }

    async function reaped() {
      await eventually(() =>
        !isAlive(box.pid()) && box.leftovers().length === 0
      );
    }

    it("serves requests through the forwarded socket", async () => {
      const transport = await tunnel("serve");
      const res = await transport.request("GET", "/info");
      assert.deepEqual(res, { status: 200, json: { ok: true } });
    });

    it("close is idempotent and ends the child and its temp dir", async () => {
      const transport = await tunnel("serve");
      transport.close();
      transport.close();
      await reaped();
      await assert.rejects(transport.request("GET", "/info"));
    });

    it("does not spawn or create anything for an aborted signal", async () => {
      const reason = new Error("never mind");
      await assert.rejects(
        create({ host: "serve", signal: AbortSignal.abort(reason) }),
        (error) => error === reason,
      );
      assert.equal(box.spawned(), false);
      assert.deepEqual(box.leftovers(), []);
    });

    it("tears everything down when aborted during startup", async () => {
      const controller = new AbortController();
      const pending = create({ host: "stuck", signal: controller.signal });
      await eventually(() => box.spawned());
      const reason = new Error("changed my mind");
      controller.abort(reason);
      await assert.rejects(pending, (error) => error === reason);
      assert.equal(isAlive(box.pid()), false);
      assert.deepEqual(box.leftovers(), []);
    });

    it("closes the client and the tunnel when aborted after ready", async () => {
      const controller = new AbortController();
      const transport = await tunnel("serve", { signal: controller.signal });
      const inFlight = assert.rejects(transport.request("GET", "/hang"));
      await sleep(50);
      controller.abort();
      await inFlight;
      await assert.rejects(transport.request("GET", "/info"));
      await reaped();
    });

    it("reports ssh's own stderr when the tunnel cannot start", async () => {
      await assert.rejects(
        create({ host: "fail" }),
        (error) =>
          error instanceof PodmanSshError &&
          error.host === "fail" &&
          error.message.includes("Permission denied (publickey)."),
      );
      assert.equal(isAlive(box.pid()), false);
      assert.deepEqual(box.leftovers(), []);
    });

    it("rejects with a typed error when ssh cannot be spawned", async () => {
      process.env.PATH = path.join(box.tmp, "no-such-dir");
      await assert.rejects(
        create({ host: "serve" }),
        (error) => error instanceof PodmanSshError && error.host === "serve",
      );
      assert.deepEqual(box.leftovers(), []);
    });

    it("keeps draining ssh's stderr after the tunnel is ready", async () => {
      const transport = await tunnel("flood-stderr");
      const res = await transport.request("GET", "/info");
      assert.equal(res.status, 200);
    });

    it("fails requests with the child's diagnostics once ssh dies", async () => {
      const transport = await tunnel("serve");
      const inFlight = assert.rejects(transport.request("GET", "/hang"));
      await sleep(50);
      await transport.request("GET", "/die").catch(() => undefined);
      await inFlight;
      await eventually(() => box.leftovers().length === 0);
      await assert.rejects(
        transport.request("GET", "/info"),
        (error) =>
          error instanceof PodmanSshError &&
          error.message.includes("tunnel broke"),
      );
    });

    it("kills a child that ignores SIGTERM", async () => {
      const controller = new AbortController();
      const pending = create({
        host: "ignore-term",
        signal: controller.signal,
      });
      await eventually(() => box.spawned());
      controller.abort();
      await assert.rejects(pending);
      assert.equal(isAlive(box.pid()), false);
      assert.deepEqual(box.leftovers(), []);
    });

    it("applies the request timeout, and null disables it", async () => {
      const limited = await tunnel("serve", { timeout: 100 });
      await assert.rejects(limited.request("GET", "/slow"), {
        name: "TimeoutError",
      });
      const unlimited = await tunnel("serve", { timeout: null });
      assert.equal((await unlimited.request("GET", "/slow")).status, 200);
    });
  });
}
