/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IDMappingOptions } from "./IDMappingOptions.ts";
import type { Namespace } from "./Namespace.ts";
/**
 * ContainerSecurityConfig is a container's security features, including
 * SELinux, Apparmor, and Seccomp.
 */
export type ContainerSecurityConfig = {
  /**
   * ApparmorProfile is the name of the Apparmor profile the container
   * will use.
   * Optional.
   */
  apparmor_profile?: string;
  /**
   * CapAdd are capabilities which will be added to the container.
   * Conflicts with Privileged.
   * Optional.
   */
  cap_add?: Array<string>;
  /**
   * CapDrop are capabilities which will be removed from the container.
   * Conflicts with Privileged.
   * Optional.
   */
  cap_drop?: Array<string>;
  /**
   * Groups are a list of supplemental groups the container's user will
   * be granted access to.
   * Optional.
   */
  groups?: Array<string>;
  idmappings?: IDMappingOptions;
  /**
   * LabelNested indicates whether or not the container is allowed to
   * run fully nested containers including SELinux labelling.
   * Optional.
   */
  label_nested?: boolean;
  /**
   * Mask is the path we want to mask in the container. This masks the paths
   * given in addition to the default list.
   * Optional
   */
  mask?: Array<string>;
  /**
   * NoNewPrivileges is whether the container will set the no new
   * privileges flag on create, which disables gaining additional
   * privileges (e.g. via setuid) in the container.
   * Optional.
   */
  no_new_privileges?: boolean;
  /**
   * Privileged is whether the container is privileged.
   * Privileged does the following:
   * Adds all devices on the system to the container.
   * Adds all capabilities to the container.
   * Disables Seccomp, SELinux, and Apparmor confinement.
   * (Though SELinux can be manually re-enabled).
   * TODO: this conflicts with things.
   * TODO: this does more.
   * Optional.
   */
  privileged?: boolean;
  /**
   * ProcOpts are the options used for the proc mount.
   */
  procfs_opts?: Array<string>;
  /**
   * ReadOnlyFilesystem indicates that everything will be mounted
   * as read-only.
   * Optional.
   */
  read_only_filesystem?: boolean;
  /**
   * ReadWriteTmpfs indicates that when running with a ReadOnlyFilesystem
   * mount temporary file systems.
   * Optional.
   */
  read_write_tmpfs?: boolean;
  /**
   * SeccompPolicy determines which seccomp profile gets applied
   * the container. valid values: empty,default,image
   */
  seccomp_policy?: string;
  /**
   * SeccompProfilePath is the path to a JSON file containing the
   * container's Seccomp profile.
   * If not specified, no Seccomp profile will be used.
   * Optional.
   */
  seccomp_profile_path?: string;
  /**
   * SelinuxProcessLabel is the process label the container will use.
   * If SELinux is enabled and this is not specified, a label will be
   * automatically generated if not specified.
   * Optional.
   */
  selinux_opts?: Array<string>;
  /**
   * Umask is the umask the init process of the container will be run with.
   */
  umask?: string;
  /**
   * Unmask a path in the container. Some paths are masked by default,
   * preventing them from being accessed within the container; this undoes
   * that masking. If ALL is passed, all paths will be unmasked.
   * Optional.
   */
  unmask?: Array<string>;
  /**
   * User is the user the container will be run as.
   * Can be given as a UID or a username; if a username, it will be
   * resolved within the container, using the container's /etc/passwd.
   * If unset, the container will be run as root.
   * Optional.
   */
  user?: string;
  userns?: Namespace;
};
