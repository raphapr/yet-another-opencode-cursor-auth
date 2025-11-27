/**
 * macOS seatbelt base policy for workspace read/write operations.
 * This policy is based on Codex's sandbox policy and Chrome's sandbox policy.
 *
 * Sources:
 * - Codex: https://github.com/openai/codex/blob/ac8a3155d64bfb502249be5666dd6c87a190510d/codex-rs/core/src/seatbelt_base_policy.sbpl
 * - Chrome: https://source.chromium.org/chromium/chromium/src/+/main:sandbox/policy/mac/common.sb;l=273-319;drc=7b3962fe2e5fc9e2ee58000dc8fbf3429d84d3bd
 */
const MACOS_SEATBELT_BASE_POLICY = `(version 1)
; start with closed-by-default
(deny default)

; child processes inherit the policy of their parent
(allow process-exec)
(allow process-fork)
(allow signal (target self))

(allow file-write-data
  (require-all
    (path "/dev/null")
    (vnode-type CHARACTER-DEVICE)))

(allow file-write-data
  (require-all
    (path "/dev/tty")
    (vnode-type CHARACTER-DEVICE)))

; allow reading from /dev/null (used for stdin redirection)
(allow file-read-data
  (require-all
    (path "/dev/null")
    (vnode-type CHARACTER-DEVICE)))

; required for directory listing and traversal
(allow file-read-data (literal "/"))

; allow stat and read of all paths
(allow file-read-data (subpath "/"))
(allow file-read-metadata (subpath "/"))

; sysctls permitted.
(allow sysctl-read
  (sysctl-name "hw.activecpu")
  (sysctl-name "hw.busfrequency_compat")
  (sysctl-name "hw.byteorder")
  (sysctl-name "hw.cacheconfig")
  (sysctl-name "hw.cachelinesize_compat")
  (sysctl-name "hw.cpufamily")
  (sysctl-name "hw.cpufrequency_compat")
  (sysctl-name "hw.cputype")
  (sysctl-name "hw.l1dcachesize_compat")
  (sysctl-name "hw.l1icachesize_compat")
  (sysctl-name "hw.l2cachesize_compat")
  (sysctl-name "hw.l3cachesize_compat")
  (sysctl-name "hw.logicalcpu_max")
  (sysctl-name "hw.machine")
  (sysctl-name "hw.ncpu")
  (sysctl-name "hw.nperflevels")
  (sysctl-name "hw.optional.arm.FEAT_BF16")
  (sysctl-name "hw.optional.arm.FEAT_DotProd")
  (sysctl-name "hw.optional.arm.FEAT_FCMA")
  (sysctl-name "hw.optional.arm.FEAT_FHM")
  (sysctl-name "hw.optional.arm.FEAT_FP16")
  (sysctl-name "hw.optional.arm.FEAT_I8MM")
  (sysctl-name "hw.optional.arm.FEAT_JSCVT")
  (sysctl-name "hw.optional.arm.FEAT_LSE")
  (sysctl-name "hw.optional.arm.FEAT_RDM")
  (sysctl-name "hw.optional.arm.FEAT_SHA512")
  (sysctl-name "hw.optional.armv8_2_sha512")
  (sysctl-name "hw.memsize")
  (sysctl-name "hw.pagesize")
  (sysctl-name "hw.packages")
  (sysctl-name "hw.pagesize_compat")
  (sysctl-name "hw.physicalcpu_max")
  (sysctl-name "hw.tbfrequency_compat")
  (sysctl-name "hw.vectorunit")
  (sysctl-name "kern.bootargs")
  (sysctl-name "kern.hostname")
  (sysctl-name "kern.maxfilesperproc")
  (sysctl-name "kern.osproductversion")
  (sysctl-name "kern.osrelease")
  (sysctl-name "kern.ostype")
  (sysctl-name "kern.osvariant_status")
  (sysctl-name "kern.osversion")
  (sysctl-name "kern.secure_kernel")
  (sysctl-name "kern.usrstack64")
  (sysctl-name "kern.version")
  (sysctl-name "security.mac.lockdown_mode_state")
  (sysctl-name "sysctl.proc_cputype")
  (sysctl-name-prefix "hw.perflevel")
)

; Added on top of Chrome profile
; Needed for python multiprocessing on MacOS for the SemLock
(allow ipc-posix-sem)

; needed to look up user info, see https://crbug.com/792228
(allow mach-lookup
  (global-name "com.apple.system.opendirectoryd.libinfo")
)`;
const MACOS_TMP_READWRITE_PATHS = ["/tmp/", "/private/tmp/", "/var/folders/", "/private/var/folders/"];
// Contains denies that must always be added, regardless of user additions.
// Intent is to block WRITE operations only for:
// everything in .vscode/ or .vscode itself
// everything in .cursor/ or .cursor itself
//    EXCEPT .cursor/rules/* and .cursor/commands/* and .cursor/worktrees/*
// any file with .code-workspace extension
// any file called .cursorignore
// .git/config files (security: prevent git config manipulation even when git writes are allowed)
// Note that denies must be at least as specific as the allow that they countermand.
// READ operations are allowed to enable tool discovery and configuration access.
const MACOS_SEATBELT_POLICY_SUFFIX = `
(deny file-write* (regex "^.*/\\.vscode($|/.*)"))
(deny file-write* (require-all
  (regex "^.*/\\.cursor($|/.*)")
  (require-not (regex "^.*/\\.cursor/(rules|commands|worktrees)($|/.*)"))
))
(deny file-write* (regex "^.*\\.code-workspace$"))
(deny file-write* (regex "^.*/\\.cursorignore$"))
(deny file-write* (regex "^.*/\\.git/config$"))
`;
//# sourceMappingURL=policy.js.map