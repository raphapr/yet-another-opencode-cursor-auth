// Base validator utilities and types
// Basic type validators
const isString = value => typeof value === "string";
const isObject = value => value !== null && typeof value === "object" && !Array.isArray(value);
// Utility function to create validation results
const createValidationResult = (isValid, errors = []) => ({
  isValid,
  errors
});