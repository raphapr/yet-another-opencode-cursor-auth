# Cursor Service Compatibility Notes

This repository contains an OpenCode plugin and a compatibility layer that can talk to Cursor services.

To keep the public repository lower-risk, this document is intentionally **high-level**:
- It explains the architectural choices in this codebase.
- It avoids publishing step-by-step protocol recipes, internal header requirements, or instructions for imitating proprietary clients.

## High-level architecture

- The integration uses standard HTTP networking and a structured RPC layer (Connect-RPC + Protocol Buffers) where applicable.
- Requests are made through the project’s API client implementation under `src/lib/api/`.
- Authentication is handled by the auth helpers under `src/lib/auth/`.

## Configuration

- Service endpoints are configurable via environment variables (see code for exact names and defaults).
- Logging can be enabled for troubleshooting via environment flags documented in `README.md`.

## Where to look in code

- `src/lib/api/` — request/response handling, streaming, model discovery
- `src/lib/auth/` — login + token refresh
- `src/lib/openai-compat/` — OpenAI-compatible request/response shaping (if enabled)

## Notes

If you need deep protocol-level notes for personal research, keep them in a private repo or private notes, and avoid redistributing derived proprietary details.
