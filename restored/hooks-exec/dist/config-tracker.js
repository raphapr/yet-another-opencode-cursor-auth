/**
 * Implementation of HooksConfigLease that provides access to a loaded configuration.
 */
class StaticHooksConfigLease {
  constructor(config) {
    this.config = config;
    this.configuredSteps = HooksConfigLoader.getConfiguredSteps(config);
  }
  getConfig() {
    return this.config;
  }
  hasHookForStep(step) {
    return this.configuredSteps.has(step);
  }
  getConfiguredSteps() {
    return new Set(this.configuredSteps);
  }
}
/**
 * No-op implementation of HooksConfigLease for when no hooks are configured.
 */
class NoopHooksConfigLease {
  getConfig() {
    return {
      errors: []
    };
  }
  hasHookForStep(_step) {
    return false;
  }
  getConfiguredSteps() {
    return new Set();
  }
}