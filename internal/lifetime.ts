/**
 * Transport lifetime: one terminal cancellation scope per transport, with a
 * cheap per-request scope on top.
 *
 * Request scopes are tracked in a set instead of as `abort` listeners on the
 * shared signal, so concurrent requests never trip EventTarget listener-count
 * warnings and a finished request leaves nothing behind.
 */

export interface RequestScope {
  readonly signal: AbortSignal;
  /** Idempotent. Call when the request, including its body, is finished. */
  release(): void;
}

export class TransportLifetime {
  readonly #scopes = new Set<AbortController>();
  readonly #release: () => void;
  readonly #external: AbortSignal | undefined;
  readonly #onExternalAbort = () => this.close(this.#external?.reason);
  #closed = false;
  #reason: unknown;

  /**
   * @param release Frees owned resources; runs once, on close or caller abort.
   * @param external Caller signal; aborting it closes the transport.
   */
  constructor(release: () => void, external?: AbortSignal) {
    this.#release = release;
    this.#external = external;
    if (external?.aborted) {
      this.close(external.reason);
    } else {
      external?.addEventListener("abort", this.#onExternalAbort, {
        once: true,
      });
    }
  }

  close(reason: unknown = closedError()): void {
    if (this.#closed) return;
    this.#closed = true;
    this.#reason = reason;
    this.#external?.removeEventListener("abort", this.#onExternalAbort);
    for (const scope of [...this.#scopes]) scope.abort(reason);
    this.#release();
  }

  /** @param timeoutMs `null` disables the ordinary timeout. */
  scope(timeoutMs: number | null): RequestScope {
    if (this.#closed) throw this.#reason;
    const controller = new AbortController();
    this.#scopes.add(controller);
    const timer = timeoutMs === null ? undefined : setTimeout(
      () =>
        controller.abort(
          new DOMException("The operation timed out.", "TimeoutError"),
        ),
      timeoutMs,
    );
    const release = () => {
      clearTimeout(timer);
      this.#scopes.delete(controller);
      controller.signal.removeEventListener("abort", release);
    };
    controller.signal.addEventListener("abort", release);
    return { signal: controller.signal, release };
  }
}

function closedError(): DOMException {
  return new DOMException("Transport is closed.", "AbortError");
}

/** Mirrors `source`, running `release` once it ends, errors or is cancelled. */
export function releaseOnEnd(
  source: ReadableStream<Uint8Array>,
  release: () => void,
): ReadableStream<Uint8Array> {
  const reader = source.getReader();
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          release();
          controller.close();
        } else {
          controller.enqueue(value);
        }
      } catch (error) { // no-excuse-ok: catch — Propagate source failure to the returned stream.
        release();
        controller.error(error);
      }
    },
    async cancel(reason) {
      release();
      await reader.cancel(reason);
    },
  });
}
