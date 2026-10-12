# podman

Typed Podman client for Deno, Node.js, and Bun. Zero runtime dependencies. The
libpod API with Unix socket, TCP, TLS, and SSH transports.

## Features

- **Native Podman API** — Uses libpod endpoints directly (not Docker compat
  layer)
- **Full type safety** — Types auto-generated from Podman's OpenAPI
  specification
- **Zero runtime dependencies** — No external packages in the client
- **Three runtimes** — Deno, Node.js, and Bun
- **Native Bun transport** — Native fetch for Unix sockets and TLS
- **4 transports** — Unix socket, TCP, TLS (mTLS), SSH tunnel
- **13 API modules** — Containers, Images, Networks, Volumes, Pods, Secrets,
  System, Exec, Generate, Manifests, Kube, Artifacts, Quadlets

## Install

### Deno

```ts
import { createClient } from "jsr:@kaberc/podman";
```

Or add to `deno.json`:

```json
{
  "imports": {
    "@kaberc/podman": "jsr:@kaberc/podman"
  }
}
```

### Node.js

```sh
npm install @ostanin/podman
```

```ts
import { createClient } from "@ostanin/podman";
```

### Bun

```sh
bun add @ostanin/podman
```

```ts
import { createClient } from "@ostanin/podman";
```

**Requirements:**

- Deno 2.4+, Node.js 18.18+, or Bun 1.4.0+
- Podman 6.0+ with the libpod API. Types use the stable Podman 6.1.3
  specification

The default API version is `6.0.0`. You can set `apiVersion` explicitly, but the
client types describe Podman 6. See [CHANGELOG.md](CHANGELOG.md) for the 0.6
migration changes.

## Quick Start

```ts
// Deno
import { createClient } from "jsr:@kaberc/podman";
// Node.js or Bun
// import { createClient } from "@ostanin/podman";

const podman = createClient({ socketPath: "/run/podman/podman.sock" });

// Pull and run a container
await podman.images.pull({ reference: "docker.io/library/alpine:latest" });
const { Id } = await podman.containers.create({
  name: "my-app",
  image: "alpine:latest",
});
await podman.containers.start("my-app");

// Execute a command and read the output stream
const execId = await podman.exec.create("my-app", {
  Cmd: ["echo", "hello"],
  AttachStdout: true,
});
const stream = await podman.exec.start(execId);
for await (const chunk of stream) {
  console.log(new TextDecoder().decode(chunk));
}

// Clean up
await podman.containers.stop("my-app");
await podman.containers.remove("my-app", { force: true });
podman.close();
```

## Transports

### Unix Socket (default)

```ts
const podman = createClient({ socketPath: "/run/podman/podman.sock" });
```

| Option       | Type             | Default   | Description                   |
| ------------ | ---------------- | --------- | ----------------------------- |
| `socketPath` | `string`         | —         | Path to Podman's Unix socket  |
| `apiVersion` | `string`         | `"6.0.0"` | Podman API version            |
| `timeout`    | `number \| null` | `30000`   | Ordinary request timeout (ms) |
| `auth`       | `object`         | —         | Registry credentials          |

### Cancellation and disposal

Use `signal` to bind a client to one operation. Cancellation stops its requests
and response streams. `close()` also stops these resources and refuses new
requests. You can call it more than once. The client supports `Symbol.dispose`,
so a `using` scope closes it automatically.

```ts
const cancellation = new AbortController();
using podman = createClient({
  socketPath: "/run/podman/podman.sock",
  signal: cancellation.signal,
});
```

The request `timeout` does not limit long-lived streams from `requestStream`.
Set `timeout: null` when an operation signal owns the deadline for ordinary
requests too.

Image pulls accept an awaited report callback and reject errors in successful
HTTP responses:

```ts
await podman.images.pull(
  { reference: "docker.io/library/alpine:latest" },
  (report) => {
    if (report.stream) console.log(report.stream);
  },
);
```

