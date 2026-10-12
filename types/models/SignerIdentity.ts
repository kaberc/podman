/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * [certificate.Summary]: https://pkg.go.dev/github.com/sigstore/sigstore-go/pkg/fulcio/certificate#Summary
 */
export type SignerIdentity = {
  /**
   * Immutable reference to the specific version of the top-level/initiating build instructions.
   */
  BuildConfigDigest?: string;
  /**
   * Build Config URL to the top-level/initiating build instructions.
   */
  BuildConfigURI?: string;
  /**
   * Immutable reference to the specific version of the build instructions that is responsible for signing.
   */
  BuildSignerDigest?: string;
  /**
   * Reference to specific build instructions that are responsible for signing.
   */
  BuildSignerURI?: string;
  /**
   * Event or action that initiated the build.
   */
  BuildTrigger?: string;
  CertificateIssuer?: string;
  /**
   * The OIDC issuer. Should match `iss` claim of ID token or, in the case of
   * a federated login like Dex it should match the issuer URL of the
   * upstream issuer. The issuer is not set the extensions are invalid and
   * will fail to render.
   */
  Issuer?: string;
  /**
   * Run Invocation URL to uniquely identify the build execution.
   */
  RunInvocationURI?: string;
  /**
   * Specifies whether the build took place in platform-hosted cloud infrastructure or customer/self-hosted infrastructure.
   */
  RunnerEnvironment?: string;
  /**
   * Immutable reference to a specific version of the source code that the build was based upon.
   */
  SourceRepositoryDigest?: string;
  /**
   * Immutable identifier for the source repository the workflow was based upon.
   */
  SourceRepositoryIdentifier?: string;
  /**
   * Immutable identifier for the owner of the source repository that the workflow was based upon.
   */
  SourceRepositoryOwnerIdentifier?: string;
  /**
   * Source repository owner URL of the owner of the source repository that the build was based on.
   */
  SourceRepositoryOwnerURI?: string;
  /**
   * Source Repository Ref that the build run was based upon.
   */
  SourceRepositoryRef?: string;
  /**
   * Source repository URL that the build was based on.
   */
  SourceRepositoryURI?: string;
  /**
   * Source repository visibility at the time of signing the certificate.
   */
  SourceRepositoryVisibilityAtSigning?: string;
  SubjectAlternativeName?: string;
};
