const validateAfterAgentResponseResponse = value => {
  // First validate base response
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  // No additional fields for now
  return baseValidation;
};