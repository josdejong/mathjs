// test norm
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('norm', function () {
  it('should return the absolute value of a boolean', function () {
    assert.strictEqual(math.norm(true), 1)
    assert.strictEqual(math.norm(false), 0)
  })

  it('should return the absolute value of a number', function () {
    assert.strictEqual(math.norm(-4.2), 4.2)
    assert.strictEqual(math.norm(-3.5), 3.5)
    assert.strictEqual(math.norm(100), 100)
    assert.strictEqual(math.norm(0), 0)
  })

  it('should return the absolute value of a big number', function () {
    assert.deepStrictEqual(math.norm(math.bignumber(-2.3)), math.bignumber(2.3))
    assert.deepStrictEqual(math.norm(math.bignumber('5e500')), math.bignumber('5e500'))
    assert.deepStrictEqual(math.norm(math.bignumber('-5e500')), math.bignumber('5e500'))
    assert.deepStrictEqual(math.norm(math.bignumber(-2.3)), math.bignumber(2.3))
    assert.deepStrictEqual(math.norm([math.bignumber(-2.3)], 'fro'), math.bignumber(2.3))
    assert.deepStrictEqual(math.norm([[math.bignumber(-2.3)]], 'fro'), math.bignumber(2.3))
  })

  it('should return the norm of a complex number', function () {
    assert.strictEqual(math.norm(math.complex(3, -4)), 5)
    assert.strictEqual(math.norm(math.complex(1e200, -4e200)), 4.12310562561766e+200)
    assert.strictEqual(math.norm(math.complex(-4e200, 1e200)), 4.12310562561766e+200)
    assert.strictEqual(math.norm(math.matrix([[math.complex(3, -4)]]), 'fro'), 5)
  })

  it('should return the norm of a vector', function () {
    // empty vector
    assert.strictEqual(math.norm([]), 0.0)
    assert.strictEqual(math.norm(math.matrix([])), 0.0)
    // p = Infinity
    assert.strictEqual(math.norm([1, 2, -3], Number.POSITIVE_INFINITY), 3)
    assert.strictEqual(math.norm(math.matrix([1, 2, -3]), Number.POSITIVE_INFINITY), 3)
    assert.strictEqual(math.norm([1, 2, -3], 'inf'), 3)
    assert.strictEqual(math.norm(math.matrix([1, 2, -3]), 'inf'), 3)
    // p = -Infinity
    assert.strictEqual(math.norm([1, 2, -3], Number.NEGATIVE_INFINITY), 1)
    assert.strictEqual(math.norm(math.matrix([1, 2, -3]), Number.NEGATIVE_INFINITY), 1)
    assert.strictEqual(math.norm([1, 2, -3], '-inf'), 1)
    assert.strictEqual(math.norm(math.matrix([1, 2, -3]), '-inf'), 1)
    // p == 1
    assert.strictEqual(math.norm([-3, -4], 1), 7.0)
    assert.strictEqual(math.norm(math.matrix([-3, -4]), 1), 7.0)
    // p - positive
    assert.strictEqual(math.norm([3, 4], 2), 5.0)
    assert.strictEqual(math.norm(math.matrix([3, 4]), 2), 5.0)
    // p - negative
    assert.strictEqual(math.norm([3, 4], -2), 2.4)
    assert.strictEqual(math.norm(math.matrix([3, 4]), -2), 2.4)
    // missing p (defaults to 2)
    assert.strictEqual(math.norm([3, 4]), 5.0)
    assert.strictEqual(math.norm(math.matrix([3, 4])), 5.0)
    // p == 'fro'
    assert.strictEqual(math.norm([3, 4], 'fro'), 5.0)
    assert.strictEqual(math.norm(math.matrix([3, 4]), 'fro'), 5.0)
    // p == 0
    assert.strictEqual(math.norm([3, 4], 0), Number.POSITIVE_INFINITY)
    assert.strictEqual(math.norm(math.matrix([3, 4]), 0), Number.POSITIVE_INFINITY)
  })

  it('should return the norm of a matrix', function () {
    // p = 1
    assert.strictEqual(math.norm([[1, 2], [3, 4]], 1), 6)
    assert.strictEqual(math.norm(math.matrix([[1, 2], [3, 4]]), 1), 6)
    assert.strictEqual(math.norm(math.matrix([[1, 2], [3, 4]], 'sparse'), 1), 6)
    // p = Infinity
    assert.strictEqual(math.norm([[1, 2], [3, 4]], Number.POSITIVE_INFINITY), 7)
    assert.strictEqual(math.norm(math.matrix([[1, 2], [3, 4]]), Number.POSITIVE_INFINITY), 7)
    assert.strictEqual(math.norm(math.matrix([[1, 2], [3, 4]], 'sparse'), Number.POSITIVE_INFINITY), 7)
    assert.strictEqual(math.norm([[1, 2], [3, 4]], 'inf'), 7)
    assert.strictEqual(math.norm(math.matrix([[1, 2], [3, 4]]), 'inf'), 7)
    assert.strictEqual(math.norm(math.matrix([[1, 2], [3, 4]], 'sparse'), 'inf'), 7)
    // p = 'fro'
    assert.strictEqual(math.norm([[1, 2], [-3, -4]], 'fro'), math.sqrt(30))
    assert.strictEqual(math.norm(math.matrix([[1, 2], [-3, -4]]), 'fro'), math.sqrt(30))
    assert.strictEqual(math.norm(math.matrix([[1, 2], [-3, -4]], 'sparse'), 'fro'), math.sqrt(30))
    // p = '2'
    assert.strictEqual(math.norm([[2, 0], [0, 3]], 2), 3)
    assert.strictEqual(math.round(math.norm([
      [53 / 360, -13 / 90, 23 / 360],
      [-11 / 180, 1 / 45, 19 / 180],
      [-7 / 360, 17 / 90, -37 / 360]
    ], 2), 10), 0.2886751346)
  })

  it('should not fail in case of a zero matrix', function () {
    assert.strictEqual(math.norm([[0, 0, 0], [0, 0, 0], [0, 0, 0]], 'fro'), 0)
    assert.strictEqual(math.norm([[0, 0, 0], [0, 0, 0], [0, 0, 0]], 1), 0)
    assert.strictEqual(math.norm([[0, 0, 0], [0, 0, 0], [0, 0, 0]], 2), 0)
    assert.strictEqual(math.norm([[0, 0, 0], [0, 0, 0], [0, 0, 0]], 'inf'), 0)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { math.norm() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.norm(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { math.norm(null) }, /Unexpected type of argument in function norm/)

    assert.throws(function () { math.norm([[], []], 'fro') }, /RangeError: Invalid matrix dimensions/)
    assert.throws(function () { math.norm([[], []], 1) }, /RangeError: Invalid matrix dimensions/)
    assert.throws(function () { math.norm([[], []], 2) }, /RangeError: Invalid matrix dimensions/)
    assert.throws(function () { math.norm([[], []], 'inf') }, /RangeError: Invalid matrix dimensions/)

    assert.throws(function () { math.norm([[1, 2, 3], [2, 1, 3]], 2) }, /RangeError: Invalid matrix dimensions/)
  })

  it('should throw an error with a string', function () {
    assert.throws(function () {
      math.norm('a string')
    })
  })

  it('should LaTeX norm', function () {
    const expr1 = math.parse('norm(a)')
    const expr2 = math.parse('norm(a,2)')

    assert.strictEqual(expr1.toTex(), '\\left\\| a\\right\\|')
    assert.strictEqual(expr2.toTex(), '\\mathrm{norm}\\left( a,2\\right)')
  })
})
