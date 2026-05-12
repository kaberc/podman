/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PluginConfigArgs } from "./PluginConfigArgs.ts";
import type { PluginConfigInterface } from "./PluginConfigInterface.ts";
import type { PluginConfigLinux } from "./PluginConfigLinux.ts";
import type { PluginConfigNetwork } from "./PluginConfigNetwork.ts";
import type { PluginConfigRootfs } from "./PluginConfigRootfs.ts";
import type { PluginConfigUser } from "./PluginConfigUser.ts";
import type { PluginEnv } from "./PluginEnv.ts";
import type { PluginMount } from "./PluginMount.ts";
export type PluginConfig = {
  Args: PluginConfigArgs;
  /**
   * description
   */
  Description: string;
  /**
   * Docker Version used to create the plugin.
   *
   * Depending on how the plugin was created, this field may be empty or omitted.
   *
   * Deprecated: this field is no longer set, and will be removed in the next API version.
   */
  DockerVersion?: string;
  /**
   * documentation
   */
  Documentation: string;
  /**
   * entrypoint
   */
  Entrypoint: Array<string>;
  /**
   * env
   */
  Env: Array<PluginEnv>;
  Interface: PluginConfigInterface;
  /**
   * ipc host
   */
  IpcHost: boolean;
  Linux: PluginConfigLinux;
  /**
   * mounts
   */
  Mounts: Array<PluginMount>;
  Network: PluginConfigNetwork;
  /**
   * pid host
   */
  PidHost: boolean;
  /**
   * propagated mount
   */
  PropagatedMount: string;
  User?: PluginConfigUser;
  /**
   * work dir
   */
  WorkDir: string;
  rootfs?: PluginConfigRootfs;
};
