/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */G: () => (/* binding */nodeToWebReadable),
  /* harmony export */W: () => (/* binding */nodeToWebWritable)
  /* harmony export */
});
/* harmony import */
var node_stream_web__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("node:stream/web");
/* harmony import */
var node_stream_web__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_stream_web__WEBPACK_IMPORTED_MODULE_0__);
function nodeToWebWritable(nodeStream) {
  return new node_stream_web__WEBPACK_IMPORTED_MODULE_0__.WritableStream({
    write(chunk) {
      return new Promise((resolve, reject) => {
        nodeStream.write(Buffer.from(chunk), err => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  });
}
function nodeToWebReadable(nodeStream) {
  return new node_stream_web__WEBPACK_IMPORTED_MODULE_0__.ReadableStream({
    start(controller) {
      nodeStream.on("data", chunk => {
        controller.enqueue(new Uint8Array(chunk));
      });
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", err => controller.error(err));
    }
  });
}

/***/