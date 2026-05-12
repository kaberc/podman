/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateHealthCheckConfig = {
  /**
   * HealthCmd set a healthcheck command for the container. ('none' disables the existing healthcheck)
   */
  health_cmd?: string;
  /**
   * HealthInterval set an interval for the healthcheck.
   * (a value of disable results in no automatic timer setup) Changing this setting resets timer.
   */
  health_interval?: string;
  /**
   * HealthLogDestination set the destination of the HealthCheck log.
   * Directory path, local or events_logger (local use container state file)
   * Warning: Changing this setting may cause the loss of previous logs!
   */
  health_log_destination?: string;
  /**
   * HealthMaxLogCount set maximum number of attempts in the HealthCheck log file.
   * ('0' value means an infinite number of attempts in the log file)
   */
  health_max_log_count?: number;
  /**
   * HealthMaxLogSize set maximum length in characters of stored HealthCheck log.
   * ('0' value means an infinite log length)
   */
  health_max_log_size?: number;
  /**
   * HealthOnFailure set the action to take once the container turns unhealthy.
   */
  health_on_failure?: string;
  /**
   * HealthRetries set the number of retries allowed before a healthcheck is considered to be unhealthy.
   */
  health_retries?: number;
  /**
   * HealthStartPeriod set the initialization time needed for a container to bootstrap.
   */
  health_start_period?: string;
  /**
   * HealthStartupCmd set a startup healthcheck command for the container.
   */
  health_startup_cmd?: string;
  /**
   * HealthStartupInterval set an interval for the startup healthcheck.
   * Changing this setting resets the timer, depending on the state of the container.
   */
  health_startup_interval?: string;
  /**
   * HealthStartupRetries set the maximum number of retries before the startup healthcheck will restart the container.
   */
  health_startup_retries?: number;
  /**
   * HealthStartupSuccess set the number of consecutive successes before the startup healthcheck is marked as successful
   * and the normal healthcheck begins (0 indicates unknown success will start the regular healthcheck)
   */
  health_startup_success?: number;
  /**
   * HealthStartupTimeout set the maximum amount of time that the startup healthcheck may take before it is considered failed.
   */
  health_startup_timeout?: string;
  /**
   * HealthTimeout set the maximum time allowed to complete the healthcheck before an interval is considered failed.
   */
  health_timeout?: string;
  /**
   * Disable healthchecks on container.
   */
  no_healthcheck?: boolean;
};
