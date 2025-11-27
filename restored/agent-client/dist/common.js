var common_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

// Parses ErrorDetails out of a ConnectError (mirrors VSCode getErrorDetail)
function getErrorDetailFromConnectError(error) {
  // Restore details values to Uint8Array when they were serialized differently
  const restoreUInt8ArrayNess = err => {
    err.details = err.details.map(detail => {
      const valueIsUInt8Array = "value" in detail && detail.value instanceof Uint8Array;
      if ("value" in detail && valueIsUInt8Array === false) {
        const values = Object.values(detail.value);
        detail.value = Uint8Array.from(values);
      }
      return detail;
    });
  };
  restoreUInt8ArrayNess(error);
  // biome-ignore lint/suspicious/noExplicitAny: findDetails is a method on ConnectError
  const errorDetails = error.findDetails(utils_pb /* ErrorDetails */.vj);
  if (!errorDetails || errorDetails.length === 0) return undefined;
  return errorDetails[0];
}
const ACTIONS_WITH_REQUEST_CONTEXT = ["userMessageAction", "resumeAction"];
function includesTyped(arr, el) {
  return arr.includes(el);
}
const hydrateRequestContext = (parentCtx, action, resources, notesSessionId) => common_awaiter(void 0, void 0, void 0, function* () {
  var _a;
  const actionCase = action.action.case;
  if (includesTyped(ACTIONS_WITH_REQUEST_CONTEXT, actionCase)) {
    const hydratedAction = action.action.value;
    const rcExecutor = resources.get(agent_exec_dist /* requestContextExecutorResource */.MZ);
    const requestContextResult = yield rcExecutor.execute(parentCtx, new request_context_exec_pb /* RequestContextArgs */._K({
      notesSessionId
    }));
    if (requestContextResult.result.case !== "success" || requestContextResult.result.value.requestContext === undefined) {
      throw new Error(`Failed to compute request context: ${JSON.stringify((_a = requestContextResult.result.value) === null || _a === void 0 ? void 0 : _a.toJson())}`);
    }
    hydratedAction.requestContext = requestContextResult.result.value.requestContext;
  }
});
class UserAbortedRequestError extends Error {
  constructor() {
    super("User aborted request");
  }
}