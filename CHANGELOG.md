# Changelog

## 0.2.0

### Features

- **Typed error subclasses** — `PodmanError` now dispatches to a semantic subclass based on HTTP status, so consumers can match on error kind instead of numeric status codes:
  - `PodmanAuthError` (401)
  - `PodmanForbiddenError` (403)
  - `PodmanNotFoundError` (404)
  - `PodmanConflictError` (409) — e.g. "already exists" / "already attached"
  - `PodmanServerError` (5xx)
  - All extend `PodmanError`, so existing `instanceof PodmanError` checks keep working.

  ```ts
  try {
    await podman.networks.connect("net", { container: "ctr" });
  } catch (e) {
    if (e instanceof PodmanConflictError) return; // already attached — fine
    throw e;
  }
  ```

### Behavior changes

- `err.name` for 401/403/404/409/5xx responses is now the subclass name (`"PodmanAuthError"`, `"PodmanConflictError"`, etc.) rather than `"PodmanError"`. Code branching on `instanceof` is unaffected; code branching on `err.name === "PodmanError"` (e.g. log filters, error serializers) will need to update.

## 0.1.4

### Fixes

- Fixed npm OIDC Trusted Publishing: upgraded to Node 24 LTS which ships npm >=11.5.1 (required for OIDC auth)

## 0.1.3

### Fixes

- Fixed response body resource leaks in `networks.connect()`, `networks.disconnect()`, `containers.putArchive()`, `volumes.import()`
- Fixed `parsedEvents()` stream cleanup — `reader.cancel()` propagates cancellation through the pipe chain, eliminating leaks when breaking out early
- Removed all `sanitizeResources: false` test overrides — all 361 tests pass with full Deno resource sanitizers
- Fixed npm publish: added `--provenance` flag for OIDC Trusted Publishing

## 0.1.2

### Fixes

- Fixed npm package repository URL (`kaberc/podman` instead of `podman-deno/podman`)
- Fixed CI integration test compatibility with Podman < 5.x (`images.resolve` gracefully skipped)
- Fixed release workflow: JSR version now matches tag, npm uses OIDC trusted publishing

## 0.1.0

Initial release.

### Features

- **13 API modules** — Containers, Images, Networks, Volumes, Pods, Secrets, System, Exec, Generate, Manifests, Kube, Artifacts, Quadlets
- **4 transports** — Unix socket, TCP, TLS (mTLS), SSH tunnel
- **Dual runtime** — Deno (JSR) and Node.js (npm)
- **Zero dependencies** on both runtimes
- **Full type safety** — Types auto-generated from Podman's OpenAPI specification
- **Error handling** — `inspect()` returns `null` on 404, other errors throw `PodmanError`
- **Streaming** — `ReadableStream<Uint8Array>` for logs, stats, events, exports

### Runtimes

- **Deno** — `jsr:@kaberc/podman` — requires Deno 2.4+
- **Node.js** — `@ostanin/podman` on npm — requires Node.js 18+, ESM and CJS supported
