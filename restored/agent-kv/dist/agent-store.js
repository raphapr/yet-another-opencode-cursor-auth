var agent_store_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
const AgentModes = ["default", "auto-run", "plan", "background", "search"];
const AgentMetadataSchema = lib.z.object({
  agentId: lib.z.string(),
  latestRootBlobId: lib.z.instanceof(Uint8Array),
  name: lib.z.string(),
  createdAt: lib.z.number(),
  mode: lib.z.enum(AgentModes),
  lastUsedModel: lib.z.string().optional(),
  resumeBcId: lib.z.string().optional()
});
const getDefaultAgentMetadata = agentId => ({
  agentId: agentId !== null && agentId !== void 0 ? agentId : crypto.randomUUID(),
  latestRootBlobId: new Uint8Array(),
  name: "New Agent",
  mode: "default",
  createdAt: Date.now(),
  lastUsedModel: undefined,
  resumeBcId: undefined
});
class AgentMetadataSerde {
  serialize(value) {
    const serializedLatestRootBlobId = serde_toHex(value.latestRootBlobId);
    return utf8Serde.serialize(JSON.stringify(Object.assign(Object.assign({}, value), {
      latestRootBlobId: serializedLatestRootBlobId
    })));
  }
  deserialize(blob) {
    const json = JSON.parse(utf8Serde.deserialize(blob));
    const latestRootBlobId = fromHex(json.latestRootBlobId);
    // Merge with defaults so missing fields (e.g., mode) are populated
    const defaults = getDefaultAgentMetadata(json.agentId);
    // Validate mode and default to "default" if invalid
    const mode = AgentModes.includes(json.mode) ? json.mode : "default";
    return AgentMetadataSchema.parse(Object.assign(Object.assign(Object.assign({}, defaults), json), {
      mode,
      latestRootBlobId
    }));
  }
}
// Serdes reused from the structured accessor
const todoItemSerde = new ProtoSerde(todo_tool_pb /* TodoItem */.kW);
const userMessageSerde = new ProtoSerde(agent_pb /* UserMessage */.RG);
const conversationStepSerde = new ProtoSerde(agent_pb /* ConversationStep */.kJ);
const conversationTurnStructureSerde = new ProtoSerde(agent_pb /* ConversationTurnStructure */.cm);
const conversationSummarySerde = new ProtoSerde(agent_pb /* ConversationSummary */.KR);
const shellCommandSerde = new ProtoSerde(agent_pb /* ShellCommand */.oI);
const shellOutputSerde = new ProtoSerde(agent_pb /* ShellOutput */.Zm);
class AgentStore {
  constructor(blobStore, metadataStore) {
    this.blobStore = blobStore;
    this.metadataStore = metadataStore;
    this.serde = new ProtoSerde(agent_pb /* ConversationStateStructure */.Y9);
    this.conversationStateStructure = new agent_pb /* ConversationStateStructure */.Y9();
  }
  subscribeToMetadata(key, callback) {
    return this.metadataStore.subscribe(key, () => {
      callback(this.metadataStore.get(key));
    });
  }
  setMetadata(key, value) {
    this.metadataStore.set(key, value);
  }
  getMetadata(key) {
    return this.metadataStore.get(key);
  }
  getId() {
    return this.getMetadata("agentId");
  }
  getBlobStore() {
    return this.blobStore;
  }
  getConversationStateStructure() {
    return this.conversationStateStructure;
  }
  getFullConversation(ctx) {
    return agent_store_awaiter(this, void 0, void 0, function* () {
      const newState = new agent_pb /* ConversationState */.lj();
      const turns = [];
      const turnBlobs = this.conversationStateStructure.turns;
      for (const turnBlobId of turnBlobs) {
        const turnBlob = yield this.blobStore.getBlob(ctx, turnBlobId);
        if (!turnBlob) continue;
        const turnStructure = conversationTurnStructureSerde.deserialize(turnBlob);
        let conversationTurn;
        switch (turnStructure.turn.case) {
          case "agentConversationTurn":
            {
              const agentTurnStructure = turnStructure.turn.value;
              const userMessageBlob = yield this.blobStore.getBlob(ctx, agentTurnStructure.userMessage);
              if (!userMessageBlob) continue;
              const userMessage = userMessageSerde.deserialize(userMessageBlob);
              const steps = [];
              for (const stepBlobId of agentTurnStructure.steps) {
                const stepBlob = yield this.blobStore.getBlob(ctx, stepBlobId);
                if (stepBlob) {
                  const step = conversationStepSerde.deserialize(stepBlob);
                  steps.push(step);
                }
              }
              const agentTurn = new agent_pb /* AgentConversationTurn */.i9({
                userMessage,
                steps
              });
              conversationTurn = new agent_pb /* ConversationTurn */.j9({
                turn: {
                  case: "agentConversationTurn",
                  value: agentTurn
                }
              });
              break;
            }
          case "shellConversationTurn":
            {
              const shellTurnStructure = turnStructure.turn.value;
              const shellCommandBlob = yield this.blobStore.getBlob(ctx, shellTurnStructure.shellCommand);
              if (!shellCommandBlob) continue;
              const shellCommand = shellCommandSerde.deserialize(shellCommandBlob);
              const shellOutputBlob = yield this.blobStore.getBlob(ctx, shellTurnStructure.shellOutput);
              if (!shellOutputBlob) continue;
              const shellOutput = shellOutputSerde.deserialize(shellOutputBlob);
              const shellTurn = new agent_pb /* ShellConversationTurn */.tm({
                shellCommand,
                shellOutput
              });
              conversationTurn = new agent_pb /* ConversationTurn */.j9({
                turn: {
                  case: "shellConversationTurn",
                  value: shellTurn
                }
              });
              break;
            }
        }
        if (!conversationTurn) continue;
        turns.push(conversationTurn);
      }
      newState.turns = turns;
      const todos = [];
      for (const todoBlobId of this.conversationStateStructure.todos) {
        const todoBlob = yield this.blobStore.getBlob(ctx, todoBlobId);
        if (todoBlob) {
          const todo = todoItemSerde.deserialize(todoBlob);
          todos.push(todo);
        }
      }
      newState.todos = todos;
      if (this.conversationStateStructure.summary) {
        const summaryBlob = yield this.blobStore.getBlob(ctx, this.conversationStateStructure.summary);
        if (summaryBlob) {
          const summary = conversationSummarySerde.deserialize(summaryBlob);
          newState.summary = summary;
        }
      }
      return newState;
    });
  }
  getLatestCheckpoint() {
    return this.getConversationStateStructure();
  }
  handleCheckpoint(ctx, checkpoint) {
    return agent_store_awaiter(this, void 0, void 0, function* () {
      this.conversationStateStructure = checkpoint;
      const bytes = this.serde.serialize(checkpoint);
      const blobId = yield blob_store_getBlobId(bytes);
      yield this.blobStore.setBlob(ctx, blobId, bytes);
      this.setMetadata("latestRootBlobId", new Uint8Array(blobId));
    });
  }
  resetFromDb(ctx) {
    return agent_store_awaiter(this, void 0, void 0, function* () {
      try {
        const rootBlobId = this.getMetadata("latestRootBlobId");
        if (!rootBlobId) {
          this.conversationStateStructure = new agent_pb /* ConversationStateStructure */.Y9();
          return;
        }
        const bytes = yield this.blobStore.getBlob(ctx, rootBlobId);
        if (!bytes) {
          this.conversationStateStructure = new agent_pb /* ConversationStateStructure */.Y9();
          return;
        }
        const structure = this.serde.deserialize(bytes);
        this.conversationStateStructure = structure;
      } catch (_e) {
        this.conversationStateStructure = new agent_pb /* ConversationStateStructure */.Y9();
      }
    });
  }
  dispose() {
    return agent_store_awaiter(this, void 0, void 0, function* () {
      if (this.blobStore instanceof dist /* Disposable */.jG) {
        yield this.blobStore.dispose();
      }
    });
  }
}