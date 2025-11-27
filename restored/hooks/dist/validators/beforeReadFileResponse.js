const validateBeforeReadFileResponse = value => {
  const errors = [];
  // First validate base response
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  // Validate permission field
  if (value.permission !== undefined) {
    const validPermissions = ["allow", "deny"];
    if (!validPermissions.includes(value.permission)) {
      errors.push(`Invalid permission value. Expected one of: ${validPermissions.join(", ")}, or undefined`);
    }
  }
  return createValidationResult(errors.length === 0, errors);
};