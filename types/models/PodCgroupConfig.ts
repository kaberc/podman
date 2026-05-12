/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * This will be expanded in future updates to pods.
 */
export type PodCgroupConfig = {
  /**
   * CgroupParent is the parent for the Cgroup that the pod will create.
   * This pod cgroup will, in turn, be the default cgroup parent for all
   * containers in the pod.
   * Optional.
   */
  cgroup_parent?: string;
};
