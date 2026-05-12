/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LinuxPersonality } from "./LinuxPersonality.ts";
import type { LogConfigLibpod } from "./LogConfigLibpod.ts";
import type { Namespace } from "./Namespace.ts";
import type { Signal } from "./Signal.ts";
export type ContainerBasicConfig = {
  /**
   * Annotations are key-value options passed into the container runtime
   * that can be used to trigger special behavior.
   * Optional.
   */
  annotations?: Record<string, string>;
  /**
   * Command is the container's command.
   * If not given and Image is specified, this will be populated by the
   * image's configuration.
   * Optional.
   */
  command?: Array<string>;
  /**
   * ConmonPidFile is a path at which a PID file for Conmon will be
   * placed.
   * If not given, a default location will be used.
   * Optional.
   */
  conmon_pid_file?: string;
  /**
   * ContainerCreateCommand is the command that was used to create this
   * container.
   * This will be shown in the output of Inspect() on the container, and
   * may also be used by some tools that wish to recreate the container
   * (e.g. `podman generate systemd --new`).
   * Optional.
   */
  containerCreateCommand?: Array<string>;
  /**
   * DependencyContainers is an array of containers this container
   * depends on. Dependency containers must be started before this
   * container. Dependencies can be specified by name or full/partial ID.
   * Optional.
   */
  dependencyContainers?: Array<string>;
  /**
   * Entrypoint is the container's entrypoint.
   * If not given and Image is specified, this will be populated by the
   * image's configuration.
   * Optional.
   */
  entrypoint?: Array<string>;
  /**
   * Env is a set of environment variables that will be set in the
   * container.
   * Optional.
   */
  env?: Record<string, string>;
  /**
   * EnvHost indicates that the host environment should be added to container
   * Optional.
   */
  env_host?: boolean;
  /**
   * EnvMerge takes the specified environment variables from image and preprocess them before injecting them into the
   * container.
   * Optional.
   */
  envmerge?: Array<string>;
  /**
   * GroupEntry specifies an arbitrary string to append to the container's /etc/group file.
   * Optional.
   */
  group_entry?: string;
  /**
   * Hostname is the container's hostname. If not set, the hostname will
   * not be modified (if UtsNS is not private) or will be set to the
   * container ID (if UtsNS is private).
   * Conflicts with UtsNS if UtsNS is not set to private.
   * Optional.
   */
  hostname?: string;
  /**
   * HostUsers is a list of host usernames or UIDs to add to the container
   * etc/passwd file
   */
  hostusers?: Array<string>;
  /**
   * EnvHTTPProxy indicates that the http host proxy environment variables
   * should be added to container
   * Optional.
   */
  httpproxy?: boolean;
  /**
   * InitContainerType describes if this container is an init container
   * and if so, what type: always or once.
   * Optional.
   */
  init_container_type?: string;
  /**
   * Labels are key-value pairs that are used to add metadata to
   * containers.
   * Optional.
   */
  labels?: Record<string, string>;
  log_configuration?: LogConfigLibpod;
  /**
   * Passwd is a container run option that determines if we are validating users/groups before running the container
   */
  manage_password?: boolean;
  /**
   * Name is the name the container will be given.
   * If no name is provided, one will be randomly generated.
   * Optional.
   */
  name?: string;
  /**
   * OCIRuntime is the name of the OCI runtime that will be used to create
   * the container.
   * If not specified, the default will be used.
   * Optional.
   */
  oci_runtime?: string;
  /**
   * PasswdEntry specifies an arbitrary string to append to the container's /etc/passwd file.
   * Optional.
   */
  passwd_entry?: string;
  personality?: LinuxPersonality;
  pidns?: Namespace;
  /**
   * Pod is the ID of the pod the container will join.
   * Optional.
   */
  pod?: string;
  /**
   * Remove indicates if the container should be removed once it has been started
   * and exits.
   * Optional.
   */
  remove?: boolean;
  /**
   * RemoveImage indicates that the container should remove the image it
   * was created from after it exits.
   * Only allowed if Remove is set to true and Image, not Rootfs, is in
   * use.
   * Optional.
   */
  removeImage?: boolean;
  /**
   * RestartPolicy is the container's restart policy - an action which
   * will be taken when the container exits.
   * If not given, the default policy, which does nothing, will be used.
   * Optional.
   */
  restart_policy?: string;
  /**
   * RestartRetries is the number of attempts that will be made to restart
   * the container.
   * Only available when RestartPolicy is set to "on-failure".
   * Optional.
   */
  restart_tries?: number;
  /**
   * Determine how to handle the NOTIFY_SOCKET - do we participate or pass it through
   * "container" - let the OCI runtime deal with it, advertise conmon's MAINPID
   * "conmon-only" - advertise conmon's MAINPID, send READY when started, don't pass to OCI
   * "ignore" - unset NOTIFY_SOCKET
   * Optional.
   */
  sdnotifyMode?: string;
  /**
   * EnvSecrets are secrets that will be set as environment variables
   * Optional.
   */
  secret_env?: Record<string, string>;
  /**
   * Stdin is whether the container will keep its STDIN open.
   * Optional.
   */
  stdin?: boolean;
  stop_signal?: Signal;
  /**
   * StopTimeout is a timeout between the container's stop signal being
   * sent and SIGKILL being sent.
   * If not provided, the default will be used.
   * If 0 is used, stop signal will not be sent, and SIGKILL will be sent
   * instead.
   * Optional.
   */
  stop_timeout?: number;
  /**
   * Sysctl sets kernel parameters for the container
   */
  sysctl?: Record<string, string>;
  /**
   * Systemd is whether the container will be started in systemd mode.
   * Valid options are "true", "false", and "always".
   * "true" enables this mode only if the binary run in the container is
   * sbin/init or systemd. "always" unconditionally enables systemd mode.
   * "false" unconditionally disables systemd mode.
   * If enabled, mounts and stop signal will be modified.
   * If set to "always" or set to "true" and conditionally triggered,
   * conflicts with StopSignal.
   * If not specified, "false" will be assumed.
   * Optional.
   */
  systemd?: string;
  /**
   * Terminal is whether the container will create a PTY.
   * Optional.
   */
  terminal?: boolean;
  /**
   * Timeout is a maximum time in seconds the container will run before
   * main process is sent SIGKILL.
   * If 0 is used, signal will not be sent. Container can run indefinitely
   * if they do not stop after the default termination signal.
   * Optional.
   */
  timeout?: number;
  /**
   * Timezone is the timezone inside the container.
   * Local means it has the same timezone as the host machine
   * Optional.
   */
  timezone?: string;
  /**
   * UnsetEnv unsets the specified default environment variables from the image or from built-in or containers.conf
   * Optional.
   */
  unsetenv?: Array<string>;
  /**
   * UnsetEnvAll unsetall default environment variables from the image or from built-in or containers.conf
   * UnsetEnvAll unsets all default environment variables from the image or from built-in
   * Optional.
   */
  unsetenvall?: boolean;
  utsns?: Namespace;
};
