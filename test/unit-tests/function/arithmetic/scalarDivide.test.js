// test scalarDivide (check if an element is a scalar multiple of another)
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const sD = math.scalarDivide
const C = math.complex
const frac = math.fraction
const Big = math.bignumber
const M = math.matrix

describe('scalarDivide', function () {
  it('should determine when one scalar is a multiple of another', function () {
    assert.strictEqual(sD(4, 2), 2)
    assert.strictEqual(sD(-4, 2), -2)
    assert.strictEqual(sD(4, -2), -2)
    assert.strictEqual(sD(-4, -2), 2)
    assert.strictEqual(sD(4, 0), undefined)
    assert.strictEqual(sD(0, -5), 0)
    assert.strictEqual(sD(0, 0), 0)
    assert.strictEqual(sD(true, true), 1)
    assert.strictEqual(sD(true, false), undefined)
    assert.strictEqual(sD(false, true), 0)
    assert.strictEqual(sD(false, false), false)
    assert.strictEqual(sD(2, true), 2)
    assert.strictEqual(sD(2, false), undefined)
    assert.strictEqual(sD(null, 1), undefined)
    assert.deepStrictEqual(sD(C(2, 3), 2), C(1, 1.5))
    assert.deepStrictEqual(sD(C(2, 3), C(0, 4)), C(0.75, -0.5))
    assert.strictEqual(sD(C(0, 2), C(0, 4)), 0.5)
    assert.deepStrictEqual(sD(5, C(1, 2)), C(1, -2))
    assert.deepStrictEqual(sD(math.unit('5m'), 10), math.unit('0.5m'))
    const result = math.unit('2m^-1')
    result.skipAutomaticSimplification = false
    assert.deepStrictEqual(sD(10, math.unit('5m')), result)
    assert.strictEqual(sD(math.unit('10m'), math.unit('5m')), 2)
    assert.strictEqual(sD(math.unit(10), 5), 2)
    assert.strictEqual(sD(4n, 2n), 2n)
    assert.deepStrictEqual(sD(5n, 3n), frac(5, 3))
    assert.deepStrictEqual(sD(frac(4), frac(2)), frac(2))
    assert.deepStrictEqual(sD(frac(5, 4), frac(3, 4)), frac(5, 3))
    assert.deepStrictEqual(sD(Big(4), 2), Big(2))
    assert.deepStrictEqual(sD(Big(1.44), Big(1.2)), Big(1.2))
    assert.strictEqual(sD(Big(0.3), 0), undefined)
  })

  it('should error with incorrect arguments', function () {
    assert.throws(() => sD(2, 3, 4))
    assert.throws(() => sD(2))
  })

  it('should determine when arrays are scalar multiples', function () {
    assert.strictEqual(sD([2, 4, 6], [1, 2, 3]), 2)
    assert.strictEqual(sD([[0.5, 1], [1.5, 2]], [[1, 2], [3, 4]]), 0.5)
    assert.strictEqual(sD([], []), 0)
    assert.strictEqual(sD([2, 4, 7], [1, 2, 3]), undefined)
    assert.strictEqual(sD([[0.5, 1], [1.5, 2]], [[1, 2], [3, 3]]), undefined)
    assert.strictEqual(sD([], [0]), undefined)
    assert.strictEqual(sD([0], [0]), 0)
    assert.strictEqual(sD([0, 5], [0, 2]), 2.5)
    assert.strictEqual(sD([0, 0, 5], [0, 2, 1]), undefined)
    assert.strictEqual(sD([0, 5, 1], [0, 0, 1]), undefined)
  })

  it('should never relate scalars and arrays', function () {
    assert.strictEqual(sD(4, [1, 2, 3]), undefined)
    assert.strictEqual(sD([1, 2, 3], 4), undefined)
  })

  it('should determine when matrices are scalar multiples', function () {
    assert.strictEqual(sD(M([2, 4, 6]), M([1, 2, 3])), 2)
    assert.strictEqual(sD(M([[0.5, 1], [1.5, 2]]), M([[1, 2], [3, 4]])), 0.5)
    assert.strictEqual(sD(M([]), M([])), 0)
    assert.strictEqual(sD(M([2, 4, 7]), M([1, 2, 3])), undefined)
    assert.strictEqual(
      sD(M([[0.5, 1], [1.5, 2]]), M([[1, 2], [3, 3]])), undefined)
    assert.strictEqual(sD(M([]), M([0])), undefined)
    assert.strictEqual(sD(M([0]), M([0])), 0)
    assert.strictEqual(sD(M([0, 5]), M([0, 2])), 2.5)
    assert.strictEqual(sD(M([0, 0, 5]), M([0, 2, 1])), undefined)
    assert.strictEqual(sD(M([0, 5, 1]), M([0, 0, 1])), undefined)
  })

  it('should never relate scalars and arrays', function () {
    assert.strictEqual(sD(4, [1, 2, 3]), undefined)
    assert.strictEqual(sD([1, 2, 3], 4), undefined)
  })

  it('should never relate scalars and matrices', function () {
    assert.strictEqual(sD(4, M([1, 2, 3])), undefined)
    assert.strictEqual(sD(M([1, 2, 3]), 4), undefined)
  })
})
