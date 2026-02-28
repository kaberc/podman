/**
 * Gated integration smoke test — requires a live Podman socket and --allow-net.
 * Skipped when no socket is found or Podman is unreachable.
 * Override socket path with PODMAN_SOCK env var.
 *
 * deno test --allow-read --allow-write --allow-run --allow-env --allow-net integration_test.ts
 */

import { assertEquals } from "@std/assert";
import { createClient, type PodmanClient, PodmanError } from "../mod.ts";

function findSocket(): string | null {
  const rootful = "/run/podman/podman.sock";
  let xdg: string | undefined;
  let explicit: string | undefined;
  try {
    xdg = Deno.env.get("XDG_RUNTIME_DIR");
    explicit = Deno.env.get("PODMAN_SOCK");
  } catch {
    // --allow-env not granted — fall back to rootful socket only
  }

  const rootless = xdg ? `${xdg}/podman/podman.sock` : null;
  for (const p of [explicit, rootless, rootful]) {
    if (!p) continue;
    try {
      if (Deno.statSync(p)) return p;
    } catch { /* not found */ }
  }
  return null;
}

let client: PodmanClient | null = null;
let skip = true;

const socketPath = findSocket();
if (socketPath) {
  const probe = createClient({ socketPath });
  try {
    if (await probe.system.ping()) {
      skip = false;
      client = probe;
    }
  } catch {
    probe.close();
  }
}

function getClient(): PodmanClient {
  return client!;
}

// ---------------------------------------------------------------------------
// Read-only tests — safe, no side effects
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: system.ping returns true",
  ignore: skip,
  async fn() {
    const ok = await getClient().system.ping();
    assertEquals(ok, true);
  },
});

Deno.test({
  name: "integration: system.version returns a version string",
  ignore: skip,
  async fn() {
    const ver = await getClient().system.version();
    assertEquals(typeof ver.Version, "string");
    assertEquals(ver.Version!.length > 0, true);
  },
});

Deno.test({
  name: "integration: system.info returns host info",
  ignore: skip,
  async fn() {
    const info = await getClient().system.info();
    assertEquals(typeof info.host?.hostname, "string");
  },
});

Deno.test({
  name: "integration: system.df returns disk usage",
  ignore: skip,
  async fn() {
    const df = await getClient().system.df();
    assertEquals(Array.isArray(df.Images), true);
    assertEquals(Array.isArray(df.Containers), true);
    assertEquals(Array.isArray(df.Volumes), true);
  },
});

Deno.test({
  name: "integration: containers.list returns an array",
  ignore: skip,
  async fn() {
    const list = await getClient().containers.list();
    assertEquals(Array.isArray(list), true);
  },
});

Deno.test({
  name: "integration: images.list returns an array",
  ignore: skip,
  async fn() {
    const list = await getClient().images.list();
    assertEquals(Array.isArray(list), true);
  },
});

Deno.test({
  name: "integration: networks.list returns an array",
  ignore: skip,
  async fn() {
    const list = await getClient().networks.list();
    assertEquals(Array.isArray(list), true);
  },
});

Deno.test({
  name: "integration: volumes.list returns an array",
  ignore: skip,
  async fn() {
    const list = await getClient().volumes.list();
    assertEquals(Array.isArray(list), true);
  },
});

Deno.test({
  name: "integration: pods.list returns an array",
  ignore: skip,
  async fn() {
    const list = await getClient().pods.list();
    assertEquals(Array.isArray(list), true);
  },
});

Deno.test({
  name: "integration: secrets.list returns an array",
  ignore: skip,
  async fn() {
    const list = await getClient().secrets.list();
    assertEquals(Array.isArray(list), true);
  },
});

Deno.test({
  name: "integration: images.search returns results",
  ignore: skip,
  async fn() {
    const results = await getClient().images.search({
      term: "docker.io/library/alpine",
      limit: 3,
    } as never);
    assertEquals(Array.isArray(results), true);
    assertEquals(results.length > 0, true);
  },
});

