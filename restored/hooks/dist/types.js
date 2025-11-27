const HookStep = {
  beforeShellExecution: "beforeShellExecution",
  beforeMCPExecution: "beforeMCPExecution",
  afterShellExecution: "afterShellExecution",
  afterMCPExecution: "afterMCPExecution",
  beforeReadFile: "beforeReadFile",
  afterFileEdit: "afterFileEdit",
  beforeTabFileRead: "beforeTabFileRead",
  afterTabFileEdit: "afterTabFileEdit",
  stop: "stop",
  beforeSubmitPrompt: "beforeSubmitPrompt",
  afterAgentResponse: "afterAgentResponse",
  afterAgentThought: "afterAgentThought"
};
/**
 * Map hook step to response validator
 */
const HookResponseValidatorMap = {
  [HookStep.beforeShellExecution]: validateBeforeCommandExecutionHookResponse,
  [HookStep.beforeMCPExecution]: validateBeforeCommandExecutionHookResponse,
  [HookStep.afterShellExecution]: validateAfterShellExecutionResponse,
  [HookStep.afterMCPExecution]: validateAfterMCPExecutionResponse,
  [HookStep.beforeReadFile]: validateBeforeReadFileResponse,
  [HookStep.afterFileEdit]: validateAfterEditFileResponse,
  [HookStep.beforeTabFileRead]: validateBeforeTabFileReadResponse,
  [HookStep.afterTabFileEdit]: validateAfterTabFileEditResponse,
  [HookStep.beforeSubmitPrompt]: validateBeforePromptSubmitResponse,
  [HookStep.stop]: validateStopResponse,
  [HookStep.afterAgentResponse]: validateAfterAgentResponseResponse,
  [HookStep.afterAgentThought]: validateAfterAgentThoughtResponse
};
/**
 * Validate and parse hook response
 */
const validateAndParseHookResponse = (hookStep, response) => {
  const validator = HookResponseValidatorMap[hookStep];
  const validation = validator(response);
  if (validation.isValid) {
    return {
      success: true,
      data: response
    };
  } else {
    return {
      success: false,
      errors: validation.errors
    };
  }
};