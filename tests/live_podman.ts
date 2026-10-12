import { createClient, type PodmanClient } from "../mod.ts";

const socketPath = Deno.env.get("PODMAN_SOCK");
let client: PodmanClient | null = null;

// Live tests never select a different daemon when an explicit target is unavailable.
if (socketPath !== undefined) {
  const probe = createClient({ socketPath });
  try {
    if (!await probe.system.ping()) {
      throw new Error("Podman test daemon did not answer");
    }
    const version = await probe.system.version();
    if (!version.Version?.startsWith("6.")) {
      throw new Error(`Live tests require Podman 6, got ${version.Version}`);
    }
    client = probe;
  } catch (error) {
    probe.close();
    throw error;
  }
}

export const skip = client === null;

export function getClient(): PodmanClient {
  if (client === null) throw new Error("Set PODMAN_SOCK to run live tests");
  return client;
}