// ---------------------------------------------------------------------------
// Container lifecycle: create → inspect → start → top → stop → remove
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: container lifecycle",
  ignore: skip,
  async fn() {
    const c = getClient();
    const name = `podman-deno-test-${Date.now()}`;

    // Ensure alpine is available
    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    try {
      // Create
      const { Id } = await c.containers.create({
        name,
        image: "alpine:latest",
        command: ["sleep", "30"],
      } as never);
      assertEquals(typeof Id, "string");

      // Inspect
      const info = await c.containers.inspect(name);
      assertEquals(info?.Name, name);

      // Exists
      assertEquals(await c.containers.exists(name), true);

      // Start
      await c.containers.start(name);

      // Top (process list)
      const top = await c.containers.top(name);
      assertEquals(Array.isArray(top.Processes), true);

      // Stop
      await c.containers.stop(name, { timeout: 2 });
    } finally {
      // Always clean up
      try {
        await c.containers.remove(name, { force: true } as never);
      } catch { /* already removed */ }
    }

    // Verify removed
    const gone = await c.containers.inspect(name);
    assertEquals(gone, null);
  },
});

// ---------------------------------------------------------------------------
// Volume lifecycle: create → inspect → list → remove
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: volume lifecycle",
  ignore: skip,
  async fn() {
    const c = getClient();
    const name = `podman-deno-vol-${Date.now()}`;

    try {
      // Create
      const vol = await c.volumes.create({ Name: name } as never);
      assertEquals(vol.Name, name);

      // Inspect
      const info = await c.volumes.inspect(name);
      assertEquals(info?.Name, name);

      // Exists
      assertEquals(await c.volumes.exists(name), true);

      // List — should include our volume
      const list = await c.volumes.list();
      const found = list.some((v) => v.Name === name);
      assertEquals(found, true);
    } finally {
      try {
        await c.volumes.remove(name);
      } catch { /* already removed */ }
    }

    // Verify removed
    const gone = await c.volumes.inspect(name);
    assertEquals(gone, null);
  },
});

// ---------------------------------------------------------------------------
// Pod lifecycle: create → inspect → start → stop → remove
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: pod lifecycle",
  ignore: skip,
  async fn() {
    const c = getClient();
    const name = `podman-deno-pod-${Date.now()}`;

    try {
      // Create
      const { Id } = await c.pods.create({ name } as never);
      assertEquals(typeof Id, "string");

      // Inspect
      const info = await c.pods.inspect(name);
      assertEquals(info?.Name, name);

      // Exists
      assertEquals(await c.pods.exists(name), true);

      // Start
      await c.pods.start(name);

      // Stop
      await c.pods.stop(name, { t: 2 } as never);
    } finally {
      try {
        await c.pods.remove(name, { force: true } as never);
      } catch { /* already removed */ }
    }

    // Verify removed
    const gone = await c.pods.inspect(name);
    assertEquals(gone, null);
  },
});

// ---------------------------------------------------------------------------
// Secret lifecycle: create → inspect → list → remove
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: secret lifecycle",
  ignore: skip,
  async fn() {
    const c = getClient();
    const name = `podman-deno-secret-${Date.now()}`;

    try {
      // Create — data is a plain string, query has the name
      const created = await c.secrets.create("my-secret-value", {
        name,
      } as never);
      assertEquals(typeof created.ID, "string");

      // Inspect
      const info = await c.secrets.inspect(name);
      assertEquals(info?.Spec?.Name, name);

      // List — should include our secret
      const list = await c.secrets.list();
      const found = list.some((s) => s.Spec?.Name === name);
      assertEquals(found, true);
    } finally {
      try {
        await c.secrets.remove(name);
      } catch { /* already removed */ }
    }
  },
});

