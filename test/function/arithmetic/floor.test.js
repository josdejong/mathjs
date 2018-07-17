// test floor
const assert = require('assert')
const approx = require('../../../tools/approx')
const math = require('../../../src/main')
const bignumber = math.bignumber
const complex = math.complex
const fraction = math.fraction
const matrix = math.matrix
const unit = math.unit
const floor = math.floor

describe('floor', function () {
  it('should round booleans correctly', function () {
    assert.equal(floor(true), 1)
    assert.equal(floor(false), 0)
  })

  it('should floor numbers correctly', function () {
    approx.equal(floor(0), 0)
    approx.equal(floor(1), 1)
    approx.equal(floor(1.3), 1)
    approx.equal(floor(1.8), 1)
    approx.equal(floor(2), 2)
    approx.equal(floor(-1), -1)
    approx.equal(floor(-1.3), -2)
    approx.equal(floor(-1.8), -2)
    approx.equal(floor(-2), -2)
    approx.equal(floor(-2.1), -3)
    approx.equal(floor(math.pi), 3)
  })

  it('should floor big numbers correctly', function () {
    assert.deepEqual(floor(bignumber(0)), bignumber(0))
    assert.deepEqual(floor(bignumber(1)), bignumber(1))
    assert.deepEqual(floor(bignumber(1.3)), bignumber(1))
    assert.deepEqual(floor(bignumber(1.8)), bignumber(1))
    assert.deepEqual(floor(bignumber(2)), bignumber(2))
    assert.deepEqual(floor(bignumber(-1)), bignumber(-1))
    assert.deepEqual(floor(bignumber(-1.3)), bignumber(-2))
    assert.deepEqual(floor(bignumber(-1.8)), bignumber(-2))
    assert.deepEqual(floor(bignumber(-2)), bignumber(-2))
    assert.deepEqual(floor(bignumber(-2.1)), bignumber(-3))
  })

  it('should floor complex numbers correctly', function () {
    approx.deepEqual(floor(complex(0, 0)), complex(0, 0))
    approx.deepEqual(floor(complex(1.3, 1.8)), complex(1, 1))
    approx.deepEqual(floor(math.i), complex(0, 1))
    approx.deepEqual(floor(complex(-1.3, -1.8)), complex(-2, -2))
  })

  it('should floor fractions correctly', function () {
    const a = fraction('2/3')
    assert(floor(a) instanceof math.type.Fraction)
    assert.equal(a.toString(), '0.(6)')

    assert.equal(floor(fraction(0)).toString(), '0')
    assert.equal(floor(fraction(1)).toString(), '1')
    assert.equal(floor(fraction(1.3)).toString(), '1')
    assert.equal(floor(fraction(1.8)).toString(), '1')
    assert.equal(floor(fraction(2)).toString(), '2')
    assert.equal(floor(fraction(-1)).toString(), '-1')
    assert.equal(floor(fraction(-1.3)).toString(), '-2')
    assert.equal(floor(fraction(-1.8)).toString(), '-2')
    assert.equal(floor(fraction(-2)).toString(), '-2')
    assert.equal(floor(fraction(-2.1)).toString(), '-3')
  })

  it('should throw an error with a unit', function () {
    assert.throws(function () { floor(unit('5cm')) }, TypeError, 'Function floor(unit) not supported')
  })

  it('should convert a string to a number', function () {
    assert.strictEqual(floor('1.8'), 1)
  })

  it('should floor all elements in a matrix', function () {
    approx.deepEqual(floor([1.2, 3.4, 5.6, 7.8, 10.0]), [1, 3, 5, 7, 10])
    approx.deepEqual(floor(matrix([1.2, 3.4, 5.6, 7.8, 10.0])), matrix([1, 3, 5, 7, 10]))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { floor() }, /TypeError: Too few arguments/)
    assert.throws(function () { floor(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { floor(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX floor', function () {
    const expression = math.parse('floor(0.6)')
    assert.equal(expression.toTex(), '\\left\\lfloor0.6\\right\\rfloor')
  })
})