Set `pullProgress: true` for structured Podman 6 progress reports. The callback
receives `status` and `pullProgress`. The result contains the final image IDs.
With `compatMode: true`, the callback receives Docker-style progress instead.
The result is the final `Download complete` report, with a shortened image ID,
not a native image summary. Podman rejects `compatMode: true` combined with
`quiet: true` or `pullProgress: true`.

Image and manifest pushes consume their reports before they resolve. They reject
in-body errors even after HTTP 200. Pulls, pushes, and both build methods use
the client signal, not the ordinary request timeout.

For a context directory on the Podman host, `images.buildLocal` applies its
ignore file without a context upload. Consume its reports with
`collectBuildOutput` to detect build errors:

```ts
import { collectBuildOutput } from "@ostanin/podman";

await collectBuildOutput(
  await podman.images.buildLocal({
    localcontextdir: "/absolute/context",
    dockerfile: "/absolute/context/Dockerfile",
    t: "localhost/example:latest",
  }),
  (report) => {
    if (report.stream) console.log(report.stream);
  },
);
```

Client cancellation and disposal still apply to these streams. Response streams
support default readers, not BYOB readers. TypeScript consumers need
`Disposable` from `ESNext.Disposable` (TypeScript 5.2 or later), or recent Node
types.

### Multiplexed output

Use `collectMultiplexedOutput` for non-TTY stdout/stderr streams from Podman.
Set `maxBytes` to limit the combined output size. Invalid frames and truncated
output cause `PodmanStreamError`.

```ts
import { collectMultiplexedOutput } from "@ostanin/podman";

const stream = await podman.containers.logs("my-container", {
  stdout: true,
  stderr: true,
});
const output = await collectMultiplexedOutput(stream, {
  maxBytes: 4 * 1024 * 1024,
  signal: cancellation.signal,
});
```

### TCP (Remote Podman API)

```ts
const podman = createClient({ uri: "http://192.168.1.100:8080" });
```

Enable the Podman API on the remote machine:

```sh
podman system service --time=0 tcp:127.0.0.1:8080
```

The Podman API can control the host. Do not expose it on a public interface. Use
an SSH tunnel or verified TLS with client certificates for remote access.

| Option       | Type             | Default   | Description                   |
| ------------ | ---------------- | --------- | ----------------------------- |
| `uri`        | `string`         | —         | HTTP/HTTPS endpoint           |
| `apiVersion` | `string`         | `"6.0.0"` | Podman API version            |
| `timeout`    | `number \| null` | `30000`   | Ordinary request timeout (ms) |
| `auth`       | `object`         | —         | Registry credentials          |
| `tls`        | `object`         | —         | TLS options (see below)       |

#### TLS (HTTPS)

For HTTPS with custom CA or client certificates (mTLS):

```ts
// Deno
const podman = createClient({
  uri: "https://podman.example.com:8443",
  tls: {
    caCerts: [await Deno.readTextFile("/path/to/ca.pem")],
    cert: await Deno.readTextFile("/path/to/client-cert.pem"),
    key: await Deno.readTextFile("/path/to/client-key.pem"),
  },
});

// Node.js or Bun
import { readFileSync } from "node:fs";

const podman = createClient({
  uri: "https://podman.example.com:8443",
  tls: {
    caCerts: [readFileSync("/path/to/ca.pem", "utf8")],
    cert: readFileSync("/path/to/client-cert.pem", "utf8"),
    key: readFileSync("/path/to/client-key.pem", "utf8"),
  },
});
```

| TLS Option | Type       | Description                                 |
| ---------- | ---------- | ------------------------------------------- |
| `caCerts`  | `string[]` | PEM-encoded CA certificates for the server  |
| `cert`     | `string`   | PEM-encoded client certificate chain (mTLS) |
| `key`      | `string`   | PEM-encoded client private key (mTLS)       |

