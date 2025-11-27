const readExecutorResource = createResource(execManager => new ExecutorResource(execManager, createServerSerializer("readArgs"), createClientDeserializer("readResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("readArgs"), createClientSerializer("readResult")));
});