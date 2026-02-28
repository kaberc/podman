# Changelog

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

 **Deno** — `jsr:@kaberc/podman` — requires Deno 2.4+
 **Node.js** — `@ostanin/podman` on npm — requires Node.js 18+, ESM and CJS supported