Standard HTTPS (with system CA trust store) works without `tls` options — just
use an `https://` URI.

### SSH Tunnel (Remote Podman via SSH)

Tunnels a Unix socket over SSH. Requires the `ssh` binary on the local machine:

```ts
import { createSshClient } from "@ostanin/podman"; // or jsr:@kaberc/podman

const podman = await createSshClient({ host: "user@remote-server" });
```

| Option             | Type             | Default                   | Description                                  |
| ------------------ | ---------------- | ------------------------- | -------------------------------------------- |
| `host`             | `string`         | —                         | SSH destination (e.g. `user@host`)           |
| `remoteSocketPath` | `string`         | `/run/podman/podman.sock` | Socket path on remote machine                |
| `port`             | `number`         | `22`                      | SSH port                                     |
| `identityFile`     | `string`         | —                         | Path to SSH private key                      |
| `sshOptions`       | `string[]`       | `[]`                      | Extra SSH arguments                          |
| `apiVersion`       | `string`         | `"6.0.0"`                 | Podman API version                           |
| `timeout`          | `number \| null` | `30000`                   | Ordinary request timeout (ms)                |
| `auth`             | `object`         | —                         | Registry credentials                         |
| `signal`           | `AbortSignal`    | —                         | Cancel startup, requests, and the SSH tunnel |

SSH clients use the same cancellation contract as Unix and TCP clients.
`PodmanSshError` includes the host and bounded SSH diagnostics. An unexpected
SSH exit closes the client. `close()` starts tunnel cleanup and returns
immediately. Cleanup ends the child before it removes the private directory.

```ts
const podman = await createSshClient({
  host: "deploy@prod-server",
  port: 2222,
  identityFile: "/home/me/.ssh/id_ed25519",
  remoteSocketPath: "/run/user/1000/podman/podman.sock",
});
```

The `auth` option accepts either `{ username, password }` or `{ identityToken }`
for private registry operations.

## API Reference

### Containers

| Method                                | Description                                                           |
| ------------------------------------- | --------------------------------------------------------------------- |
| `create(spec)`                        | Create a container                                                    |
| `inspect(nameOrId)`                   | Inspect a container (returns `null` on 404)                           |
| `list(query?)`                        | List containers                                                       |
| `start(nameOrId)`                     | Start a container (idempotent; returns `{ alreadyRunning }`)          |
| `stop(nameOrId, query?)`              | Stop a container (idempotent; returns `{ alreadyStopped }`)           |
| `restart(nameOrId, query?)`           | Restart a container                                                   |
| `kill(nameOrId, query?)`              | Send signal to container (idempotent; returns `{ wasRunning }`)       |
| `pause(nameOrId)`                     | Pause a container                                                     |
| `unpause(nameOrId)`                   | Unpause a container                                                   |
| `remove(nameOrId, query?)`            | Remove a container (idempotent; returns `{ alreadyRemoved }`)         |
| `logs(nameOrId, query?)`              | Stream container logs                                                 |
| `top(nameOrId, query?)`               | List processes in container                                           |
| `wait(nameOrId, query?)`              | Wait for container to stop                                            |
| `rename(nameOrId, newName)`           | Rename a container                                                    |
| `resize(nameOrId, query)`             | Resize container TTY                                                  |
| `export(nameOrId)`                    | Export container filesystem                                           |
| `checkpoint(nameOrId, query?)`        | Checkpoint a container                                                |
| `restore(nameOrId, query?)`           | Restore a container                                                   |
| `exists(nameOrId)`                    | Check if container exists                                             |
| `prune(query?)`                       | Remove stopped containers                                             |
| `stats(nameOrId, query?)`             | Stream container resource stats                                       |
| `attach(nameOrId, query?)`            | Attach to a running container                                         |
| `getArchive(nameOrId, query)`         | Get file archive from container                                       |
| `putArchive(nameOrId, body, query)`   | Upload file archive to container                                      |
| `healthcheck(nameOrId)`               | Run container healthcheck                                             |
| `init(nameOrId)`                      | Initialize a container (idempotent; returns `{ alreadyInitialized }`) |
| `update(nameOrId, resources, query?)` | Update container resource limits                                      |
| `changes(nameOrId, query?)`           | List filesystem changes                                               |
| `mount(nameOrId)`                     | Mount a container's filesystem                                        |
| `unmount(nameOrId)`                   | Unmount a container's filesystem                                      |
| `showMounted()`                       | List all mounted containers                                           |
| `statsAll(query?)`                    | Stream resource stats for all containers                              |

