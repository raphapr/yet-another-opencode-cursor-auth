var zod_utils_awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
function parseBody(req) {
  return zod_utils_awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const trimmed = body.trim();
          // Allow empty bodies (e.g., GET requests) to be treated as empty objects
          if (trimmed.length === 0) {
            resolve({});
            return;
          }
          resolve(JSON.parse(trimmed));
        } catch (_error) {
          reject(new Error("Invalid JSON body"));
        }
      });
      req.on("error", reject);
    });
  });
}
function handleZodRequest(req, res, schema, handler) {
  return zod_utils_awaiter(this, void 0, void 0, function* () {
    try {
      const body = yield parseBody(req);
      const parsed = schema.parse(body);
      const result = yield handler(parsed);
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(error instanceof lib.z.ZodError ? 400 : 500, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error"
      }));
    }
  });
}
//# sourceMappingURL=zod-utils.js.map