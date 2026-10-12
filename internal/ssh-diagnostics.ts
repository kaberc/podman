/** What `ssh` told us: its exit status and the tail of its stderr. */

const STDERR_TAIL_CHARS = 4_096;

export type SshExit =
  | {
    readonly kind: "exited";
    readonly code: number | null;
    readonly signal: string | null;
  }
  | { readonly kind: "failed"; readonly error: unknown };

/** Keeps only the last `STDERR_TAIL_CHARS` of what ssh printed. */
export class StderrTail {
  readonly #decoder = new TextDecoder();
  #text = "";

  push(chunk: Uint8Array): void {
    const decoded = this.#decoder.decode(chunk, { stream: true });
    this.#text = (this.#text + decoded).slice(-STDERR_TAIL_CHARS);
  }

  text(): string {
    return this.#text.trim();
  }
}

/** Reads ssh's stderr until it ends; a broken pipe only costs diagnostics. */
export async function drain(
  source: AsyncIterable<Uint8Array>,
  into: StderrTail,
): Promise<void> {
  try {
    for await (const chunk of source) into.push(chunk);
  } catch { // no-excuse-ok: catch — diagnostics only; the exit status still reports the failure.
  }
}

export function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function describeStatus(exit: SshExit): string {
  switch (exit.kind) {
    case "failed":
      return `ssh could not run (${messageOf(exit.error)})`;
    case "exited":
      return `ssh exited with ${
        exit.code === null ? exit.signal : `code ${exit.code}`
      }`;
  }
}

export function describeExit(exit: SshExit, stderr: StderrTail): string {
  const status = describeStatus(exit);
  const diagnostics = stderr.text();
  return diagnostics ? `${status}: ${diagnostics}` : status;
}
