import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import approx from '../../../../tools/approx.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const sech = math.sech
const bigmath = math.create({ precision: 20 })
const biggermath = math.create({ number: 'BigNumber', precision: 21 })

describe('sech', function () {
  it('should return the sech of a boolean', function () {
    approx.equal(sech(true), 0.64805427366389)
    approx.equal(sech(false), 1)
  })

  it('should return the sech of a number', function () {
    approx.equal(sech(0), 1)
    approx.equal(sech(pi), 0.086266738334054)
    approx.equal(sech(1), 0.64805427366389)
    approx.equal(sech(2), 0.26580222883408)
    approx.equal(sech(3), 0.099327927419433)
  })

  it('should return the sech of a bignumber', function () {
    const sechBig = bigmath.sech
    const Big = bigmath.bignumber

    assert.deepStrictEqual(sechBig(Big(0)), Big(1))
    assert.deepStrictEqual(sechBig(Big(1)), Big('0.64805427366388539957'))
    assert.deepStrictEqual(sechBig(Big(2)), Big('0.26580222883407969212'))
    assert.deepStrictEqual(sechBig(Big(3)), Big('0.099327927419433207829'))

    /* Pass in extra digits to pi. */
    assert.deepStrictEqual(sechBig(biggermath.pi), Big('0.086266738334054414697'))
  })

  it('should return the sech of a complex number', function () {
    approx.deepEqual(sech(complex('1')), complex(0.64805427366389, 0))
    approx.deepEqual(sech(complex('i')), complex(1.8508157176809, 0))
    approx.deepEqual(sech(complex('2 + i')), complex(0.15117629826558, -0.22697367539372))
  })

  it('should return the sech of an angle', function () {
    approx.equal(sech(unit('90deg')), 0.39853681533839)
    approx.equal(sech(unit('-45deg')), 0.75493970871413)

    assert(math.isBigNumber(sech(unit(math.bignumber(90), 'deg'))))
    approx.equal(sech(unit(math.bignumber(90), 'deg')).toNumber(), 0.39853681533839)

    approx.deepEqual(sech(unit(complex('2 + i'), 'rad')), complex(0.15117629826558, -0.22697367539372))
  })

  it('should throw an error if called with an invalid unit', function () {
    assert.throws(function () { sech(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { sech('string') })
  })

  const sech123 = [0.64805427366389, 0.26580222883408, 0.099327927419433]

  it('should return the sech of each element of an array', function () {
    approx.deepEqual(sech([1, 2, 3]), sech123)
  })

  it('should return the sech of each element of a matrix', function () {
    approx.deepEqual(sech(matrix([1, 2, 3])), matrix(sech123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { sech() }, /TypeError: Too few arguments/)
    assert.throws(function () { sech(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX sech', function () {
    const expression = math.parse('sech(1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{sech}\\left(1\\right)')
  })
})
