class DebounceTimer {
  constructor(timeout, resolve) {
    this.timeout = timeout;
    this.resolve = resolve;
    this.timer = null;
  }
  delay() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.resolve();
    }, this.timeout);
  }
}
function createDebounceTimer(timeout) {
  let resolve = () => {};
  const promise = new Promise(r => {
    resolve = r;
  });
  const timer = new DebounceTimer(timeout, resolve);
  timer.delay();
  return {
    promise,
    timer
  };
}
//# sourceMappingURL=utils.js.map