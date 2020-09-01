import assert from 'assert'
import math from '../../../../src/bundleAny'
const { digits, bignumber } = math

describe('digits', function () {
  it('should return the number of digits in a number', function () {
    assert.strictEqual(digits(1), 1)
    assert.strictEqual(digits(5985), 4)
    assert.strictEqual(digits(579), 3)
    assert.strictEqual(digits(82), 2)
  })
  it('should return the number of digits in a big number', function () {
    assert.strictEqual(digits(bignumber(1234567950)), 10)
    assert.strictEqual(digits(bignumber(456218)), 6)
    assert.strictEqual(digits(bignumber(69)), 2)
    assert.strictEqual(digits(bignumber(51249)), 5)
  })
})
