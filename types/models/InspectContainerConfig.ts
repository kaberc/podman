/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InspectSecret } from "./InspectSecret.ts";
import type { Schema2HealthConfig } from "./Schema2HealthConfig.ts";
import type { StartupHealthCheck } from "./StartupHealthCheck.ts";
/**
 * InspectContainerConfig holds further data about how a container was initially
 * configured.
 */
export type InspectContainerConfig = {
  /**
   * Container annotations
   */
  Annotations?: Record<string, string>;
  /**
   * Unused, at present
   */
  AttachStderr?: boolean;
  /**
   * Unused, at present
   */
  AttachStdin?: boolean;
  /**
   * Unused, at present
   */
  AttachStdout?: boolean;
  /**
   * ChrootDirs is an additional set of directories that need to be
   * treated as root directories. Standard bind mounts will be mounted
   * into paths relative to these directories.
   */
  ChrootDirs?: Array<string>;
  /**
   * Container command
   */
  Cmd?: Array<string>;
  /**
   * CreateCommand is the full command plus arguments of the process the
   * container has been created with.
   */
  CreateCommand?: Array<string>;
  /**
   * Container domain name - unused at present
   */
  Domainname?: string;
  /**
   * Container entrypoint
   */
  Entrypoint?: Array<string>;
  /**
   * Container environment variables
   */
  Env?: Array<string>;
  /**
   * ExposedPorts includes ports the container has exposed.
   */
  ExposedPorts?: Record<string, Record<string, unknown>>;
  /**
   * HealthLogDestination defines the destination where the log is stored
   */
  HealthLogDestination?: string;
  Healthcheck?: Schema2HealthConfig;
  /**
   * HealthMaxLogCount is maximum number of attempts in the HealthCheck log file.
   * ('0' value means an infinite number of attempts in the log file)
   */
  HealthcheckMaxLogCount?: number;
  /**
   * HealthMaxLogSize is the maximum length in characters of stored HealthCheck log
   * ("0" value means an infinite log length)
   */
  HealthcheckMaxLogSize?: number;
  /**
   * HealthcheckOnFailureAction defines an action to take once the container turns unhealthy.
   */
  HealthcheckOnFailureAction?: string;
  /**
   * Container hostname
   */
  Hostname?: string;
  /**
   * Container image
   */
  Image?: string;
  /**
   * Container labels
   */
  Labels?: Record<string, string>;
  /**
   * On-build arguments - presently unused. More of Buildah's domain.
   */
  OnBuild?: string;
  /**
   * Whether the container leaves STDIN open
   */
  OpenStdin?: boolean;
  /**
   * Passwd determines whether or not podman can add entries to /etc/passwd and /etc/group
   */
  Passwd?: boolean;
  /**
   * Secrets are the secrets mounted in the container
   */
  Secrets?: Array<InspectSecret>;
  StartupHealthCheck?: StartupHealthCheck;
  /**
   * Whether STDIN is only left open once.
   * Presently not supported by Podman, unused.
   */
  StdinOnce?: boolean;
  /**
   * Container stop signal
   */
  StopSignal?: string;
  /**
   * StopTimeout is time before container is stopped when calling stop
   */
  StopTimeout?: number;
  /**
   * SystemdMode is whether the container is running in systemd mode. In
   * systemd mode, the container configuration is customized to optimize
   * running systemd in the container.
   */
  SystemdMode?: boolean;
  /**
   * Timeout is time before container is killed by conmon
   */
  Timeout?: number;
  /**
   * Timezone is the timezone inside the container.
   * Local means it has the same timezone as the host machine
   */
  Timezone?: string;
  /**
   * Whether the container creates a TTY
   */
  Tty?: boolean;
  /**
   * Umask is the umask inside the container.
   */
  Umask?: string;
  /**
   * User the container was launched with
   */
  User?: string;
  /**
   * Unused, at present. I've never seen this field populated.
   */
  Volumes?: Record<string, Record<string, unknown>>;
  /**
   * Container working directory
   */
  WorkingDir?: string;
  /**
   * SdNotifyMode is the sd-notify mode of the container.
   */
  sdNotifyMode?: string;
  /**
   * SdNotifySocket is the NOTIFY_SOCKET in use by/configured for the container.
   */
  sdNotifySocket?: string;
};
