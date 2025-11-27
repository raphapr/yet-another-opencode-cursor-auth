const bashScript = `#!/usr/bin/env bash

# Usage:
#   source dump_bash_state.bash
#   dump_bash_state OUTPUT_FILE
# Or execute directly (captures a subshell's state):
#   ./dump_bash_state.bash OUTPUT_FILE

dump_bash_state() {
  set -euo pipefail

  # Require base64 for safe encoding of emitted sections
  if ! command -v base64 >/dev/null 2>&1; then
    echo "Error: base64 command is required" >&2
    return 1
  fi

  # Helper to log timing, only if DUMP_BASH_STATE_TIMING is set
  if [[ -n "\${DUMP_BASH_STATE_TIMING:-}" ]]; then
    # Timing setup
    if [[ "\${BASH_VERSION%%.*}" -ge 5 ]]; then
      # Use EPOCHREALTIME if available (bash 5+)
      local start_time=\${EPOCHREALTIME}
      local step_start=\${EPOCHREALTIME}
      _log_timing() {
        local step_name="$1"
        local now=\${EPOCHREALTIME}
        local step_duration=$(command awk "BEGIN {printf "%.3f", $now - $step_start}")
        local total_duration=$(command awk "BEGIN {printf "%.3f", $now - $start_time}")
        builtin printf "[TIMING] %-20s: %6.3fs (total: %6.3fs)\n" "$step_name" "$step_duration" "$total_duration" >&2
        step_start=$now
      }
    else
      # Fallback for older bash versions
      local start_time=$(command date +%s.%N)
      local step_start=$(command date +%s.%N)
      _log_timing() {
        local step_name="$1"
        local now=$(command date +%s.%N)
        local step_duration=$(command awk "BEGIN {printf "%.3f", $now - $step_start}")
        local total_duration=$(command awk "BEGIN {printf "%.3f", $now - $start_time}")
        builtin printf "[TIMING] %-20s: %6.3fs (total: %6.3fs)\n" "$step_name" "$step_duration" "$total_duration" >&2
        step_start=$now
      }
    fi
  else
    _log_timing() { :; }
  fi

  # Helper to append a line to output file
  _emit() {
    builtin printf '%s\n' "$1"
  }

  # Helper to safely encode and emit unsafe values
  _emit_encoded() {
    local content="$1"
    local var_name="$2"
    if [[ -n "$content" ]]; then
      builtin printf 'cursor_snap_%s=$(command base64 -d <<'''CURSOR_SNAP_EOF_%s'''\n' "$var_name" "$var_name"
      command base64 <<<"$content" | command tr -d '\n'
      builtin printf '\nCURSOR_SNAP_EOF_%s\n' "$var_name"
      builtin printf ')\n'
      builtin printf 'eval "$cursor_snap_%s"\n' "$var_name"
    fi
  }

  # Start fresh
  _log_timing "file_init"

  # Working directory
  _emit "$PWD"
  _log_timing "working_dir"

  # Environment variables (export statements)
  local env_vars
  env_vars=$(builtin export -p 2>/dev/null || true)
  _emit_encoded "$env_vars" "ENV_VARS_B64"
  _log_timing "environment"

  # POSIX shell options (replayable as set +/-o lines; exclude nounset which we enable locally)
  local posix_opts
  posix_opts=$(builtin shopt -po 2>/dev/null | command grep -v '^set -o nounset$' | command grep -v '^set +o nounset$' || true)
  _emit_encoded "$posix_opts" "POSIX_OPTS_B64"
  _log_timing "posix_options"

  # Bash shopt options (replayable as shopt -s/-u lines)
  local bash_opts
  bash_opts=$(builtin shopt -p 2>/dev/null || true)
  _emit_encoded "$bash_opts" "BASH_OPTS_B64"
  _log_timing "bash_options"

  # Functions: capture all functions
  local all_functions
  all_functions=$(builtin declare -f 2>/dev/null || true)
  _emit_encoded "$all_functions" "FUNCTIONS_B64"
  _log_timing "functions"

  # Aliases
  local aliases
  aliases=$(builtin alias -p 2>/dev/null || true)
  _emit_encoded "$aliases" "ALIASES_B64"
  _log_timing "aliases"


  # Done
  _log_timing "finalize"
}
`;
/* harmony default export */
const dump_bash_state = bashScript;
//# sourceMappingURL=dump_bash_state.js.map