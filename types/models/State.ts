/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Health } from "./Health.ts";
/**
 * State stores container's running state
 * it's part of ContainerJSONBase and returned by "inspect" command
 */
export type State = {
  Dead?: boolean;
  Error?: string;
  ExitCode?: number;
  FinishedAt?: string;
  Health?: Health;
  OOMKilled?: boolean;
  Paused?: boolean;
  Pid?: number;
  Restarting?: boolean;
  Running?: boolean;
  StartedAt?: string;
  Status?: string;
};