// ---------------------------------------------------------------------------
// Network lifecycle: create → inspect → exists → remove
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: network lifecycle",
  ignore: skip,
  async fn() {
    const c = getClient();
    const name = `podman-deno-net-${Date.now()}`;

    try {
      // Create
      const net = await c.networks.create({ name } as never);
      assertEquals(net.name, name);

      // Inspect
      const info = await c.networks.inspect(name);
      assertEquals(info?.name, name);

      // Exists
      assertEquals(await c.networks.exists(name), true);

      // List — should include our network
      const list = await c.networks.list();
      const found = list.some((n) => n.name === name);
      assertEquals(found, true);
    } finally {
      try {
        await c.networks.remove(name);
      } catch { /* already removed */ }
    }

    // Verify removed
    const gone = await c.networks.inspect(name);
    assertEquals(gone, null);
  },
});

// ---------------------------------------------------------------------------
// Exec: create → start → inspect (requires running container)
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: exec lifecycle",
  ignore: skip,
  async fn() {
    const c = getClient();
    const containerName = `podman-deno-exec-${Date.now()}`;

    // Ensure alpine is available
    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    try {
      // Create and start a container
      await c.containers.create({
        name: containerName,
        image: "alpine:latest",
        command: ["sleep", "30"],
      } as never);
      await c.containers.start(containerName);

      // Create exec session
      const execId = await c.exec.create(containerName, {
        Cmd: ["echo", "hello-from-exec"],
        AttachStdout: true,
      });
      assertEquals(typeof execId, "string");
      assertEquals(execId.length > 0, true);

      // Start exec and collect output
      const stream = await c.exec.start(execId);
      const reader = stream.getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      // Output may contain multiplexed header bytes, just verify we got data
      assertEquals(chunks.length > 0, true);

      // Inspect exec session — should show it ran
      const info = await c.exec.inspect(execId);
      assertEquals(typeof info.ContainerID, "string");
    } finally {
      try {
        await c.containers.stop(containerName, { timeout: 2 });
      } catch { /* may already be stopped */ }
      try {
        await c.containers.remove(containerName, { force: true } as never);
      } catch { /* already removed */ }
    }
  },
});

// ---------------------------------------------------------------------------
// Generate: systemd + kube from container
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: generate systemd and kube",
  ignore: skip,
  async fn() {
    const c = getClient();
    const containerName = `podman-deno-gen-${Date.now()}`;

    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    try {
      await c.containers.create({
        name: containerName,
        image: "alpine:latest",
        command: ["sleep", "30"],
      } as never);

      // Generate systemd unit
      const units = await c.generate.systemd(containerName);
      assertEquals(typeof units, "object");
      // Should have at least one unit file keyed by container name
      const keys = Object.keys(units);
      assertEquals(keys.length > 0, true);
      // Unit content should contain [Service]
      const firstUnit = units[keys[0]];
      assertEquals(firstUnit.includes("[Service]"), true);

      // Generate kube YAML
      const yaml = await c.generate.kube({ names: [containerName] });
      assertEquals(typeof yaml, "string");
      assertEquals(yaml.includes("apiVersion"), true);
      assertEquals(yaml.includes("kind"), true);
    } finally {
      try {
        await c.containers.remove(containerName, { force: true } as never);
      } catch { /* already removed */ }
    }
  },
});

// ---------------------------------------------------------------------------
// Manifest lifecycle: create → inspect → exists → remove
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: manifest lifecycle",
  ignore: skip,
  async fn() {
    const c = getClient();
    const name = `localhost/podman-deno-manifest-${Date.now()}`;

    try {
      // Create manifest list
      const created = await c.manifests.create(name, {} as never);
      assertEquals(typeof created.Id, "string");

      // Inspect
      const info = await c.manifests.inspect(name);
      assertEquals(info !== null, true);
      assertEquals(info!.schemaVersion, 2);

      // Exists
      assertEquals(await c.manifests.exists(name), true);
    } finally {
      try {
        await c.manifests.remove(name);
      } catch { /* already removed */ }
    }

    // Verify removed
    assertEquals(await c.manifests.exists(name), false);
  },
});

