/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ListPodContainer } from "./ListPodContainer.ts";
export type ListPodsReport = {
  Cgroup?: string;
  Containers?: Array<ListPodContainer>;
  Created?: string;
  Id?: string;
  InfraId?: string;
  Labels?: Record<string, string>;
  Name?: string;
  Namespace?: string;
  /**
   * Network names connected to infra container
   */
  Networks?: Array<string>;
  Status?: string;
};
