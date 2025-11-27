/**
 * Determines if a tool call is a "read" tool that can be grouped with other read tools.
 * Read tools are those that only read/query information without modifying state.
 */
function isReadToolCall(toolCall) {
  const call = toolCall.call;
  // Check if the tool call is one of the read-like tools
  return !!(call.tool.case === "readToolCall" || call.tool.case === "lsToolCall" || call.tool.case === "globToolCall" || call.tool.case === "grepToolCall" || call.tool.case === "readLintsToolCall" || call.tool.case === "semSearchToolCall");
}
/**
 * Determines if all tool calls in a group are read tools.
 */
function isReadToolGroup(group) {
  return group.calls.every(isReadToolCall);
}
/**
 * Predicate function that determines if a new tool call can be merged into an existing group.
 * Currently merges read tool calls into groups that only contain other read tool calls.
 */
function canMergeToolCallIntoGroup(group, newToolCall) {
  // Only merge read tools into read-only groups
  if (isReadToolCall(newToolCall) && isReadToolGroup(group)) {
    return true;
  }
  // Future: Add other merge criteria here (e.g., same file operations, etc.)
  return false;
}
function mergeSegmentStartToolCallUpdate(segment, update) {
  const lastGroup = segment.groups[segment.groups.length - 1];
  const newToolCall = {
    id: update.callId,
    call: update.toolCall,
    completed: false,
    aborted: false
  };
  // If no existing group, create a new one
  if (lastGroup === undefined) {
    return {
      type: "tool-call-segment",
      groups: [{
        type: "tool-call-group",
        calls: [newToolCall]
      }]
    };
  }
  // Check if the new tool call can be merged into the last group
  if (canMergeToolCallIntoGroup(lastGroup, newToolCall)) {
    return Object.assign(Object.assign({}, segment), {
      groups: [...segment.groups.slice(0, -1), Object.assign(Object.assign({}, lastGroup), {
        calls: [...lastGroup.calls, newToolCall]
      })]
    });
  }
  // If it can't be merged, create a new group
  return Object.assign(Object.assign({}, segment), {
    groups: [...segment.groups, {
      type: "tool-call-group",
      calls: [newToolCall]
    }]
  });
}
function createToolCallSegmentFromStartToolCallUpdate(update) {
  return {
    type: "tool-call-segment",
    groups: [{
      type: "tool-call-group",
      calls: [{
        id: update.callId,
        call: update.toolCall,
        completed: false,
        aborted: false
      }]
    }]
  };
}
function mergeSegmentToolCallCompletedUpdate(segment, update) {
  const newGroups = segment.groups.map(group => {
    return Object.assign(Object.assign({}, group), {
      calls: group.calls.map(call => {
        if (call.id === update.callId) {
          return Object.assign(Object.assign({}, call), {
            call: update.toolCall,
            completed: true,
            aborted: false
          });
        }
        return call;
      })
    });
  });
  return {
    type: "tool-call-segment",
    groups: newGroups
  };
}
function mergeSegmentToolCallDeltaUpdate(segment, update) {
  const newGroups = segment.groups.map(group => {
    return Object.assign(Object.assign({}, group), {
      calls: group.calls.map(call => {
        var _a, _b;
        if (call.id === update.callId) {
          // Only handle shell tool call deltas
          if (update.toolCallDelta.delta.case === "shellToolCallDelta" && call.call.tool.case === "shellToolCall") {
            const shellDelta = update.toolCallDelta.delta.value;
            const shellToolCall = call.call.tool.value;
            // Get current accumulated output from partial result, or start fresh
            const currentResult = (_a = shellToolCall.result) === null || _a === void 0 ? void 0 : _a.result;
            let currentStdout = "";
            let currentStderr = "";
            if ((currentResult === null || currentResult === void 0 ? void 0 : currentResult.case) === "success") {
              // If there's already a partial result, get its accumulated output
              currentStdout = currentResult.value.stdout || "";
              currentStderr = currentResult.value.stderr || "";
            }
            // Append the new delta
            if (shellDelta.delta.case === "stdout") {
              currentStdout += shellDelta.delta.value.content;
            } else if (shellDelta.delta.case === "stderr") {
              currentStderr += shellDelta.delta.value.content;
            }
            // Create updated tool call with accumulated output in partialResult
            const updatedShellToolCall = new shell_tool_pb /* ShellToolCall */.$M({
              args: shellToolCall.args,
              result: new shell_exec_pb /* ShellResult */.W4({
                result: {
                  case: "success",
                  value: new shell_exec_pb /* ShellSuccess */.QR({
                    stdout: currentStdout,
                    stderr: currentStderr
                  })
                },
                sandboxPolicy: (_b = shellToolCall.result) === null || _b === void 0 ? void 0 : _b.sandboxPolicy
              })
            });
            return Object.assign(Object.assign({}, call), {
              call: new agent_pb /* ToolCall */.Dm({
                tool: {
                  case: "shellToolCall",
                  value: updatedShellToolCall
                }
              })
            });
          }
        }
        return call;
      })
    });
  });
  return {
    type: "tool-call-segment",
    groups: newGroups
  };
}
function abortSegmentToolCall(segment) {
  const newGroups = segment.groups.map(group => {
    return Object.assign(Object.assign({}, group), {
      calls: group.calls.map(call => {
        return Object.assign(Object.assign({}, call), {
          completed: false,
          aborted: true
        });
      })
    });
  });
  return {
    type: "tool-call-segment",
    groups: newGroups
  };
}
//# sourceMappingURL=tool-call-merge.js.map