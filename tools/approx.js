import assert from 'assert' // do not use 'node:assert' here, that is not supported by Karma
import { hasOwnProperty } from './utils.js'

const EPSILON = 0.0001

/**
 * Test whether a value is a number
 * @param {*} value
 * @returns {boolean}
 */
function isNumber (value) {
  return (value instanceof Number || typeof value === 'number')
}

/**
 * Test whether two values are approximately equal. Tests whether the difference
 * between the two numbers is smaller than a fraction of their max value.
 * @param {Number | BigNumber | Complex | Fraction} a
 * @param {Number | BigNumber | Complex | Fraction} b
 * @param {Number} [epsilon]
 */
export function approxEqual (a, b, epsilon) {
  if (epsilon === undefined) {
    epsilon = EPSILON
  }

  if (isNumber(a) && isNumber(b)) {
    if (a === b) {
      // great, we're done :)
    } else if (isNaN(a)) {
      assert.strictEqual(a.toString(), b.toString())
    } else if (a === 0) {
      assert.ok(Math.abs(b) < epsilon, (a + ' ~= ' + b))
    } else if (b === 0) {
      assert.ok(Math.abs(a) < epsilon, (a + ' ~= ' + b))
    } else {
      const diff = Math.abs(a - b)
      const max = Math.max(Math.abs(a), Math.abs(b))
      const maxDiff = Math.abs(max * epsilon)
      assert.ok(diff <= maxDiff, (a + ' ~= ' + b + ' (epsilon: ' + epsilon + ')'))
    }
  } else if (a && b && a.isBigNumber && b.isBigNumber) {
    if (!a.equals(b)) {
      if (a.isNaN()) assert.ok(b.isNaN())
      else if (a.equals(0)) {
        assert.ok(b.abs().lt(epsilon))
      } else if (b.equals(0)) {
        assert.ok(a.abs().lt(epsilon))
      } else {
        const diff = a.minus(b).abs()
        let mx = a.abs()
        if (mx.lt(b.abs())) mx = b.abs()
        const maxDiff = mx.mul(epsilon)
        assert.ok(diff.lt(maxDiff), `Diff ${diff} exceeds ${maxDiff}`)
      }
    }
  } else if (a && a.isBigNumber) {
    return approxEqual(a.toNumber(), b, epsilon)
  } else if (b && b.isBigNumber) {
    return approxEqual(a, b.toNumber(), epsilon)
  } else if ((a && a.isComplex) || (b && b.isComplex)) {
    if (a && a.isComplex && b && b.isComplex) {
      approxEqual(a.re, b.re, epsilon)
      approxEqual(a.im, b.im, epsilon)
    } else if (a && a.isComplex) {
      approxEqual(a.re, b, epsilon)
      approxEqual(a.im, 0, epsilon)
    } else if (b && b.isComplex) {
      approxEqual(a, b.re, epsilon)
      approxEqual(0, b.im, epsilon)
    }
  } else {
    assert.strictEqual(a, b)
  }
}

/**
 * Test whether all values in two objects or arrays are approximately equal.
 * Will deep compare all values of Arrays and Objects element wise.
 * @param {*} a
 * @param {*} b
 * @param {number} [epsilon]
 */
export function approxDeepEqual (a, b, epsilon) {
  let prop, i, len

  if (Array.isArray(a) && Array.isArray(b)) {
    assert.strictEqual(a.length, b.length, a + ' ~= ' + b)
    for (i = 0, len = a.length; i < len; i++) {
      approxDeepEqual(a[i], b[i], epsilon)
    }
  } else if (a instanceof Object && b instanceof Object) {
    for (prop in a) {
      if (hasOwnProperty(a, prop)) {
        assert.ok(hasOwnProperty(b, prop), a[prop] + ' ~= ' + b[prop] +
          ' (epsilon: ' + epsilon + ', prop: ' + prop + ')')
        approxDeepEqual(a[prop], b[prop], epsilon)
      }
    }

    for (prop in b) {
      if (hasOwnProperty(b, prop)) {
        assert.ok(hasOwnProperty(a, prop), a[prop] + ' ~= ' + b[prop] +
          ' (epsilon: ' + epsilon + ', prop: ' + prop + ')')
        approxDeepEqual(a[prop], b[prop], epsilon)
      }
    }
  } else {
    approxEqual(a, b, epsilon)
  }
}
