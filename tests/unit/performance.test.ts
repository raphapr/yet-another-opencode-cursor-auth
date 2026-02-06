import { describe, expect, test } from "bun:test";
import {
  calculateTokenUsage,
  calculateTokenUsageFast,
  countOpenAITokens,
} from "../../src/lib/utils/tokenizer";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Measure median wall-clock time (ms) over `rounds` invocations. */
function bench(fn: () => void, rounds = 100): number {
  // Warm-up
  for (let i = 0; i < 5; i++) fn();

  const times: number[] = [];
  for (let i = 0; i < rounds; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)]!;
}

/** Generate a realistic-looking LLM response text of approximately `length` chars. */
function generateText(length: number): string {
  const base =
    "The quick brown fox jumps over the lazy dog. " +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ";
  let text = "";
  while (text.length < length) text += base;
  return text.slice(0, length);
}

// ---------------------------------------------------------------------------
// 1. Tokenizer: calculateTokenUsageFast vs calculateTokenUsage
// ---------------------------------------------------------------------------

describe("perf: tokenizer — fast vs full", () => {
  const shortPrompt = "What is the capital of France?";
  const shortCompletion = "The capital of France is Paris.";

  const longPrompt = generateText(8_000); // ~2k tokens
  const longCompletion = generateText(16_000); // ~4k tokens

  test("fast estimate is ≥10x faster than full tokenizer (short text)", () => {
    const fullMs = bench(() => {
      calculateTokenUsage(shortPrompt, shortCompletion, "gpt-4o");
    });
    const fastMs = bench(() => {
      calculateTokenUsageFast(shortPrompt.length, shortCompletion.length);
    });

    console.log(
      `  short text — full: ${fullMs.toFixed(4)}ms, fast: ${fastMs.toFixed(4)}ms, speedup: ${(fullMs / fastMs).toFixed(1)}x`
    );
    expect(fastMs).toBeLessThan(fullMs);
    // The fast path should be at least an order of magnitude faster
    expect(fullMs / fastMs).toBeGreaterThan(10);
  });

  test("fast estimate is ≥10x faster than full tokenizer (long text)", () => {
    const fullMs = bench(() => {
      calculateTokenUsage(longPrompt, longCompletion, "gpt-4o");
    });
    const fastMs = bench(() => {
      calculateTokenUsageFast(longPrompt.length, longCompletion.length);
    });

    console.log(
      `  long text  — full: ${fullMs.toFixed(4)}ms, fast: ${fastMs.toFixed(4)}ms, speedup: ${(fullMs / fastMs).toFixed(1)}x`
    );
    expect(fastMs).toBeLessThan(fullMs);
    expect(fullMs / fastMs).toBeGreaterThan(10);
  });

  test("fast estimate is within 2x of actual token count", () => {
    const text = generateText(4_000);
    const actual = countOpenAITokens(text);
    const estimated = Math.ceil(text.length / 4);

    const ratio = estimated / actual;
    console.log(
      `  accuracy — actual: ${actual} tokens, estimated: ${estimated}, ratio: ${ratio.toFixed(3)}`
    );
    // Heuristic should be roughly within 0.5x–2x of the real count
    expect(ratio).toBeGreaterThan(0.5);
    expect(ratio).toBeLessThan(2.0);
  });
});

// ---------------------------------------------------------------------------
// 2. String accumulation vs length tracking
// ---------------------------------------------------------------------------

describe("perf: string accumulation vs length tracking", () => {
  const chunkSize = 80; // average SSE chunk size in chars
  const chunkCounts = [100, 500, 2000];

  for (const numChunks of chunkCounts) {
    test(`length tracking is faster than string concat (${numChunks} chunks)`, () => {
      const chunks = Array.from({ length: numChunks }, (_, i) =>
        generateText(chunkSize).slice(0, chunkSize)
      );

      const concatMs = bench(() => {
        let accumulated = "";
        for (const c of chunks) accumulated += c;
        // Simulate final token calc on accumulated string
        void accumulated.length;
      });

      const lengthMs = bench(() => {
        let accumulatedLength = 0;
        for (const c of chunks) accumulatedLength += c.length;
        void accumulatedLength;
      });

      const speedup = concatMs / lengthMs;
      console.log(
        `  ${numChunks} chunks — concat: ${concatMs.toFixed(4)}ms, length: ${lengthMs.toFixed(4)}ms, speedup: ${speedup.toFixed(1)}x`
      );
      expect(lengthMs).toBeLessThanOrEqual(concatMs);
    });
  }
});

// ---------------------------------------------------------------------------
// 3. Growing buffer vs naive copy-on-append
// ---------------------------------------------------------------------------

