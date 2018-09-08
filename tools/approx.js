const assert = require('assert')

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
      assert.ok(diff <= maxDiff, (a + ' ~= ' + b))
    }
  } else if (a && a.isBigNumber) {
    return exports.equal(a.toNumber(), b)
  } else if (b && b.isBigNumber) {
    return exports.equal(a, b.toNumber())
  } else if ((a && a.isComplex) || (b && b.isComplex)) {
    if (a && a.isComplex && b && b.isComplex) {
      exports.equal(a.re, b.re, (a + ' ~= ' + b))
      exports.equal(a.im, b.im, (a + ' ~= ' + b))
    } else if (a && a.isComplex) {
      exports.equal(a.re, b, (a + ' ~= ' + b))
      exports.equal(a.im, 0, (a + ' ~= ' + b))
    } else if (b && b.isComplex) {
      exports.equal(a, b.re, (a + ' ~= ' + b))
      exports.equal(0, b.im, (a + ' ~= ' + b))
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
 */
exports.deepEqual = function deepEqual (a, b) {
  let prop, i, len

  if (Array.isArray(a) && Array.isArray(b)) {
    assert.strictEqual(a.length, b.length, a + ' ~= ' + b)
    for (i = 0, len = a.length; i < len; i++) {
      deepEqual(a[i], b[i])
    }
  } else if (a instanceof Object && b instanceof Object) {
    for (prop in a) {
      if (a.hasOwnProperty(prop)) {
        assert.ok(b.hasOwnProperty(prop), a[prop] + ' ~= ' + b[prop])
        deepEqual(a[prop], b[prop])
      }
    }

    for (prop in b) {
      if (b.hasOwnProperty(prop)) {
        assert.ok(a.hasOwnProperty(prop), a[prop] + ' ~= ' + b[prop])
        deepEqual(a[prop], b[prop])
      }
    }
  } else {
    exports.equal(a, b)
  }
}
