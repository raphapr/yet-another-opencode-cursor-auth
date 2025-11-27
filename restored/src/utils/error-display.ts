/**
 * Displays ErrorDetails to the user via ephemeral messages
 */
function displayErrorDetails(details) {
  var _a, _b, _c, _d, _e, _f;
  const errorLines = [];
  if ((_a = details.details) === null || _a === void 0 ? void 0 : _a.title) {
    errorLines.push(`Error: ${details.details.title}`);
  } else {
    errorLines.push("Error: Connection failed");
  }
  if ((_b = details.details) === null || _b === void 0 ? void 0 : _b.detail) {
    errorLines.push(details.details.detail);
  }
  if ((_c = details.details) === null || _c === void 0 ? void 0 : _c.additionalInfo) {
    for (const [key, value] of Object.entries(details.details.additionalInfo)) {
      errorLines.push(`${key}: ${value}`);
    }
  }
  (0, ephemeral_bridge /* pushEphemeral */.ET)(errorLines);
  (0, debug.debugLog)("ErrorDetails displayed", {
    error: details.error,
    title: (_d = details.details) === null || _d === void 0 ? void 0 : _d.title,
    detail: (_e = details.details) === null || _e === void 0 ? void 0 : _e.detail,
    additionalInfo: (_f = details.details) === null || _f === void 0 ? void 0 : _f.additionalInfo
  });
}
/**
 * Displays general errors to the user via ephemeral messages
 */
function displayGeneralError(error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  pushEphemeral([`Error: ${errorMessage}`]);
  debugLog("General error displayed", {
    errorMessage
  });
}
/**
 * Formats ErrorDetails into user-friendly ephemeral lines
 */
function formatErrorDetails(details) {
  var _a, _b, _c;
  const errorLines = [];
  if ((_a = details.details) === null || _a === void 0 ? void 0 : _a.title) {
    errorLines.push(`Error: ${details.details.title}`);
  } else {
    errorLines.push("Error: Connection failed");
  }
  if ((_b = details.details) === null || _b === void 0 ? void 0 : _b.detail) {
    errorLines.push(details.details.detail);
  }
  if ((_c = details.details) === null || _c === void 0 ? void 0 : _c.additionalInfo) {
    for (const [key, value] of Object.entries(details.details.additionalInfo)) {
      errorLines.push(`${key}: ${value}`);
    }
  }
  return errorLines;
}