import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const isPrime = math.isPrime
const bignumber = math.bignumber
const complex = math.complex

describe('isPrime', function () {
  it('should test whether a number is prime', function () {
    assert.strictEqual(isPrime(0), false)
    assert.strictEqual(isPrime(-0), false)
    assert.strictEqual(isPrime(-1), false)
    assert.strictEqual(isPrime(1), false)
    assert.strictEqual(isPrime(2), true)
    assert.strictEqual(isPrime(3), true)
    assert.strictEqual(isPrime(5), true)
    assert.strictEqual(isPrime(7), true)
    assert.strictEqual(isPrime(4), false)
    assert.strictEqual(isPrime(100), false)
    assert.strictEqual(isPrime(102), false)
    assert.strictEqual(isPrime(999), false)
  })

  it('should test whether a bigint is prime', function () {
    assert.strictEqual(isPrime(0n), false)
    assert.strictEqual(isPrime(-0n), false)
    assert.strictEqual(isPrime(-1n), false)
    assert.strictEqual(isPrime(1n), false)
    assert.strictEqual(isPrime(2n), true)
    assert.strictEqual(isPrime(3n), true)
    assert.strictEqual(isPrime(5n), true)
    assert.strictEqual(isPrime(7n), true)
    assert.strictEqual(isPrime(4n), false)
    assert.strictEqual(isPrime(100n), false)
    assert.strictEqual(isPrime(102n), false)
    assert.strictEqual(isPrime(999n), false)
  })

  it('should test whether a BigNumber is prime', function () {
    assert.strictEqual(isPrime(bignumber(0)), false)
    assert.strictEqual(isPrime(bignumber(-0)), false)
    assert.strictEqual(isPrime(bignumber(-1)), false)
    assert.strictEqual(isPrime(bignumber(1)), false)
    assert.strictEqual(isPrime(bignumber(2)), true)
    assert.strictEqual(isPrime(bignumber(3)), true)
    assert.strictEqual(isPrime(bignumber(5)), true)
    assert.strictEqual(isPrime(bignumber(7)), true)
    assert.strictEqual(isPrime(bignumber(4)), false)
    assert.strictEqual(isPrime(bignumber(100)), false)
    assert.strictEqual(isPrime(bignumber(102)), false)
    assert.strictEqual(isPrime(bignumber(999)), false)
  })

  it('should test isPrime element wise on an Array', function () {
    assert.deepStrictEqual(isPrime([0, 1, 2, 5, 9]), [false, false, true, true, false])
  })

  it('should throw an error in case of unsupported data types', function () {
    assert.throws(function () { isPrime(complex(2, 3)) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { isPrime(new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { isPrime({}) }, /TypeError: Unexpected type of argument/)
  })

  it('should work fast for huge values', function () {
    assert.strictEqual(isPrime(bignumber('2305843009213693951')), true)
    assert.strictEqual(isPrime(bignumber('230584300921369395')), false)
  })
})
