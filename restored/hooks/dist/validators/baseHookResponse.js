const validateBaseHookResponse = value => {
  const errors = [];
  if (!isObject(value)) {
    errors.push("Expected an object");
    return createValidationResult(false, errors);
  }
  return createValidationResult(true);
};