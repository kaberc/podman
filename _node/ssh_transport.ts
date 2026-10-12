import { spawn as spawnChild } from "node:child_process";
import * as fs from "node:fs/promises";
import * as net from "node:net";
import * as os from "node:os";
import * as path from "node:path";
import {
  openSshTunnel,
  PodmanSshError,
  type SshExit,
  type SshProcess,
  type SshRuntime,
  type SshTransportOptions,
} from "../internal/ssh-lifetime.ts";
import { createTransport, type Transport } from "./transport.ts";

export { PodmanSshError };
export type { SshTransportOptions };

function spawn(args: string[]): SshProcess {
  const child = spawnChild("ssh", args, { stdio: ["ignore", "ignore", "pipe"] });
  const exited = new Promise<SshExit>((resolve) => {
    child.on("error", (error) => resolve({ kind: "failed", error }));
    child.on("exit", (code, signal) => resolve({ kind: "exited", code, signal }));
  });
  return {
    stderr: child.stderr,
    exited,
    kill: (signal) => void child.kill(signal),
  };
}

function canConnect(socketPath: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const socket = net.connect(socketPath);
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("error", (error: NodeJS.ErrnoException) => {
      socket.destroy();
      if (error.code === "ENOENT" || error.code === "ECONNREFUSED") resolve(false);
      else reject(error);
    });
  });
}

const runtime: SshRuntime = {
  spawn,
  makeTempDir: () => fs.mkdtemp(path.join(os.tmpdir(), "podman-ssh-")),
  async removeDir(dir) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch { // no-excuse-ok: catch — best-effort removal of a private temp dir.
    }
  },
  canConnect,
  createTransport,
};

export function createSshTransport(opts: SshTransportOptions): Promise<Transport> {
  return openSshTunnel(runtime, opts);
}
