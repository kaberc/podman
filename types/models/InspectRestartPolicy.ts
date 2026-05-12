/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InspectRestartPolicy = {
  /**
   * MaximumRetryCount is the maximum number of retries allowed if the
   * "on-failure" restart policy is in use. Not used if "on-failure" is
   * not set.
   */
  MaximumRetryCount?: number;
  /**
   * Name contains the container's restart policy.
   * Allowable values are "no" or "" (take no action),
   * "on-failure" (restart on non-zero exit code, with an optional max
   * retry count), and "always" (always restart on container stop, unless
   * explicitly requested by API).
   * Note that this is NOT actually a name of unknown sort - the poor naming
   * is for Docker compatibility.
   */
  Name?: string;
};
