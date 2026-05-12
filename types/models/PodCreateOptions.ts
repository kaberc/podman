/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NetOptions } from "./NetOptions.ts";
/**
 * The JSON tags below are made to match the respective field in ContainerCreateOptions for the purpose of mapping.
 */
export type PodCreateOptions = {
  cgroup_parent?: string;
  container_command?: string;
  container_conmon_pidfile?: string;
  container_name?: string;
  cpus?: number;
  cpuset_cpus?: string;
  create_command?: Array<string>;
  device_read_bps?: Array<string>;
  devices?: Array<string>;
  exit_policy?: string;
  hostname?: string;
  infra?: boolean;
  infra_image?: string;
  ipc?: string;
  labels?: Record<string, string>;
  name?: string;
  net?: NetOptions;
  pid?: string;
  restart?: string;
  security_opt?: Array<string>;
  share?: Array<string>;
  share_parent?: boolean;
  sysctl?: Array<string>;
  uts?: string;
  volume?: Array<string>;
  volumes_from?: Array<string>;
};
