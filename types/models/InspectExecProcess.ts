/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * InspectExecProcess contains information about the process in a given exec
 * session.
 */
export type InspectExecProcess = {
  /**
   * Arguments are the arguments to the entrypoint command of the exec
   * session.
   */
  arguments?: Array<string>;
  /**
   * Entrypoint is the entrypoint for the exec session (the command that
   * will be executed in the container).
   */
  entrypoint?: string;
  /**
   * Privileged is whether the exec session will be started with elevated
   * privileges.
   */
  privileged?: boolean;
  /**
   * Tty is whether the exec session created a terminal.
   */
  tty?: boolean;
  /**
   * User is the user the exec session was started as.
   */
  user?: string;
};
