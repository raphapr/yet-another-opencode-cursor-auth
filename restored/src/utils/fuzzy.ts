/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */dt: () => (/* binding */fuzzyScore)
  /* harmony export */
});
/* unused harmony exports fuzzyMatch, fuzzyFilter */
/**
 * Generic fuzzy matcher.
 *
 * Scores a candidate based on how well it matches the needle. Higher is better.
 * Tuned for CLI palette usage: rewards consecutive runs, boundary starts, and
 * penalizes gaps. Case-insensitive.
 */
function fuzzyScore(candidate, needle) {
  var _a, _b;
  const candidateLower = candidate.toLowerCase();
  const needleLower = needle.toLowerCase();
  if (needleLower.length === 0) return 1; // neutral base score
  let score = 0;
  let cIdx = 0;
  let consecutive = 0;
  let prevMatch = -1;
  for (let nIdx = 0; nIdx < needleLower.length; nIdx++) {
    const ch = needleLower[nIdx];
    let found = false;
    for (let i = cIdx; i < candidateLower.length; i++) {
      if (candidateLower[i] === ch) {
        found = true;
        cIdx = i + 1;
        if (prevMatch >= 0 && i === prevMatch + 1) {
          consecutive++;
          score += 15 * consecutive;
        } else {
          consecutive = 1;
        }
        if (i === 0) score += 30; // start of string
        const prevChar = candidate[i - 1];
        if (i > 0 && (prevChar === "/" || prevChar === "-" || prevChar === "_" || prevChar === "." || prevChar === " ")) {
          score += 25; // boundary separator
        }
        // Pascal/camel boundary: lower -> Upper
        const prevIsLower = i > 0 && /[a-z]/.test((_a = candidate[i - 1]) !== null && _a !== void 0 ? _a : "");
        const currIsUpper = /[A-Z]/.test((_b = candidate[i]) !== null && _b !== void 0 ? _b : "");
        if (prevIsLower && currIsUpper) score += 20;
        if (prevMatch >= 0) score -= (i - prevMatch - 1) * 2; // gap penalty
        prevMatch = i;
        break;
      }
    }
    if (!found) return 0; // no match
  }
  // Prefer shorter candidates
  score += Math.max(0, 50 - candidate.length);
  if (candidateLower === needleLower) score += 100; // exact match
  return score;
}
function fuzzyMatch(candidate, needle) {
  const s = fuzzyScore(candidate, needle);
  return {
    matched: s > 0,
    score: s
  };
}
function fuzzyFilter(items, needle, getText, limit = 50) {
  if (!needle) return items.slice(0, limit);
  const scored = [];
  for (const item of items) {
    const s = fuzzyScore(getText(item), needle);
    if (s > 0) scored.push({
      item,
      score: s
    });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(x => x.item);
}

/***/