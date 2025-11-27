const validateBeforeCommandExecutionHookResponse = value => {
  const errors = [];
  // First validate base response
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  // Validate permission field
  if (value.permission !== undefined) {
    const validPermissions = ["allow", "deny", "ask"];
    if (!validPermissions.includes(value.permission)) {
      errors.push(`Invalid permission value. Expected one of: ${validPermissions.join(", ")}, or undefined`);
    }
  }
  // Validate optional reason fields (snake_case)
  if (value.user_message !== undefined && typeof value.user_message !== "string") {
    errors.push("Invalid user_message value. Expected a string if provided");
  }
  if (value.agent_message !== undefined && typeof value.agent_message !== "string") {
    errors.push("Invalid agent_message value. Expected a string if provided");
  }
  return createValidationResult(errors.length === 0, errors);
};