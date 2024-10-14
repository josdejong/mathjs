import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const tanh = math.tanh
const bigmath = math.create({ number: 'BigNumber', precision: 20 })

describe('tanh', function () {
  it('should return the tanh of a boolean', function () {
    approxEqual(tanh(true), 0.76159415595576)
    approxEqual(tanh(false), 0)
  })

  it('should return the tanh of a number', function () {
    approxEqual(tanh(0), 0)
    approxEqual(tanh(pi), 0.99627207622075)
    approxEqual(tanh(1), 0.76159415595576)
    approxEqual(tanh(2), 0.96402758007582)
    approxEqual(tanh(3), 0.99505475368673)
  })

  it('should return the tanh of a bignumber', function () {
    const tanhBig = bigmath.tanh
    const Big = bigmath.bignumber

    const arg1 = Big(-Infinity)
    const arg2 = Big(-3)
    const arg10 = Big(Infinity)
    assert.deepStrictEqual(tanhBig(arg1), Big(-1))
    assert.deepStrictEqual(tanhBig(arg2), Big('-0.99505475368673045133'))
    assert.deepStrictEqual(tanhBig(Big(-2)), Big('-0.96402758007581688395'))
    assert.deepStrictEqual(tanhBig(Big(-1)), Big('-0.76159415595576488812'))
    assert.deepStrictEqual(tanhBig(Big(0)), Big(0))
    assert.deepStrictEqual(tanhBig(Big(1)), Big('0.76159415595576488812'))
    assert.deepStrictEqual(tanhBig(Big(2)), Big('0.96402758007581688395'))
    assert.deepStrictEqual(tanhBig(Big(3)), Big('0.99505475368673045133'))
    assert.deepStrictEqual(tanhBig(bigmath.pi).toString(), '0.99627207622074994426')
    assert.deepStrictEqual(tanhBig(arg10), Big(1))

    // Make sure args were not changed
    assert.deepStrictEqual(arg1.toString(), '-Infinity')
    assert.deepStrictEqual(arg2, Big(-3))
    assert.deepStrictEqual(arg10.toString(), 'Infinity')
  })

  it('should return the tanh of a complex number', function () {
    approxDeepEqual(tanh(complex('1')), complex(0.76159415595576, 0))
    approxDeepEqual(tanh(complex('i')), complex(0, 1.5574077246549))
    approxDeepEqual(tanh(complex('2 + i')), complex(1.0147936161466, 0.033812826079897))
  })

  it('should throw an error on an angle', function () {
    assert.throws(() => tanh(unit('90deg')), TypeError)
  })

  it('should throw an error if called with an invalid unit', function () {
    assert.throws(function () { tanh(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { tanh('string') })
  })

  const tanh123 = [0.76159415595576, 0.96402758007582, 0.99505475368673]

  it('should not operate on an array', function () {
    assert.throws(() => tanh([1, 2, 3]), TypeError)
    approxDeepEqual(math.map([1, 2, 3], tanh), tanh123)
  })

  it('should not operate on a matrix', function () {
    assert.throws(() => tanh(matrix([1, 2, 3])), TypeError)
    approxDeepEqual(math.map(matrix([1, 2, 3]), tanh), matrix(tanh123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { tanh() }, /TypeError: Too few arguments/)
    assert.throws(function () { tanh(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX tanh', function () {
    const expression = math.parse('tanh(1)')
    assert.strictEqual(expression.toTex(), '\\tanh\\left(1\\right)')
  })
})
