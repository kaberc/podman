/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type History = {
  /**
   * Author is the author of the build point.
   */
  author?: string;
  /**
   * Comment is a custom message set when creating the layer.
   */
  comment?: string;
  /**
   * Created is the combined date and time at which the layer was created, formatted as defined by RFC 3339, section 5.6.
   */
  created?: string;
  /**
   * CreatedBy is the command which created the layer.
   */
  created_by?: string;
  /**
   * EmptyLayer is used to mark if the history item created a filesystem diff.
   */
  empty_layer?: boolean;
};
