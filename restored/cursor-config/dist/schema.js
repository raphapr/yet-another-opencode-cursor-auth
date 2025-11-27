const ModelDetailsProtoSchema = lib.z.any().transform((val, ctx) => {
  if (val instanceof agent_pb /* ModelDetails */.Gm) return val;
  try {
    return agent_pb /* ModelDetails */.Gm.fromJson(val, {
      ignoreUnknownFields: false
    });
  } catch (e) {
    ctx.addIssue({
      code: lib.z.ZodIssueCode.custom,
      message: e instanceof Error ? e.message : String(e)
    });
    return val;
  }
});
const BaseConfigSchema = lib.z.object({
  permissions: lib.z.object({
    allow: lib.z.array(lib.z.string()),
    deny: lib.z.array(lib.z.string())
  })
});
const SystemConfigSchema = BaseConfigSchema.extend({
  version: lib.z.number(),
  editor: lib.z.object({
    vimMode: lib.z.boolean(),
    defaultBehavior: lib.z.enum(["ide", "agent"]).optional()
  }),
  display: lib.z.object({
    showLineNumbers: lib.z.boolean().default(true)
  }).optional(),
  channel: lib.z.literal("static").or(lib.z.literal("prod")).or(lib.z.literal("lab")).or(lib.z.literal("staging"))
  // prod-stable-internal is an internal alias for prod to avoid auto-update of devs to staging channel
  .or(lib.z.literal("prod-stable-internal")).optional(),
  model: ModelDetailsProtoSchema.optional(),
  hasChangedDefaultModel: lib.z.boolean().default(false).optional(),
  // Local, best-effort cache for privacy mode derived headering
  privacyCache: lib.z.object({
    ghostMode: lib.z.boolean(),
    privacyMode: lib.z.number().optional(),
    updatedAt: lib.z.number()
  }).optional(),
  // Network configuration
  network: lib.z.object({
    // Use HTTP/1.1 for agent connections (enables SSE-based bidirectional streaming)
    useHttp1ForAgent: lib.z.boolean().default(false)
  }).default({
    useHttp1ForAgent: false
  }),
  approvalMode: lib.z.enum(["allowlist", "unrestricted"]).default("allowlist").optional(),
  sandbox: lib.z.object({
    mode: lib.z.enum(["disabled", "enabled"]).default("disabled"),
    networkAccess: lib.z.enum(["allowlist", "enabled"]).optional(),
    networkAllowlist: lib.z.array(lib.z.string()).default([]).optional()
  }).optional(),
  showSandboxIntro: lib.z.boolean().default(false).optional()
});
const ProjectConfigSchema = BaseConfigSchema.strict().extend({});
const CursorConfigSchema = SystemConfigSchema.merge(ProjectConfigSchema);