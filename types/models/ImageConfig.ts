/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ImageConfig = {
  /**
   * ArgsEscaped
   *
   * Deprecated: This field is present only for legacy compatibility with
   * Docker and should not be used by new image builders.  It is used by Docker
   * for Windows images to indicate that the `Entrypoint` or `Cmd` or both,
   * contains only a single element array, that is a pre-escaped, and combined
   * into a single string `CommandLine`. If `true` the value in `Entrypoint` or
   * `Cmd` should be used as-is to avoid double escaping.
   * https://github.com/opencontainers/image-spec/pull/892
   */
  ArgsEscaped?: boolean;
  /**
   * Cmd defines the default arguments to the entrypoint of the container.
   */
  Cmd?: Array<string>;
  /**
   * Entrypoint defines a list of arguments to use as the command to execute when the container starts.
   */
  Entrypoint?: Array<string>;
  /**
   * Env is a list of environment variables to be used in a container.
   */
  Env?: Array<string>;
  /**
   * ExposedPorts a set of ports to expose from a container running this image.
   */
  ExposedPorts?: Record<string, Record<string, unknown>>;
  /**
   * Labels contains arbitrary metadata for the container.
   */
  Labels?: Record<string, string>;
  /**
   * StopSignal contains the system call signal that will be sent to the container to exit.
   */
  StopSignal?: string;
  /**
   * User defines the username or UID which the process in the container should run as.
   */
  User?: string;
  /**
   * Volumes is a set of directories describing where the process is likely write data specific to a container instance.
   */
  Volumes?: Record<string, Record<string, unknown>>;
  /**
   * WorkingDir sets the current working directory of the entrypoint process in the container.
   */
  WorkingDir?: string;
};
