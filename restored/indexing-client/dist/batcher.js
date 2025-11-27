class SimpleBatchBuilder {
  constructor(maxSize, initialItems = []) {
    this.maxSize = maxSize;
    this.size = 1;
    this.items = initialItems;
  }
  add(item) {
    if (this.size >= this.maxSize) {
      return false;
    }
    this.items.push(item);
    this.size++;
    return true;
  }
}
class SimpleBatcherFactory {
  constructor(maxSize) {
    this.maxSize = maxSize;
  }
  createBatch(item) {
    return new SimpleBatchBuilder(this.maxSize, [item]);
  }
}