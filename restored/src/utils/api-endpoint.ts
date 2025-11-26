/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */G6: () => (/* binding */getApiEndpoint),
  /* harmony export */t2: () => (/* binding */getAgentBackendUrl)
  /* harmony export */
});
/* unused harmony exports DEFAULT_API_ENDPOINT, AGENT_BACKEND_PRIVACY, AGENT_BACKEND_NON_PRIVACY */
const DEFAULT_API_ENDPOINT = "https://api2.cursor.sh";
const AGENT_BACKEND_PRIVACY = "https://agent.api5.cursor.sh";
const AGENT_BACKEND_NON_PRIVACY = "https://agentn.api5.cursor.sh";
function getApiEndpoint(overrideEndpoint) {
  if (overrideEndpoint) return overrideEndpoint;
  const envEndpoint = process.env.CURSOR_API_ENDPOINT;
  if (envEndpoint) return envEndpoint;
  return DEFAULT_API_ENDPOINT;
}
/**
 * Gets the agent backend URL based on the use_nlb_for_nal feature flag and privacy mode.
 * When the flag is enabled, returns agent.api5.cursor.sh for privacy mode users,
 * and agentn.api5.cursor.sh for non-privacy mode users.
 * Otherwise, returns the regular backend URL.
 */
function getAgentBackendUrl(backendUrl, isPrivacyMode, useNlbForNal) {
  // For localhost, staging, and dev-staging, always use the same backendUrl
  if (backendUrl.includes("localhost") || backendUrl.includes("lclhst.build") || backendUrl.includes("staging.cursor.sh") || backendUrl.includes("dev-staging.cursor.sh")) {
    return backendUrl;
  }
  // If flag is disabled, use regular backendUrl
  if (!useNlbForNal) {
    return backendUrl;
  }
  // Use privacy mode specific URLs when flag is enabled
  return isPrivacyMode ? AGENT_BACKEND_PRIVACY : AGENT_BACKEND_NON_PRIVACY;
}

/***/