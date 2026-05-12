/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Default to reservation limits if supported. Otherwise fallback to page fault limits.
 */
export type LinuxHugepageLimit = {
  /**
   * Limit is the limit of "hugepagesize" hugetlb reservations (if supported) or usage.
   */
  limit?: number;
  /**
   * Pagesize is the hugepage size.
   * Format: "<size><unit-prefix>B' (e.g. 64KB, 2MB, 1GB, etc.).
   */
  pageSize?: string;
};
