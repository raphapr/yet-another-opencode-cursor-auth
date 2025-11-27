/**
 * Types for MCP elicitation support.
 * Elicitation allows MCP tools to request additional information from users during execution.
 */
var elicitation_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
/**
 * No-op elicitation provider that always declines requests.
 * Useful for testing or when elicitation is not supported.
 */
class NoopElicitationProvider {
  elicit(_request) {
    return elicitation_awaiter(this, void 0, void 0, function* () {
      return {
        action: "decline"
      };
    });
  }
}
/**
 * No-op elicitation provider factory that creates providers that always decline.
 */
class NoopElicitationProviderFactory {
  createProvider(_serverName, _toolName, _toolCallId) {
    return new NoopElicitationProvider();
  }
}
//# sourceMappingURL=elicitation.js.map