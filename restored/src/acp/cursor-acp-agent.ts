var cursor_acp_agent_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
 * CursorACPAgent implements the Agent protocol interface, managing agent sessions
 * and handling communication with the agent client protocol connection.
 */
class CursorACPAgent {
  constructor(connection, deps, ctx, options, sharedServices) {
    this.connection = connection;
    this.sessions = new Map();
    this.deps = deps;
    this.ctx = ctx;
    this.options = options;
    this.sharedServices = sharedServices;
  }
  initialize(_params) {
    return cursor_acp_agent_awaiter(this, void 0, void 0, function* () {
      return {
        protocolVersion: acp /* PROTOCOL_VERSION */.WP,
        agentCapabilities: {
          loadSession: false
        }
      };
    });
  }
  newSession(_params) {
    return cursor_acp_agent_awaiter(this, void 0, void 0, function* () {
      const sessionId = crypto.randomUUID();
      const agentStore = yield createAgentStoreForSession(this.ctx, sessionId, this.options, this.deps, this.sharedServices.modelManager);
      const resources = yield createSessionResources(this.connection, sessionId, this.sharedServices, agentStore, this.options);
      this.sessions.set(sessionId, new AgentSession(this.connection, sessionId, this.sharedServices, this.ctx, agentStore, resources));
      return {
        sessionId
      };
    });
  }
  authenticate(_params) {
    return cursor_acp_agent_awaiter(this, void 0, void 0, function* () {
      // no-op
    });
  }
  prompt(params) {
    return cursor_acp_agent_awaiter(this, void 0, void 0, function* () {
      const session = this.sessions.get(params.sessionId);
      if (!session) {
        throw new Error(`Session ${params.sessionId} not found`);
      }
      return yield session.handlePrompt(params);
    });
  }
  cancel(params) {
    return cursor_acp_agent_awaiter(this, void 0, void 0, function* () {
      var _a;
      const session = this.sessions.get(params.sessionId);
      (_a = session === null || session === void 0 ? void 0 : session.pendingPrompt) === null || _a === void 0 ? void 0 : _a.abort();
      return;
    });
  }
}