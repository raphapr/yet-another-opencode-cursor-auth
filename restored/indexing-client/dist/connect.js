class RounRobin {
  constructor(items) {
    this.items = items;
    this.index = 0;
  }
  next() {
    const item = this.items[this.index];
    this.index = (this.index + 1) % this.items.length;
    return item;
  }
}
function createRoundRobinTransport(transports) {
  const roundRobin = new RounRobin(transports);
  return {
    unary: (request, options, signal, timeoutMs, header, input, contextValues) => {
      const transport = roundRobin.next();
      return transport.unary(request, options, signal, timeoutMs, header, input, contextValues);
    },
    stream: (request, options, signal, timeoutMs, header, input, contextValues) => {
      const transport = roundRobin.next();
      return transport.stream(request, options, signal, timeoutMs, header, input, contextValues);
    }
  };
}
function createRoundRobinTransportFromFactory(factory, numTransports) {
  const transports = [];
  for (let i = 0; i < numTransports; i++) {
    transports.push(factory());
  }
  return createRoundRobinTransport(transports);
}
function createRotatingTransport(factory, ttl) {
  let transport = factory();
  let lifetime = 0;
  return {
    unary: (request, options, signal, timeoutMs, header, input, contextValues) => {
      lifetime++;
      if (lifetime > ttl) {
        transport = factory();
        lifetime = 0;
      }
      return transport.unary(request, options, signal, timeoutMs, header, input, contextValues);
    },
    stream: (request, options, signal, timeoutMs, header, input, contextValues) => {
      lifetime++;
      if (lifetime > ttl) {
        transport = factory();
        lifetime = 0;
      }
      return transport.stream(request, options, signal, timeoutMs, header, input, contextValues);
    }
  };
}
function createRepositoryClient(options) {
  var _a;
  const baseTransportFactory = () => {
    var _a;
    return (0, esm /* createConnectTransport */.wQ)({
      baseUrl: options.endpoint,
      httpVersion: (_a = options.httpVersion) !== null && _a !== void 0 ? _a : "2",
      interceptors: options.interceptors,
      nodeOptions: options.endpoint.startsWith("https:") ? {
        protocol: "https:",
        rejectUnauthorized: !options.insecure
      } : undefined
    });
  };
  const ttl = options.ttl;
  const transportFactory = ttl ? () => createRotatingTransport(baseTransportFactory, ttl) : baseTransportFactory;
  const transport = createRoundRobinTransportFromFactory(transportFactory, (_a = options.numTransports) !== null && _a !== void 0 ? _a : 16);
  return (0, promise_client /* createClient */.UU)(repository_connect /* RepositoryService */.B, transport);
}