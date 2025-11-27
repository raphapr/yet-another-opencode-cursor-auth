// Error's source file is reported as file:///home/user/file.js
// This function removes the file://[cwd] part
const cleanupPath = path => {
  return path?.replace(`file://${(0, external_node_process_.cwd)()}/`, '');
};
const stackUtils = new stack_utils({
  cwd: (0, external_node_process_.cwd)(),
  internals: stack_utils.nodeInternals()
});
function ErrorOverview({
  error
}) {
  const stack = error.stack ? error.stack.split('\n').slice(1) : undefined;
  const origin = stack ? stackUtils.parseLine(stack[0]) : undefined;
  const filePath = cleanupPath(origin?.file);
  let excerpt;
  let lineWidth = 0;
  if (filePath && origin?.line && external_node_fs_.existsSync(filePath)) {
    const sourceCode = external_node_fs_.readFileSync(filePath, 'utf8');
    excerpt = (0, dist /* default */.A)(sourceCode, origin.line);
    if (excerpt) {
      for (const {
        line
      } of excerpt) {
        lineWidth = Math.max(lineWidth, String(line).length);
      }
    }
  }
  return react.createElement(Box /* default */.A, {
    flexDirection: "column",
    padding: 1
  }, react.createElement(Box /* default */.A, null, react.createElement(Text /* default */.A, {
    backgroundColor: "red",
    color: "white"
  }, ' ', "ERROR", ' '), react.createElement(Text /* default */.A, null, " ", error.message)), origin && filePath && react.createElement(Box /* default */.A, {
    marginTop: 1
  }, react.createElement(Text /* default */.A, {
    dimColor: true
  }, filePath, ":", origin.line, ":", origin.column)), origin && excerpt && react.createElement(Box /* default */.A, {
    marginTop: 1,
    flexDirection: "column"
  }, excerpt.map(({
    line,
    value
  }) => react.createElement(Box /* default */.A, {
    key: line
  }, react.createElement(Box /* default */.A, {
    width: lineWidth + 1
  }, react.createElement(Text /* default */.A, {
    dimColor: line !== origin.line,
    backgroundColor: line === origin.line ? 'red' : undefined,
    color: line === origin.line ? 'white' : undefined,
    "aria-label": line === origin.line ? `Line ${line}, error` : `Line ${line}`
  }, String(line).padStart(lineWidth, ' '), ":")), react.createElement(Text /* default */.A, {
    key: line,
    backgroundColor: line === origin.line ? 'red' : undefined,
    color: line === origin.line ? 'white' : undefined
  }, ' ' + value)))), error.stack && react.createElement(Box /* default */.A, {
    marginTop: 1,
    flexDirection: "column"
  }, error.stack.split('\n').slice(1).map(line => {
    const parsedLine = stackUtils.parseLine(line);
    // If the line from the stack cannot be parsed, we print out the unparsed line.
    if (!parsedLine) {
      return react.createElement(Box /* default */.A, {
        key: line
      }, react.createElement(Text /* default */.A, {
        dimColor: true
      }, "- "), react.createElement(Text /* default */.A, {
        dimColor: true,
        bold: true
      }, line, "\\t", ' '));
    }
    return react.createElement(Box /* default */.A, {
      key: line
    }, react.createElement(Text /* default */.A, {
      dimColor: true
    }, "- "), react.createElement(Text /* default */.A, {
      dimColor: true,
      bold: true
    }, parsedLine.function), react.createElement(Text /* default */.A, {
      dimColor: true,
      color: "gray",
      "aria-label": `at ${cleanupPath(parsedLine.file) ?? ''} line ${parsedLine.line} column ${parsedLine.column}`
    }, ' ', "(", cleanupPath(parsedLine.file) ?? '', ":", parsedLine.line, ":", parsedLine.column, ")"));
  })));
}
//# sourceMappingURL=ErrorOverview.js.map