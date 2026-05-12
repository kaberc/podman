# Changelog

## 0.4.1

### Fixes

- **Restore typed response shapes for `ListContainer`,
  `ContainerCreateResponse`, `ListPodsReport`, `SystemDfReport`, and ~40 other
  schemas** that the 0.4.0 regeneration had collapsed to
  `Record<string, unknown>`. The Podman v6 swagger generator (master) drops
  `properties:` for these schemas; the spec source is now pinned to the latest
  GA release (`swagger-v5.8.2.yaml`), which still emits full property metadata
  while keeping all Quadlets and Artifacts endpoints.

## 0.4.0

### Features

- **More idempotent destructive operations** — common remove and detach-style
  calls now report already-done states instead of throwing for Podman's expected
  404/409 responses:
  - `containers.kill()` returns `{ wasRunning: false }` on 409.
  - `containers.remove()`, `networks.remove()`, `volumes.remove()`, and
    `secrets.remove()` return `{ alreadyRemoved: true }` on 404.
  - `networks.connect()` returns `{ alreadyConnected: true }` on 409.
  - `networks.disconnect()` returns `{ alreadyDisconnected: true }` on 409.
  - `pods.kill()`, `pods.pause()`, and `pods.unpause()` return `null` on 409.
  - `images.remove()`, `manifests.remove()`, `artifacts.remove()`,
    `quadlets.remove()`, and `pods.remove()` return `null` on 404.
- **Generated type layout** — OpenAPI schemas are now generated as individual
  model files under `types/models/`, with operation query types in
  `types/queries.ts`. Public imports continue to go through package exports
  rather than the generated files directly.

### Behavior changes (breaking)

- `containers.kill()` return type: `Promise<void>` →
  `Promise<{ wasRunning: boolean }>`.
- `containers.remove()` return type: `Promise<void>` →
  `Promise<{ alreadyRemoved: boolean }>`.
- `networks.remove()` return type: `Promise<void>` →
  `Promise<{ alreadyRemoved: boolean }>`.
- `networks.connect()` return type: `Promise<void>` →
  `Promise<{ alreadyConnected: boolean }>`.
- `networks.disconnect()` return type: `Promise<void>` →
  `Promise<{ alreadyDisconnected: boolean }>`.
- `volumes.remove()` return type: `Promise<void>` →
  `Promise<{ alreadyRemoved: boolean }>`.
- `secrets.remove()` return type: `Promise<void>` →
  `Promise<{ alreadyRemoved: boolean }>`.
- `images.remove()`, `manifests.remove()`, `artifacts.remove()`,
  `quadlets.remove()`, and `pods.remove()` now return `null` for not-found
  removals instead of throwing.
- `pods.kill()`, `pods.pause()`, and `pods.unpause()` now return `null` for
  already-done 409 responses instead of throwing.

## 0.3.0

### Features

- **`PodmanNotModifiedError` (304)** — `createPodmanError` now dispatches HTTP
  304 to a dedicated subclass. Consumers no longer need to combine a typed-error
  check with a raw `e.status === 304` check for endpoints that still surface 304
  as an error. Container `start()` / `stop()` / `init()` handle 304 directly via
  the idempotent return values below.

- **Idempotent container lifecycle calls** — `containers.start()` / `stop()` /
  `init()` are now silently idempotent: they resolve whether or not the
  container was already in the target state, and report what happened via the
  return value.

  ```ts
  const { alreadyRunning } = await podman.containers.start("ctr");
  const { alreadyStopped } = await podman.containers.stop("ctr");
  const { alreadyInitialized } = await podman.containers.init("ctr");
  ```

- **`null` on 404 extended to other lookups** — `exec.inspect()` now returns
  `null` on 404, matching every other `inspect()` method. `quadlets.file()` also
  returns `null` on 404 — extending the null-on-404 convention from `inspect()`
  methods to file-content getters.

### Behavior changes (breaking)

