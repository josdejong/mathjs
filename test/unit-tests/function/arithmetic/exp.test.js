// test exp
import assert from 'assert'

import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const complex = math.complex
const matrix = math.matrix
const sparse = math.sparse
const unit = math.unit
const exp = math.exp

describe('exp', function () {
  it('should exponentiate a boolean', function () {
    approx.equal(exp(true), 2.71828182845905)
    approx.equal(exp(false), 1)
  })

  it('should exponentiate a number', function () {
    approx.equal(exp(-3), 0.0497870683678639)
    approx.equal(exp(-2), 0.1353352832366127)
    approx.equal(exp(-1), 0.3678794411714423)
    approx.equal(exp(0), 1)
    approx.equal(exp(1), 2.71828182845905)
    approx.equal(exp(2), 7.38905609893065)
    approx.equal(exp(3), 20.0855369231877)
    approx.equal(exp(math.log(100)), 100)
  })

  it('should exponentiate a bignumber', function () {
    const bigmath = math.create({ precision: 100 })

    assert.deepStrictEqual(bigmath.exp(bigmath.bignumber(1)), bigmath.bignumber('2.718281828459045235360287471352662497757247093699959574966967627724076630353547594571382178525166427'))
  })

  it('should throw an error if there\'s wrong number of arguments', function () {
    assert.throws(function () { exp() }, /TypeError: Too few arguments/)
    assert.throws(function () { exp(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { exp(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should exponentiate a complex number correctly', function () {
    approx.deepEqual(exp(math.i), complex('0.540302305868140 + 0.841470984807897i'))
    approx.deepEqual(exp(complex(0, -1)), complex('0.540302305868140 - 0.841470984807897i'))
    approx.deepEqual(exp(complex(1, 1)), complex('1.46869393991589 + 2.28735528717884i'))
    approx.deepEqual(exp(complex(1, -1)), complex('1.46869393991589 - 2.28735528717884i'))
    approx.deepEqual(exp(complex(-1, -1)), complex('0.198766110346413 - 0.309559875653112i'))
    approx.deepEqual(exp(complex(-1, 1)), complex('0.198766110346413 + 0.309559875653112i'))
    approx.deepEqual(exp(complex(1, 0)), complex('2.71828182845905'))

    // test some logic identities
    const multiply = math.multiply
    const pi = math.pi
    const i = math.i
    approx.deepEqual(exp(multiply(0.5, multiply(pi, i))), complex(0, 1))
    approx.deepEqual(exp(multiply(1, multiply(pi, i))), complex(-1, 0))
    approx.deepEqual(exp(multiply(1.5, multiply(pi, i))), complex(0, -1))
    approx.deepEqual(exp(multiply(2, multiply(pi, i))), complex(1, 0))
    approx.deepEqual(exp(multiply(-0.5, multiply(pi, i))), complex(0, -1))
    approx.deepEqual(exp(multiply(-1, multiply(pi, i))), complex(-1, 0))
    approx.deepEqual(exp(multiply(-1.5, multiply(pi, i))), complex(0, 1))
  })

  it('should throw an error on a unit', function () {
    assert.throws(function () { exp(unit('5cm')) })
  })

  it('should throw an error with a string', function () {
    assert.throws(function () { exp('text') })
  })

  it('should not operate on matrices, arrays and ranges', function () {
    // array
    assert.throws(() => exp([0, 1, 2, 3]), /Function 'exp' doesn't apply/)
    approx.deepEqual(math.map([0, 1, 2, 3], exp), [1, 2.71828182845905, 7.38905609893065, 20.0855369231877])
    approx.deepEqual(math.map([[0, 1], [2, 3]], exp), [[1, 2.71828182845905], [7.38905609893065, 20.0855369231877]])
    // dense matrix
    assert.throws(() => exp(matrix([0, 1, 2, 3])), TypeError)
    approx.deepEqual(math.map(matrix([0, 1, 2, 3]), exp), matrix([1, 2.71828182845905, 7.38905609893065, 20.0855369231877]))
    approx.deepEqual(math.map(matrix([[0, 1], [2, 3]]), exp), matrix([[1, 2.71828182845905], [7.38905609893065, 20.0855369231877]]))
    // sparse matrix, TODO: it should return a dense matrix
    approx.deepEqual(math.map(sparse([[0, 1], [2, 3]]), exp), sparse([[1, 2.71828182845905], [7.38905609893065, 20.0855369231877]]))
  })

  it('should LaTeX exp', function () {
    const expression = math.parse('exp(0)')
    assert.strictEqual(expression.toTex(), '\\exp\\left(0\\right)')
  })
})
