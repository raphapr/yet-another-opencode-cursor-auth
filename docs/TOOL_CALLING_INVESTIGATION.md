# Tool Calling Investigation (Condensed)

**Date**: December 9, 2025
**Status**: ✅ OpenAI-compatible tool calling works via fresh-session flow

## TL;DR
- OpenCode now streams OpenAI-style tool calls through Cursor's Agent API. All built-in tools (bash, read, list, glob/grep, edit/write, task, chrome-devtools_*, webfetch, etc.) round-trip correctly.
- Tool calls are emitted as OpenAI `tool_calls` when `tools` are provided; the client executes locally and reposts with the tool result in conversation history.
- **Implemented policy**: when `tools` are present, skip session reuse and always create a fresh Cursor session. Same-session continuation stores text in KV blobs and never streams; fresh sessions stream normally.

## How It Works
1. Client sends chat request with `tools` → server translates Cursor `exec_request` into OpenAI `tool_calls` chunks and closes the SSE with `finish_reason: "tool_calls"`.
2. Client executes the tool locally.
3. Client sends a **new** chat request containing full history (user, assistant + tool_call, tool result).
4. Server formats history and streams the assistant response normally (`finish_reason: "stop"`).

### Key Implementation Points
- `src/server.ts`
  - Detects `clientProvidedTools`; when true, skips session reuse and uses the fresh-session path.
  - Exec handling: emits all `exec_request` messages as OpenAI `tool_calls`; closes stream after emitting.
  - `messagesToPrompt()` supports `role: "tool"` for multi-turn history.
  - `handleToolResult()` covers shell, read, list, grep/glob, and MCP result types.
- Tool name mapping:
  - `shell`→`bash`, `read`→`read`, `ls`→`list`, `grep` (pattern)→`grep`, `grep` (glob)→`glob`, `mcp`→original tool name/args.

### Why Session Reuse Is Disabled for Tools
- Same-session BidiAppend (Cursor-style continuation) causes the server to acknowledge tool completion but stream only heartbeats; the assistant text is stored in KV blobs instead of `text_delta`/`token_delta`, and `turn_ended` never arrives.
- Fresh requests with full history stream correctly and complete turns. This matches standard OpenAI client behavior and is now the default for tool flows.
- If session reuse becomes critical later, investigate `x-cursor-streaming: "true"`, longer heartbeat tolerance, and/or extracting text from KV blobs.

## Test Coverage
- **Fresh tool flow (working)**: initial request returns `tool_calls`; follow-up request with history and tool result streams assistant text and ends with `finish_reason: stop`.
- **Same-session continuation (intentionally not used)**: returns `tool_call_completed` plus heartbeats; no streamed text (response only in KV). Documented but not used.

## Quick Tests
- Automated: `bun run scripts/test-exec-flow.ts` (verifies exec flow wiring without tools).
- Manual fresh flow (works):
  1) `curl -s http://localhost:18741/v1/chat/completions -H "Content-Type: application/json" -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Run: echo hello"}],"tools":[{"type":"function","function":{"name":"bash","description":"Run bash command","parameters":{"type":"object","properties":{"command":{"type":"string"}},"required":["command"]}}}],"stream":true}'`
     - Expect `tool_calls` chunk for `bash` with `finish_reason:"tool_calls"`.
  2) `curl -s http://localhost:18741/v1/chat/completions -H "Content-Type: application/json" -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Run: echo hello"},{"role":"assistant","content":null,"tool_calls":[{"id":"call_123","type":"function","function":{"name":"bash","arguments":"{\\"command\\":\\"echo hello\\"}"}}]},{"role":"tool","tool_call_id":"call_123","content":"hello\n"}],"stream":true}'`
     - Expect streamed assistant text and `finish_reason:"stop"`.
- Manual same-session repro (broken on purpose): send Step 1 above, then send tool result via BidiAppend path; observe only heartbeats and KV-stored response.

## Remaining Gaps / Future Work
- Session reuse after tool results (would require handling KV-stored text or matching Cursor CLI streaming headers/behavior).
- Optional: richer `LsResult` tree format instead of `files_string`.
- Optional: test MCP tool round-trip further now that the fresh-session flow is stable.

## Reference
- Key files: `src/server.ts`, `src/lib/api/agent-service.ts`, `cursor-agent-restored-source-code/` (reference).
- Runtime: Bun, port 18741, Cursor API `api2.cursor.sh` / `agentn.api5.cursor.sh`.
