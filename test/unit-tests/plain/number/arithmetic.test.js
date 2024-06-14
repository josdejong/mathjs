import assert from 'assert'
import { approxEqual } from '../../../../tools/approx.js'
import { modNumber } from '../../../../src/plain/number/arithmetic.js'

describe('mod', function () {
  it('should calculate the modulus of two numbers', function () {
    assert.strictEqual(modNumber(1, 1), 0)
    assert.strictEqual(modNumber(0, 1), 0)
    assert.strictEqual(modNumber(1, 0), 1)
    assert.strictEqual(modNumber(0, 0), 0)
    assert.strictEqual(modNumber(7, 0), 7)

    approxEqual(modNumber(7, 2), 1)
    approxEqual(modNumber(9, 3), 0)
    approxEqual(modNumber(10, 4), 2)
    approxEqual(modNumber(-10, 4), 2)
    approxEqual(modNumber(8.2, 3), 2.2)
    approxEqual(modNumber(4, 1.5), 1)
    approxEqual(modNumber(0, 3), 0)
    approxEqual(modNumber(-10, 4), 2)
    approxEqual(modNumber(-5, 3), 1)
  })

  it('should calculate mod for negative divisor', function () {
    assert.strictEqual(modNumber(10, -4), -2)
  })
})
