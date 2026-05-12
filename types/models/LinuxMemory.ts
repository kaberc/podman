/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * LinuxMemory for Linux cgroup 'memory' resource management
 */
export type LinuxMemory = {
  /**
   * CheckBeforeUpdate enables checking if a new memory limit is lower
   * than the current usage during update, and if so, rejecting the new
   * limit.
   */
  checkBeforeUpdate?: boolean;
  /**
   * DisableOOMKiller disables the OOM killer for out of memory conditions
   */
  disableOOMKiller?: boolean;
  /**
   * Kernel memory limit (in bytes).
   *
   * Deprecated: kernel-memory limits are not supported in cgroups v2, and
   * were obsoleted in [kernel v5.4]. This field should no longer be used,
   * as it may be ignored by runtimes.
   *
   * [kernel v5.4]: https://github.com/torvalds/linux/commit/0158115f702b0ba208ab0
   */
  kernel?: number;
  /**
   * Kernel memory limit for tcp (in bytes)
   */
  kernelTCP?: number;
  /**
   * Memory limit (in bytes).
   */
  limit?: number;
  /**
   * Memory reservation or soft_limit (in bytes).
   */
  reservation?: number;
  /**
   * Total memory limit (memory + swap).
   */
  swap?: number;
  /**
   * How aggressive the kernel will swap memory pages.
   */
  swappiness?: number;
  /**
   * Enables hierarchical memory accounting
   */
  useHierarchy?: boolean;
};
