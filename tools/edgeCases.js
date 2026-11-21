import assert from 'assert' // do not use 'node:assert' here, that is not supported by Karma

// Edge-case inputs from https://github.com/josdejong/mathjs/issues/3754,
// keyed by the labels used there. The near-1 points are exact doubles:
// 1-2^-53 and 1+2^-52 are the two neighbours of 1.
export const edgeCasePoints = {
  Infinity,
  '-Infinity': -Infinity,
  NaN,
  '1e300': 1e300,
  710: 710,
  400: 400,
  '-400': -400,
  '-710': -710,
  '-1e300': -1e300,
  1e-8: 1e-8,
  1e-17: 1e-17,
  1e-200: 1e-200,
  '-1e-8': -1e-8,
  '-1e-17': -1e-17,
  '-1e-200': -1e-200,
  0: 0,
  '-0': -0,
  1: 1,
  '1-1e-15': 1 - 1e-15,
  '1-2^-53': 1 - 2 ** -53,
  '1+2^-52': 1 + 2 ** -52,
  '1+1e-15': 1 + 1e-15,
  '-1': -1,
  '-(1-1e-15)': -(1 - 1e-15),
  '-(1-2^-53)': -(1 - 2 ** -53),
  '-(1+2^-52)': -(1 + 2 ** -52),
  '-(1+1e-15)': -(1 + 1e-15)
}

const MAX_ULP = 4

/**
 * Size of one unit in the last place of the double d (2^-1074 for 0).
 * @param {number} d
 * @returns {number}
 */
function ulp (d) {
  if (d === 0 || !isFinite(d)) return 2 ** -1074
  const view = new DataView(new ArrayBuffer(8))
  view.setFloat64(0, d)
  const exponent = (view.getUint16(0) >> 4) & 0x7ff
  return 2 ** (Math.max(exponent - 1023, -1022) - 52)
}

function str (x) {
  if (Object.is(x, -0)) return '-0'
  if (x && x.isComplex) return `${str(x.re)} ${Object.is(x.im, -0) || x.im < 0 ? '-' : '+'} ${str(Math.abs(x.im))}i`
  return String(x)
}

/**
 * Assert that a real number is within MAX_ULP units in the last place of
 * the expected double. NaN, infinities and the sign of zero must match exactly
 * (the sign of zero only when checkZeroSign is true).
 */
function assertUlpEqual (actual, expected, message, checkZeroSign) {
  assert.strictEqual(typeof actual, 'number', message)
  if (isNaN(expected) || !isFinite(expected)) {
    assert.ok(Object.is(actual, expected), message)
  } else if (expected === 0 && actual === 0) {
    if (checkZeroSign) assert.ok(Object.is(actual, expected), message)
  } else {
    assert.ok(isFinite(actual), message)
    const error = Math.abs(actual - expected) / ulp(expected)
    assert.ok(error <= MAX_ULP, `${message} (${error} ulp)`)
  }
}

/**
 * Generate one test per edge case of a real function.
 * Each case is [label, expected] or [label, expected, knownIssue]; label is a
 * key of edgeCasePoints, expected is the correctly rounded result (a number,
 * or a Complex for results off the real line). Cases with a knownIssue
 * describe a current bug and are skipped until it is fixed.
 * Real results are compared with signed zeros; for Complex results the
 * real and imaginary parts are compared separately, ignoring the sign of zero.
 * @param {string} name
 * @param {function} fn
 * @param {Array} cases
 */
export function testEdgeCases (name, fn, cases) {
  for (const [label, expected, knownIssue] of cases) {
    assert.ok(label in edgeCasePoints, `unknown edge case ${label}`)
    const x = edgeCasePoints[label]
    const test = knownIssue ? it.skip : it
    test(`${name}(${label}) should be ${str(expected)}`, function () {
      const actual = fn(x)
      const message = `${name}(${label}) returned ${str(actual)}, expected ${str(expected)}`
      if (expected && expected.isComplex) {
        assert.ok(actual && actual.isComplex, message)
        assertUlpEqual(actual.re, expected.re, message, false)
        assertUlpEqual(actual.im, expected.im, message, false)
      } else {
        assertUlpEqual(actual, expected, message, true)
      }
    })
  }
}
