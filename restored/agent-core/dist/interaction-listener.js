var interaction_listener_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class NoopInteractionListener {
  sendUpdate(_ctx, _update) {
    return interaction_listener_awaiter(this, void 0, void 0, function* () {
      // No-op: ignore all interaction updates
    });
  }
  query(_ctx, query) {
    return interaction_listener_awaiter(this, void 0, void 0, function* () {
      switch (query.type) {
        case "web-search-request":
          return {
            approved: true
          };
        case "ask-question-request":
          // Auto-reject with empty answers for CLI fallback
          return {
            result: new AskQuestionResultProto({
              result: {
                case: "rejected",
                value: new AskQuestionRejected({
                  reason: "Questions skipped by user (CLI fallback)"
                })
              }
            })
          };
        case "switch-mode-request":
          // Auto-reject mode switches for CLI fallback
          return {
            approved: false,
            reason: "Mode switching not supported in CLI"
          };
        case "exa-search-request":
          return {
            approved: true
          };
        case "exa-fetch-request":
          return {
            approved: true
          };
        default:
          {
            const _exhaustiveCheck = query;
            throw new Error(`Unhandled interaction query type`);
          }
      }
    });
  }
}
class LogInteractionListener {
  constructor() {
    this.lastCharWasNewline = true;
    this.inThinking = false;
    this.inSummary = false;
  }
  writeStdout(text) {
    process.stdout.write(text);
    if (text.length > 0) {
      this.lastCharWasNewline = text[text.length - 1] === "\n";
    }
  }
  ensureNewline() {
    if (!this.lastCharWasNewline) {
      this.writeStdout("\n");
    }
  }
  logLine(message) {
    this.ensureNewline();
    console.log(message);
    this.lastCharWasNewline = true;
  }
  sendUpdate(_ctx, update) {
    return interaction_listener_awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c;
      switch (update.type) {
        case "text-delta":
          // Ensure separation from any previous non-text streams
          if (this.inThinking || this.inSummary) {
            this.ensureNewline();
            this.inThinking = false;
            // Keep summary open but separate text nicely
            if (this.inSummary) {
              this.logLine("────────────────────────");
              this.inSummary = false;
            }
          }
          this.writeStdout(update.text);
          break;
        case "tool-call-started":
          {
            const toolCase = (_a = update.toolCall.tool.case) !== null && _a !== void 0 ? _a : "unknown";
            this.logLine(`🛠️  Tool call started: ${update.callId} (${toolCase})`);
          }
          break;
        case "tool-call-completed":
          {
            const toolCase = (_b = update.toolCall.tool.case) !== null && _b !== void 0 ? _b : "unknown";
            this.logLine(`✅ Tool call completed: ${update.callId} (${toolCase})`);
          }
          break;
        case "partial-tool-call":
          {
            const toolCase = (_c = update.toolCall.tool.case) !== null && _c !== void 0 ? _c : "unknown";
            this.logLine(`🧩 Tool call update: ${update.callId} (${toolCase})`);
          }
          break;
        case "thinking-delta":
          if (!this.inThinking) {
            this.ensureNewline();
            this.writeStdout("🧠 Thinking: ");
            this.inThinking = true;
          }
          this.writeStdout(update.text);
          break;
        case "thinking-completed":
          if (this.inThinking && !this.lastCharWasNewline) {
            this.writeStdout("\n");
          }
          this.inThinking = false;
          this.logLine("🧠 Thinking completed");
          break;
        case "summary":
          {
            if (!this.inSummary) {
              this.ensureNewline();
              this.logLine("──────────────── Summary ────────────────");
              this.inSummary = true;
            }
            // Print the summary body (ensure it ends with a newline)
            const body = update.summary.endsWith("\n") ? update.summary : `${update.summary}\n`;
            this.writeStdout(body);
            break;
          }
        case "summary-started":
          this.ensureNewline();
          this.logLine("──────────────── Summary ────────────────");
          this.inSummary = true;
          break;
        case "summary-completed":
          if (!this.lastCharWasNewline) {
            this.writeStdout("\n");
          }
          this.logLine("─────────────────────────────────────────");
          this.inSummary = false;
          break;
        case "step-started":
          this.logLine(`🪜 Step started: ${update.stepId}`);
          break;
      }
    });
  }
  query(_ctx, query) {
    return interaction_listener_awaiter(this, void 0, void 0, function* () {
      switch (query.type) {
        case "web-search-request":
          this.logLine("🔎 Web search requested");
          this.logLine(`Search term: ${query.args.searchTerm}`);
          return {
            approved: true
          };
        case "ask-question-request":
          this.logLine("❓ Ask question requested");
          this.logLine(`Tool call ID: ${query.toolCallId}`);
          if (query.args.title) {
            this.logLine(`Title: ${query.args.title}`);
          }
          for (const question of query.args.questions) {
            this.logLine(`Question ${question.id}: ${question.prompt}`);
          }
          // Auto-reject for CLI logging
          return {
            result: new AskQuestionResultProto({
              result: {
                case: "rejected",
                value: new AskQuestionRejected({
                  reason: "Questions skipped by user (CLI fallback)"
                })
              }
            })
          };
        case "switch-mode-request":
          this.logLine("🔄 Switch mode requested");
          this.logLine(`Tool call ID: ${query.toolCallId}`);
          this.logLine(`Target mode: ${query.args.targetModeId}`);
          if (query.args.explanation) {
            this.logLine(`Explanation: ${query.args.explanation}`);
          }
          // Auto-reject for CLI logging
          return {
            approved: false,
            reason: "Mode switching not supported in CLI"
          };
        case "exa-search-request":
          this.logLine("🔎 Exa search requested");
          this.logLine(`Query: ${query.args.query}`);
          return {
            approved: true
          };
        case "exa-fetch-request":
          this.logLine("📥 Exa fetch requested");
          this.logLine(`IDs: ${query.args.ids.join(", ")}`);
          return {
            approved: true
          };
        default:
          {
            const _exhaustiveCheck = query;
            throw new Error(`Unhandled query type`);
          }
      }
    });
  }
}