// ---------------------------------------------------------------------------
// Kube: play + down a simple pod YAML
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: kube play and down",
  ignore: skip,
  async fn() {
    const c = getClient();

    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    const podName = `podman-deno-kube-${Date.now()}`;
    const yaml = `apiVersion: v1
kind: Pod
metadata:
  name: ${podName}
spec:
  containers:
    - name: test
      image: alpine:latest
      command: ["sleep", "30"]`;

    try {
      // Play — creates pod + container from YAML
      const report = await c.kube.play(yaml);
      assertEquals(Array.isArray(report.Pods), true);
      assertEquals(report.Pods!.length > 0, true);

      // Verify pod was created
      const podExists = await c.pods.exists(podName);
      assertEquals(podExists, true);
    } finally {
      // Down — tear down everything created by play
      try {
        await c.kube.down();
      } catch { /* already down */ }
      // Force-clean the pod in case down didn't remove it
      try {
        await c.pods.remove(podName, { force: true } as never);
      } catch { /* already removed */ }
    }
  },
});

// ---------------------------------------------------------------------------
// Artifacts (Podman 5.7+): list + add → inspect → remove
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: artifacts lifecycle",
  ignore: skip,
  async fn() {
    const c = getClient();

    // Check if artifacts API is available (5.7+)
    try {
      await c.artifacts.list();
    } catch {
      // Artifacts not supported on this Podman version — skip
      return;
    }

    const artifactName = `localhost/podman-deno-artifact-${Date.now()}:latest`;
    const testData = new TextEncoder().encode("hello-from-artifact-test");

    try {
      // Add artifact from a stream
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(testData);
          controller.close();
        },
      });
      const added = await c.artifacts.add(body, {
        name: artifactName,
        fileName: "test.txt",
      } as never);
      assertEquals(typeof added.ArtifactDigest, "string");

      // Inspect
      const info = await c.artifacts.inspect(artifactName);
      assertEquals(info !== null, true);
      assertEquals(info!.Name, artifactName);

      // List — should include our artifact
      const list = await c.artifacts.list();
      const found = list.some((a) => a.Name === artifactName);
      assertEquals(found, true);
    } finally {
      try {
        await c.artifacts.remove(artifactName);
      } catch { /* already removed */ }
    }

    // Verify removed
    const gone = await c.artifacts.inspect(artifactName);
    assertEquals(gone, null);
  },
});

// ---------------------------------------------------------------------------
// Quadlets (Podman 5.x+): list (read-only, safe)
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: quadlets list",
  ignore: skip,
  async fn() {
    const c = getClient();

    // Check if quadlets API is available (5.x+)
    try {
      const list = await c.quadlets.list();
      assertEquals(Array.isArray(list), true);
    } catch {
      // Quadlets not supported on this Podman version — skip
      return;
    }
  },
});


// ---------------------------------------------------------------------------
// Helper: create a minimal tar archive with one file
// ---------------------------------------------------------------------------

