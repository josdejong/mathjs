import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const isNaN = math.isNaN
const bignumber = math.bignumber
const fraction = math.fraction
const complex = math.complex
const Unit = math.Unit

describe('isNegative', function () {
  it('should test whether a number is NaN', function () {
    assert.strictEqual(isNaN(0), false)
    assert.strictEqual(isNaN(2), false)
    assert.strictEqual(isNaN(-3), false)
    assert.strictEqual(isNaN(Infinity), false)
    assert.strictEqual(isNaN(-Infinity), false)
    assert.strictEqual(isNaN(NaN), true)
  })

  it('should test whether a bigint is NaN', function () {
    assert.strictEqual(isNaN(0n), false)
    assert.strictEqual(isNaN(2n), false)
    assert.strictEqual(isNaN(-3n), false)
  })

  it('should test whether a boolean is NaN', function () {
    assert.strictEqual(isNaN(true), false)
    assert.strictEqual(isNaN(false), false)
  })

  it('should test whether a BigNumber is NaN', function () {
    assert.strictEqual(isNaN(bignumber(0)), false)
    assert.strictEqual(isNaN(bignumber(2)), false)
    assert.strictEqual(isNaN(bignumber(-3)), false)
    assert.strictEqual(isNaN(bignumber(Infinity)), false)
    assert.strictEqual(isNaN(bignumber(-Infinity)), false)
    assert.strictEqual(isNaN(bignumber(NaN)), true)
  })

  it('should test whether a Fraction is NaN', function () {
    assert.strictEqual(isNaN(fraction(2)), false)
    assert.strictEqual(isNaN(fraction(-3)), false)
    assert.strictEqual(isNaN(fraction(0)), false)
  })

  it('should test whether a unit is NaN', function () {
    assert.strictEqual(isNaN(new Unit(0, 'm')), false)
    assert.strictEqual(isNaN(new Unit(0, 'kB')), false)
    assert.strictEqual(isNaN(new Unit(5, 'cm')), false)
    assert.strictEqual(isNaN(new Unit(-3, 'inch')), false)
    assert.strictEqual(isNaN(new Unit(NaN, 'inch')), true)
  })

  it('should test whether a complex number contains NaN', function () {
    assert.strictEqual(isNaN(complex(0, 0)), false)
    assert.strictEqual(isNaN(complex(NaN, 0)), true)
    assert.strictEqual(isNaN(complex(0, NaN)), true)
    assert.strictEqual(isNaN(complex(NaN, NaN)), true)
  })

  it('should test whether a string contains a NaN', function () {
    assert.strictEqual(isNaN('2'), false)
    assert.strictEqual(isNaN('-2'), false)
    assert.strictEqual(isNaN('0'), false)
    assert.throws(function () { isNaN('NaN') }, /Error: Cannot convert "NaN" to a number/)
    assert.strictEqual(isNaN(''), false)
  })

  it('should test isNaN element wise on an Array', function () {
    assert.deepStrictEqual(isNaN([0, 5, -2, NaN]), [false, false, false, true])
  })

  it('should test isNaN element wise on a Matrix', function () {
    assert.deepStrictEqual(isNaN(math.matrix([0, 5, -2, NaN])), math.matrix([false, false, false, true]))
  })

  it('should test isNaN element wise on a Matrix of units', function () {
    assert.deepStrictEqual(isNaN(math.matrix([new Unit(3, 'ft'), new Unit(NaN, 'ft')])), math.matrix([false, true]))
  })

  it('should throw an error in case of unsupported data types', function () {
    assert.throws(function () { isNaN(new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { isNaN({}) }, /TypeError: Unexpected type of argument/)
  })
})
