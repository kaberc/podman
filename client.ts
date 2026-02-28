import {
  createTcpTransport,
  createTransport,
  type TlsOptions,
  type Transport,
  type TransportOptions,
} from "./transport.ts";
import {
  createSshTransport,
  type SshTransportOptions,
} from "./ssh_transport.ts";
import type { AuthOption } from "./transport_core.ts";
import { ContainersApi } from "./api/containers.ts";
import { ImagesApi } from "./api/images.ts";
import { NetworksApi } from "./api/networks.ts";
import { VolumesApi } from "./api/volumes.ts";
import { PodsApi } from "./api/pods.ts";
import { SecretsApi } from "./api/secrets.ts";
import { SystemApi } from "./api/system.ts";
import { ExecApi } from "./api/exec.ts";
import { GenerateApi } from "./api/generate.ts";
import { ManifestsApi } from "./api/manifests.ts";
import { KubeApi } from "./api/kube.ts";
import { ArtifactsApi } from "./api/artifacts.ts";
import { QuadletsApi } from "./api/quadlets.ts";

/** Options for connecting to Podman via a Unix socket. */
export interface UnixClientOptions {
  socketPath: string;
  apiVersion?: string;
  timeout?: number;
  auth?: AuthOption;
}

/** Options for connecting to Podman via TCP or TLS. */
export interface TcpClientOptions {
  uri: string;
  apiVersion?: string;
  timeout?: number;
  auth?: AuthOption;
  tls?: TlsOptions;
}

/** Union of all client connection options (Unix socket or TCP/TLS). */
export type ClientOptions = UnixClientOptions | TcpClientOptions;

export type SshClientOptions = SshTransportOptions;

/** Client interface exposing all 13 Podman libpod API modules. */
export interface PodmanClient {
  containers: ContainersApi;
  images: ImagesApi;
  networks: NetworksApi;
  volumes: VolumesApi;
  pods: PodsApi;
  secrets: SecretsApi;
  system: SystemApi;
  exec: ExecApi;
  generate: GenerateApi;
  manifests: ManifestsApi;
  kube: KubeApi;
  artifacts: ArtifactsApi;
  quadlets: QuadletsApi;
  close(): void;
}

function buildPodmanClient(transport: Transport): PodmanClient {
  return {
    containers: new ContainersApi(transport),
    images: new ImagesApi(transport),
    networks: new NetworksApi(transport),
    volumes: new VolumesApi(transport),
    pods: new PodsApi(transport),
    secrets: new SecretsApi(transport),
    system: new SystemApi(transport),
    exec: new ExecApi(transport),
    generate: new GenerateApi(transport),
    manifests: new ManifestsApi(transport),
    kube: new KubeApi(transport),
    artifacts: new ArtifactsApi(transport),
    quadlets: new QuadletsApi(transport),
    close() {
      transport.close();
    },
  };
}

/** Create a Podman client using a Unix socket or TCP/TLS connection. */
export function createClient(opts: ClientOptions): PodmanClient {
  let transport: Transport;

  if ("socketPath" in opts) {
    const transportOpts: TransportOptions = {
      socketPath: opts.socketPath,
      apiVersion: opts.apiVersion,
      timeout: opts.timeout,
      auth: opts.auth,
    };
    transport = createTransport(transportOpts);
  } else {
    transport = createTcpTransport({
      uri: opts.uri,
      apiVersion: opts.apiVersion,
      timeout: opts.timeout,
      auth: opts.auth,
      tls: opts.tls,
    });
  }

  return buildPodmanClient(transport);
}

/** Create a Podman client tunneled over SSH. Requires `ssh` on the local machine. */
export async function createSshClient(
  opts: SshClientOptions,
): Promise<PodmanClient> {
  const transport = await createSshTransport(opts);
  return buildPodmanClient(transport);
}