describe("perf: growing buffer vs naive Uint8Array copy", () => {
  /** Simulate the old O(n²) buffer approach */
  function naiveBufferAppend(chunks: Uint8Array[]): Uint8Array {
    let buffer = new Uint8Array(0);
    for (const chunk of chunks) {
      const newBuffer = new Uint8Array(buffer.length + chunk.length);
      newBuffer.set(buffer);
      newBuffer.set(chunk, buffer.length);
      buffer = newBuffer;
    }
    return buffer;
  }

  /** Simulate the new growing-buffer approach */
  function growingBufferAppend(chunks: Uint8Array[]): { buffer: Uint8Array; used: number } {
    let buffer = new Uint8Array(8192);
    let used = 0;
    for (const chunk of chunks) {
      const needed = used + chunk.length;
      if (needed > buffer.length) {
        let newSize = buffer.length;
        while (newSize < needed) newSize *= 2;
        const grown = new Uint8Array(newSize);
        grown.set(buffer.subarray(0, used));
        buffer = grown;
      }
      buffer.set(chunk, used);
      used += chunk.length;
    }
    return { buffer, used };
  }

  // Simulate realistic SSE frames: 5-byte header + variable payload
  function makeChunks(count: number, avgPayloadSize: number): Uint8Array[] {
    const chunks: Uint8Array[] = [];
    for (let i = 0; i < count; i++) {
      const size = avgPayloadSize + Math.floor(Math.random() * 100) - 50;
      const chunk = new Uint8Array(Math.max(size, 10));
      // Fill with non-zero data to be realistic
      for (let j = 0; j < chunk.length; j++) chunk[j] = (i + j) & 0xff;
      chunks.push(chunk);
    }
    return chunks;
  }

  const scenarios = [
    { chunks: 50, payload: 200, label: "small stream (50 chunks, ~200B)" },
    { chunks: 200, payload: 500, label: "medium stream (200 chunks, ~500B)" },
    { chunks: 1000, payload: 1000, label: "large stream (1000 chunks, ~1KB)" },
  ];

  for (const { chunks: count, payload, label } of scenarios) {
    test(`growing buffer is faster than naive copy — ${label}`, () => {
      const testChunks = makeChunks(count, payload);

      const naiveMs = bench(() => {
        naiveBufferAppend(testChunks);
      }, 50);

      const growingMs = bench(() => {
        growingBufferAppend(testChunks);
      }, 50);

      const speedup = naiveMs / growingMs;
      console.log(
        `  ${label} — naive: ${naiveMs.toFixed(4)}ms, growing: ${growingMs.toFixed(4)}ms, speedup: ${speedup.toFixed(1)}x`
      );

      // Growing buffer should always be at least as fast
      expect(growingMs).toBeLessThanOrEqual(naiveMs * 1.1); // allow 10% noise margin
    });
  }

  test("growing buffer produces same data as naive copy", () => {
    const chunks = makeChunks(100, 300);

    const naiveResult = naiveBufferAppend(chunks);
    const { buffer, used } = growingBufferAppend(chunks);
    const growingResult = buffer.subarray(0, used);

    expect(growingResult.length).toBe(naiveResult.length);
    expect(Buffer.from(growingResult).equals(Buffer.from(naiveResult))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 4. Static vs dynamic imports (simulated)
// ---------------------------------------------------------------------------

describe("perf: static vs dynamic import overhead", () => {
  test("static import has no per-call overhead", () => {
    // Simulate the old pattern: dynamic import on each call
    // We measure the sync overhead of creating the import promise
    const dynamicFn = () => {
      const p = import("node:fs/promises");
      void p;
    };
    const dynamicMs = bench(dynamicFn, 200);

    // Static import: just a variable reference (zero overhead)
    const fs = require("node:fs/promises");
    const staticFn = () => {
      void fs.readdir;
    };
    const staticMs = bench(staticFn, 200);

    console.log(
      `  dynamic import: ${dynamicMs.toFixed(4)}ms, static ref: ${staticMs.toFixed(4)}ms`
    );
    // Static should be faster (dynamic has module resolution overhead even when cached)
    expect(staticMs).toBeLessThanOrEqual(dynamicMs);
  });
});

// ---------------------------------------------------------------------------
// 5. Buffer compaction: copyWithin vs slice
// ---------------------------------------------------------------------------

describe("perf: buffer compaction — copyWithin vs slice", () => {
  const bufferSizes = [4096, 32768, 262144]; // 4KB, 32KB, 256KB
  const consumedRatio = 0.75; // 75% of buffer consumed, compact remaining 25%

  for (const size of bufferSizes) {
    test(`copyWithin is faster than slice for ${(size / 1024).toFixed(0)}KB buffer`, () => {
      const original = new Uint8Array(size);
      for (let i = 0; i < size; i++) original[i] = i & 0xff;

      const consumed = Math.floor(size * consumedRatio);
      const remaining = size - consumed;

      // Old approach: slice creates a new array
      const sliceMs = bench(() => {
        const newBuf = original.slice(consumed);
        void newBuf;
      });

      // New approach: copyWithin mutates in-place
      const copyWithinMs = bench(() => {
        original.copyWithin(0, consumed, consumed + remaining);
      });

      const speedup = sliceMs / copyWithinMs;
      console.log(
        `  ${(size / 1024).toFixed(0)}KB — slice: ${sliceMs.toFixed(4)}ms, copyWithin: ${copyWithinMs.toFixed(4)}ms, speedup: ${speedup.toFixed(1)}x`
      );
      expect(copyWithinMs).toBeLessThanOrEqual(sliceMs * 1.1); // allow noise
    });
  }
});
