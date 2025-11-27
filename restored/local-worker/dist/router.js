var router_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
class Router {
  constructor() {
    this.routes = [];
  }
  post(path, handler) {
    this.routes.push({
      method: "POST",
      path,
      handler
    });
  }
  get(path, handler) {
    this.routes.push({
      method: "GET",
      path,
      handler
    });
  }
  handle(req, res) {
    return router_awaiter(this, void 0, void 0, function* () {
      const url = new external_node_url_.URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      const pathname = url.pathname;
      const method = req.method || "GET";
      // Find matching route
      const route = this.routes.find(r => r.method === method && r.path === pathname);
      if (route) {
        try {
          yield route.handler(req, res);
        } catch (error) {
          console.error("Route handler error:", error);
          if (!res.headersSent) {
            res.writeHead(500, {
              "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
              error: "Internal server error"
            }));
          }
        }
      } else {
        res.writeHead(404, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
          error: `Cannot ${method} ${pathname}`
        }));
      }
    });
  }
}
//# sourceMappingURL=router.js.map