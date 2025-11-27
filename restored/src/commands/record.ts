/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleRecord: () => (/* binding */ handleRecord)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:fs");
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("node:os");
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_os__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("node:path");
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lydell_node_pty__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("@lydell/node-pty");
/* harmony import */ var _lydell_node_pty__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lydell_node_pty__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var node_ansiparser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("../../node_modules/.pnpm/node-ansiparser@2.2.1/node_modules/node-ansiparser/dist/ansiparser.js");
/* harmony import */ var node_ansiparser__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(node_ansiparser__WEBPACK_IMPORTED_MODULE_4__);






// Initial config - paths will be set after temp directory creation
const CONFIG = {
    shell: "/bin/zsh",
    pendingFile: "",
    completedFile: "",
    tempDir: "",
};
// Command capture state
class CommandCapture {
    constructor(pendingFile, completedFile) {
        this.pendingFile = pendingFile;
        this.completedFile = completedFile;
        this.state = {
            currentCommand: null,
            isCapturingOutput: false,
            pendingStream: null,
            commandExitCode: null,
            waitingForExitCode: false,
        };
    }
    startCapture(command) {
        this.state.currentCommand = command;
        this.state.isCapturingOutput = true;
        // Start writing to pending file with command as first line
        this.state.pendingStream = node_fs__WEBPACK_IMPORTED_MODULE_0__.createWriteStream(this.pendingFile);
        this.state.pendingStream.write(`${command}\n`);
    }
    writeToCapture(data) {
        if (this.state.isCapturingOutput && this.state.pendingStream) {
            this.state.pendingStream.write(data);
        }
    }
    setExitCode(exitCode) {
        this.state.commandExitCode = exitCode;
        if (this.state.isCapturingOutput &&
            this.state.currentCommand &&
            this.state.pendingStream) {
            this.state.waitingForExitCode = true;
        }
    }
    finishCommand() {
        if (this.state.pendingStream && this.state.commandExitCode !== null) {
            // Write the exit code as the last line
            this.state.pendingStream.write(`\n${this.state.commandExitCode}`);
            this.state.pendingStream.end();
            this.state.pendingStream = null;
            // Move pending.bin to completed.bin
            try {
                if (node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(this.pendingFile)) {
                    node_fs__WEBPACK_IMPORTED_MODULE_0__.renameSync(this.pendingFile, this.completedFile);
                }
            }
            catch (err) {
                void err;
            }
            // Reset state
            this.state.commandExitCode = null;
            this.state.waitingForExitCode = false;
        }
    }
    resetForNextCommand() {
        // Default to exit code 0 if we don't have one yet
        if (this.state.isCapturingOutput && this.state.currentCommand) {
            if (this.state.commandExitCode === null) {
                this.state.commandExitCode = "0";
            }
            this.finishCommand();
            // Reset for next command
            this.state.currentCommand = null;
        }
        this.state.isCapturingOutput = false;
    }
    get isCapturing() {
        return this.state.isCapturingOutput;
    }
    get hasCommand() {
        return this.state.currentCommand !== null;
    }
    get isWaitingForExitCode() {
        return this.state.waitingForExitCode;
    }
    get currentCommand() {
        return this.state.currentCommand;
    }
    handleProcessExit(exitCode) {
        if (this.state.isCapturingOutput && this.state.currentCommand) {
            if (this.state.commandExitCode === null) {
                this.state.commandExitCode = exitCode.toString();
            }
            this.finishCommand();
        }
    }
    closePendingStream() {
        if (this.state.pendingStream) {
            this.state.pendingStream.end();
            this.state.pendingStream = null;
        }
    }
}
// OSC (Operating System Command) parser
class OscParser {
    constructor(commandCapture) {
        this.commandCapture = commandCapture;
    }
    parse(oscSequence) {
        const semicolonIndex = oscSequence.indexOf(";");
        if (semicolonIndex === -1)
            return;
        const oscType = oscSequence.substring(0, semicolonIndex);
        const oscData = oscSequence.substring(semicolonIndex + 1);
        switch (oscType) {
            case "1":
                this.handleWindowTitle(oscData);
                break;
            case "2":
                this.handleTerminalTitle(oscData);
                break;
            case "7":
                // OSC 7: Current working directory as file:// URL
                // Ignored for now since we're not tracking CWD
                break;
            case "133":
                this.handleShellIntegration(oscSequence);
                break;
            case "9999":
                // Custom OSC sequence for Cursor Agent terminal capture
                this.handleCursorAgentSequence(oscData);
                break;
        }
    }
    handleWindowTitle(_oscData) {
        // OSC 1: Window title - disabled in favor of custom OSC 9999
        // We don't process window titles to avoid conflicts with other tools
    }
    handleTerminalTitle(_oscData) {
        // OSC 2: Terminal title - disabled in favor of custom OSC 9999
        // We don't process terminal titles to avoid conflicts with other tools
    }
    handleShellIntegration(_oscSequence) {
        // OSC 133: Shell integration sequences - disabled in favor of custom OSC 9999
        // We don't process OSC 133 to avoid conflicts with other tools
    }
    handleCursorAgentSequence(data) {
        // Custom OSC 9999 sequence format:
        // OSC 9999;type;data ST
        // Types:
        // - prompt: New prompt is about to be shown
        // - preexec: Command is about to execute (data contains command)
        // - precmd: Command finished (data contains exit code)
        const parts = data.split(";");
        if (parts.length < 1)
            return;
        const type = parts[0];
        const payload = parts.slice(1).join(";");
        switch (type) {
            case "prompt":
                // New prompt - reset for next command
                this.commandCapture.resetForNextCommand();
                break;
            case "preexec":
                // Command is about to execute
                if (payload && !this.commandCapture.hasCommand) {
                    this.commandCapture.startCapture(payload);
                }
                break;
            case "precmd":
                // Command finished with exit code
                if (payload) {
                    this.commandCapture.setExitCode(payload);
                    this.commandCapture.finishCommand();
                }
                break;
        }
    }
}
// ANSI terminal handler
class AnsiTerminalHandler {
    constructor(commandCapture) {
        this.commandCapture = commandCapture;
        this.oscParser = new OscParser(commandCapture);
    }
    // Print regular text
    inst_p(s) {
        // Write to pending file if we're capturing output
        this.commandCapture.writeToCapture(s);
    }
    // OSC (Operating System Command) sequences
    inst_o(s) {
        this.oscParser.parse(s);
    }
    // Execute single character commands (C0 control codes)
    inst_x(flag) {
        // Write control characters to pending file if capturing
        this.commandCapture.writeToCapture(flag);
    }
    // CSI (Control Sequence Introducer) sequences
    inst_c(_collected, _params, _flag) { }
    // ESC sequences
    inst_e(_collected, _flag) { }
    // DCS (Device Control String) sequences - Start
    inst_H(_collected, _params, _flag) { }
    // DCS data
    inst_P(_data) { }
    // End of DCS sequence
    inst_U() { }
    // Error handler
    inst_E(error) {
        void error;
    }
}
// Main terminal capture class
class TerminalCapture {
    constructor() {
        // Create temporary directory for this execution
        this.createTempDirectory();
        this.commandCapture = new CommandCapture(CONFIG.pendingFile, CONFIG.completedFile);
        // Create terminal handler
        const terminal = new AnsiTerminalHandler(this.commandCapture);
        // Create parser instance
        this.parser = new (node_ansiparser__WEBPACK_IMPORTED_MODULE_4___default())(terminal);
        // Initialize PTY
        this.ptyProcess = this.initializePty();
        // Clean up any existing files on start
        this.cleanupFiles();
    }
    createTempDirectory() {
        // Create a unique temporary directory
        const tempDirPrefix = "termcapture-";
        CONFIG.tempDir = node_fs__WEBPACK_IMPORTED_MODULE_0__.mkdtempSync(node_path__WEBPACK_IMPORTED_MODULE_2__.join(node_os__WEBPACK_IMPORTED_MODULE_1__.tmpdir(), tempDirPrefix));
        // Set the file paths within the temp directory
        CONFIG.pendingFile = node_path__WEBPACK_IMPORTED_MODULE_2__.join(CONFIG.tempDir, "pending.bin");
        CONFIG.completedFile = node_path__WEBPACK_IMPORTED_MODULE_2__.join(CONFIG.tempDir, "completed.bin");
        // Set the environment variable for completed.bin path
        process.env.CURSOR_AGENT_COMPLETED_PATH = CONFIG.completedFile;
    }
    initializePty() {
        try {
            const require = /* createRequire() */ undefined;
            const spawnHelperPath =  false
                ? 0
                : node_path__WEBPACK_IMPORTED_MODULE_2__.join(process.argv[1], "..", "spawn-helper");
            const ptyProcess = _lydell_node_pty__WEBPACK_IMPORTED_MODULE_3__.spawn("zsh", ["-il"], {
                ["helperPath"]: spawnHelperPath,
                name: "xterm-256color",
                cols: process.stdout.columns || 80,
                rows: process.stdout.rows || 24,
                cwd: process.cwd(),
                env: Object.assign(Object.assign({}, process.env), { CURSOR_AGENT_COMPLETED_PATH: CONFIG.completedFile }),
            });
            // Parse PTY output through ANSI parser before displaying
            ptyProcess.onData((data) => {
                this.parser.parse(data);
                process.stdout.write(data);
            });
            // Handle PTY exit
            ptyProcess.onExit((exitCode) => {
                this.commandCapture.handleProcessExit(exitCode.exitCode);
                this.cleanup();
                process.exit(exitCode.exitCode);
            });
            return ptyProcess;
        }
        catch (err) {
            process.stderr.write("Error initializing PTY:");
            if (err instanceof Error) {
                process.stderr.write(err.message);
                process.stderr.write(err.stack || "");
            }
            else {
                process.stderr.write(String(err));
            }
            process.exit(1);
        }
    }
    cleanupFiles() {
        try {
            if (node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(CONFIG.pendingFile)) {
                node_fs__WEBPACK_IMPORTED_MODULE_0__.unlinkSync(CONFIG.pendingFile);
            }
            if (node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(CONFIG.completedFile)) {
                node_fs__WEBPACK_IMPORTED_MODULE_0__.unlinkSync(CONFIG.completedFile);
            }
        }
        catch (err) {
            // Ignore errors during cleanup
            void err;
        }
    }
    setupStdin() {
        // Set raw mode for stdin to capture all input
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        process.stdin.resume();
        process.stdin.setEncoding("utf8");
        // Pipe stdin to the PTY
        process.stdin.on("data", (data) => {
            this.ptyProcess.write(data);
        });
    }
    setupResize() {
        // Handle terminal resize
        process.stdout.on("resize", () => {
            if (process.stdout.columns && process.stdout.rows) {
                this.ptyProcess.resize(process.stdout.columns, process.stdout.rows);
            }
        });
        // Initial resize to match current terminal size
        if (process.stdout.columns && process.stdout.rows) {
            this.ptyProcess.resize(process.stdout.columns, process.stdout.rows);
        }
    }
    setupSignalHandlers() {
        // Handle process signals for graceful shutdown
        const handleSignal = (signal) => {
            this.ptyProcess.kill(signal);
        };
        process.on("SIGINT", () => handleSignal("SIGINT"));
        process.on("SIGTERM", () => handleSignal("SIGTERM"));
        //     process.on("uncaughtException", (err: Error) => {
        //       console.error("Uncaught exception:", err);
        //       this.commandCapture.closePendingStream();
        //       this.cleanup();
        //       process.exit(1);
        //     });
    }
    cleanup() {
        // Restore terminal state
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }
        // Remove the temporary directory and all its contents
        if (CONFIG.tempDir && node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync(CONFIG.tempDir)) {
            try {
                node_fs__WEBPACK_IMPORTED_MODULE_0__.rmSync(CONFIG.tempDir, { recursive: true, force: true });
            }
            catch (_err) { }
        }
    }
    start() {
        this.setupStdin();
        this.setupResize();
        this.setupSignalHandlers();
    }
}
function handleRecord() {
    // Check if running on Windows
    if (false) // removed by dead control flow
{}
    // Entry point
    const terminalCapture = new TerminalCapture();
    terminalCapture.start();
    process.title = "cursor-shell";
}


/***/ })

};
;