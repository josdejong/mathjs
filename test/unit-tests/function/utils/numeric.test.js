import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const numeric = math.numeric
const bignumber = math.bignumber
const fraction = math.fraction

describe('numeric', function () {
  it('should convert things to numbers', function () {
    assert.strictEqual(numeric(99), 99)
    assert(isNaN(numeric(NaN, 'number')))
    assert.strictEqual(numeric('Infinity'), Infinity)
    assert.strictEqual(numeric('-2.7', 'number'), -2.7)
    assert.strictEqual(numeric(true), 1)
    assert.strictEqual(numeric(false, 'number'), 0)
    assert.strictEqual(numeric(bignumber('3.7e6')), 3.7e6)
    assert.strictEqual(numeric(bignumber(-1.5), 'number'), -1.5)
    assert.strictEqual(numeric(fraction(5, 4)), 1.25)
    assert.strictEqual(numeric(fraction(-3, 8), 'number'), -0.375)
    assert.strictEqual(numeric(0n), 0)
    assert.strictEqual(numeric(2n ** 48n, 'number'), 2 ** 48)
  })

  it('should convert things to bignumbers', function () {
    assert.deepStrictEqual(numeric(99, 'BigNumber'), bignumber(99))
    assert.deepStrictEqual(numeric(NaN, 'BigNumber'), bignumber(NaN))
    assert.deepStrictEqual(numeric('Infinity', 'BigNumber'), bignumber(Infinity))
    assert.deepStrictEqual(numeric('-2.7', 'BigNumber'), bignumber(-2.7))
    assert.deepStrictEqual(numeric(true, 'BigNumber'), bignumber(1))
    assert.deepStrictEqual(
      numeric(bignumber('3.7e6'), 'BigNumber'), bignumber(3.7e6))
    assert.deepStrictEqual(numeric(fraction(5, 4), 'BigNumber'), bignumber(1.25))
    assert.deepStrictEqual(numeric(0n, 'BigNumber'), bignumber(0))
  })

  // See further tests in the non-standard location
  // test/unit-tests/type/numeric.test.js
})
