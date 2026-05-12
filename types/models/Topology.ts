/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * This description is taken verbatim from the CSI Spec:
 *
 * A topological domain is a sub-division of a cluster, like "region",
 * "zone", "rack", etc.
 * A topological segment is a specific instance of a topological domain,
 * like "zone3", "rack3", etc.
 * For example {"com.company/zone": "Z1", "com.company/rack": "R3"}
 * Valid keys have two segments: an OPTIONAL prefix and name, separated
 */
export type Topology = {
  Segments?: Record<string, string>;
};
