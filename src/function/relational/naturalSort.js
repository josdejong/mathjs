// Inline ESM replacement for the 'javascript-natural-sort' package (v0.7.1)
// Original: https://github.com/Bill4Time/javascript-natural-sort (MIT license)
// Author: Jim Palmer (based on chunking idea from Dave Koelle)

const NUMBER_RE = /(^([+-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi
const WHITESPACE_RE = /(^[ ]*|[ ]*$)/g
const DATE_RE = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[/\-]\d{1,4}[/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/ // eslint-disable-line no-useless-escape
const HEX_RE = /^0x[0-9a-f]+$/i

/**
 * Split a string into chunks of text and numeric tokens for natural comparison.
 * Uses null-character delimiters to separate numeric from non-numeric parts.
 */
function tokenize (str) {
  // Reset lastIndex since NUMBER_RE has the global flag
  NUMBER_RE.lastIndex = 0
  const s = str.replace(NUMBER_RE, '\0$1\0')
  // Trim leading/trailing null chars and split — avoids two regex replacements
  const start = s.charCodeAt(0) === 0 ? 1 : 0
  const end = s.charCodeAt(s.length - 1) === 0 ? s.length - 1 : s.length
  return s.substring(start, end).split('\0')
}

/**
 * Parse a chunk as a number (if it doesn't have a leading zero) or keep as string.
 * Falls back to 0 for undefined/empty chunks.
 */
function parseChunk (chunk) {
  const s = chunk || ''
  // charCodeAt check is ~4x faster than regex for leading-zero detection
  if (s.charCodeAt(0) !== 48 /* '0' */) {
    const n = parseFloat(s)
    if (n) return n
  }
  return s || 0
}

/**
 * Try to interpret the string as a hex number or a date for fast comparison.
 * Returns the numeric value if successful, or a falsy value otherwise.
 */
function detectHexOrDate (str, tokens, otherDetected) {
  if (HEX_RE.test(str)) return parseInt(str, 16)
  // Only attempt date parse for multi-token strings (contains numbers mixed with text)
  if (otherDetected !== undefined) {
    return otherDetected && DATE_RE.test(str) && Date.parse(str)
  }
  return tokens.length !== 1 && DATE_RE.test(str) && Date.parse(str)
}

/**
 * Natural sort comparator. Compares two values by splitting them into
 * text and numeric chunks and comparing each chunk appropriately.
 */
export function naturalSort (a, b) {
  const strA = ('' + a).replace(WHITESPACE_RE, '') || ''
  const strB = ('' + b).replace(WHITESPACE_RE, '') || ''

  const tokensA = tokenize(strA)
  const tokensB = tokenize(strB)

  const detectedA = detectHexOrDate(strA, tokensA)
  const detectedB = detectHexOrDate(strB, tokensB, detectedA)

  // If both are hex or dates, compare directly
  if (detectedB) {
    if (detectedA < detectedB) return -1
    if (detectedA > detectedB) return 1
  }

  // Compare chunk by chunk
  const maxLen = Math.max(tokensA.length, tokensB.length)
  for (let i = 0; i < maxLen; i++) {
    let chunkA = parseChunk(tokensA[i])
    let chunkB = parseChunk(tokensB[i])

    // Numbers sort before strings
    if (isNaN(chunkA) !== isNaN(chunkB)) {
      return isNaN(chunkA) ? 1 : -1
    }

    // Coerce to same type for comparison (e.g. '02' vs 2)
    if (typeof chunkA !== typeof chunkB) {
      chunkA += ''
      chunkB += ''
    }

    if (chunkA < chunkB) return -1
    if (chunkA > chunkB) return 1
  }

  return 0
}
