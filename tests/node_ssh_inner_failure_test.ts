// Runs under Deno, Node (>=22.18) and Bun: `deno test`, `node --test`, `bun test`.
import { afterEach, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as net from "node:net";
import * as os from "node:os";
import * as path from "node:path";
import {
  openSshTunnel,
  PodmanSshError,
  type SshExit,
  type SshRuntime,
} from "../internal/ssh-lifetime.ts";
import { isAlive, type Sandbox, sandbox } from "./node_ssh_fixture.ts";

describe("ssh tunnel when the inner transport cannot be built", () => {
  let box: Sandbox;
  beforeEach(() => {
    box = sandbox();
  });
  afterEach(() => box.dispose());

  /** Real child, temp dir and socket probe; only inner construction is replaced. */
  const failingInner = (failure: Error): SshRuntime => ({
    spawn(args) {
      const child = spawn("ssh", args, { stdio: ["ignore", "ignore", "pipe"] });
      return {
        stderr: child.stderr,
        exited: new Promise<SshExit>((resolve) => {
          child.on("error", (error) => resolve({ kind: "failed", error }));
          child.on(
            "exit",
            (code, signal) => resolve({ kind: "exited", code, signal }),
          );
        }),
        kill: (signal) => void child.kill(signal),
      };
    },
    makeTempDir: () =>
      fs.promises.mkdtemp(path.join(os.tmpdir(), "podman-ssh-")),
    removeDir: (dir) => fs.promises.rm(dir, { recursive: true, force: true }),
    canConnect: (socketPath) =>
      new Promise((resolve) => {
        const socket = net.connect(socketPath);
        socket.on("connect", () => {
          socket.destroy();
          resolve(true);
        });
        socket.on("error", () => resolve(false));
      }),
    createTransport() {
      throw failure;
    },
  });

  it("ends the child and temp dir, and rejects with a typed error", async () => {
    const failure = new Error("inner refused");
    await assert.rejects(
      openSshTunnel(failingInner(failure), { host: "serve" }),
      (error) =>
        error instanceof PodmanSshError && error.host === "serve" &&
        error.cause === failure && error.message.includes("inner refused"),
    );
    assert.equal(isAlive(box.pid()), false);
    assert.deepEqual(box.leftovers(), []);
  });
});
