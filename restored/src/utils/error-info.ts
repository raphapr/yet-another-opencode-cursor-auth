/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */q: () => (/* binding */extractErrorInfo)
  /* harmony export */
});
function extractErrorInfo(err) {
  if (err instanceof Error) return {
    message: err.message || String(err),
    stack: err.stack
  };
  if (typeof err === "string") return {
    message: err
  };
  try {
    return {
      message: JSON.stringify(err)
    };
  } catch (_a) {
    return {
      message: String(err)
    };
  }
}

/***/