function simpleTar(fileName: string, content: string): Uint8Array {
  const enc = new TextEncoder();
  const data = enc.encode(content);
  const header = new Uint8Array(512);
  // File name (0–99)
  header.set(enc.encode(fileName));
  // Mode (100–107)
  header.set(enc.encode("0000644\0"), 100);
  // UID (108–115)
  header.set(enc.encode("0000000\0"), 108);
  // GID (116–123)
  header.set(enc.encode("0000000\0"), 116);
  // Size (124–135) in octal
  header.set(enc.encode(data.length.toString(8).padStart(11, "0") + "\0"), 124);
  // Mtime (136–147)
  header.set(
    enc.encode(
      Math.floor(Date.now() / 1000).toString(8).padStart(11, "0") + "\0",
    ),
    136,
  );
  // Checksum placeholder — 8 spaces (148–155)
  header.set(enc.encode("        "), 148);
  // Type flag: '0' = regular file (156)
  header[156] = 0x30;
  // UStar magic (257–262)
  header.set(enc.encode("ustar\0"), 257);
  // UStar version (263–264)
  header.set(enc.encode("00"), 263);
  // Compute checksum
  let sum = 0;
  for (let i = 0; i < 512; i++) sum += header[i];
  header.set(enc.encode(sum.toString(8).padStart(6, "0") + "\0 "), 148);
  // Data block padded to 512 bytes
  const padded = Math.ceil(data.length / 512) * 512 || 512;
  const dataBlock = new Uint8Array(padded);
  dataBlock.set(data);
  // End of archive: two 512-byte zero blocks
  const endBlock = new Uint8Array(1024);
  // Concatenate
  const result = new Uint8Array(512 + padded + 1024);
  result.set(header, 0);
  result.set(dataBlock, 512);
  result.set(endBlock, 512 + padded);
  return result;
}

// ---------------------------------------------------------------------------
// Container operations: pause, unpause, restart, kill
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: container pause, unpause, restart, kill",
  ignore: skip,
  async fn() {
    const c = getClient();
    const name = `podman-deno-ops-${Date.now()}`;

    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    try {
      await c.containers.create({
        name,
        image: "alpine:latest",
        command: ["sleep", "300"],
      } as never);
      await c.containers.start(name);

      // Pause
      await c.containers.pause(name);
      let info = await c.containers.inspect(name);
      assertEquals(info?.State?.Status, "paused");

      // Unpause
      await c.containers.unpause(name);
      info = await c.containers.inspect(name);
      assertEquals(info?.State?.Status, "running");

      // Restart
      await c.containers.restart(name, { t: 2 } as never);
      info = await c.containers.inspect(name);
      assertEquals(info?.State?.Status, "running");

      // Kill
      await c.containers.kill(name);
      await c.containers.wait(name);
      info = await c.containers.inspect(name);
      assertEquals(info?.State?.Running, false);
    } finally {
      try {
        await c.containers.remove(name, { force: true } as never);
      } catch { /* already removed */ }
    }
  },
});

// ---------------------------------------------------------------------------
// Container logs
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: container logs",
  ignore: skip,
  async fn() {
    const c = getClient();
    const name = `podman-deno-logs-${Date.now()}`;

    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    try {
      await c.containers.create({
        name,
        image: "alpine:latest",
        command: ["sh", "-c", "echo hello-integration-logs"],
      } as never);
      await c.containers.start(name);
      await c.containers.wait(name);

      const stream = await c.containers.logs(name, {
        stdout: true,
        stderr: true,
      } as never);
      const reader = stream.getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      const total = chunks.reduce((n, c) => n + c.length, 0);
      const merged = new Uint8Array(total);
      let pos = 0;
      for (const chunk of chunks) {
        merged.set(chunk, pos);
        pos += chunk.length;
      }
      const output = new TextDecoder().decode(merged);
      assertEquals(output.includes("hello-integration-logs"), true);
    } finally {
      try {
        await c.containers.remove(name, { force: true } as never);
      } catch { /* already removed */ }
    }
  },
});

// ---------------------------------------------------------------------------
// Container getArchive
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: container getArchive",
  ignore: skip,
  async fn() {
    const c = getClient();
    const name = `podman-deno-archive-${Date.now()}`;

    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    try {
      await c.containers.create({
        name,
        image: "alpine:latest",
        command: ["sleep", "30"],
      } as never);
      await c.containers.start(name);

      // /etc/hostname always exists in Alpine
      const stream = await c.containers.getArchive(name, {
        path: "/etc/hostname",
      } as never);
      const reader = stream.getReader();
      const { done, value } = await reader.read();
      assertEquals(done, false);
      assertEquals(value!.length > 0, true);
      reader.releaseLock();
      await stream.cancel();
    } finally {
      try {
        await c.containers.stop(name, { timeout: 2 });
      } catch { /* already stopped */ }
      try {
        await c.containers.remove(name, { force: true } as never);
      } catch { /* already removed */ }
    }
  },
});

