var acp_decision_provider_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class AcpDecisionProvider {
  constructor(connection, sessionId) {
    this.connection = connection;
    this.sessionId = sessionId;
  }
  requestApproval(operation) {
    return acp_decision_provider_awaiter(this, void 0, void 0, function* () {
      var _a;
      const {
        title,
        kind,
        content
      } = this.formatOperation(operation);
      const request = {
        sessionId: this.sessionId,
        toolCall: {
          toolCallId: (_a = operation.toolCallId) !== null && _a !== void 0 ? _a : `decision_${Date.now()}`,
          title,
          kind,
          status: "pending",
          content
        },
        options: [{
          optionId: "allow-once",
          name: "Allow once",
          kind: "allow_once"
        }, {
          optionId: "allow-always",
          name: "Allow always",
          kind: "allow_always"
        }, {
          optionId: "reject-once",
          name: "Reject",
          kind: "reject_once"
        }, {
          optionId: "reject-always",
          name: "Reject always",
          kind: "reject_always"
        }]
      };
      try {
        const response = yield this.connection.requestPermission(request);
        if (response.outcome.outcome === "cancelled") {
          return {
            approved: false,
            reason: "Cancelled"
          };
        }
        if (response.outcome.outcome === "selected") {
          const optionId = response.outcome.optionId;
          const approved = optionId === "allow-once" || optionId === "allow-always";
          return approved ? {
            approved: true
          } : {
            approved: false,
            reason: "User rejected"
          };
        }
        return {
          approved: false,
          reason: "Unknown response"
        };
      } catch (error) {
        return {
          approved: false,
          reason: error instanceof Error ? error.message : "Request failed"
        };
      }
    });
  }
  formatOperation(operation) {
    var _a, _b;
    switch (operation.type) {
      case local_exec_dist.OperationType.Write:
        {
          const path = operation.details.path;
          const isNew = operation.details.isNewFile;
          return {
            title: isNew ? `Write ${path}` : `Edit \`${path}\``,
            kind: "edit",
            content: [{
              type: "diff",
              path,
              oldText: (_a = operation.details.before) !== null && _a !== void 0 ? _a : null,
              newText: (_b = operation.details.after) !== null && _b !== void 0 ? _b : ""
            }]
          };
        }
      case local_exec_dist.OperationType.Shell:
        {
          const command = operation.details.command;
          const displayCommand = command.replaceAll("`", "\\`");
          return {
            title: `\`${displayCommand}\``,
            kind: "execute",
            content: operation.details.reason ? [{
              type: "content",
              content: {
                type: "text",
                text: operation.details.reason
              }
            }] : undefined
          };
        }
      case local_exec_dist.OperationType.Delete:
        {
          const path = operation.details.path;
          return {
            title: `Delete \`${path}\``,
            kind: "edit",
            content: undefined
          };
        }
      case local_exec_dist.OperationType.Mcp:
        {
          const toolName = operation.details.toolName;
          const providerName = operation.details.name;
          return {
            title: `${providerName}: ${toolName}`,
            kind: "other",
            content: [{
              type: "content",
              content: {
                type: "text",
                text: `\`\`\`json\n${JSON.stringify(operation.details.args, null, 2)}\n\`\`\``
              }
            }]
          };
        }
      default:
        return {
          title: "Unknown operation",
          kind: "other",
          content: undefined
        };
    }
  }
}