- `containers.start()` return type: `Promise<void>` →
  `Promise<{ alreadyRunning: boolean }>`. Callers using `await` without
  assignment are unaffected; callers explicitly typing the result as `void` need
  to update.
- `containers.stop()` return type: `Promise<void>` →
  `Promise<{ alreadyStopped: boolean }>`.
- `containers.init()` return type: `Promise<void>` →
  `Promise<{ alreadyInitialized: boolean }>`.
- `pods.start()` return type: `Promise<PodStartReport>` →
  `Promise<PodStartReport | null>`. Returns `null` on 304 (pod already running)
  instead of casting an empty body as a report — fixes a latent unsoundness.
- `pods.stop()` return type: `Promise<PodStopReport>` →
  `Promise<PodStopReport | null>`. Same fix for 304 (pod already stopped).
- `exec.inspect()` return type: `Promise<InspectExecSession>` →
  `Promise<InspectExecSession | null>`.
- `quadlets.file()` return type: `Promise<string>` → `Promise<string | null>`.

## 0.2.0

### Features

- **Typed error subclasses** — `PodmanError` now dispatches to a semantic
  subclass based on HTTP status, so consumers can match on error kind instead of
  numeric status codes:
  - `PodmanAuthError` (401)
  - `PodmanForbiddenError` (403)
  - `PodmanNotFoundError` (404)
  - `PodmanConflictError` (409) — e.g. "already exists" / "already attached"
  - `PodmanServerError` (5xx)
  - All extend `PodmanError`, so existing `instanceof PodmanError` checks keep
    working.

  ```ts
  try {
    await podman.networks.connect("net", { container: "ctr" });
  } catch (e) {
    if (e instanceof PodmanConflictError) return; // already attached — fine
    throw e;
  }
  ```

### Behavior changes

- `err.name` for 401/403/404/409/5xx responses is now the subclass name
  (`"PodmanAuthError"`, `"PodmanConflictError"`, etc.) rather than
  `"PodmanError"`. Code branching on `instanceof` is unaffected; code branching
  on `err.name === "PodmanError"` (e.g. log filters, error serializers) will
  need to update.

## 0.1.4

### Fixes

- Fixed npm OIDC Trusted Publishing: upgraded to Node 24 LTS which ships npm
  > =11.5.1 (required for OIDC auth)

## 0.1.3

### Fixes

- Fixed response body resource leaks in `networks.connect()`,
  `networks.disconnect()`, `containers.putArchive()`, `volumes.import()`
- Fixed `parsedEvents()` stream cleanup — `reader.cancel()` propagates
  cancellation through the pipe chain, eliminating leaks when breaking out early
- Removed all `sanitizeResources: false` test overrides — all 361 tests pass
  with full Deno resource sanitizers
- Fixed npm publish: added `--provenance` flag for OIDC Trusted Publishing

## 0.1.2

### Fixes

- Fixed npm package repository URL (`kaberc/podman` instead of
  `podman-deno/podman`)
- Fixed CI integration test compatibility with Podman < 5.x (`images.resolve`
  gracefully skipped)
- Fixed release workflow: JSR version now matches tag, npm uses OIDC trusted
  publishing

## 0.1.0

Initial release.

### Features

- **13 API modules** — Containers, Images, Networks, Volumes, Pods, Secrets,
  System, Exec, Generate, Manifests, Kube, Artifacts, Quadlets
- **4 transports** — Unix socket, TCP, TLS (mTLS), SSH tunnel
- **Dual runtime** — Deno (JSR) and Node.js (npm)
- **Zero dependencies** on both runtimes
- **Full type safety** — Types auto-generated from Podman's OpenAPI
  specification
- **Error handling** — `inspect()` returns `null` on 404, other errors throw
  `PodmanError`
- **Streaming** — `ReadableStream<Uint8Array>` for logs, stats, events, exports

### Runtimes

- **Deno** — `jsr:@kaberc/podman` — requires Deno 2.4+
- **Node.js** — `@ostanin/podman` on npm — requires Node.js 18+, ESM and CJS
  supported
