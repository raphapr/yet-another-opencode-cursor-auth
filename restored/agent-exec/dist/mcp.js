const CURSOR_PLAYWRIGHT_PROVIDER_ID = "cursor-browser-extension";
const CURSOR_IDE_BROWSER_PROVIDER_ID = "cursor-ide-browser";
const CURSOR_SELF_CONTROL_PROVIDER_ID = "cursor-dev-control";
const mcpExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("mcpArgs"), createClientDeserializer("mcpResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("mcpArgs"), createClientSerializer("mcpResult")));
});
const listMcpResourcesExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("listMcpResourcesExecArgs"), createClientDeserializer("listMcpResourcesExecResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("listMcpResourcesExecArgs"), createClientSerializer("listMcpResourcesExecResult")));
});
const readMcpResourceExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("readMcpResourceExecArgs"), createClientDeserializer("readMcpResourceExecResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("readMcpResourceExecArgs"), createClientSerializer("readMcpResourceExecResult")));
});