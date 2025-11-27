/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runToolGallery: () => (/* binding */ runToolGallery)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../../node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js");
/* harmony import */ var _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("../agent-kv/dist/index.js");
/* harmony import */ var _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("../cursor-config/dist/index.js");
/* harmony import */ var _anysphere_ink__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("../ink/build/index.js");
/* harmony import */ var _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../local-exec/dist/index.js");
/* harmony import */ var _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("../proto/dist/generated/agent/v1/agent_pb.js");
/* harmony import */ var _anysphere_proto_agent_v1_delete_exec_pb_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("../proto/dist/generated/agent/v1/delete_exec_pb.js");
/* harmony import */ var _anysphere_proto_agent_v1_delete_tool_pb_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("../proto/dist/generated/agent/v1/delete_tool_pb.js");
/* harmony import */ var _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("../proto/dist/generated/agent/v1/edit_tool_pb.js");
/* harmony import */ var _anysphere_proto_agent_v1_grep_exec_pb_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("../proto/dist/generated/agent/v1/grep_exec_pb.js");
/* harmony import */ var _anysphere_proto_agent_v1_grep_tool_pb_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("../proto/dist/generated/agent/v1/grep_tool_pb.js");
/* harmony import */ var _anysphere_proto_agent_v1_read_exec_pb_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("../proto/dist/generated/agent/v1/read_exec_pb.js");
/* harmony import */ var _anysphere_proto_agent_v1_read_tool_pb_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__("../proto/dist/generated/agent/v1/read_tool_pb.js");
/* harmony import */ var _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__("../proto/dist/generated/agent/v1/shell_exec_pb.js");
/* harmony import */ var _anysphere_proto_agent_v1_shell_tool_pb_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__("../proto/dist/generated/agent/v1/shell_tool_pb.js");
/* harmony import */ var _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__("../proto/dist/generated/agent/v1/todo_tool_pb.js");
/* harmony import */ var _components_alt_screen_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__("./src/components/alt-screen.tsx");
/* harmony import */ var _components_delete_tool_ui_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__("./src/components/delete-tool-ui.tsx");
/* harmony import */ var _components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__("./src/components/edit-tool-ui.tsx");
/* harmony import */ var _components_grep_tool_ui_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__("./src/components/grep-tool-ui.tsx");
/* harmony import */ var _components_highlighted_code_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__("./src/components/highlighted-code.tsx");
/* harmony import */ var _components_prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__("./src/components/prompt/decision-dropdown.tsx");
/* harmony import */ var _components_read_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__("./src/components/read-todos-tool-ui.tsx");
/* harmony import */ var _components_read_tool_ui_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__("./src/components/read-tool-ui.tsx");
/* harmony import */ var _components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__("./src/components/shell-tool-ui.tsx");
/* harmony import */ var _components_update_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__("./src/components/update-todos-tool-ui.tsx");
/* harmony import */ var _context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__("./src/context/agent-state-context.tsx");
/* harmony import */ var _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__("./src/context/terminal-state-context.tsx");
/* harmony import */ var _context_theme_context_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__("./src/context/theme-context.tsx");
/* harmony import */ var _context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__("./src/context/vim-mode-context.tsx");
/* harmony import */ var _models_index_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__("./src/models/index.ts");
/* harmony import */ var _pending_decision_store_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__("./src/pending-decision-store.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__, _components_alt_screen_js__WEBPACK_IMPORTED_MODULE_16__, _components_delete_tool_ui_js__WEBPACK_IMPORTED_MODULE_17__, _components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_18__, _components_grep_tool_ui_js__WEBPACK_IMPORTED_MODULE_19__, _components_highlighted_code_js__WEBPACK_IMPORTED_MODULE_20__, _components_prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_21__, _components_read_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_22__, _components_read_tool_ui_js__WEBPACK_IMPORTED_MODULE_23__, _components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_24__, _components_update_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_25__, _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_27__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_28__]);
([_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__, _components_alt_screen_js__WEBPACK_IMPORTED_MODULE_16__, _components_delete_tool_ui_js__WEBPACK_IMPORTED_MODULE_17__, _components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_18__, _components_grep_tool_ui_js__WEBPACK_IMPORTED_MODULE_19__, _components_highlighted_code_js__WEBPACK_IMPORTED_MODULE_20__, _components_prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_21__, _components_read_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_22__, _components_read_tool_ui_js__WEBPACK_IMPORTED_MODULE_23__, _components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_24__, _components_update_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_25__, _context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_27__, _context_theme_context_js__WEBPACK_IMPORTED_MODULE_28__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
































function _wrap(call) {
    return new ToolCall({ tool: call });
}
function shellSuccess() {
    return new _anysphere_proto_agent_v1_shell_tool_pb_js__WEBPACK_IMPORTED_MODULE_14__/* .ShellToolCall */ .$M({
        args: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellArgs */ .a({
            command: "echo Hello World",
            workingDirectory: "/repo",
            timeout: 0,
        }),
        result: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellResult */ .W4({
            result: {
                case: "success",
                value: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellSuccess */ .QR({
                    command: "echo Hello World",
                    workingDirectory: "/repo",
                    exitCode: 0,
                    signal: "",
                    stdout: "Hello World\nLine 2\nLine 3\nLine 4\n",
                    stderr: "",
                    executionTime: 12,
                }),
            },
        }),
    });
}
function shellFailure() {
    return new _anysphere_proto_agent_v1_shell_tool_pb_js__WEBPACK_IMPORTED_MODULE_14__/* .ShellToolCall */ .$M({
        args: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellArgs */ .a({
            command: "grep -r TODO src",
            workingDirectory: "/repo",
            timeout: 0,
        }),
        result: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellResult */ .W4({
            result: {
                case: "failure",
                value: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellFailure */ .xC({
                    command: "grep -r TODO src",
                    workingDirectory: "/repo",
                    exitCode: 2,
                    signal: "",
                    stdout: "",
                    stderr: "grep: src: No such file or directory\n",
                    executionTime: 9,
                }),
            },
        }),
    });
}
function shellLongSuccess() {
    return new _anysphere_proto_agent_v1_shell_tool_pb_js__WEBPACK_IMPORTED_MODULE_14__/* .ShellToolCall */ .$M({
        args: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellArgs */ .a({
            command: "git clone https://github.com/anysphere/everysphere repo && cd repo && bun install && bun run build",
            workingDirectory: "/tmp",
            timeout: 0,
        }),
        result: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellResult */ .W4({
            result: {
                case: "success",
                value: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellSuccess */ .QR({
                    command: "git clone https://github.com/anysphere/everysphere repo && cd repo && bun install && bun run build",
                    workingDirectory: "/tmp",
                    exitCode: 0,
                    signal: "",
                    stdout: [
                        "Cloning into 'repo'...",
                        "remote: Enumerating objects: 12456, done.",
                        "remote: Counting objects: 100% (12456/12456), done.",
                        "remote: Compressing objects: 100% (5123/5123), done.",
                        "Receiving objects: 100% (12456/12456), 12.34 MiB | 9.87 MiB/s, done.",
                        "Resolving deltas: 100% (7890/7890), done.",
                        "",
                        "$ bun install",
                        "✓ 2181 packages installed",
                        "",
                        "$ bun run build",
                        "tsc -p packages/agent-cli/tsconfig.build.json",
                        "tsc -p packages/agent-core/tsconfig.build.json",
                        "tsc -p packages/proto/tsconfig.build.json",
                        "",
                        "Build summary:",
                        " - @anysphere/agent-cli            12.1s",
                        " - @anysphere/agent-core           10.8s",
                        " - @anysphere/proto                3.4s",
                        "",
                        "Done in 27.1s",
                    ].join("\n"),
                    stderr: "",
                    executionTime: 27100,
                }),
            },
        }),
    });
}
function shellGrepMany() {
    const stdoutLines = Array.from({ length: 25 }, (_, i) => `packages/agent-cli/src/tool-gallery.tsx:${100 + i}: createWriteToolCall variant ${i}`);
    return new _anysphere_proto_agent_v1_shell_tool_pb_js__WEBPACK_IMPORTED_MODULE_14__/* .ShellToolCall */ .$M({
        args: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellArgs */ .a({
            command: "rg -n --glob '!node_modules' --color=never 'create.*Tool' packages | head -n 50",
            workingDirectory: "/repo",
            timeout: 0,
        }),
        result: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellResult */ .W4({
            result: {
                case: "success",
                value: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellSuccess */ .QR({
                    command: "rg -n --glob '!node_modules' --color=never 'create.*Tool' packages | head -n 50",
                    workingDirectory: "/repo",
                    exitCode: 0,
                    signal: "",
                    stdout: `${stdoutLines.join("\n")}\n(…truncated)`,
                    stderr: "",
                    executionTime: 87,
                }),
            },
        }),
    });
}
function shellTscFailure() {
    return new _anysphere_proto_agent_v1_shell_tool_pb_js__WEBPACK_IMPORTED_MODULE_14__/* .ShellToolCall */ .$M({
        args: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellArgs */ .a({
            command: "tsc -p tsconfig.json",
            workingDirectory: "/repo/packages/agent-cli",
            timeout: 0,
        }),
        result: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellResult */ .W4({
            result: {
                case: "failure",
                value: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellFailure */ .xC({
                    command: "tsc -p tsconfig.json",
                    workingDirectory: "/repo/packages/agent-cli",
                    exitCode: 2,
                    signal: "",
                    stdout: "",
                    stderr: [
                        "src/components/ShellToolUI.tsx(43,24): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.",
                        "  Type 'undefined' is not assignable to type 'string'.",
                        "src/ui.tsx(210,11): error TS2304: Cannot find name 'useEffect'.",
                        "src/ui.tsx(311,7): error TS2322: Type 'number' is not assignable to type 'ToolStatus'.",
                        "src/tool-gallery.tsx(151,19): error TS6133: 'grepError' is declared but its value is never read.",
                        "Found 4 errors in 3 files.",
                    ].join("\n"),
                    executionTime: 412,
                }),
            },
        }),
    });
}
function shellCmdNotFound() {
    return new _anysphere_proto_agent_v1_shell_tool_pb_js__WEBPACK_IMPORTED_MODULE_14__/* .ShellToolCall */ .$M({
        args: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellArgs */ .a({
            command: "foobarbaz --help",
            workingDirectory: "/repo",
            timeout: 0,
        }),
        result: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellResult */ .W4({
            result: {
                case: "failure",
                value: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellFailure */ .xC({
                    command: "foobarbaz --help",
                    workingDirectory: "/repo",
                    exitCode: 127,
                    signal: "",
                    stdout: "",
                    stderr: "zsh: command not found: foobarbaz\n",
                    executionTime: 5,
                }),
            },
        }),
    });
}
function shellTimeout() {
    return new _anysphere_proto_agent_v1_shell_tool_pb_js__WEBPACK_IMPORTED_MODULE_14__/* .ShellToolCall */ .$M({
        args: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellArgs */ .a({
            command: "npm test",
            workingDirectory: "/repo",
            timeout: 30000,
        }),
        result: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellResult */ .W4({
            result: {
                case: "failure",
                value: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellFailure */ .xC({
                    command: "npm test",
                    workingDirectory: "/repo",
                    exitCode: 124,
                    signal: "SIGTERM",
                    stdout: "",
                    stderr: "Command timed out after 30000ms\n",
                    executionTime: 30000,
                }),
            },
        }),
    });
}
function shellPending() {
    return new _anysphere_proto_agent_v1_shell_tool_pb_js__WEBPACK_IMPORTED_MODULE_14__/* .ShellToolCall */ .$M({
        args: new _anysphere_proto_agent_v1_shell_exec_pb_js__WEBPACK_IMPORTED_MODULE_13__/* .ShellArgs */ .a({
            command: "rm -rf /tmp/build && mkdir -p /tmp/build && make -j8",
            workingDirectory: "/repo",
            timeout: 0,
        }),
    });
}
function grepSuccess() {
    return new _anysphere_proto_agent_v1_grep_tool_pb_js__WEBPACK_IMPORTED_MODULE_10__/* .GrepToolCall */ .j({
        args: new _anysphere_proto_agent_v1_grep_exec_pb_js__WEBPACK_IMPORTED_MODULE_9__/* .GrepArgs */ .Qj({
            pattern: "createWriteTool",
            path: "/repo/packages",
        }),
        result: new _anysphere_proto_agent_v1_grep_exec_pb_js__WEBPACK_IMPORTED_MODULE_9__/* .GrepResult */ .Ud({
            result: {
                case: "success",
                value: new _anysphere_proto_agent_v1_grep_exec_pb_js__WEBPACK_IMPORTED_MODULE_9__/* .GrepSuccess */ ._0({
                    pattern: "createWriteTool",
                    path: "/repo/packages",
                    outputMode: "content",
                    workspaceResults: {
                        "/repo/packages": new _anysphere_proto_agent_v1_grep_exec_pb_js__WEBPACK_IMPORTED_MODULE_9__/* .GrepUnionResult */ .vD({
                            result: {
                                case: "content",
                                value: new _anysphere_proto_agent_v1_grep_exec_pb_js__WEBPACK_IMPORTED_MODULE_9__/* .GrepContentResult */ .Zp({
                                    matches: [],
                                    totalMatchedLines: 8,
                                    ripgrepTruncated: false,
                                    clientTruncated: false,
                                }),
                            },
                        }),
                    },
                }),
            },
        }),
    });
}
function grepPending() {
    return new _anysphere_proto_agent_v1_grep_tool_pb_js__WEBPACK_IMPORTED_MODULE_10__/* .GrepToolCall */ .j({
        args: new _anysphere_proto_agent_v1_grep_exec_pb_js__WEBPACK_IMPORTED_MODULE_9__/* .GrepArgs */ .Qj({ pattern: "TODO", path: "/repo" }),
    });
}
function grepError() {
    return new _anysphere_proto_agent_v1_grep_tool_pb_js__WEBPACK_IMPORTED_MODULE_10__/* .GrepToolCall */ .j({
        args: new _anysphere_proto_agent_v1_grep_exec_pb_js__WEBPACK_IMPORTED_MODULE_9__/* .GrepArgs */ .Qj({ pattern: "(", path: "/repo" }),
        result: new _anysphere_proto_agent_v1_grep_exec_pb_js__WEBPACK_IMPORTED_MODULE_9__/* .GrepResult */ .Ud({
            result: {
                case: "error",
                value: new _anysphere_proto_agent_v1_grep_exec_pb_js__WEBPACK_IMPORTED_MODULE_9__/* .GrepError */ .ts({
                    error: "invalid regex",
                }),
            },
        }),
    });
}
// function globSuccess(): GlobToolCall {
//   return new GlobToolCall({
//     args: new GlobArgs({ pattern: "**/*.ts", path: "/repo" }),
//     result: new GlobResult({
//       result: {
//         case: "success",
//         value: new GlobSuccess({
//           pattern: "**/*.ts",
//           path: "/repo",
//           files: ["a.ts", "b.ts"],
//           totalFiles: 2,
//           truncated: false,
//         }),
//       },
//     }),
//   });
// }
// function globRejected(): GlobToolCall {
//   return new GlobToolCall({
//     args: new GlobArgs({ pattern: "**/*.ts", path: "/restricted" }),
//     result: new GlobResult({
//       result: {
//         case: "rejected",
//         value: new GlobRejected({
//           pattern: "**/*.ts",
//           path: "/restricted",
//           reason: "sandbox",
//         }),
//       },
//     }),
//   });
// }
function readPending() {
    return new _anysphere_proto_agent_v1_read_tool_pb_js__WEBPACK_IMPORTED_MODULE_12__/* .ReadToolCall */ .D8({ args: new _anysphere_proto_agent_v1_read_exec_pb_js__WEBPACK_IMPORTED_MODULE_11__/* .ReadArgs */ .a2({ path: "/repo/README.md" }) });
}
function readError() {
    return new _anysphere_proto_agent_v1_read_tool_pb_js__WEBPACK_IMPORTED_MODULE_12__/* .ReadToolCall */ .D8({
        args: new _anysphere_proto_agent_v1_read_exec_pb_js__WEBPACK_IMPORTED_MODULE_11__/* .ReadArgs */ .a2({ path: "/repo/MISSING.md" }),
        result: new _anysphere_proto_agent_v1_read_tool_pb_js__WEBPACK_IMPORTED_MODULE_12__/* .ReadToolResult */ .uX({
            result: { case: "error", value: { errorMessage: "ENOENT" } },
        }),
    });
}
function deleteSuccess() {
    return new _anysphere_proto_agent_v1_delete_tool_pb_js__WEBPACK_IMPORTED_MODULE_7__/* .DeleteToolCall */ .Y({
        args: new _anysphere_proto_agent_v1_delete_exec_pb_js__WEBPACK_IMPORTED_MODULE_6__/* .DeleteArgs */ .dn({ path: "/repo/old.ts" }),
        result: new _anysphere_proto_agent_v1_delete_exec_pb_js__WEBPACK_IMPORTED_MODULE_6__/* .DeleteResult */ .Pi({
            result: {
                case: "success",
                value: new _anysphere_proto_agent_v1_delete_exec_pb_js__WEBPACK_IMPORTED_MODULE_6__/* .DeleteSuccess */ .fl({
                    path: "/repo/old.ts",
                    deletedFile: "old.ts",
                    fileSize: BigInt(1024),
                }),
            },
        }),
    });
}
function deleteNotFound() {
    return new _anysphere_proto_agent_v1_delete_tool_pb_js__WEBPACK_IMPORTED_MODULE_7__/* .DeleteToolCall */ .Y({
        args: new _anysphere_proto_agent_v1_delete_exec_pb_js__WEBPACK_IMPORTED_MODULE_6__/* .DeleteArgs */ .dn({ path: "/repo/missing.ts" }),
        result: new _anysphere_proto_agent_v1_delete_exec_pb_js__WEBPACK_IMPORTED_MODULE_6__/* .DeleteResult */ .Pi({
            result: {
                case: "fileNotFound",
                value: new _anysphere_proto_agent_v1_delete_exec_pb_js__WEBPACK_IMPORTED_MODULE_6__/* .DeleteFileNotFound */ .n0({ path: "/repo/missing.ts" }),
            },
        }),
    });
}
function editSuccess() {
    return new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditToolCall */ .T6({
        args: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditArgs */ .g$({
            path: "/repo/file.ts",
        }),
        result: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditResult */ .Kc({
            result: {
                case: "success",
                value: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditSuccess */ .SG({
                    path: "/repo/file.ts",
                    linesAdded: 2,
                    linesRemoved: 1,
                }),
            },
        }),
    });
}
function editSuccessAddsOnly() {
    return new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditToolCall */ .T6({
        args: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditArgs */ .g$({
            path: "/repo/new_feature.ts",
        }),
        result: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditResult */ .Kc({
            result: {
                case: "success",
                value: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditSuccess */ .SG({
                    path: "/repo/new_feature.ts",
                    linesAdded: 5,
                    linesRemoved: 0,
                }),
            },
        }),
    });
}
function editSuccessRemovesOnly() {
    return new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditToolCall */ .T6({
        args: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditArgs */ .g$({
            path: "/repo/cleanup.ts",
        }),
        result: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditResult */ .Kc({
            result: {
                case: "success",
                value: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditSuccess */ .SG({
                    path: "/repo/cleanup.ts",
                    linesRemoved: 3,
                    linesAdded: 0,
                }),
            },
        }),
    });
}
function editPending() {
    return new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditToolCall */ .T6({
        args: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditArgs */ .g$({
            path: "/repo/pending.ts",
        }),
    });
}
function editFileMissing() {
    return new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditToolCall */ .T6({
        args: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditArgs */ .g$({
            path: "/repo/missing.ts",
        }),
        result: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditResult */ .Kc({
            result: {
                case: "fileNotFound",
                value: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditFileNotFound */ .kF({ path: "/repo/missing.ts" }),
            },
        }),
    });
}
function editReadDenied() {
    return new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditToolCall */ .T6({
        args: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditArgs */ .g$({
            path: "/root/secret.ts",
        }),
        result: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditResult */ .Kc({
            result: {
                case: "readPermissionDenied",
                value: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditReadPermissionDenied */ .nF({ path: "/root/secret.ts" }),
            },
        }),
    });
}
function editWriteDenied() {
    return new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditToolCall */ .T6({
        args: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditArgs */ .g$({
            path: "/root/secret.ts",
        }),
        result: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditResult */ .Kc({
            result: {
                case: "writePermissionDenied",
                value: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditWritePermissionDenied */ .uK({ path: "/root/secret.ts" }),
            },
        }),
    });
}
function editRejectedByUser() {
    return new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditToolCall */ .T6({
        args: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditArgs */ .g$({
            path: "/repo/file.ts",
        }),
        result: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditResult */ .Kc({
            result: {
                case: "rejected",
                value: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditRejected */ .pl({
                    path: "/repo/file.ts",
                    reason: "user cancelled",
                }),
            },
        }),
    });
}
function editErrored() {
    return new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditToolCall */ .T6({
        args: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditArgs */ .g$({
            path: "/repo/file.ts",
        }),
        result: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditResult */ .Kc({
            result: {
                case: "error",
                value: new _anysphere_proto_agent_v1_edit_tool_pb_js__WEBPACK_IMPORTED_MODULE_8__/* .EditError */ .F({
                    path: "/repo/file.ts",
                    error: "EIO",
                }),
            },
        }),
    });
}
function readTodosSuccess() {
    const todo = new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoItem */ .kW({
        id: "t1",
        content: "Implement gallery",
        status: _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.IN_PROGRESS,
        createdAt: BigInt(Date.now()),
        updatedAt: BigInt(Date.now()),
    });
    return new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .ReadTodosToolCall */ .AJ({
        args: new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .ReadTodosArgs */ .n_({}),
        result: new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .ReadTodosResult */ .Py({
            result: {
                case: "success",
                value: new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .ReadTodosSuccess */ .Pf({ todos: [todo], totalCount: 1 }),
            },
        }),
    });
}
function deletePending() {
    return new _anysphere_proto_agent_v1_delete_tool_pb_js__WEBPACK_IMPORTED_MODULE_7__/* .DeleteToolCall */ .Y({
        args: new _anysphere_proto_agent_v1_delete_exec_pb_js__WEBPACK_IMPORTED_MODULE_6__/* .DeleteArgs */ .dn({ path: "/repo/pending_delete.ts" }),
    });
}
function readTodosLongSuccess() {
    const now = Date.now();
    const mk = (id, content, status, deps = []) => new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoItem */ .kW({
        id,
        content,
        status,
        createdAt: BigInt(now - 1000 * 60 * 60),
        updatedAt: BigInt(now),
        dependencies: deps,
    });
    const todos = [
        mk("T-001", "Set up repository structure", _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.COMPLETED),
        mk("T-002", "Implement core agent UI", _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.IN_PROGRESS, ["T-001"]),
        mk("T-003", "Wire debug logging", _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.PENDING, ["T-001"]),
        mk("T-004", "Add Read/Search collapsed header", _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.COMPLETED, [
            "T-002",
        ]),
        mk("T-005", "Add long TODO list examples", _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.IN_PROGRESS, [
            "T-004",
        ]),
        mk("T-006", "Polish header typography", _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.PENDING),
        mk("T-007", "Document CLI flags", _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.COMPLETED),
        mk("T-008", "Ship", _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.CANCELLED),
    ];
    return new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .ReadTodosToolCall */ .AJ({
        args: new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .ReadTodosArgs */ .n_({
            statusFilter: [_anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.PENDING, _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.IN_PROGRESS],
        }),
        result: new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .ReadTodosResult */ .Py({
            result: {
                case: "success",
                value: new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .ReadTodosSuccess */ .Pf({ todos, totalCount: 25 }),
            },
        }),
    });
}
function updateTodosSuccess() {
    const todo = new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoItem */ .kW({
        id: "t2",
        content: "Ship",
        status: _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.PENDING,
        createdAt: BigInt(Date.now()),
        updatedAt: BigInt(Date.now()),
    });
    return new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .UpdateTodosToolCall */ .bk({
        args: new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .UpdateTodosArgs */ .wb({ todos: [todo], merge: true }),
        result: new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .UpdateTodosResult */ .w9({
            result: {
                case: "success",
                value: new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .UpdateTodosSuccess */ .q8({ todos: [todo], totalCount: 1 }),
            },
        }),
    });
}
function updateTodosLongSuccess() {
    const now = Date.now();
    const mk = (id, content, status, deps = []) => new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoItem */ .kW({
        id,
        content,
        status,
        createdAt: BigInt(now - 1000 * 60 * 120),
        updatedAt: BigInt(now),
        dependencies: deps,
    });
    const todos = [
        mk("U-101", "Mark core UI completed", _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.COMPLETED, ["T-002"]),
        mk("U-102", "Advance long TODOs", _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.IN_PROGRESS, ["T-005"]),
        mk("U-103", "Cancel experimental path", _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.CANCELLED),
        mk("U-104", "Queue polish step", _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .TodoStatus */ .Vj.PENDING, ["T-006"]),
    ];
    return new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .UpdateTodosToolCall */ .bk({
        args: new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .UpdateTodosArgs */ .wb({ todos, merge: true }),
        result: new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .UpdateTodosResult */ .w9({
            result: {
                case: "success",
                value: new _anysphere_proto_agent_v1_todo_tool_pb_js__WEBPACK_IMPORTED_MODULE_15__/* .UpdateTodosSuccess */ .q8({ todos, totalCount: todos.length }),
            },
        }),
    });
}
const GalleryInner = () => {
    const sampleDiffTs = [
        "- export function add(a: number, b: number) {",
        "+ export function sum(a: number, b: number) {",
        "  const total = a + b;",
        "-   return add, /* bug */ total;",
        "+   console.log('sum', total);",
        "  return total;",
        "}",
    ].join("\n");
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Box */ .az, { flexDirection: "column", gap: 1, paddingX: 1, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Text */ .EY, { bold: true, children: "Tool Gallery" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_24__/* .ShellToolUI */ .f, { tool: shellSuccess() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_24__/* .ShellToolUI */ .f, { tool: shellLongSuccess() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_24__/* .ShellToolUI */ .f, { tool: shellGrepMany() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_24__/* .ShellToolUI */ .f, { tool: shellFailure() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_24__/* .ShellToolUI */ .f, { tool: shellTscFailure() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_24__/* .ShellToolUI */ .f, { tool: shellCmdNotFound() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_24__/* .ShellToolUI */ .f, { tool: shellTimeout() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_shell_tool_ui_js__WEBPACK_IMPORTED_MODULE_24__/* .ShellToolUI */ .f, { tool: shellPending() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_grep_tool_ui_js__WEBPACK_IMPORTED_MODULE_19__/* .GrepToolUI */ .h, { tool: grepSuccess() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_grep_tool_ui_js__WEBPACK_IMPORTED_MODULE_19__/* .GrepToolUI */ .h, { tool: grepPending() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_grep_tool_ui_js__WEBPACK_IMPORTED_MODULE_19__/* .GrepToolUI */ .h, { tool: grepError() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_read_tool_ui_js__WEBPACK_IMPORTED_MODULE_23__/* .ReadToolUI */ .B, { tool: readPending() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_read_tool_ui_js__WEBPACK_IMPORTED_MODULE_23__/* .ReadToolUI */ .B, { tool: readError() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_delete_tool_ui_js__WEBPACK_IMPORTED_MODULE_17__/* .DeleteToolUI */ .Y, { tool: deletePending() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_delete_tool_ui_js__WEBPACK_IMPORTED_MODULE_17__/* .DeleteToolUI */ .Y, { tool: deleteSuccess() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_delete_tool_ui_js__WEBPACK_IMPORTED_MODULE_17__/* .DeleteToolUI */ .Y, { tool: deleteNotFound() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_18__/* .EditToolUI */ .N, { tool: editPending() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_18__/* .EditToolUI */ .N, { tool: editSuccess() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_18__/* .EditToolUI */ .N, { tool: editSuccessAddsOnly() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_18__/* .EditToolUI */ .N, { tool: editSuccessRemovesOnly() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_18__/* .EditToolUI */ .N, { tool: editFileMissing() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_18__/* .EditToolUI */ .N, { tool: editReadDenied() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_18__/* .EditToolUI */ .N, { tool: editWriteDenied() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_18__/* .EditToolUI */ .N, { tool: editRejectedByUser() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_edit_tool_ui_js__WEBPACK_IMPORTED_MODULE_18__/* .EditToolUI */ .N, { tool: editErrored() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_read_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_22__/* .ReadTodosToolUI */ .w, { tool: readTodosSuccess() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_read_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_22__/* .ReadTodosToolUI */ .w, { tool: readTodosLongSuccess() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_update_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_25__/* .UpdateTodosToolUI */ .v, { tool: updateTodosSuccess() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_update_todos_tool_ui_js__WEBPACK_IMPORTED_MODULE_25__/* .UpdateTodosToolUI */ .v, { tool: updateTodosLongSuccess() }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Box */ .az, { marginTop: 1, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Text */ .EY, { bold: true, children: "Diff Code Block" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_highlighted_code_js__WEBPACK_IMPORTED_MODULE_20__/* .HighlightedCode */ .d, { content: sampleDiffTs, language: "typescript", isDiff: true, showLineNumbers: true }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Box */ .az, { marginTop: 1, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .Text */ .EY, { bold: true, children: "Decision Dropdowns" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_21__/* ["default"] */ .A, { title: "Select an action", highlightColor: "cyan", options: [
                    { label: "Continue" },
                    { label: "Retry" },
                    { label: "Cancel" },
                ], selectedIndex: 0 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_21__/* ["default"] */ .A, { title: "Choose deployment target", highlightColor: "green", options: [
                    { label: "Production", hint: "Live environment" },
                    { label: "Staging", hint: "Testing environment" },
                    { label: "Development", hint: "Local environment" },
                ], selectedIndex: 1 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_21__/* ["default"] */ .A, { title: "File operations", highlightColor: "yellow", options: [
                    { label: "Open file" },
                    { label: "Save file", disabled: true },
                    { label: "Delete file", disabled: true },
                    { label: "Rename file" },
                ], selectedIndex: 3 }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_prompt_decision_dropdown_js__WEBPACK_IMPORTED_MODULE_21__/* ["default"] */ .A, { title: "Select features to enable", highlightColor: "magenta", options: [
                    { label: "Auto-save", hint: "Save files automatically" },
                    { label: "Syntax highlighting", hint: "Color code syntax" },
                    { label: "Line numbers", hint: "Show line numbers" },
                    { label: "Minimap", hint: "Show code overview", disabled: true },
                    { label: "Word wrap", hint: "Wrap long lines" },
                ], selectedIndex: 2 })] }));
};
const GalleryApp = () => {
    const dummyModel = new _anysphere_proto_agent_v1_agent_pb_js__WEBPACK_IMPORTED_MODULE_5__/* .ModelDetails */ .Gm({
        modelId: "gpt-5",
        displayModelId: "gpt-5",
        displayName: "GPT-5 (Gallery)",
    });
    const modelManager = _models_index_js__WEBPACK_IMPORTED_MODULE_30__/* .ModelManager */ .P3.createForTesting();
    modelManager.setCurrentModelWithoutPersistence(dummyModel);
    // Ensure required agent metadata exists to avoid missing-key errors
    const initialAgentStore = new _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_1__/* .AgentStore */ .pH(new _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_1__/* .InMemoryBlobStore */ .ve(), new _anysphere_agent_kv__WEBPACK_IMPORTED_MODULE_1__/* .InMemoryTypedStore */ .We());
    initialAgentStore.setMetadata("mode", "default");
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_vim_mode_context_js__WEBPACK_IMPORTED_MODULE_29__/* .VimModeProvider */ .l, { configProvider: new _anysphere_cursor_config__WEBPACK_IMPORTED_MODULE_2__/* .DefaultConfigProvider */ .LV(), children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_terminal_state_context_js__WEBPACK_IMPORTED_MODULE_27__/* .TerminalStateProvider */ .rs, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_theme_context_js__WEBPACK_IMPORTED_MODULE_28__/* .ThemeProvider */ .NP, { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_context_agent_state_context_js__WEBPACK_IMPORTED_MODULE_26__/* .AgentStateProvider */ .oG, { fileChangeTracker: new _anysphere_local_exec__WEBPACK_IMPORTED_MODULE_4__.FileChangeTracker(process.cwd()), pendingDecisionStore: new _pending_decision_store_js__WEBPACK_IMPORTED_MODULE_31__/* .PendingDecisionStore */ .$(), initialViewMode: "chat", initialAgentStore: initialAgentStore, modelManager: modelManager, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_alt_screen_js__WEBPACK_IMPORTED_MODULE_16__/* .AltScreen */ .I, { clearOnMount: true, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(GalleryInner, {}) }) }) }) }) }));
};
function runToolGallery() {
    return __awaiter(this, void 0, void 0, function* () {
        const { waitUntilExit } = (0,_anysphere_ink__WEBPACK_IMPORTED_MODULE_3__/* .render */ .XX)((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(GalleryApp, {}), { exitOnCtrlC: true });
        yield waitUntilExit();
    });
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;