// test xgcd
import assert from 'assert'

import defaultMath from '../../../../src/defaultInstance.js'
const math = defaultMath.create({ matrix: 'Array' })
const gcd = math.gcd
const xgcd = math.xgcd

describe('xgcd', function () {
  it('should return extended greatest common divisor of two numbers', function () {
    // xgcd(36163, 21199) = 1247 => -7(36163) + 12(21199) = 1247
    assert.deepStrictEqual([1247, -7, 12], xgcd(36163, 21199))
    // xgcd(120, 23) = 1 => -9(120) + 47(23) = 1
    assert.deepStrictEqual([1, -9, 47], xgcd(120, 23))
    // some unit tests from: https://github.com/sjkaliski/numbers.js/blob/master/test/basic.test.js
    assert.deepStrictEqual([5, -3, 5], xgcd(65, 40))
    assert.deepStrictEqual([5, 5, -3], xgcd(40, 65))
    assert.deepStrictEqual([21, -16, 27], xgcd(1239, 735))
    assert.deepStrictEqual([21, 5, -2], xgcd(105, 252))
    assert.deepStrictEqual([21, -2, 5], xgcd(252, 105))
  })

  it('should calculate xgcd for edge cases around zero', function () {
    assert.deepStrictEqual([3, 1, 0], xgcd(3, 0))
    assert.deepStrictEqual([3, -1, -0], xgcd(-3, 0))
    assert.deepStrictEqual([3, 0, 1], xgcd(0, 3))
    assert.deepStrictEqual([3, -0, -1], xgcd(0, -3))

    assert.deepStrictEqual([1, 0, 1], xgcd(1, 1))
    assert.deepStrictEqual([1, 1, 0], xgcd(1, 0))
    assert.deepStrictEqual([1, -0, -1], xgcd(1, -1))
    assert.deepStrictEqual([1, 0, 1], xgcd(-1, 1))
    assert.deepStrictEqual([1, -1, -0], xgcd(-1, 0))
    assert.deepStrictEqual([1, -0, -1], xgcd(-1, -1))
    assert.deepStrictEqual([1, 0, 1], xgcd(0, 1))
    assert.deepStrictEqual([1, -0, -1], xgcd(0, -1))
    assert.deepStrictEqual([0, 0, 0], xgcd(0, 0))
  })

  it('should calculate xgcd of booleans', function () {
    assert.deepStrictEqual(xgcd(true, true), [1, 0, 1])
    assert.deepStrictEqual(xgcd(true, false), [1, 1, 0])
    assert.deepStrictEqual(xgcd(false, true), [1, 0, 1])
    assert.deepStrictEqual(xgcd(false, false), [0, 0, 0])
  })

  it('should calculate xgcd for BigNumbers', function () {
    assert.deepStrictEqual(xgcd(math.bignumber(65), math.bignumber(40)), [math.bignumber(5), math.bignumber(-3), math.bignumber(5)])
    assert.deepStrictEqual(xgcd(math.bignumber(65), math.bignumber(40)), [math.bignumber(5), math.bignumber(-3), math.bignumber(5)])
  })

  it('should calculate xgcd for mixed BigNumbers and Numbers', function () {
    assert.deepStrictEqual(xgcd(math.bignumber(65), 40), [math.bignumber(5), math.bignumber(-3), math.bignumber(5)])
    assert.deepStrictEqual(xgcd(65, math.bignumber(40)), [math.bignumber(5), math.bignumber(-3), math.bignumber(5)])
  })

  it('should calculate xgcd for edge cases with negative values', function () {
    assert.deepStrictEqual([1, -2, 1], xgcd(2, 5))
    assert.deepStrictEqual([1, -2, -1], xgcd(2, -5))
    assert.deepStrictEqual([1, 2, 1], xgcd(-2, 5))
    assert.deepStrictEqual([1, 2, -1], xgcd(-2, -5))

    assert.deepStrictEqual([2, 1, 0], xgcd(2, 6))
    assert.deepStrictEqual([2, 1, -0], xgcd(2, -6))
    assert.deepStrictEqual([2, -1, 0], xgcd(-2, 6))
    assert.deepStrictEqual([2, -1, -0], xgcd(-2, -6))
  })

  it('should find the greatest common divisor of booleans', function () {
    assert.deepStrictEqual([1, 0, 1], xgcd(true, true))
    assert.deepStrictEqual([1, 1, 0], xgcd(true, false))
    assert.deepStrictEqual([1, 0, 1], xgcd(false, true))
    assert.deepStrictEqual([0, 0, 0], xgcd(false, false))
  })

  it('should give same results as gcd', function () {
    assert.strictEqual(gcd(1239, 735), xgcd(1239, 735)[0])
    assert.strictEqual(gcd(105, 252), xgcd(105, 252)[0])
    assert.strictEqual(gcd(7, 13), xgcd(7, 13)[0])
  })

  it('should return a matrix when configured to use matrices', function () {
    const math1 = math.create({ matrix: 'Matrix' })
    assert.deepStrictEqual(math1.xgcd(65, 40), math1.matrix([5, -3, 5]))

    const math2 = math.create({ matrix: 'Array' })
    assert.deepStrictEqual(math2.xgcd(65, 40), [5, -3, 5])
  })

  it('should throw an error if used with wrong number of arguments', function () {
    assert.throws(function () { xgcd(1) })
    assert.throws(function () { xgcd(1, 2, 3) })
  })

  it('should throw an error for non-integer numbers', function () {
    assert.throws(function () { xgcd(2, 4.1) }, /Parameters in function xgcd must be integer numbers/)
    assert.throws(function () { xgcd(2.3, 4) }, /Parameters in function xgcd must be integer numbers/)
  })

  it('should throw an error when used with a complex number', function () {
    assert.throws(function () { xgcd(math.complex(1, 3), 2) }, TypeError, 'Function xgcd(complex, number) not supported')
  })

  it('should convert to a number when used with a string', function () {
    assert.deepStrictEqual(xgcd('65', '40'), [5, -3, 5])
    assert.throws(function () { xgcd(2, 'a') }, /Cannot convert "a" to a number/)
  })

  it('should throw an error when used with a unit', function () {
    assert.throws(function () { xgcd(math.unit('5cm'), 2) }, TypeError, 'Function xgcd(unit, number) not supported')
  })

  it('should throw an error when used with a matrix', function () {
    assert.throws(function () { xgcd([5, 2, 3], [25, 3, 6]) }, TypeError, 'Function xgcd(array, array) not supported')
  })

  it('should LaTeX xgcd', function () {
    const expression = math.parse('xgcd(2,3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{xgcd}\\left(2,3\\right)')
  })
})