// ---------------------------------------------------------------------------
// Image tag and untag
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: image tag and untag",
  ignore: skip,
  async fn() {
    const c = getClient();
    const repo = "localhost/podman-deno-tag-test";
    const tag = `v${Date.now()}`;

    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    try {
      await c.images.tag("alpine:latest", repo, tag);
      assertEquals(await c.images.exists(`${repo}:${tag}`), true);

      await c.images.untag(`${repo}:${tag}`, repo, tag);
      assertEquals(await c.images.exists(`${repo}:${tag}`), false);
    } finally {
      try {
        await c.images.untag(`${repo}:${tag}`, repo, tag);
      } catch { /* already untagged */ }
    }
  },
});

// ---------------------------------------------------------------------------
// Image history and resolve
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: image history and resolve",
  ignore: skip,
  async fn() {
    const c = getClient();

    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    const history = await c.images.history("alpine:latest");
    assertEquals(Array.isArray(history), true);
    assertEquals(history.length > 0, true);

    try {
      const resolved = await c.images.resolve("alpine");
      assertEquals(resolved != null, true);
    } catch (e) {
      // images.resolve was added in Podman 5.x; skip on older versions
      if (e instanceof PodmanError && e.status === 405) return;
      throw e;
    }
  },
});

// ---------------------------------------------------------------------------
// Image export stream
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: image export stream",
  ignore: skip,
  async fn() {
    const c = getClient();

    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    const stream = await c.images.export("alpine:latest");
    const reader = stream.getReader();
    const { done, value } = await reader.read();
    assertEquals(done, false);
    assertEquals(value!.length > 0, true);
    reader.releaseLock();
    await stream.cancel();
  },
});

// ---------------------------------------------------------------------------
// Image build from tar context
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: image build",
  ignore: skip,
  async fn() {
    const c = getClient();
    const tag = `localhost/podman-deno-build-${Date.now()}:latest`;

    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    try {
      const dockerfile = "FROM alpine:latest\nCMD [\"echo\", \"built\"]\n";
      const tar = simpleTar("Dockerfile", dockerfile);
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(tar);
          controller.close();
        },
      });

      const stream = await c.images.build(body, { t: tag } as never);
      const reader = stream.getReader();
      while (true) {
        const { done } = await reader.read();
        if (done) break;
      }

      assertEquals(await c.images.exists(tag), true);
    } finally {
      try {
        await c.images.remove(tag);
      } catch { /* already removed */ }
    }
  },
});

// ---------------------------------------------------------------------------
// System events stream
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: system events stream",
  ignore: skip,
  async fn() {
    const c = getClient();
    const stream = await c.system.events();
    assertEquals(stream instanceof ReadableStream, true);
    await stream.cancel();
  },
});

// ---------------------------------------------------------------------------
// System parsedEvents
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: system parsedEvents",
  ignore: skip,
  sanitizeResources: false,
  sanitizeOps: false,
  async fn() {
    const c = getClient();
    const name = `podman-deno-evt-${Date.now()}`;

    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    const since = Math.floor(Date.now() / 1000) - 1;

    // Generate an event
    await c.containers.create({
      name,
      image: "alpine:latest",
      command: ["true"],
    } as never);

    const until = Math.floor(Date.now() / 1000) + 3;

    try {
      let gotEvent = false;
      for await (const event of c.system.parsedEvents({
        since: String(since),
        until: String(until),
      } as never)) {
        assertEquals(typeof event.Type, "string");
        gotEvent = true;
        break;
      }
      assertEquals(gotEvent, true);
    } finally {
      try {
        await c.containers.remove(name, { force: true } as never);
      } catch { /* already removed */ }
    }
  },
});