### Images

| Method                        | Description                                         |
| ----------------------------- | --------------------------------------------------- |
| `list(query?)`                | List images                                         |
| `inspect(nameOrId)`           | Inspect an image (returns `null` on 404)            |
| `pull(query)`                 | Pull an image                                       |
| `remove(nameOrId, query?)`    | Remove an image (returns `null` on 404)             |
| `tag(nameOrId, repo, tag?)`   | Tag an image                                        |
| `untag(nameOrId, repo, tag?)` | Untag an image                                      |
| `search(query)`               | Search for images                                   |
| `history(nameOrId)`           | Image layer history                                 |
| `push(nameOrId, query?)`      | Push an image                                       |
| `import(body, query?)`        | Import image from tarball                           |
| `export(nameOrId)`            | Export image as tarball                             |
| `load(body)`                  | Load images from tar archive                        |
| `prune(query?)`               | Prune unused images                                 |
| `build(body, query?)`         | Build image from context                            |
| `exists(nameOrId)`            | Check if image exists                               |
| `commit(query)`               | Commit container changes to image                   |
| `tree(nameOrId, query?)`      | Get layer tree representation                       |
| `changes(nameOrId, query?)`   | List filesystem changes                             |
| `resolve(nameOrId)`           | Resolve short image name to full reference          |
| `exportMultiple(query?)`      | Export multiple images as tar archive               |
| `removeAll(query?)`           | Remove one or more images                           |
| `scp(nameOrId, query?)`       | Copy an image between hosts via SCP                 |
| `loadLocal(query)`            | Load an image from a local file on the server       |
| `buildLocal(query)`           | Build an image from a local directory on the server |

### Networks

| Method                       | Description                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| `create(opts, query?)`       | Create a network                                            |
| `inspect(nameOrId)`          | Inspect a network (returns `null` on 404)                   |
| `list(query?)`               | List networks                                               |
| `remove(nameOrId)`           | Remove a network (idempotent; returns `{ alreadyRemoved }`) |
| `exists(nameOrId)`           | Check if network exists                                     |
| `update(nameOrId, opts)`     | Update network DNS servers (Podman 5.0+)                    |
| `connect(nameOrId, opts)`    | Connect a container. A repeated connection throws           |
| `disconnect(nameOrId, opts)` | Disconnect a container. A repeated disconnection throws     |
| `prune(query?)`              | Prune unused networks                                       |

### Volumes

| Method                     | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| `create(opts)`             | Create a volume                                            |
| `inspect(nameOrId)`        | Inspect a volume (returns `null` on 404)                   |
| `list(query?)`             | List volumes                                               |
| `remove(nameOrId, query?)` | Remove a volume (idempotent; returns `{ alreadyRemoved }`) |
| `exists(nameOrId)`         | Check if volume exists                                     |
| `prune(query?)`            | Prune unused anonymous volumes                             |
| `rename(nameOrId, query)`  | Rename a volume (Podman 6+)                                |
| `export(nameOrId)`         | Export volume as tar archive                               |
| `import(nameOrId, body)`   | Import tar archive into volume                             |

### Pods

