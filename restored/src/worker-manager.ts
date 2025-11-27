function getProjectSocketPathForWorkspace(workspaceDir) {
  const projectDir = (0, cursor_config_dist /* getProjectDirForSocketPath */.kL)(workspaceDir);
  return (0, local_worker_dist.getProjectSocketPath)(projectDir);
}
function getProjectLogPath(workspacePath) {
  return (0, external_node_path_.join)((0, cursor_config_dist /* getProjectDir */.Xq)(workspacePath), "worker.log");
}
function spawnLocalWorker(workspacePath, socketPath, logPath, options) {
  return () => {
    const entryArg = process.argv[1];
    const args = entryArg.endsWith(".tsx") || entryArg.endsWith(".js") ? [entryArg, "worker-server"] : ["worker-server"];
    const child = (0, external_node_child_process_.spawn)(process.execPath, args, {
      // The worker will become a daemon and index the codebase in the background
      stdio: "ignore",
      detached: true,
      cwd: workspacePath,
      env: Object.assign(Object.assign({}, process.env), {
        AGENT_CLI_SOCKET_PATH: socketPath,
        AGENT_CLI_LOG_PATH: logPath,
        AGENT_CLI_WORKER_OPTIONS: JSON.stringify(options)
      })
    });
    child.unref();
  };
}