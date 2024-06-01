// test square
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const fraction = math.fraction
const matrix = math.matrix
const square = math.square

describe('square', function () {
  it('should return the square of a boolean', function () {
    assert.strictEqual(square(true), 1)
    assert.strictEqual(square(false), 0)
  })

  it('should return the square of a number', function () {
    assert.strictEqual(square(4), 16)
    assert.strictEqual(square(-2), 4)
    assert.strictEqual(square(0), 0)
  })

  it('should return the square of a bigint', function () {
    assert.strictEqual(square(4n), 16n)
    assert.strictEqual(square(-2n), 4n)
    assert.strictEqual(square(0n), 0n)
  })

  it('should return the square of a big number', function () {
    assert.deepStrictEqual(square(bignumber(4)), bignumber(16))
    assert.deepStrictEqual(square(bignumber(-2)), bignumber(4))
    assert.deepStrictEqual(square(bignumber(0)), bignumber(0))
  })

  it('should return the square of a fraction', function () {
    const a = fraction(0.5)
    assert(square(a) instanceof math.Fraction)
    assert.strictEqual(square(a).toString(), '0.25')
    assert.strictEqual(a.toString(), '0.5')
  })

  it('should throw an error if used with wrong number of arguments', function () {
    assert.throws(function () { square() }, /TypeError: Too few arguments/)
    assert.throws(function () { square(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { square(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should return the square of a complex number', function () {
    assert.deepStrictEqual(square(math.complex('2i')), math.complex('-4'))
    assert.deepStrictEqual(square(math.complex('2+3i')), math.complex('-5+12i'))
    assert.deepStrictEqual(square(math.complex('2')), math.complex('4'))
  })

  it('should return the square of a unit', function () {
    assert.strictEqual(square(math.unit('4 cm')).toString(), '16 cm^2')
    assert.strictEqual(square(math.unit('-2 cm')).toString(), '4 cm^2')
    assert.strictEqual(square(math.unit('0 cm')).toString(), '0 cm^2')
  })

  it('should throw an error when used with a string', function () {
    assert.throws(function () { square('text') })
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => square([2, 3, 4, 5]), TypeError)
    assert.deepStrictEqual(math.map([2, 3, 4, 5], square), [4, 9, 16, 25])
    assert.deepStrictEqual(math.map(matrix([2, 3, 4, 5]), square), matrix([4, 9, 16, 25]))
    assert.deepStrictEqual(math.map(matrix([[1, 2], [3, 4]]), square), matrix([[1, 4], [9, 16]]))
  })

  it('should LaTeX square', function () {
    const expression = math.parse('square(4)')
    assert.strictEqual(expression.toTex(), '\\left(4\\right)^2')
  })
})
