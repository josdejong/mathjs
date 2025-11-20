// test zero
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const zero = math.zero

describe('zero', function () {
  it('should return additive identity', function () {
    assert.strictEqual(zero(-Infinity), 0)
    assert.deepStrictEqual(zero(math.bignumber(7)), math.bignumber(0))
    assert.strictEqual(zero(117n), 0n)
    assert.deepStrictEqual(zero(math.complex(0, 1)), math.complex(0))
    assert.strictEqual(zero(false), false)
    assert.deepStrictEqual(zero(math.fraction(3, 10)), math.fraction(0))
    assert.deepStrictEqual(
      zero(math.identity(3, 3)), math.zeros(math.matrix([3, 3])))
    assert.deepStrictEqual(zero([1, 2, 3]), math.zeros([3]))
  })
})
