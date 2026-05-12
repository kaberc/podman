/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Task } from "./Task.ts";
/**
 * ServiceInfo represents service parameters with the list of service's tasks
 */
export type ServiceInfo = {
  LocalLBIndex?: number;
  Ports?: Array<string>;
  Tasks?: Array<Task>;
  VIP?: string;
};
