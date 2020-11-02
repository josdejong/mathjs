// test modMultiplicativeInverse
import assert from 'assert'

import math from '../../../../src/bundleAny'

const {
  bignumber,
  modMultiplicativeInverse
} = math

describe('modMultiplicativeInverse', function () {
  it('should calculate the modular multiplicative inverse of two numbers', () => {
    assert.strictEqual(modMultiplicativeInverse(7, 26), 15)
    assert.strictEqual(modMultiplicativeInverse(5, 17), 7)
    assert.strictEqual(modMultiplicativeInverse(42, 103), 27)
  })

  it('should throw an error if used with wrong number of arguments', function () {
    assert.throws(function () { modMultiplicativeInverse(1) }, /TypeError: Too few arguments/)
    assert.throws(function () { modMultiplicativeInverse(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error if used with wrong type of arguments', function () {
    assert.throws(function () { modMultiplicativeInverse(1, new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { modMultiplicativeInverse(1, null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { modMultiplicativeInverse(new Date(), bignumber(2)) }, /TypeError: Unexpected type of argument/)
  })
})
