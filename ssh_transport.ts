import {
  openSshTunnel,
  PodmanSshError,
  type SshExit,
  type SshProcess,
  type SshRuntime,
  type SshTransportOptions,
} from "./internal/ssh-lifetime.ts";
import { createTransport, type Transport } from "./transport.ts";

export { PodmanSshError };
export type { SshTransportOptions };

function spawn(args: string[]): SshProcess {
  const child = new Deno.Command("ssh", {
    args,
    stdin: "null",
    stdout: "null",
    stderr: "piped",
  }).spawn();
  return {
    stderr: child.stderr,
    exited: child.status.then(
      ({ code, signal }): SshExit => ({ kind: "exited", code, signal }),
      (error): SshExit => ({ kind: "failed", error }),
    ),
    kill(signal) {
      try {
        child.kill(signal);
      } catch (error) {
        if (!(error instanceof TypeError)) throw error; // already terminated
      }
    },
  };
}

async function canConnect(path: string): Promise<boolean> {
  try {
    (await Deno.connect({ transport: "unix", path })).close();
    return true;
  } catch (error) {
    if (
      error instanceof Deno.errors.NotFound ||
      error instanceof Deno.errors.ConnectionRefused
    ) return false;
    throw error;
  }
}

const runtime: SshRuntime = {
  spawn,
  makeTempDir: () => Deno.makeTempDir({ prefix: "podman-ssh-" }),
  async removeDir(dir) {
    try {
      await Deno.remove(dir, { recursive: true });
    } catch { // no-excuse-ok: catch — best-effort removal of a private temp dir.
    }
  },
  canConnect,
  createTransport,
};

export function createSshTransport(
  opts: SshTransportOptions,
): Promise<Transport> {
  return openSshTunnel(runtime, opts);
}
