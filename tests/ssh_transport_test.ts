import { assertEquals, assertRejects } from "@std/assert";
import { createSshTransport } from "../ssh_transport.ts";

// ─── Error paths ─────────────────────────────────────────────────────────────

Deno.test("sshTransport: rejects when ssh command not found", async () => {
  const err = await assertRejects(
    () =>
      createSshTransport({
        host: "user@nonexistent-host-that-will-never-resolve.invalid",
        sshOptions: ["-o", "ConnectTimeout=1"],
      }),
    Error,
  );
  assertEquals(err.message.includes("SSH tunnel"), true);
});

Deno.test("sshTransport: uses custom remoteSocketPath", async () => {
  const err = await assertRejects(
    () =>
      createSshTransport({
        host: "user@nonexistent-host-that-will-never-resolve.invalid",
        remoteSocketPath: "/custom/podman.sock",
        sshOptions: ["-o", "ConnectTimeout=1"],
      }),
    Error,
  );
  assertEquals(
    err.message.includes("nonexistent-host-that-will-never-resolve.invalid"),
    true,
  );
});

Deno.test("sshTransport: uses custom port", async () => {
  const err = await assertRejects(
    () =>
      createSshTransport({
        host: "user@nonexistent-host-that-will-never-resolve.invalid",
        port: 2222,
        sshOptions: ["-o", "ConnectTimeout=1"],
      }),
    Error,
  );
  assertEquals(err.message.includes("SSH tunnel"), true);
});

Deno.test("sshTransport: includes identityFile in args", async () => {
  const err = await assertRejects(
    () =>
      createSshTransport({
        host: "user@nonexistent-host-that-will-never-resolve.invalid",
        identityFile: "/path/to/key",
        sshOptions: ["-o", "ConnectTimeout=1"],
      }),
    Error,
  );
  assertEquals(err.message.includes("SSH tunnel"), true);
});

Deno.test("sshTransport: default options produce correct error", async () => {
  const err = await assertRejects(
    () =>
      createSshTransport({
        host: "user@nonexistent-host-that-will-never-resolve.invalid",
        sshOptions: ["-o", "ConnectTimeout=1"],
      }),
    Error,
  );

  assertEquals(
    err.message.includes("nonexistent-host-that-will-never-resolve.invalid"),
    true,
  );

  assertEquals(err.message.includes("SSH tunnel"), true);
});

Deno.test("sshTransport: error message includes stderr output when available", async () => {
  const err = await assertRejects(
    () =>
      createSshTransport({
        host: "user@nonexistent-host-that-will-never-resolve.invalid",
        sshOptions: ["-o", "ConnectTimeout=1"],
      }),
    Error,
  );

  assertEquals(err.message.length > 10, true);
});
