function mergeShellOutputDelta(prevShellTurn, update) {
  if (update.event.case === "stdout") {
    return Object.assign(Object.assign({}, prevShellTurn), {
      stdout: prevShellTurn.stdout + update.event.value.data
    });
  }
  if (update.event.case === "stderr") {
    return Object.assign(Object.assign({}, prevShellTurn), {
      stderr: prevShellTurn.stderr + update.event.value.data
    });
  }
  if (update.event.case === "exit") {
    return Object.assign(Object.assign({}, prevShellTurn), {
      exitCode: update.event.value.code
    });
  }
  throw new MergeError("Invalid shell output delta update");
}
function createNewPendingShellTurn(shellCommand) {
  return {
    type: "shell",
    shellCommand: shellCommand,
    stdout: "",
    stderr: "",
    exitCode: undefined
  };
}
function abortShellTurn(shellTurn) {
  return Object.assign(Object.assign({}, shellTurn), {
    exitCode: 130
  });
}
//# sourceMappingURL=shell.js.map