// test one
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const one = math.one

describe('one', function () {
  it('should return multiplicative identity', function () {
    assert.strictEqual(one(Infinity), 1)
    assert.deepStrictEqual(one(math.bignumber(7)), math.bignumber(1))
    assert.strictEqual(one(-17n), 1n)
    assert.deepStrictEqual(one(math.complex(0, 1)), math.complex(1))
    assert.strictEqual(one(false), true)
    assert.deepStrictEqual(one(math.fraction(3, 10)), math.fraction(1))
    assert.deepStrictEqual(one(math.zeros(3, 3)), math.identity(3))
    assert.throws(() => one(math.zeros(5)))
  })
})
