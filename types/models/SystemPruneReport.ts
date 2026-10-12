/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NetworkPruneReport } from "./NetworkPruneReport.ts";
import type { PodPruneReport } from "./PodPruneReport.ts";
import type { ReportsPruneReport } from "./ReportsPruneReport.ts";
export type SystemPruneReport = {
  ContainerPruneReports?: Array<ReportsPruneReport>;
  ImagePruneReports?: Array<ReportsPruneReport>;
  NetworkPruneReports?: Array<NetworkPruneReport>;
  PodPruneReport?: Array<PodPruneReport>;
  ReclaimedSpace?: number;
  VolumePruneReports?: Array<ReportsPruneReport>;
};
