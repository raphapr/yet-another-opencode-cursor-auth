/**
 * Maps bidirectional streaming methods to their SSE (Server-Sent Events) counterparts.
 * This allows HTTP/1.1 clients to use SSE for server-to-client streaming while
 * using regular HTTP requests for client-to-server messages via BidiAppend.
 */
class AgentBidiMapper {
  map(bidiMethod) {
    if (bidiMethod.name === AgentService.methods.run.name) {
      // Create the SSE method info that matches the expected signature
      // Input: BidiRequestId, Output: AgentServerMessage
      return {
        name: "RunSSE",
        I: BidiRequestId,
        O: bidiMethod.O,
        kind: service_type /* MethodKind */.I.ServerStreaming
      };
    }
    throw new Error(`Unknown method: ${bidiMethod.name}`);
  }
}