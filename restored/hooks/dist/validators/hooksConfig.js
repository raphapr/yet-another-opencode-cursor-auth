const validateHookScript = value => {
  const errors = [];
  if (!isObject(value)) {
    errors.push("Hook script must be an object with a command property");
    return createValidationResult(false, errors);
  }
  // Validate HookScript object
  if (!isString(value.command)) {
    errors.push("Hook script command must be a string");
  }
  return createValidationResult(errors.length === 0, errors);
};
const validateHookScriptArray = (value, hookName) => {
  const errors = [];
  if (!Array.isArray(value)) {
    errors.push(`${hookName} must be an array of hook scripts`);
    return createValidationResult(false, errors);
  }
  for (let i = 0; i < value.length; i++) {
    const scriptValidation = validateHookScript(value[i]);
    if (!scriptValidation.isValid) {
      errors.push(`${hookName}[${i}]: ${scriptValidation.errors.join(", ")}`);
    }
  }
  return createValidationResult(errors.length === 0, errors);
};
const validateHooksConfig = value => {
  const errors = [];
  if (!isObject(value)) {
    errors.push("Hooks config must be an object");
    return createValidationResult(false, errors);
  }
  // Validate version field
  if (typeof value.version !== "number") {
    errors.push("Config version must be a number");
  } else if (!Number.isInteger(value.version) || value.version < 1) {
    errors.push("Config version must be a positive integer");
  }
  // Validate hooks field
  if (!isObject(value.hooks)) {
    errors.push("Config hooks must be an object");
    return createValidationResult(false, errors);
  }
  // Validate each hook type - automatically derived from HookStep to ensure they stay in sync
  const validHookTypes = Object.values(HookStep);
  const hooks = value.hooks;
  for (const [hookName, hookValue] of Object.entries(hooks)) {
    if (!validHookTypes.includes(hookName)) {
      errors.push(`Unknown hook type: ${hookName}. Valid types are: ${validHookTypes.join(", ")}`);
      continue;
    }
    if (hookValue !== undefined) {
      const arrayValidation = validateHookScriptArray(hookValue, hookName);
      if (!arrayValidation.isValid) {
        errors.push(...arrayValidation.errors);
      }
    }
  }
  return createValidationResult(errors.length === 0, errors);
};