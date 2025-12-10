# Tool Calling Investigation (Condensed)

**Date**: December 10, 2025  
**Status**: ✅ OpenAI-compatible tool calling works via fresh-session flow

## TL;DR
- OpenCode now streams OpenAI-style tool calls through Cursor's Agent API. ALL tools (built-in: bash, read, write, list, glob/grep + MCP tools) are emitted as OpenAI `tool_calls`.
- Tool calls are emitted when `tools` parameter is provided; the client executes locally and reposts with the tool result in conversation history.
- **Key**: Follow-up requests after tool execution should NOT include the `tools` parameter to get text responses.
- **Implemented policy**: Fresh session for every request; same-session continuation stores text in KV blobs and never streams.

## How It Works
1. Client sends chat request with `tools` → server translates ALL Cursor `exec_request` types (shell, read, write, ls, grep, mcp) into OpenAI `tool_calls` chunks and closes the SSE with `finish_reason: "tool_calls"`.
2. Client executes the tool locally.
3. Client sends a **new** chat request containing full history (user, assistant + tool_call, tool result) **WITHOUT the `tools` parameter**.
4. Server formats history and streams the assistant response normally (`finish_reason: "stop"`).

### Key Implementation Points
- `src/server.ts` and `src/plugin/plugin.ts`
  - When `tools` are provided: emit ALL `exec_request` messages as OpenAI `tool_calls`; close stream after emitting.
  - When `tools` are NOT provided: execute built-in tools internally (fallback for non-OpenCode clients).
  - `messagesToPrompt()` supports `role: "tool"` for multi-turn history.
- Tool name mapping (Cursor → OpenAI):
  - `shell`→`bash`, `read`→`read`, `write`→`write`, `ls`→`list`, `grep` (pattern)→`grep`, `grep` (glob)→`glob`, `mcp`→original tool name/args.

### Why Session Reuse Is Disabled for Tools
- Same-session BidiAppend (Cursor-style continuation) causes the server to acknowledge tool completion but stream only heartbeats; the assistant text is stored in KV blobs instead of `text_delta`/`token_delta`, and `turn_ended` never arrives.
- Fresh requests with full history stream correctly and complete turns. This matches standard OpenAI client behavior.
- **Important**: The follow-up request MUST NOT include the `tools` parameter, or the model may try to call tools again instead of responding with text.

## Test Coverage
- **Fresh tool flow (working)**: initial request returns `tool_calls`; follow-up request (without tools) with history and tool result streams assistant text and ends with `finish_reason: stop`.
- **Same-session continuation (intentionally not used)**: returns `tool_call_completed` plus heartbeats; no streamed text (response only in KV). Documented but not used.

## Quick Tests
- Manual fresh flow (works):
  1) Request with tools:
     ```bash
     curl -s http://localhost:18741/v1/chat/completions -H "Content-Type: application/json" -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Read README.md"}],"tools":[{"type":"function","function":{"name":"read","description":"Read file","parameters":{"type":"object","properties":{"filePath":{"type":"string"}},"required":["filePath"]}}}],"stream":true}'
     ```
     - Expect `tool_calls` chunk for `read` with `finish_reason:"tool_calls"`.
  2) Follow-up WITHOUT tools:
     ```bash
     curl -s http://localhost:18741/v1/chat/completions -H "Content-Type: application/json" -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Read README.md"},{"role":"assistant","content":null,"tool_calls":[{"id":"call_0","type":"function","function":{"name":"read","arguments":"{\"filePath\":\"README.md\"}"}}]},{"role":"tool","tool_call_id":"call_0","content":"# README\n..."}],"stream":true}'
     ```
     - Expect streamed assistant text and `finish_reason:"stop"`.

## December 10, 2025 Update: Full OpenCode Compatibility

### Problem
OpenCode always sends the `tools` parameter in every request, even after tool execution. Initial approach was to strip tools when tool results are present, but this breaks **multi-step tool flows** (e.g., read → write):

1. User asks: "Read README.md and add a line to it"
2. Model requests `read` tool
3. OpenCode executes read, sends result back WITH tools
4. If proxy strips tools → Model can only respond with text, CAN'T call `write`!

### Solution
**Always pass tools to Cursor** - let the model decide when to call tools vs respond with text. The model should be smart enough to:
- Call additional tools when needed (multi-step flows)
- Respond with text when the task is complete

This trusts the model's intelligence rather than trying to outsmart it with proxy-side logic.

### Implementation
- `src/server.ts` (line ~842): Always passes `toolsToPass = body.tools`
- `src/plugin/plugin.ts` (line ~342): Same - `toolsToPass = tools`

