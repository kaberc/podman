import { createTransport, type Transport } from "./transport.ts";
import type { AuthOption } from "./transport_core.ts";

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

async function drainStderr(
  stream: ReadableStream<Uint8Array>,
): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const buf = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    buf.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(buf);
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

  const tempDir = await Deno.makeTempDir({ prefix: "podman-deno-" });
  const localSocket = `${tempDir}/podman.sock`;

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

  let child: Deno.ChildProcess;
  try {
    child = new Deno.Command("ssh", {
      args,
      stdin: "null",
      stdout: "null",
      stderr: "piped",
    }).spawn();
  } catch (e) {
    await Deno.remove(tempDir, { recursive: true }).catch(() => {});
    throw new Error(
      `SSH tunnel to ${host} failed: ssh command not available (${e instanceof Error ? e.message : e})`,
    );
  }

  let processExited = false;
  child.status.then(() => {
    processExited = true;
  });

  const deadline = Date.now() + 10_000;
  let ready = false;
  while (Date.now() < deadline && !processExited) {
    try {
      await Deno.stat(localSocket);
      ready = true;
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  if (!ready) {
    try {
      child.kill("SIGTERM");
    } catch { /* already dead */ }
    let timerId: number | undefined;
    const errText = await Promise.race([
      drainStderr(child.stderr),
      new Promise<string>((r) => {
        timerId = setTimeout(() => r(""), 5_000);
      }),
    ]);
    clearTimeout(timerId);
    await child.status;
    await Deno.remove(tempDir, { recursive: true }).catch(() => {});
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
      try {
        child.kill("SIGTERM");
      } catch { /* already dead */ }
      Deno.remove(tempDir, { recursive: true }).catch(() => {});
    },
  };
}
