const validateAfterEditFileResponse = value => {
  // First validate base response
  const baseValidation = validateBaseHookResponse(value);
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  // AfterEditFileResponse currently has no additional fields beyond BaseHookResponse
  // This validator can be extended in the future if additional fields are added
  return baseValidation;
};