/**
 * SSH tunnel lifetime, shared by the Deno and Node transports.
 *
 * One `AbortController` (`life`) owns the tunnel. Caller abort, `close()`,
 * startup failure and an unexpected `ssh` exit all end it the same way: abort
 * `life`. Aborting `life` closes the inner transport (it is given `life`'s
 * signal) and starts the single teardown: terminate `ssh`, remove the private
 * temp dir. Runtimes only supply how to spawn, probe and clean up.
 */

import type { AuthOption, Transport } from "../transport_core.ts";
import {
  describeExit,
  drain,
  messageOf,
  type SshExit,
  StderrTail,
} from "./ssh-diagnostics.ts";

export type { SshExit };

export interface SshTransportOptions {
  host: string;
  remoteSocketPath?: string;
  port?: number;
  identityFile?: string;
  sshOptions?: string[];
  apiVersion?: string;
  /** Per-request timeout in ms; `null` disables it. */
  timeout?: number | null;
  auth?: AuthOption;
  /** Aborting tears the tunnel down and closes the transport. */
  signal?: AbortSignal;
}

/** The SSH tunnel could not start, or `ssh` died. `message` carries ssh's own diagnostics. */
export class PodmanSshError extends Error {
  readonly host: string;

  constructor(host: string, detail: string, options?: ErrorOptions) {
    super(`SSH tunnel to ${host} failed: ${detail}`, options);
    this.name = "PodmanSshError";
    this.host = host;
  }
}

export interface SshProcess {
  readonly stderr: AsyncIterable<Uint8Array>;
  /** Settles once, never rejects. */
  readonly exited: Promise<SshExit>;
  /** Must not throw when the process is already gone. */
  kill(signal: "SIGTERM" | "SIGKILL"): void;
}

export interface InnerTransportOptions {
  socketPath: string;
  apiVersion?: string;
  timeout?: number | null;
  auth?: AuthOption;
  signal: AbortSignal;
}

export interface SshRuntime {
  /** Throws if `ssh` cannot be started synchronously. */
  spawn(args: string[]): SshProcess;
  makeTempDir(): Promise<string>;
  /** Best effort; never rejects. */
  removeDir(dir: string): Promise<void>;
  /** `false` while nothing accepts connections yet; throws on any other failure. */
  canConnect(socketPath: string): Promise<boolean>;
  createTransport(opts: InnerTransportOptions): Transport;
}

const STARTUP_TIMEOUT_MS = 10_000;
const PROBE_INTERVAL_MS = 100;
const KILL_GRACE_MS = 2_000;
const STDERR_SETTLE_MS = 500;

export function sshArgs(
  opts: SshTransportOptions,
  localSocket: string,
): string[] {
  const {
    host,
    remoteSocketPath = "/run/podman/podman.sock",
    port = 22,
    identityFile,
    sshOptions = [],
  } = opts;
  const hasStrictHostKeyChecking = sshOptions.some((o) =>
    o.includes("StrictHostKeyChecking")
  );
  return [
    "-N",
    "-L",
    `${localSocket}:${remoteSocketPath}`,
    "-p",
    String(port),
    ...(hasStrictHostKeyChecking
      ? []
      : ["-o", "StrictHostKeyChecking=accept-new"]),
    "-o",
    "ExitOnForwardFailure=yes",
    ...(identityFile ? ["-i", identityFile] : []),
    ...sshOptions,
    host,
  ];
}

function aborted(signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) resolve();
    else signal.addEventListener("abort", () => resolve(), { once: true });
  });
}

async function terminate(child: SshProcess): Promise<void> {
  child.kill("SIGTERM");
  const escalation = setTimeout(() => child.kill("SIGKILL"), KILL_GRACE_MS);
  await child.exited;
  clearTimeout(escalation);
}

async function untilConnectable(
  runtime: SshRuntime,
  socketPath: string,
  stop: AbortSignal,
): Promise<boolean> {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;
  while (!stop.aborted && Date.now() < deadline) {
    if (await runtime.canConnect(socketPath)) return true;
    await new Promise((resolve) => setTimeout(resolve, PROBE_INTERVAL_MS));
  }
  return false;
}

export async function openSshTunnel(
  runtime: SshRuntime,
  opts: SshTransportOptions,
): Promise<Transport> {
  const { host, signal } = opts;
  signal?.throwIfAborted();

  const life = new AbortController();
  const forwardCallerAbort = () => life.abort(signal?.reason);
  signal?.addEventListener("abort", forwardCallerAbort, { once: true });

  let tempDir: string;
  try {
    tempDir = await runtime.makeTempDir();
  } catch (cause) {
    signal?.removeEventListener("abort", forwardCallerAbort);
    throw new PodmanSshError(
      host,
      `cannot create a temp dir (${messageOf(cause)})`,
      { cause },
    );
  }
  const socketPath = `${tempDir}/podman.sock`;

  let child: SshProcess;
  try {
    child = runtime.spawn(sshArgs(opts, socketPath));
  } catch (cause) {
    signal?.removeEventListener("abort", forwardCallerAbort);
    await runtime.removeDir(tempDir);
    throw new PodmanSshError(
      host,
      `ssh command not available (${messageOf(cause)})`,
      { cause },
    );
  }

  const stderr = new StderrTail();
  const drained = drain(child.stderr, stderr);

  const closed = (async () => {
    await aborted(life.signal);
    signal?.removeEventListener("abort", forwardCallerAbort);
    await terminate(child);
    await runtime.removeDir(tempDir);
  })();

  void child.exited.then(async (exit) => {
    if (life.signal.aborted) return;
    let settle: ReturnType<typeof setTimeout> | undefined;
    await Promise.race([
      drained,
      new Promise((resolve) => settle = setTimeout(resolve, STDERR_SETTLE_MS)),
    ]);
    clearTimeout(settle);
    life.abort(new PodmanSshError(host, describeExit(exit, stderr)));
  });

  try {
    if (!await untilConnectable(runtime, socketPath, life.signal)) {
      life.abort(
        new PodmanSshError(
          host,
          stderr.text() || "socket not created within 10s",
        ),
      );
    }
  } catch (cause) {
    life.abort(
      new PodmanSshError(host, `tunnel probe failed (${messageOf(cause)})`, {
        cause,
      }),
    );
  }
  if (life.signal.aborted) {
    await closed;
    throw life.signal.reason;
  }

  let inner: Transport;
  try {
    inner = runtime.createTransport({
      socketPath,
      apiVersion: opts.apiVersion,
      timeout: opts.timeout,
      auth: opts.auth,
      signal: life.signal,
    });
  } catch (cause) {
    life.abort(
      new PodmanSshError(
        host,
        `cannot build the transport (${messageOf(cause)})`,
        { cause },
      ),
    );
    await closed;
    throw life.signal.reason;
  }
  return {
    ...inner,
    close() {
      inner.close();
      life.abort();
    },
  };
}
