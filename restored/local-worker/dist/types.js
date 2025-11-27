// openFile
const openRequestSchema = lib /* default.object */.Ay.object({
  url: lib /* default.string */.Ay.string()
});
const openResponseSchema = lib /* default.object */.Ay.object({
  success: lib /* default.boolean */.Ay.boolean()
});
// sleep
const sleepRequestSchema = lib /* default.object */.Ay.object({
  duration: lib /* default.number */.Ay.number()
});
const sleepResponseSchema = lib /* default.object */.Ay.object({
  success: lib /* default.boolean */.Ay.boolean()
});
// getDiagnostics
const getDiagnosticsRequestSchema = lib /* default.object */.Ay.object({
  url: lib /* default.string */.Ay.string()
});
const diagnosticSchema = lib /* default.object */.Ay.object({
  severity: lib /* default.union */.Ay.union([lib /* default.literal */.Ay.literal(1), lib /* default.literal */.Ay.literal(2), lib /* default.literal */.Ay.literal(3), lib /* default.literal */.Ay.literal(4)]).optional(),
  message: lib /* default.string */.Ay.string(),
  range: lib /* default.object */.Ay.object({
    start: lib /* default.object */.Ay.object({
      line: lib /* default.number */.Ay.number(),
      character: lib /* default.number */.Ay.number()
    }),
    end: lib /* default.object */.Ay.object({
      line: lib /* default.number */.Ay.number(),
      character: lib /* default.number */.Ay.number()
    })
  }),
  source: lib /* default.string */.Ay.string().optional(),
  code: lib /* default.union */.Ay.union([lib /* default.string */.Ay.string(), lib /* default.number */.Ay.number()]).optional()
});
const getDiagnosticsResponseSchema = lib /* default.object */.Ay.object({
  diagnostics: lib /* default.array */.Ay.array(diagnosticSchema)
});
// getIndexingStatus
const getIndexingStatusRequestSchema = lib /* default.object */.Ay.object({});
const getIndexingStatusResponseSchema = lib /* default.custom */.Ay.custom();
// decryptPath
const decryptPathRequestSchema = lib /* default.object */.Ay.object({
  encryptedPath: lib /* default.string */.Ay.string()
});
const decryptPathResponseSchema = lib /* default.object */.Ay.object({
  url: lib /* default.string */.Ay.string()
});
// getRepositoryInfo
const getRepositoryInfoRequestSchema = lib /* default.object */.Ay.object({});
const getRepositoryInfoResponseSchema = lib /* default.object */.Ay.object({
  relativeWorkspacePath: lib /* default.string */.Ay.string(),
  repoName: lib /* default.string */.Ay.string(),
  repoOwner: lib /* default.string */.Ay.string(),
  isLocal: lib /* default.boolean */.Ay.boolean(),
  numFiles: lib /* default.number */.Ay.number(),
  isTracked: lib /* default.boolean */.Ay.boolean(),
  remoteNames: lib /* default.array */.Ay.array(lib /* default.string */.Ay.string()),
  remoteUrls: lib /* default.array */.Ay.array(lib /* default.string */.Ay.string()),
  workspaceUri: lib /* default.string */.Ay.string(),
  orthogonalTransformSeed: lib /* default.number */.Ay.number(),
  pathEncryptionKey: lib /* default.string */.Ay.string()
});
//# sourceMappingURL=types.js.map