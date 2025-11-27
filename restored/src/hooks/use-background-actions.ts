/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */V: () => (/* binding */useBackgroundActions)
  /* harmony export */
});
/* harmony import */
var node_child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:child_process");
/* harmony import */
var node_child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_child_process__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */
var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:fs");
/* harmony import */
var node_fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */
var node_os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:os");
/* harmony import */
var node_os__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("node:path");
/* harmony import */
var node_path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */
var _utils_git_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/utils/git.ts");
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
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
function printLines(print, lines) {
  try {
    print === null || print === void 0 ? void 0 : print(lines);
  } catch (_a) {
    // ignore UI failures
  }
}
function runGit(args, cwd) {
  const out = (0, node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFileSync)("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 2 * 1024 * 1024
  });
  return out.trim();
}
function tryRunGit(args, cwd) {
  try {
    return runGit(args, cwd);
  } catch (_a) {
    return undefined;
  }
}
function getCurrentBranch(cwd) {
  return tryRunGit(["rev-parse", "--abbrev-ref", "HEAD"], cwd);
}
function ensureFetch(cwd, branch) {
  if (branch) {
    tryRunGit(["fetch", "--prune", "--tags", "origin", branch], cwd);
  } else {
    tryRunGit(["fetch", "--all", "--prune", "--tags"], cwd);
  }
}
function checkoutAndPull(cwd, branch) {
  const hasLocal = tryRunGit(["show-ref", "--verify", `refs/heads/${branch}`], cwd) !== undefined;
  if (!hasLocal) {
    // Create local branch tracking origin/branch if it exists; otherwise just checkout a new branch
    const hasRemote = tryRunGit(["ls-remote", "--exit-code", "--heads", "origin", branch], cwd) !== undefined;
    if (hasRemote) {
      runGit(["checkout", "-b", branch, "--track", `origin/${branch}`], cwd);
    } else {
      runGit(["checkout", "-b", branch], cwd);
    }
  } else {
    runGit(["checkout", branch], cwd);
  }
  // Fast-forward if possible
  tryRunGit(["pull", "--ff-only"], cwd);
}
function stripWorkspacePrefix(pathOrUri) {
  const prefixes = ["/workspace/", "file:///workspace/"];
  for (const prefix of prefixes) {
    if (pathOrUri.startsWith(prefix)) {
      const rel = pathOrUri.slice(prefix.length);
      return rel.startsWith("/") ? rel.slice(1) : rel;
    }
  }
  return pathOrUri;
}
function safeWriteFile(absPath, contents) {
  (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.mkdirSync)((0, node_path__WEBPACK_IMPORTED_MODULE_3__.dirname)(absPath), {
    recursive: true
  });
  (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.writeFileSync)(absPath, contents, "utf8");
}
function detectEol(text) {
  const crlf = (text.match(/\r\n/g) || []).length;
  const lf = (text.match(/(?<!\r)\n/g) || []).length;
  return crlf > lf ? "\r\n" : "\n";
}
function mergeThreeWay(original, target, current) {
  const tmpRoot = (0, node_path__WEBPACK_IMPORTED_MODULE_3__.join)(node_os__WEBPACK_IMPORTED_MODULE_2___default().tmpdir(), `bg-merge-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.mkdirSync)(tmpRoot, {
    recursive: true
  });
  const basePath = (0, node_path__WEBPACK_IMPORTED_MODULE_3__.join)(tmpRoot, "base.txt");
  const oursPath = (0, node_path__WEBPACK_IMPORTED_MODULE_3__.join)(tmpRoot, "ours.txt");
  const theirsPath = (0, node_path__WEBPACK_IMPORTED_MODULE_3__.join)(tmpRoot, "theirs.txt");
  // Normalize inputs to LF for git merge-file stability
  const normalize = s => s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.writeFileSync)(basePath, normalize(original), "utf8");
  (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.writeFileSync)(oursPath, normalize(current), "utf8");
  (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.writeFileSync)(theirsPath, normalize(target), "utf8");
  const args = ["merge-file", "-p", "-L", "Current (Your changes)", "-L", "Base (Original)", "-L", "Incoming (Background Agent changes)", oursPath, basePath, theirsPath];
  let out = "";
  let hasConflicts = false;
  try {
    try {
      out = (0, node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFileSync)("git", args, {
        encoding: "utf8",
        maxBuffer: 10 * 1024 * 1024
      });
    } catch (e) {
      const err = e;
      if (err && err.status === 1 && typeof err.stdout === "string") {
        // Conflicts present; stdout still contains merged result with markers
        out = err.stdout;
        hasConflicts = true;
      } else {
        throw e;
      }
    }
  } finally {
    // Always attempt to clean up temporary files
    try {
      (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.rmSync)(tmpRoot, {
        recursive: true,
        force: true
      });
    } catch (_a) {
      // ignore cleanup failures
    }
  }
  // Restore original EOL style of current
  const eol = detectEol(current);
  if (eol === "\r\n") {
    out = out.replace(/\n/g, "\r\n");
  }
  return {
    merged: out,
    hasConflicts
  };
}
function useBackgroundActions(backgroundComposerClient) {
  function checkoutLocally(bcId, opts) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c;
      const print = opts === null || opts === void 0 ? void 0 : opts.print;
      const confirm = opts === null || opts === void 0 ? void 0 : opts.confirm;
      const repoRoot = (0, _utils_git_js__WEBPACK_IMPORTED_MODULE_4__ /* .findGitRoot */.k)(process.cwd());
      printLines(print, [{
        text: "» ",
        dim: true
      }, {
        text: "Checking out background branch locally",
        bold: true
      }]);
      // Fetch composer info to get the target branch
      const infoResp = yield backgroundComposerClient.getBackgroundComposerInfo({
        bcId
      });
      const branchName = (_b = (_a = infoResp === null || infoResp === void 0 ? void 0 : infoResp.composer) === null || _a === void 0 ? void 0 : _a.composer) === null || _b === void 0 ? void 0 : _b.branchName;
      if (!branchName) {
        printLines(print, [{
          text: "error:",
          color: "red",
          bold: true
        }, {
          text: " No branch available to checkout for this background agent"
        }]);
        return;
      }
      // Ask server to push branch to remote (best-effort)
      try {
        yield backgroundComposerClient.commitBackgroundComposer({
          bcId
        });
      } catch (_d) {
        // best effort; continue
      }
      ensureFetch(repoRoot, branchName);
      // Warn if not on the target branch or if there are local changes
      const currentBefore = getCurrentBranch(repoRoot);
      const hasUnstaged = ((_c = tryRunGit(["status", "--porcelain"], repoRoot)) !== null && _c !== void 0 ? _c : "").length > 0;
      if (currentBefore && currentBefore !== branchName || hasUnstaged) {
        if (confirm) {
          const ok = yield confirm({
            title: hasUnstaged ? "You have local changes that may conflict." : "You are not on the target branch.",
            detail: hasUnstaged ? `Current branch: ${currentBefore !== null && currentBefore !== void 0 ? currentBefore : "unknown"}. Continuing will attempt to check out '${branchName}'.` : `Current branch: ${currentBefore !== null && currentBefore !== void 0 ? currentBefore : "unknown"}. Will switch to '${branchName}'.`,
            continueLabel: "Continue",
            cancelLabel: "Cancel"
          });
          if (!ok) return;
        }
      }
      checkoutAndPull(repoRoot, branchName);
      const current = getCurrentBranch(repoRoot);
      printLines(print, [[{
        text: "✔ ",
        color: "green",
        bold: true
      }, {
        text: `Now on branch `
      }, {
        text: current !== null && current !== void 0 ? current : branchName,
        bold: true
      }]]);
    });
  }
  function applyChangesLocally(bcId, opts) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c, _d, _e, _f;
      const print = opts === null || opts === void 0 ? void 0 : opts.print;
      const confirm = opts === null || opts === void 0 ? void 0 : opts.confirm;
      const repoRoot = (0, _utils_git_js__WEBPACK_IMPORTED_MODULE_4__ /* .findGitRoot */.k)(process.cwd());
      const branch = getCurrentBranch(repoRoot);
      printLines(print, [{
        text: "» ",
        dim: true
      }, {
        text: "Applying background agent changes locally",
        bold: true
      }]);
      // Load diff details
      const diffResp = yield backgroundComposerClient.getOptimizedDiffDetails({
        bcId
      });
      const files = [];
      const addDiff = d => {
        var _a, _b;
        const basePath = d.to && d.to !== "/dev/null" ? d.to : d.from;
        if (!basePath) return;
        let rel = stripWorkspacePrefix(basePath);
        if (rel.startsWith("/")) rel = rel.slice(1);
        files.push({
          relativePath: rel,
          isDeleted: d.to === "/dev/null" && d.from !== "/dev/null",
          isNew: d.from === "/dev/null" && d.to !== "/dev/null",
          originalContent: (_a = d.beforeFileContents) !== null && _a !== void 0 ? _a : "",
          finalContent: (_b = d.afterFileContents) !== null && _b !== void 0 ? _b : ""
        });
      };
      for (const diff of (_b = (_a = diffResp.diff) === null || _a === void 0 ? void 0 : _a.diffs) !== null && _b !== void 0 ? _b : []) addDiff(diff);
      for (const sub of (_c = diffResp.submoduleDiffs) !== null && _c !== void 0 ? _c : []) {
        if (sub.errored || !((_d = sub.diff) === null || _d === void 0 ? void 0 : _d.diffs)) continue;
        for (const d of sub.diff.diffs) {
          const base = d.to && d.to !== "/dev/null" ? d.to : d.from;
          if (!base) continue;
          const joined = `${sub.relativePath}/${base}`;
          addDiff(Object.assign(Object.assign({}, d), {
            to: d.to === "/dev/null" ? "/dev/null" : joined,
            from: d.from === "/dev/null" ? "/dev/null" : `${sub.relativePath}/${d.from}`
          }));
        }
      }
      if (files.length === 0) {
        printLines(print, [{
          text: "No changes to apply.",
          dim: true
        }]);
        return;
      }
      // Warn when there are local unstaged/staged changes
      const porcelain = (_e = tryRunGit(["status", "--porcelain"], repoRoot)) !== null && _e !== void 0 ? _e : "";
      if (porcelain.length > 0 && confirm) {
        const ok = yield confirm({
          title: "You have local changes",
          detail: `Applying ${files.length} changes${branch ? ` from ${branch}` : ""}. We'll merge into your working tree and show conflict markers where needed.`,
          continueLabel: "Apply",
          cancelLabel: "Cancel"
        });
        if (!ok) return;
      }
      // Apply edits
      const results = [];
      let totalApplied = 0;
      let createdCount = 0;
      let updatedCount = 0;
      let deletedCount = 0;
      let conflictedCount = 0;
      for (const f of files) {
        const abs = (0, node_path__WEBPACK_IMPORTED_MODULE_3__.resolve)(repoRoot, f.relativePath);
        const existedBefore = (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.existsSync)(abs);
        const currentContent = existedBefore ? (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.readFileSync)(abs, "utf8") : "";
        // For delete, treat "theirs" as empty content
        const targetContent = f.isDeleted ? "" : f.finalContent;
        const {
          merged,
          hasConflicts
        } = mergeThreeWay((_f = f.originalContent) !== null && _f !== void 0 ? _f : "", targetContent !== null && targetContent !== void 0 ? targetContent : "", currentContent !== null && currentContent !== void 0 ? currentContent : "");
        if (f.isDeleted) {
          // If merged result is empty and no conflicts, delete file if exists; else write merged with markers
          if (merged.length === 0 && !hasConflicts) {
            if ((0, node_fs__WEBPACK_IMPORTED_MODULE_1__.existsSync)(abs)) {
              try {
                (0, node_fs__WEBPACK_IMPORTED_MODULE_1__.rmSync)(abs, {
                  force: true
                });
              } catch (_g) {
                /* ignore */
              }
              results.push([{
                text: "- ",
                color: "yellow"
              }, {
                text: f.relativePath,
                bold: true
              }, {
                text: " (deleted)",
                dim: true
              }]);
              deletedCount += 1;
              totalApplied += 1;
            } else {
              // No-op
              results.push([{
                text: "• ",
                color: "gray"
              }, {
                text: f.relativePath,
                bold: true
              }, {
                text: " (unchanged)",
                dim: true
              }]);
            }
          } else {
            // Conflicts or merged text not empty -> keep file with markers
            safeWriteFile(abs, merged);
            results.push([{
              text: "• ",
              color: hasConflicts ? "red" : "green"
            }, {
              text: f.relativePath,
              bold: true
            }, {
              text: hasConflicts ? " (conflicts)" : " (updated)",
              dim: true
            }]);
            if (hasConflicts) conflictedCount += 1;else updatedCount += 1;
            totalApplied += 1;
          }
          continue;
        }
        // New or modified
        if (merged === currentContent) {
          results.push([{
            text: "• ",
            color: "gray"
          }, {
            text: f.relativePath,
            bold: true
          }, {
            text: " (unchanged)",
            dim: true
          }]);
        } else {
          // Ensure directory exists then write merged
          safeWriteFile(abs, merged);
          if (!existedBefore) {
            // Count as created when the file did not exist prior to writing
            createdCount += 1;
          } else {
            // Existing file: count conflicts separately, otherwise as updated
            if (hasConflicts) conflictedCount += 1;else updatedCount += 1;
          }
          results.push([{
            text: "• ",
            color: hasConflicts ? "red" : "green"
          }, {
            text: f.relativePath,
            bold: true
          }, {
            text: hasConflicts ? " (conflicts)" : f.isNew ? " (created)" : " (updated)",
            dim: true
          }]);
          totalApplied += 1;
        }
        if (results.length % 10 === 0) {
          printLines(print, results.slice(-10));
        }
      }
      // Final summary
      const parts = [];
      if (createdCount > 0) parts.push(`${createdCount} created`);
      if (updatedCount > 0) parts.push(`${updatedCount} updated`);
      if (deletedCount > 0) parts.push(`${deletedCount} deleted`);
      if (conflictedCount > 0) parts.push(`${conflictedCount} with conflicts`);
      const breakdown = parts.length > 0 ? ` (${parts.join(", ")})` : "";
      const summary = [{
        text: "✔ ",
        color: "green",
        bold: true
      }, {
        text: `Applied ${totalApplied}/${files.length} file changes${breakdown}`
      }, branch ? {
        text: ` on ${branch}`,
        dim: true
      } : {
        text: "",
        dim: true
      }];
      printLines(print, [...results.slice(-10), summary]);
    });
  }
  return {
    checkoutLocally,
    applyChangesLocally
  };
}

/***/