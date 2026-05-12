/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Namespace } from "./Namespace.ts";
export type PodBasicConfig = {
  /**
   * ExitPolicy determines the pod's exit and stop behaviour.
   */
  exit_policy?: string;
  /**
   * Hostname is the pod's hostname. If not set, the name of the pod will
   * be used (if a name was not provided here, the name auto-generated for
   * the pod will be used). This will be used by the infra container and
   * all containers in the pod as long as the UTS namespace is shared.
   * Optional.
   */
  hostname?: string;
  /**
   * InfraCommand sets the command that will be used to start the infra
   * container.
   * If not set, the default set in the Libpod configuration file will be
   * used.
   * Conflicts with NoInfra=true.
   * Optional.
   */
  infra_command?: Array<string>;
  /**
   * InfraConmonPidFile is a custom path to store the infra container's
   * conmon PID.
   */
  infra_conmon_pid_file?: string;
  /**
   * InfraImage is the image that will be used for the infra container.
   * If not set, the default set in the Libpod configuration file will be
   * used.
   * Conflicts with NoInfra=true.
   * Optional.
   */
  infra_image?: string;
  /**
   * InfraName is the name that will be used for the infra container.
   * If not set, the default set in the Libpod configuration file will be
   * used.
   * Conflicts with NoInfra=true.
   * Optional.
   */
  infra_name?: string;
  ipcns?: Namespace;
  /**
   * Labels are key-value pairs that are used to add metadata to pods.
   * Optional.
   */
  labels?: Record<string, string>;
  /**
   * Name is the name of the pod.
   * If not provided, a name will be generated when the pod is created.
   * Optional.
   */
  name?: string;
  /**
   * NoInfra tells the pod not to create an infra container. If this is
   * done, many networking-related options will become unavailable.
   * Conflicts with setting unknown options in PodNetworkConfig, and the
   * InfraCommand and InfraImages in this struct.
   * Optional.
   */
  no_infra?: boolean;
  pidns?: Namespace;
  pod_create_command?: Array<string>;
  /**
   * Devices contains user specified Devices to be added to the Pod
   */
  pod_devices?: Array<string>;
  /**
   * RestartPolicy is the pod's restart policy - an action which
   * will be taken when one or all the containers in the pod exits.
   * If not given, the default policy will be set to Always, which
   * restarts the containers in the pod when they exit indefinitely.
   * Optional.
   */
  restart_policy?: string;
  /**
   * RestartRetries is the number of attempts that will be made to restart
   * the container.
   * Only available when RestartPolicy is set to "on-failure".
   * Optional.
   */
  restart_tries?: number;
  /**
   * PodCreateCommand is the command used to create this pod.
   * This will be shown in the output of Inspect() on the pod, and may
   * also be used by some tools that wish to recreate the pod
   * (e.g. `podman generate systemd --new`).
   * Optional.
   * ShareParent determines if all containers in the pod will share the pod's cgroup as the cgroup parent
   */
  share_parent?: boolean;
  /**
   * SharedNamespaces instructs the pod to share a set of namespaces.
   * Shared namespaces will be joined (by default) by every container
   * which joins the pod.
   * If not set and NoInfra is false, the pod will set a default set of
   * namespaces to share.
   * Conflicts with NoInfra=true.
   * Optional.
   */
  shared_namespaces?: Array<string>;
  /**
   * Sysctl sets kernel parameters for the pod
   */
  sysctl?: Record<string, string>;
  userns?: Namespace;
  utsns?: Namespace;
};