### Potential Issues
If the model re-requests the same tools unnecessarily, possible mitigations:
1. **Improve prompt formatting** - Make tool results clearer in the conversation history
2. **Filter duplicate tool calls** - Detect and reject identical tool requests on proxy side
3. **Trust the model** - Most modern models handle this correctly

### Test Flow (OpenCode-like)
```bash
# Step 1: Initial request WITH tools - may get tool_calls
curl ... -d '{"messages":[...], "tools":[...]}' 

# Step 2: Follow-up WITH tools AND tool result - may get more tool_calls OR text
curl ... -d '{"messages":[..., {"role":"tool",...}], "tools":[...]}'
```

Both requests include `tools`. The model decides whether to call more tools or respond with text.

## Remaining Gaps / Future Work
- Session reuse after tool results (would require handling KV-stored text or matching Cursor CLI streaming headers/behavior).
- Optional: richer `LsResult` tree format instead of `files_string`.

## KV Blob Investigation (December 10, 2025)

### Background
After sending tool results via BidiAppend, Cursor streams only heartbeats and stores model responses in KV blobs instead of streaming `text_delta`/`token_delta`. This investigation analyzed the blob contents to understand what's being stored.

### Test Setup
```bash
# Start server with session reuse enabled and enhanced blob logging
CURSOR_SESSION_REUSE=1 bun run src/server.ts > server.log 2>&1

# Run investigation script
bun run scripts/investigate-kv-blobs.ts
```

### Blob Types Observed

| Blob ID | Size | Type | Role | Content |
|---------|------|------|------|---------|
| #0 | 122b | text | - | Empty/metadata |
| #1 | 8806b | json | `system` | System prompt |
| #2 | 242b | json | `user` | User message |
| #3 | 241b | json | `user` | Additional context (user_info) |
| #4 | 36b | protobuf | - | Unknown metadata |
| #5 | 465b | json | `assistant` | **Tool call request (NOT text!)** |
| #6 | 905b | json | `tool` | Tool result storage |
| #7 | 305b | protobuf | - | Checkpoint data |
| #8 | 70b | protobuf | - | Unknown metadata |

### Key Finding: Assistant Blob Structure

The assistant blob (#5) contains:
```json
{
  "id": "...",
  "role": "assistant",
  "content": [
    {
      "type": "tool-call",
      "toolCallId": "call_...",
      "toolName": "Shell",
      "args": {"command": "echo 'Hello from KV blob investigation'"}
    }
  ]
}
```

**Critical insight**: The `content` field is an **array of tool-call objects**, not a text string!

This means after BidiAppend with tool result:
1. Cursor acknowledges tool completion (`tool_call_completed`)
2. The model's response is stored in KV blob
3. But the model is **requesting the same tool again** (infinite loop!)
4. No text response is generated

### Why This Happens

When resuming via BidiAppend, Cursor:
1. Reconstructs conversation from KV blobs (system, user, assistant, tool)
2. Continues the model turn
3. Model sees tool result but decides to call tool again (no turn boundary)
4. Response goes to KV blob instead of streaming

The streaming path (`text_delta`/`token_delta`) is never triggered because:
- Model outputs tool calls → stored as blob
- Model outputs text → also stored as blob (never observed)

### Detection Code Added

Enhanced `agent-service.ts` with comprehensive blob analysis:
```typescript
private analyzeBlobData(data: Uint8Array): {
  type: 'json' | 'text' | 'protobuf' | 'binary';
  json?: any;
  text?: string;
  protoFields?: Array<{...}>;
}
```

Logging shows blob role, content type, and extracts potential assistant responses.

### Conclusion

**Session reuse via BidiAppend is fundamentally incompatible with text streaming** when tools are involved:

1. ❌ Tool results sent → Model requests tool again (stored in blob)
2. ❌ Even if model responds with text → Stored in blob, not streamed
3. ❌ `turn_ended` never fires → Client waits forever

**Recommendation**: Continue using fresh sessions for every request. The overhead is acceptable and streaming works correctly.

### Future Exploration

If session reuse is still desired:
1. **Poll for blobs**: After heartbeat timeout, check blob store for assistant content
2. **Extract text from blobs**: Parse assistant blobs and emit as synthetic text chunks
3. **Force turn end**: Send a signal to close the turn after tool completion

None of these are implemented as fresh sessions work reliably.

## Reference
- Key files: `src/server.ts`, `src/plugin/plugin.ts`, `src/lib/api/agent-service.ts`
- Runtime: Bun, port 18741, Cursor API `api2.cursor.sh` / `agentn.api5.cursor.sh`.