| Method                     | Description                                     |
| -------------------------- | ----------------------------------------------- |
| `create(spec)`             | Create a pod                                    |
| `inspect(nameOrId)`        | Inspect a pod (returns `null` on 404)           |
| `list(query?)`             | List pods                                       |
| `remove(nameOrId, query?)` | Remove a pod (returns `null` on 404)            |
| `start(nameOrId)`          | Start a pod (idempotent; returns `null` on 304) |
| `stop(nameOrId, query?)`   | Stop a pod (idempotent; returns `null` on 304)  |
| `restart(nameOrId)`        | Restart a pod                                   |
| `kill(nameOrId, query?)`   | Send signal to pod (returns `null` on 409)      |
| `pause(nameOrId)`          | Pause a pod (returns `null` on 409)             |
| `unpause(nameOrId)`        | Unpause a pod (returns `null` on 409)           |
| `top(nameOrId, query?)`    | List processes in pod                           |
| `exists(nameOrId)`         | Check if pod exists                             |
| `stats(query?)`            | Get pod resource stats                          |
| `prune()`                  | Prune stopped pods                              |

### Secrets

| Method                      | Description                                                |
| --------------------------- | ---------------------------------------------------------- |
| `create(data, query)`       | Create a secret                                            |
| `inspect(nameOrId, query?)` | Inspect a secret (returns `null` on 404)                   |
| `list(query?)`              | List secrets                                               |
| `remove(nameOrId, query?)`  | Remove a secret (idempotent; returns `{ alreadyRemoved }`) |
| `exists(nameOrId)`          | Check if secret exists                                     |

### System

| Method                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `info()`               | Get Podman system information                |
| `version()`            | Get Podman version                           |
| `ping()`               | Ping Podman (returns boolean)                |
| `prune(query?)`        | Prune unused system data                     |
| `df()`                 | Get disk usage (containers, images, volumes) |
| `events(query?)`       | Stream system events (raw bytes)             |
| `parsedEvents(query?)` | Stream system events as parsed JSON          |
| `check(query?)`        | Run consistency check on container storage   |

### Exec

| Method                     | Description                                      |
| -------------------------- | ------------------------------------------------ |
| `create(nameOrId, config)` | Create an exec instance (returns exec ID)        |
| `start(id, config?)`       | Start exec and stream output                     |
| `inspect(id)`              | Inspect an exec instance (returns `null` on 404) |
| `resize(id, query)`        | Resize exec TTY                                  |

### Generate (Podman-specific)

| Method                      | Description                 |
| --------------------------- | --------------------------- |
| `systemd(nameOrId, query?)` | Generate systemd unit files |
| `kube(query)`               | Generate Kubernetes YAML    |

### Manifests (Podman-specific)

| Method                                | Description                                     |
| ------------------------------------- | ----------------------------------------------- |
| `create(name, query, opts?)`          | Create a manifest list                          |
| `inspect(nameOrId, query?)`           | Inspect a manifest list (returns `null` on 404) |
| `exists(nameOrId)`                    | Check if manifest list exists                   |
| `modify(nameOrId, opts, query?)`      | Modify a manifest list (add/remove/annotate)    |
| `remove(nameOrId, query?)`            | Remove a manifest list (returns `null` on 404)  |
| `push(nameOrId, destination, query?)` | Push manifest list to registry                  |

### Kube (Podman-specific)

| Method                | Description                         |
| --------------------- | ----------------------------------- |
| `play(body, query?)`  | Play a Kubernetes YAML file         |
| `down(query?)`        | Tear down resources created by play |
| `apply(body, query?)` | Apply Kubernetes YAML to Podman     |

### Artifacts (Podman 5.7+)

