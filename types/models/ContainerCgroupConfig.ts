/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Namespace } from "./Namespace.ts";
/**
 * ContainerCgroupConfig contains configuration information about a container's
 * cgroups.
 */
export type ContainerCgroupConfig = {
  /**
   * CgroupParent is the container's Cgroup parent.
   * If not set, the default for the current cgroup driver will be used.
   * Optional.
   */
  cgroup_parent?: string;
  cgroupns?: Namespace;
  /**
   * CgroupsMode sets a policy for how cgroups will be created for the
   * container, including the ability to disable creation entirely.
   * Optional.
   */
  cgroups_mode?: string;
};
