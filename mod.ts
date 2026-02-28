export {
  type ClientOptions,
  createClient,
  createSshClient,
  type PodmanClient,
  type SshClientOptions,
  type TcpClientOptions,
  type UnixClientOptions,
} from "./client.ts";
export { PodmanError, createPodmanError, throwRawError } from "./types/errors.ts";
export {
  createTcpTransport,
  createTransport,
  type TcpTransportOptions,
  type TlsOptions,
  type Transport,
  type TransportOptions,
  type TransportResponse,
} from "./transport.ts";
export {
  createSshTransport,
  type SshTransportOptions,
} from "./ssh_transport.ts";

export type { AuthOption } from "./transport_core.ts";

// All schema types (430+ auto-generated from openapi.ts via --root-types),
// friendly renames, custom types, and operation query param types.
export type * from "./types/api.ts";

export { ContainersApi } from "./api/containers.ts";
export { ImagesApi } from "./api/images.ts";
export { NetworksApi } from "./api/networks.ts";
export { VolumesApi } from "./api/volumes.ts";
export { PodsApi } from "./api/pods.ts";
export { SecretsApi } from "./api/secrets.ts";
export { SystemApi } from "./api/system.ts";
export { ExecApi } from "./api/exec.ts";
export { GenerateApi } from "./api/generate.ts";
export { ManifestsApi } from "./api/manifests.ts";
export { KubeApi } from "./api/kube.ts";
export { ArtifactsApi } from "./api/artifacts.ts";
export { QuadletsApi } from "./api/quadlets.ts";
export type { QuadletInstallReport } from "./api/quadlets.ts";