| Method                      | Description                                 |
| --------------------------- | ------------------------------------------- |
| `list()`                    | List all artifacts                          |
| `inspect(nameOrId)`         | Inspect an artifact (returns `null` on 404) |
| `add(body, query)`          | Add a file as a new artifact                |
| `addLocal(query)`           | Add a local file as an artifact             |
| `remove(nameOrId)`          | Remove an artifact (returns `null` on 404)  |
| `removeAll(query?)`         | Remove one or more artifacts                |
| `extract(nameOrId, query?)` | Extract artifact contents as tar stream     |
| `push(nameOrId, query?)`    | Push artifact to remote registry            |
| `pull(query)`               | Pull artifact from remote registry          |

### Quadlets (Podman 5.x+)

| Method                  | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `list(query?)`          | List all quadlets                                 |
| `install(body, query?)` | Install quadlet files from tar archive            |
| `remove(name, query?)`  | Remove a quadlet (returns `null` on 404)          |
| `removeAll(query?)`     | Remove one or more quadlets                       |
| `exists(name)`          | Check if a quadlet exists                         |
| `file(name)`            | Get quadlet file contents (returns `null` on 404) |

## Error Handling

- **404 responses**: `inspect()` methods return `null` instead of throwing.
  Destructive remove calls either return `null` or an idempotency flag as
  documented above.
- **Other errors**: Throw `PodmanError` (or a typed subclass) with `status`,
  `message`, `method`, and `path`

Typed subclasses dispatched by HTTP status:

| Subclass                 | Status | Common cause                          |
| ------------------------ | ------ | ------------------------------------- |
| `PodmanNotModifiedError` | 304    | Resource already in target state      |
| `PodmanAuthError`        | 401    | Missing or invalid credentials        |
| `PodmanForbiddenError`   | 403    | Operation not allowed                 |
| `PodmanNotFoundError`    | 404    | Resource does not exist               |
| `PodmanConflictError`    | 409    | "already exists" / "already attached" |
| `PodmanServerError`      | 5xx    | libpod or storage error               |

All subclasses extend `PodmanError`, so existing `instanceof PodmanError` checks
keep working.

`containers.start()`, `containers.stop()`, and `containers.init()` are
idempotent — they resolve on 304 with
`{ alreadyRunning|Stopped|Initialized: true }` instead of throwing.
`containers.kill()` resolves HTTP 409 as `{ wasRunning: false }`, and
`containers.remove()`, `networks.remove()`, `volumes.remove()`, and
`secrets.remove()` resolve HTTP 404 as `{ alreadyRemoved: true }`.
`pods.start()` and `pods.stop()` resolve to `null` on 304; `pods.kill()`,
`pods.pause()`, and `pods.unpause()` resolve to `null` on 409. The
`PodmanNotModifiedError` subclass exists for any other endpoint that
surfaces 304.

```ts
import { PodmanError } from "@ostanin/podman"; // or jsr:@kaberc/podman

try {
  await podman.system.check();
} catch (e) {
  if (e instanceof PodmanError) {
    console.error(`${e.method} ${e.path}: ${e.status} ${e.message}`);
  }
  throw e;
}
```

## Streaming

Methods returning `ReadableStream<Uint8Array>` (logs, stats, attach, events,
export) stream data as raw bytes:

```ts
const stream = await podman.containers.logs("my-app", {
  follow: true,
  stdout: true,
});

for await (const chunk of stream) {
  console.log(new TextDecoder().decode(chunk));
}
```

For system events, use `parsedEvents()` for structured data:

```ts
for await (const event of podman.system.parsedEvents()) {
  console.log(event.Type, event.Action, event.Actor);
}
```

## Building the npm Package

The npm package is built from the Deno source using
[`dnt`](https://github.com/denoland/dnt):

```sh
deno task build-npm 0.6.1
```

This outputs a complete npm package to `./npm/` with ESM, CJS, and type
declarations.

## Generated Types

Podman schema models are generated from the libpod OpenAPI specification into
`types/models/`, and operation query types are generated into
`types/queries.ts`. They are re-exported through the package entry point, so
consumers should import types from `@ostanin/podman` or `jsr:@kaberc/podman`
instead of generated file paths.

## License

MIT
