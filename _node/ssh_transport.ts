import { spawn, type ChildProcess } from "node:child_process";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { createTransport, type Transport } from "./transport.ts";

import type { AuthOption } from "../transport_core.ts";

export interface SshTransportOptions {
  host: string;
  remoteSocketPath?: string;
  port?: number;
  identityFile?: string;
  sshOptions?: string[];
  apiVersion?: string;
  timeout?: number;
  auth?: AuthOption;
}

async function drainStderr(child: ChildProcess): Promise<string> {
  if (!child.stderr) return "";
  const chunks: Buffer[] = [];
  for await (const chunk of child.stderr) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function createSshTransport(
  opts: SshTransportOptions,
): Promise<Transport> {
  const {
    host,
    remoteSocketPath = "/run/podman/podman.sock",
    port = 22,
    identityFile,
    sshOptions = [],
    apiVersion,
    timeout,
    auth,
  } = opts;

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "podman-deno-"));
  const localSocket = path.join(tempDir, "podman.sock");

  const hasStrictHostKeyChecking = sshOptions.some((o) =>
    o.includes("StrictHostKeyChecking"),
  );
  const args = [
    "-N",
    "-L", `${localSocket}:${remoteSocketPath}`,
    "-p", String(port),
    ...(hasStrictHostKeyChecking
      ? []
      : ["-o", "StrictHostKeyChecking=accept-new"]),
    "-o", "ExitOnForwardFailure=yes",
  ];
  if (identityFile) args.push("-i", identityFile);
  args.push(...sshOptions, host);

  const child = spawn("ssh", args, {
    stdio: ["ignore", "ignore", "pipe"],
  });

  let processExited = false;
  const exitPromise = new Promise<void>((resolve) => {
    child.on("exit", () => {
      processExited = true;
      resolve();
    });
  });

  const deadline = Date.now() + 10_000;
  let ready = false;
  while (Date.now() < deadline && !processExited) {
    try {
      await fs.stat(localSocket);
      ready = true;
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  if (!ready) {
    child.kill("SIGTERM");
    let timerId: ReturnType<typeof setTimeout> | undefined;
    const errText = await Promise.race([
      drainStderr(child),
      new Promise<string>((r) => {
        timerId = setTimeout(() => r(""), 5_000);
      }),
    ]);
    clearTimeout(timerId);
    await exitPromise;
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    throw new Error(
      `SSH tunnel to ${host} failed: ${errText.trim() || "socket not created within 10s"}`,
    );
  }

  const inner = createTransport({
    socketPath: localSocket,
    apiVersion,
    timeout,
    auth,
  });

  return {
    request: inner.request,
    requestRaw: inner.requestRaw,
    requestStream: inner.requestStream,
    getAuthHeader: inner.getAuthHeader,
    close() {
      inner.close();
      child.kill("SIGTERM");
      fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    },
  };
}
