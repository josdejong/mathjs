const assert = require('assert')
const hasOwnProperty = require('./utils').hasOwnProperty

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
exports.equal = function equal (a, b, epsilon) {
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
      const max = Math.max(a, b)
      const maxDiff = Math.abs(max * epsilon)
      assert.ok(diff <= maxDiff, (a + ' ~= ' + b + ' (epsilon: ' + epsilon + ')'))
    }
  } else if (a && a.isBigNumber) {
    return exports.equal(a.toNumber(), b, epsilon)
  } else if (b && b.isBigNumber) {
    return exports.equal(a, b.toNumber(), epsilon)
  } else if ((a && a.isComplex) || (b && b.isComplex)) {
    if (a && a.isComplex && b && b.isComplex) {
      exports.equal(a.re, b.re, epsilon)
      exports.equal(a.im, b.im, epsilon)
    } else if (a && a.isComplex) {
      exports.equal(a.re, b, epsilon)
      exports.equal(a.im, 0, epsilon)
    } else if (b && b.isComplex) {
      exports.equal(a, b.re, epsilon)
      exports.equal(0, b.im, epsilon)
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
exports.deepEqual = function deepEqual (a, b, epsilon) {
  let prop, i, len

  if (Array.isArray(a) && Array.isArray(b)) {
    assert.strictEqual(a.length, b.length, a + ' ~= ' + b)
    for (i = 0, len = a.length; i < len; i++) {
      deepEqual(a[i], b[i], epsilon)
    }
  } else if (a instanceof Object && b instanceof Object) {
    for (prop in a) {
      if (hasOwnProperty(a, prop)) {
        assert.ok(hasOwnProperty(b, prop), a[prop] + ' ~= ' + b[prop] +
          ' (epsilon: ' + epsilon + ', prop: ' + prop + ')')
        deepEqual(a[prop], b[prop], epsilon)
      }
    }

    for (prop in b) {
      if (hasOwnProperty(b, prop)) {
        assert.ok(hasOwnProperty(a, prop), a[prop] + ' ~= ' + b[prop] +
          ' (epsilon: ' + epsilon + ', prop: ' + prop + ')')
        deepEqual(a[prop], b[prop], epsilon)
      }
    }
  } else {
    exports.equal(a, b, epsilon)
  }
}