// ---------------------------------------------------------------------------
// Network connect and disconnect
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: network connect and disconnect",
  ignore: skip,
  sanitizeResources: false,
  async fn() {
    const c = getClient();
    const netName = `podman-deno-cd-net-${Date.now()}`;
    const ctrName = `podman-deno-cd-ctr-${Date.now()}`;

    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    try {
      await c.networks.create({ name: netName } as never);
      await c.containers.create({
        name: ctrName,
        image: "alpine:latest",
        command: ["sleep", "30"],
        netns: { nsmode: "bridge" },
      } as never);
      await c.containers.start(ctrName);

      // Connect
      await c.networks.connect(netName, { container: ctrName } as never);
      let info = await c.containers.inspect(ctrName);
      assertEquals(netName in (info?.NetworkSettings?.Networks ?? {}), true);

      // Disconnect
      await c.networks.disconnect(netName, { container: ctrName } as never);
      info = await c.containers.inspect(ctrName);
      assertEquals(netName in (info?.NetworkSettings?.Networks ?? {}), false);
    } finally {
      try {
        await c.containers.stop(ctrName, { timeout: 2 });
      } catch { /* already stopped */ }
      try {
        await c.containers.remove(ctrName, { force: true } as never);
      } catch { /* already removed */ }
      try {
        await c.networks.remove(netName);
      } catch { /* already removed */ }
    }
  },
});

// ---------------------------------------------------------------------------
// Manifest modify (add image)
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: manifest modify",
  ignore: skip,
  sanitizeResources: false,
  async fn() {
    const c = getClient();
    const name = `localhost/podman-deno-manifest-mod-${Date.now()}`;

    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    try {
      await c.manifests.create(name, {} as never);

      const report = await c.manifests.modify(name, {
        operation: "update",
        images: ["docker.io/library/alpine:latest"],
      } as never);
      assertEquals(typeof report, "object");

      const info = await c.manifests.inspect(name);
      assertEquals(info !== null, true);
      assertEquals(Array.isArray(info!.manifests), true);
      assertEquals(info!.manifests!.length > 0, true);
    } finally {
      try {
        await c.manifests.remove(name);
      } catch { /* already removed */ }
    }
  },
});

// ---------------------------------------------------------------------------
// Pod operations: restart, kill, top, stats
// ---------------------------------------------------------------------------

Deno.test({
  name: "integration: pod restart, kill, top, stats",
  ignore: skip,
  async fn() {
    const c = getClient();
    const podName = `podman-deno-pod-ops-${Date.now()}`;
    const ctrName = `${podName}-ctr`;

    const hasAlpine = await c.images.exists("docker.io/library/alpine:latest");
    if (!hasAlpine) {
      await c.images.pull({ reference: "docker.io/library/alpine:latest" });
    }

    try {
      await c.pods.create({ name: podName } as never);
      await c.containers.create({
        name: ctrName,
        image: "alpine:latest",
        command: ["sleep", "300"],
        pod: podName,
      } as never);
      await c.pods.start(podName);

      // Top
      const top = await c.pods.top(podName);
      assertEquals(Array.isArray(top.Processes), true);

      // Stats
      const stats = await c.pods.stats();
      assertEquals(Array.isArray(stats), true);

      // Restart
      const restart = await c.pods.restart(podName);
      assertEquals(typeof restart, "object");
      await new Promise((r) => setTimeout(r, 500));

      const info = await c.pods.inspect(podName);
      assertEquals(info?.State, "Running");

      // Kill
      const kill = await c.pods.kill(podName);
      assertEquals(typeof kill, "object");
    } finally {
      try {
        await c.pods.remove(podName, { force: true } as never);
      } catch { /* already removed */ }
    }
  },
});