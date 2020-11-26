// test cube
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const fraction = math.fraction
const matrix = math.matrix
const cube = math.cube

describe('cube', function () {
  it('should return the cube of a boolean', function () {
    assert.strictEqual(cube(true), 1)
    assert.strictEqual(cube(false), 0)
  })

  it('should return the cube of a number', function () {
    assert.strictEqual(cube(4), 64)
    assert.strictEqual(cube(-2), -8)
    assert.strictEqual(cube(0), 0)
  })

  it('should return the cube of a big number', function () {
    assert.deepStrictEqual(cube(bignumber(4)), bignumber(64))
    assert.deepStrictEqual(cube(bignumber(-2)), bignumber(-8))
    assert.deepStrictEqual(cube(bignumber(0)), bignumber(0))
  })

  it('should return the cube of a fraction', function () {
    const a = fraction(0.5)
    assert(cube(a) instanceof math.Fraction)
    assert.strictEqual(cube(a).toString(), '0.125')
    assert.strictEqual(a.toString(), '0.5')
  })

  it('should return the cube of a complex number', function () {
    assert.deepStrictEqual(cube(math.complex('2i')), math.complex(-0, -8))
    assert.deepStrictEqual(cube(math.complex('2+3i')), math.complex('-46+9i'))
    assert.deepStrictEqual(cube(math.complex('2')), math.complex('8'))
  })

  it('should return the cube of a unit', function () {
    assert.strictEqual(cube(math.unit('4 cm')).toString(), '64 cm^3')
    assert.strictEqual(cube(math.unit('-2 cm')).toString(), '-8 cm^3')
    assert.strictEqual(cube(math.unit('0 cm')).toString(), '0 cm^3')
  })

  it('should throw an error with strings', function () {
    assert.throws(function () { cube('text') })
  })

  it('should throw an error if there\'s wrong number of args', function () {
    assert.throws(function () { cube() }, /TypeError: Too few arguments/)
    assert.throws(function () { cube(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { cube(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should cube each element in a matrix, array or range', function () {
    // array, matrix, range
    // arrays are evaluated element wise
    assert.deepStrictEqual(cube([2, 3, 4, 5]), [8, 27, 64, 125])
    assert.deepStrictEqual(cube(matrix([2, 3, 4, 5])), matrix([8, 27, 64, 125]))
    assert.deepStrictEqual(cube(matrix([[1, 2], [3, 4]])), matrix([[1, 8], [27, 64]]))
  })

  it('should LaTeX cube', function () {
    const expression = math.parse('cube(2)')
    assert.strictEqual(expression.toTex(), '\\left(2\\right)^3')
  })
})
