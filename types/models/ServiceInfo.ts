/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Task } from "./Task.ts";
/**
 * ServiceInfo represents service parameters with the list of service's tasks
 */
export type ServiceInfo = {
  /**
   * local l b index
   */
  LocalLBIndex?: number;
  /**
   * ports
   */
  Ports?: Array<string>;
  /**
   * tasks
   */
  Tasks?: Array<Task>;
  /**
   * v IP
   */
  VIP?: string;
};
