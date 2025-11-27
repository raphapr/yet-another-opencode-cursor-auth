const validateBeforePromptSubmitResponse = value => {
  // First validate base response
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  const errors = [];
  // Validate continue field if present
  if (value.continue !== undefined && typeof value.continue !== "boolean") {
    errors.push("continue must be a boolean if provided");
  }
  // Validate user_message field if present
  if (value.user_message !== undefined && typeof value.user_message !== "string") {
    errors.push("user_message must be a string if provided");
  }
  return createValidationResult(errors.length === 0, errors);
};