/**
 * Seeded random number generator based on ARC4 (RC4) cipher.
 * Based on https://github.com/davidbau/seedrandom
 * License: MIT (David Bau)
 */

const STATE_SIZE = 256
const BYTE_MASK = STATE_SIZE - 1
const BASE_DENOMINATOR = 281474976710656 // 256^6
const SIGNIFICANCE_THRESHOLD = 4503599627370496 // 2^52
const OVERFLOW_THRESHOLD = SIGNIFICANCE_THRESHOLD * 2 // 2^53
/** Prime multiplier from original seedrandom for entropy distribution in key scheduling */
const KEY_MIX_MULTIPLIER = 19

class ARC4 {
  constructor (key) {
    this.i = 0
    this.j = 0

    const keyLength = key.length || 1
    const s = new Uint8Array(STATE_SIZE)
    for (let i = 0; i < STATE_SIZE; i++) s[i] = i

    // Key scheduling algorithm (KSA)
    let j = 0
    for (let i = 0; i < STATE_SIZE; i++) {
      const t = s[i]
      j = (j + (key[i % keyLength] || 0) + t) & BYTE_MASK
      s[i] = s[j]
      s[j] = t
    }
    this.s = s

    // RC4-drop[256]: advance state via g() which also sets this.i/j
    this.i = 0
    this.j = 0
    this.g(STATE_SIZE)
  }

  /** Generate `count` random bytes concatenated as a single number */
  g (count) {
    const s = this.s
    let si = this.i
    let sj = this.j
    let r = 0
    while (count--) {
      const t = s[si = (si + 1) & BYTE_MASK]
      r = r * STATE_SIZE + s[((s[si] = s[sj = (sj + t) & BYTE_MASK]) + (s[sj] = t)) & BYTE_MASK]
    }
    this.i = si
    this.j = sj
    return r
  }
}

function flattenSeed (value) {
  if (typeof value === 'string') {
    return value
  }
  return String(value) + '\0'
}

function mixSeedIntoKey (seed, key) {
  let scramble = 0
  const len = seed.length

  for (let i = 0; i < len; i++) {
    const idx = BYTE_MASK & i
    scramble ^= key[idx] * KEY_MIX_MULTIPLIER
    key[idx] = BYTE_MASK & (scramble + seed.charCodeAt(i))
  }
}

/**
 * Create a seeded random number generator.
 *
 * @param {string | number | null} [seed] - The seed value
 * @returns {function} A function that returns random numbers in [0, 1)
 */
export function seedrandom (seed) {
  const key = []

  mixSeedIntoKey(flattenSeed(seed ?? Math.random()), key)

  const arc4 = new ARC4(key)

  return function () {
    let numerator = arc4.g(6)
    let denominator = BASE_DENOMINATOR
    let extraBits = 0

    while (numerator < SIGNIFICANCE_THRESHOLD) {
      numerator = (numerator + extraBits) * STATE_SIZE
      denominator *= STATE_SIZE
      extraBits = arc4.g(1)
    }

    // Scale down to avoid rounding up to 1.0
    while (numerator >= OVERFLOW_THRESHOLD) {
      numerator /= 2
      denominator /= 2
      extraBits >>>= 1
    }

    return (numerator + extraBits) / denominator
  }
}
