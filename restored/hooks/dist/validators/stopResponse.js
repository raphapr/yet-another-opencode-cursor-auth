const validateStopResponse = value => {
  // First validate base response
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  const errors = [];
  // Validate optional followup_message
  if (value.followup_message !== undefined && typeof value.followup_message !== "string") {
    errors.push("followup_message must be a string if provided");
  }
  return createValidationResult(errors.length === 0, errors);
};