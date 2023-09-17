// test modNumber function in src\plain\number\arithmetic.js
import assert from 'assert'
import { modNumber as mod } from '../../../../lib/cjs/plain/number/aristhmetic'
import approx from '../../../../tools/approx.js'

const math = require('../../../../lib/cjs/defaultInstance').default
const bignumber = math.bignumber

describe('mod', function () {
  it('should calculate the modulus of booleans correctly', function () {
    assert.strictEqual(mod(true, true), 0)
    assert.strictEqual(mod(false, true), 0)
    assert.strictEqual(mod(true, false), 1)
    assert.strictEqual(mod(false, false), 0)
  })

  it('should calculate the modulus of two numbers', function () {
    assert.strictEqual(mod(1, 1), 0)
    assert.strictEqual(mod(0, 1), 0)
    assert.strictEqual(mod(1, 0), 1)
    assert.strictEqual(mod(0, 0), 0)
    assert.strictEqual(mod(7, 0), 7)

    approx.equal(mod(7, 2), 1)
    approx.equal(mod(9, 3), 0)
    approx.equal(mod(10, 4), 2)
    approx.equal(mod(-10, 4), 2)
    approx.equal(mod(8.2, 3), 2.2)
    approx.equal(mod(4, 1.5), 1)
    approx.equal(mod(0, 3), 0)
    approx.equal(mod(-10, 4), 2)
    approx.equal(mod(-5, 3), 1)
  })

  it('should handle precise approximation of float approximation', function () {
    approx.equal(mod(0.1, 0.01), 0)
    approx.equal(mod(0.15, 0.05), 0)
    approx.equal(mod(1.23456789, 0.00000000001), 0)
  })

  it('should calculate mod for negative divisor', function () {
    assert.strictEqual(mod(10, -4), -2)
  })

  it('should throw an error if used with wrong number of arguments', function () {
    assert.throws(function () { mod(1) }, /TypeError: Too few arguments/)
    assert.throws(function () { mod(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error if used with wrong type of arguments', function () {
    assert.throws(function () { mod(1, new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { mod(1, null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { mod(new Date(), bignumber(2)) }, /TypeError: Unexpected type of argument/)
  })
})
