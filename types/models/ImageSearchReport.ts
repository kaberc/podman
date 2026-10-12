/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ImageSearchReport = {
  /**
   * Automated indicates if the image was created by an automated build.
   * ImageSearchTrue represents true and "" is false.
   */
  Automated?: string;
  /**
   * Description of the image.
   */
  Description?: string;
  /**
   * Index is the image index (e.g., "docker.io" or "quay.io")
   */
  Index?: string;
  /**
   * Name is the canonical name of the image (e.g., "docker.io/library/alpine").
   */
  Name?: string;
  /**
   * Official indicates if it's an official image.
   * ImageSearchTrue represents true and "" is false.
   */
  Official?: string;
  /**
   * Stars is the number of stars of the image.
   */
  Stars?: number;
  /**
   * Tag is the repository tag
   */
  Tag?: string;
};
