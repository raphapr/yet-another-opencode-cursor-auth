// Remote Ser-de
function createServerSerializer(argsKey) {
  function serialize(id, args) {
    const message = {
      case: argsKey,
      value: args
    };
    return new exec_pb /* ExecServerMessage */.Ye({
      id,
      message
    });
  }
  return serialize;
}
function createClientDeserializer(resultKey) {
  return result => {
    return result.message.case === resultKey ? result.message.value : undefined;
  };
}
// Controlled Ser-de
function createClientSerializer(resultKey) {
  function serialize(id, result) {
    const message = {
      case: resultKey,
      value: result
    };
    return new exec_pb /* ExecClientMessage */.yT({
      id,
      message
    });
  }
  return serialize;
}
function createServerDeserializer(argsKey) {
  function deserialize(result) {
    if (result.message.case !== argsKey) {
      return undefined;
    }
    return {
      id: result.id,
      args: result.message.value
    };
  }
  return deserialize;
}