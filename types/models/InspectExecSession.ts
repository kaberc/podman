/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InspectExecProcess } from "./InspectExecProcess.ts";
export type InspectExecSession = {
  /**
   * CanRemove is legacy and used purely for compatibility reasons.
   * Will always be set to true, unless the exec session is running.
   */
  CanRemove?: boolean;
  /**
   * ContainerID is the ID of the container this exec session is attached
   * to.
   */
  ContainerID?: string;
  /**
   * DetachKeys are the detach keys used by the exec session.
   * If set to "" the default keys are being used.
   * Will show "<none>" if no detach keys are set.
   */
  DetachKeys?: string;
  /**
   * ExitCode is the exit code of the exec session. Will be set to 0 if
   * the exec session has not yet exited.
   */
  ExitCode?: number;
  /**
   * ID is the ID of the exec session.
   */
  ID?: string;
  /**
   * OpenStderr is whether the container's STDERR stream will be attached.
   * Always set to true if the exec session created a TTY.
   */
  OpenStderr?: boolean;
  /**
   * OpenStdin is whether the container's STDIN stream will be attached
   * to.
   */
  OpenStdin?: boolean;
  /**
   * OpenStdout is whether the container's STDOUT stream will be attached.
   * Always set to true if the exec session created a TTY.
   */
  OpenStdout?: boolean;
  /**
   * Pid is the PID of the exec session's process.
   * Will be set to 0 if the exec session is not running.
   */
  Pid?: number;
  ProcessConfig?: InspectExecProcess;
  /**
   * Running is whether the exec session is running.
   */
  Running?: boolean;
};
