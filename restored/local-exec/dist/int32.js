const INT32_MIN = -(2 ** 31);
const INT32_MAX = 2 ** 31 - 1;
/**
 * Clamps a number to the valid int32 range.
 */
function clampInt32(n) {
  if (n < INT32_MIN) {
    return INT32_MIN;
  }
  if (n > INT32_MAX) {
    return INT32_MAX;
  }
  return n;
}
//# sourceMappingURL=int32.js.map