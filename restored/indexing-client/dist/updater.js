var updater_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const updater_logger = (0, dist /* createLogger */.h)("@anysphere/indexing-client:updater");
function createConnectUpdater(client, clientRepositoryInfo, codebaseId) {
  return (ctx, changes) => updater_awaiter(this, void 0, void 0, function* () {
    const requestId = (0, external_node_crypto_.randomUUID)();
    updater_logger.info(ctx, "Updating files", {
      requestId,
      changes: changes.length
    });
    try {
      const response = yield client.fastUpdateFileV2({
        codebaseId,
        clientRepositoryInfo,
        updateType: repository_pb /* FastUpdateFileV2Request_UpdateType */.dr.BATCH,
        fileUpdates: changes
      }, {
        headers: {
          "x-request-id": requestId
        }
      });
      updater_logger.info(ctx, "Updated files", {
        requestId,
        response: response.toJson()
      });
    } catch (e) {
      updater_logger.error(ctx, "Error updating files", {
        requestId,
        error: e
      });
      throw e;
    }
  });
}