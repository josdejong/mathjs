import { nearlyEqual } from '../../../../src/utils/bignumber/nearlyEqual.js'

import assert from 'assert'
import BigNumber from 'decimal.js'

describe('nearlyEqual', function () {
  it('should test whether two BigNumbers are nearly equal', function () {
    const relTol = 1e-2; const absTol = 1e-5
    assert.strictEqual(nearlyEqual(new BigNumber(1), new BigNumber(0.9), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(1), new BigNumber(0.95), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(1), new BigNumber(0.98), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(1), new BigNumber(0.99), relTol, absTol), true)
    assert.strictEqual(nearlyEqual(new BigNumber(1), new BigNumber(0.991), relTol, absTol), true)
    assert.strictEqual(nearlyEqual(new BigNumber(1), new BigNumber(1.1), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(1), new BigNumber(1.05), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(1), new BigNumber(1.02), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(1), new BigNumber(1.01), relTol, absTol), true)
    assert.strictEqual(nearlyEqual(new BigNumber(1), new BigNumber(1), relTol, absTol), true)

    // smaller relTol and absTol
    const relTol2 = 1e-4
    const absTol2 = 1e-7
    assert.strictEqual(nearlyEqual(new BigNumber(1), new BigNumber(0.99), relTol2, absTol2), false)
    assert.strictEqual(nearlyEqual(new BigNumber(1), new BigNumber(0.999), relTol2, absTol2), false)
    assert.strictEqual(nearlyEqual(new BigNumber(1), new BigNumber(0.9999), relTol2, absTol2), true)
  })

  it('should test whether a positive and negative number are nearly equal', function () {
    const relTol = 1e-3
    const absTol = 1e-6
    assert.strictEqual(nearlyEqual(new BigNumber(1.2), new BigNumber(1.2), relTol, absTol), true)
    assert.strictEqual(nearlyEqual(new BigNumber(1.2), new BigNumber(-1.2), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(-1.2), new BigNumber(1.2), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(-1.2), new BigNumber(-1.2), relTol, absTol), true)
  })

  it('should test whether two large numbers are nearly equal', function () {
    const relTol = 1e-2
    const absTol = 1e-5
    assert.strictEqual(nearlyEqual(new BigNumber('1e500'), new BigNumber('0.90e500'), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber('1e500'), new BigNumber('0.95e500'), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber('1e500'), new BigNumber('0.98e500'), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber('1e500'), new BigNumber('0.99e500'), relTol, absTol), true)
  })

  it('should test whether two small numbers are nearly equal (always true)', function () {
    const relTol = 1e-2
    const absTol = 1e-5
    assert.strictEqual(nearlyEqual(new BigNumber('1e-200'), new BigNumber('0.99e-200'), relTol, absTol), true)
    assert.strictEqual(nearlyEqual(new BigNumber('1e-200'), new BigNumber('10e-200'), relTol, absTol), true)
  })

  it('should compare with zero', function () {
    const relTol = 1e-3
    const absTol = 1e-6
    assert.strictEqual(nearlyEqual(new BigNumber(0), new BigNumber(0), relTol, absTol), true)
    assert.strictEqual(nearlyEqual(new BigNumber(0), new BigNumber(-0), relTol, absTol), true)
    assert.strictEqual(nearlyEqual(new BigNumber(0), new BigNumber(1.2), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(0), new BigNumber(1e30), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(0), new BigNumber(1e-3), relTol, absTol), false)
  })

  it('should compare with Infinity', function () {
    const relTol = 1e-3
    const absTol = 1e-6
    assert.strictEqual(nearlyEqual(new BigNumber(1.2), new BigNumber(Infinity), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(Infinity), new BigNumber(1.2), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(Infinity), new BigNumber(Infinity), relTol, absTol), true)
    assert.strictEqual(nearlyEqual(new BigNumber(Infinity), new BigNumber(-Infinity), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(-Infinity), new BigNumber(Infinity), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(-Infinity), new BigNumber(-Infinity), relTol, absTol), true)
  })

  it('should compare with NaN', function () {
    const relTol = 1e-3
    const absTol = 1e-6
    assert.strictEqual(nearlyEqual(new BigNumber(1.2), new BigNumber(NaN), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(NaN), new BigNumber(1.2), relTol, absTol), false)
    assert.strictEqual(nearlyEqual(new BigNumber(NaN), new BigNumber(NaN), relTol, absTol), false)
  })

  it('should use default values when absTol and relTol are undefined', function () {
    assert.strictEqual(nearlyEqual(new BigNumber(1.2), new BigNumber(1.2)), true)
    assert.strictEqual(nearlyEqual(new BigNumber(1.2), new BigNumber(1.2), undefined), true)
    assert.strictEqual(nearlyEqual(new BigNumber(1.2), new BigNumber(1.2), undefined, undefined), true)

    assert.strictEqual(nearlyEqual(new BigNumber(1.2).plus(1e-18), new BigNumber(1.2)), true)
    assert.strictEqual(nearlyEqual(new BigNumber(1.2).plus(1e-18), new BigNumber(1.2), undefined), true)
    assert.strictEqual(nearlyEqual(new BigNumber(1.2).plus(1e-18), new BigNumber(1.2), undefined, undefined), true)

    assert.strictEqual(nearlyEqual(new BigNumber(1.2).plus(1e-8), new BigNumber(1.2)), false)
    assert.strictEqual(nearlyEqual(new BigNumber(1.2).plus(1e-8), new BigNumber(1.2), undefined), false)
    assert.strictEqual(nearlyEqual(new BigNumber(1.2).plus(1e-8), new BigNumber(1.2), undefined, undefined), false)
  })
})
