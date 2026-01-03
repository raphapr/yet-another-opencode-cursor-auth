# Authentication

This repo implements authentication for an OpenCode plugin that talks to Cursor services.

To keep the public repository low-risk, this document focuses on **how to use the plugin** and **how credentials are handled**, and intentionally avoids publishing deep protocol recipes or derived proprietary implementation details.

## Supported auth methods

### 1) Browser-based login (recommended)
- Initiates an interactive login flow in your browser and polls locally for completion.
- On success, you get an access token + refresh token that the plugin can reuse.

Quick demo:

```bash
bun run demo:login
bun run demo:status
bun run demo:logout
```

### 2) API key (optional)
- If you already have a Cursor API key, the plugin can exchange it for access/refresh credentials.
- Useful for non-interactive setups.

### 3) Provide an access token
- You can provide an access token via environment variables for local testing.

## Credential storage

Credentials are stored locally using this project’s storage layer (see `src/lib/storage.ts` and the OpenCode plugin integration in `src/plugin/plugin.ts`).

Guidance:
- Never commit tokens, cookies, or credential exports to git.
- Prefer environment variables for ephemeral testing.

## Troubleshooting

- If requests start failing unexpectedly, re-run `bun run demo:login` to refresh credentials.
- If you suspect stale credentials, run `bun run demo:logout` and log in again.
