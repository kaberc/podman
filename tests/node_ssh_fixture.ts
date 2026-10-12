// Shared by the SSH tests: a sandbox with a fake `ssh` first on PATH and a
// private TMPDIR, so tests can see exactly what the tunnel spawned and left.
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const FAKE_SSH = fileURLToPath(new URL("./fake_ssh.mjs", import.meta.url));
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const shellQuote = (s: string) => `'${s.replaceAll("'", "'\\''")}'`;

/** Under Deno `process.execPath` is the deno binary, which must `run` the script. */
function interpreter(): string {
  const exec = shellQuote(process.execPath);
  return "Deno" in globalThis ? `${exec} run -A` : exec;
}

export function sandbox() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "podman-ssh-test-"));
  const bin = path.join(root, "bin");
  const tmp = path.join(root, "tmp");
  const record = path.join(root, "record");
  for (const dir of [bin, tmp, record]) fs.mkdirSync(dir);
  fs.writeFileSync(
    path.join(bin, "ssh"),
    `#!/bin/sh\nexec ${interpreter()} ${shellQuote(FAKE_SSH)} "$@"\n`,
    { mode: 0o755 },
  );
  const saved = { ...process.env };
  process.env.PATH = bin;
  process.env.TMPDIR = tmp;
  process.env.FAKE_SSH_RECORD = record;
  return {
    bin,
    tmp,
    pid: () => Number(fs.readFileSync(path.join(record, "pid"), "utf8")),
    spawned: () => fs.existsSync(path.join(record, "pid")),
    leftovers: () => fs.readdirSync(tmp),
    dispose() {
      for (const key of ["PATH", "TMPDIR", "FAKE_SSH_RECORD"]) {
        if (saved[key] === undefined) delete process.env[key];
        else process.env[key] = saved[key];
      }
      fs.rmSync(root, { recursive: true, force: true });
    },
  };
}

export function isAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ESRCH") {
      return false;
    }
    throw error;
  }
}

export async function eventually(check: () => boolean, ms = 5000) {
  const end = Date.now() + ms;
  while (!check()) {
    assert.ok(Date.now() < end, "condition not reached");
    await sleep(10);
  }
}

export type Sandbox = ReturnType<typeof sandbox>;
